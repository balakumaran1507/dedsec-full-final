/**
 * Writeups Database Service
 *
 * Handles all writeup-related Firestore operations including:
 * - Writeup CRUD operations
 * - Upvote system
 * - Hot score calculations
 * - Category filtering
 * - Author stats updates
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  addDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '../firebase/init';
import {
  Writeup,
  WriteupCreationData,
  WriteupUpdateData,
  WriteupFilters,
  WriteupCategory,
  WriteupWithAuthor,
} from '@/types/writeup';
import { calculateHotScore } from '../utils/scoring';
import { incrementUserStats, getUser } from './user';

// Collection name
const WRITEUPS_COLLECTION = 'writeups';

/**
 * Firestore timeout wrapper (5 seconds)
 */
async function withTimeout<T>(promise: Promise<T>, timeoutMs = 5000): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Firestore operation timed out')), timeoutMs)
  );
  return Promise.race([promise, timeoutPromise]);
}

/**
 * Create a new writeup
 *
 * Auto-generates: id, date, upvotes, upvotedBy, hotScore
 * Auto-updates: author's writeupCount stat
 */
export async function createWriteup(
  data: WriteupCreationData
): Promise<Writeup> {
  try {
    const writeupRef = doc(collection(db, WRITEUPS_COLLECTION));

    const now = Timestamp.now();
    const hotScore = calculateHotScore(0, now);

    const writeup: Writeup = {
      id: writeupRef.id,
      ...data,
      date: data.date ?? now,
      upvotes: 0,
      upvotedBy: [],
      hotScore,
    };

    await withTimeout(setDoc(writeupRef, writeup));

    // Update author's stats
    await incrementUserStats(data.authorUid, { writeupCount: 1 });

    return writeup;
  } catch (error) {
    console.error('Error creating writeup:', error);
    throw new Error('Failed to create writeup');
  }
}

/**
 * Get writeup by ID
 */
export async function getWriteup(id: string): Promise<Writeup | null> {
  try {
    const writeupRef = doc(db, WRITEUPS_COLLECTION, id);
    const writeupSnap = await withTimeout(getDoc(writeupRef));

    if (!writeupSnap.exists()) {
      return null;
    }

    return writeupSnap.data() as Writeup;
  } catch (error) {
    console.error('Error getting writeup:', error);
    return null;
  }
}

/**
 * Get writeup with author details
 */
export async function getWriteupWithAuthor(
  id: string
): Promise<WriteupWithAuthor | null> {
  const writeup = await getWriteup(id);
  if (!writeup) {
    return null;
  }

  const author = await getUser(writeup.authorUid);
  if (!author) {
    return null;
  }

  return {
    ...writeup,
    author: {
      uid: author.uid,
      displayName: author.displayName,
      title: author.title,
      photoURL: author.photoURL,
    },
  };
}

/**
 * Update writeup
 */
export async function updateWriteup(
  id: string,
  updates: WriteupUpdateData
): Promise<void> {
  try {
    const writeupRef = doc(db, WRITEUPS_COLLECTION, id);
    await withTimeout(updateDoc(writeupRef, updates as any));
  } catch (error) {
    console.error('Error updating writeup:', error);
    throw new Error('Failed to update writeup');
  }
}

/**
 * Delete writeup
 *
 * Also decrements author's writeupCount stat
 */
export async function deleteWriteup(id: string): Promise<void> {
  try {
    const writeup = await getWriteup(id);
    if (!writeup) {
      throw new Error('Writeup not found');
    }

    const writeupRef = doc(db, WRITEUPS_COLLECTION, id);
    await withTimeout(deleteDoc(writeupRef));

    // Decrement author's stats
    await incrementUserStats(writeup.authorUid, { writeupCount: -1 });
  } catch (error) {
    console.error('Error deleting writeup:', error);
    throw new Error('Failed to delete writeup');
  }
}

/**
 * Upvote a writeup
 *
 * - Adds user to upvotedBy array
 * - Increments upvote count
 * - Recalculates hot score
 * - Updates author's totalUpvotes stat
 */
export async function upvoteWriteup(
  writeupId: string,
  userId: string
): Promise<void> {
  try {
    const writeup = await getWriteup(writeupId);
    if (!writeup) {
      throw new Error('Writeup not found');
    }

    // Check if user already upvoted
    if (writeup.upvotedBy.includes(userId)) {
      console.log('User already upvoted this writeup');
      return;
    }

    // Calculate new hot score
    const newUpvotes = writeup.upvotes + 1;
    const newHotScore = calculateHotScore(newUpvotes, writeup.date);

    const writeupRef = doc(db, WRITEUPS_COLLECTION, writeupId);
    await withTimeout(
      updateDoc(writeupRef, {
        upvotes: newUpvotes,
        upvotedBy: arrayUnion(userId),
        hotScore: newHotScore,
      })
    );

    // Update author's stats
    await incrementUserStats(writeup.authorUid, { totalUpvotes: 1 });
  } catch (error) {
    console.error('Error upvoting writeup:', error);
    throw new Error('Failed to upvote writeup');
  }
}

/**
 * Remove upvote from a writeup
 */
export async function removeUpvote(
  writeupId: string,
  userId: string
): Promise<void> {
  try {
    const writeup = await getWriteup(writeupId);
    if (!writeup) {
      throw new Error('Writeup not found');
    }

    // Check if user actually upvoted
    if (!writeup.upvotedBy.includes(userId)) {
      console.log('User has not upvoted this writeup');
      return;
    }

    // Calculate new hot score
    const newUpvotes = Math.max(0, writeup.upvotes - 1);
    const newHotScore = calculateHotScore(newUpvotes, writeup.date);

    const writeupRef = doc(db, WRITEUPS_COLLECTION, writeupId);
    await withTimeout(
      updateDoc(writeupRef, {
        upvotes: newUpvotes,
        upvotedBy: arrayRemove(userId),
        hotScore: newHotScore,
      })
    );

    // Update author's stats
    await incrementUserStats(writeup.authorUid, { totalUpvotes: -1 });
  } catch (error) {
    console.error('Error removing upvote:', error);
    throw new Error('Failed to remove upvote');
  }
}

/**
 * Get writeups with filters and sorting
 */
export async function getWriteups(
  filters: WriteupFilters = {}
): Promise<Writeup[]> {
  try {
    const writeupsRef = collection(db, WRITEUPS_COLLECTION);
    let q = query(writeupsRef);

    // Apply filters
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }

    if (filters.authorUid) {
      q = query(q, where('authorUid', '==', filters.authorUid));
    }

    if (filters.ctfName) {
      q = query(q, where('ctfName', '==', filters.ctfName));
    }

    // Apply sorting
    const sortBy = filters.sortBy ?? 'hot';
    if (sortBy === 'hot') {
      q = query(q, orderBy('hotScore', 'desc'));
    } else if (sortBy === 'date') {
      q = query(q, orderBy('date', 'desc'));
    } else if (sortBy === 'upvotes') {
      q = query(q, orderBy('upvotes', 'desc'));
    }

    // Apply limit
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    const querySnapshot = await withTimeout(getDocs(q));
    return querySnapshot.docs.map((doc) => doc.data() as Writeup);
  } catch (error) {
    console.error('Error getting writeups:', error);
    return [];
  }
}

/**
 * Get writeups with author details
 */
export async function getWriteupsWithAuthors(
  filters: WriteupFilters = {}
): Promise<WriteupWithAuthor[]> {
  const writeups = await getWriteups(filters);

  // Fetch all unique authors
  const authorIds = Array.from(new Set(writeups.map((w) => w.authorUid)));
  const authors = await Promise.all(authorIds.map((uid) => getUser(uid)));

  // Create author map
  const authorMap = new Map(
    authors.filter((a) => a !== null).map((a) => [a!.uid, a!])
  );

  // Attach author details
  return writeups
    .map((writeup) => {
      const author = authorMap.get(writeup.authorUid);
      if (!author) return null;

      return {
        ...writeup,
        author: {
          uid: author.uid,
          displayName: author.displayName,
          title: author.title,
          photoURL: author.photoURL,
        },
      };
    })
    .filter((w) => w !== null) as WriteupWithAuthor[];
}

/**
 * Get total writeup count
 */
export async function getTotalWriteupCount(): Promise<number> {
  try {
    const writeupsRef = collection(db, WRITEUPS_COLLECTION);
    const querySnapshot = await withTimeout(getDocs(writeupsRef));
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting writeup count:', error);
    return 0;
  }
}

/**
 * Get recent writeups (last 10)
 */
export async function getRecentWriteups(limitCount = 10): Promise<Writeup[]> {
  return getWriteups({ sortBy: 'date', limit: limitCount });
}

/**
 * Get hot writeups (sorted by hot score)
 */
export async function getHotWriteups(limitCount = 10): Promise<Writeup[]> {
  return getWriteups({ sortBy: 'hot', limit: limitCount });
}

/**
 * Get top writeups (sorted by upvotes)
 */
export async function getTopWriteups(limitCount = 10): Promise<Writeup[]> {
  return getWriteups({ sortBy: 'upvotes', limit: limitCount });
}

/**
 * Get writeups by category
 */
export async function getWriteupsByCategory(
  category: WriteupCategory,
  limitCount?: number
): Promise<Writeup[]> {
  return getWriteups({ category, sortBy: 'hot', limit: limitCount });
}

/**
 * Get writeups by author
 */
export async function getWriteupsByAuthor(
  authorUid: string,
  limitCount?: number
): Promise<Writeup[]> {
  return getWriteups({ authorUid, sortBy: 'date', limit: limitCount });
}

/**
 * Check if user has upvoted a writeup
 */
export async function hasUserUpvoted(
  writeupId: string,
  userId: string
): Promise<boolean> {
  const writeup = await getWriteup(writeupId);
  return writeup?.upvotedBy.includes(userId) ?? false;
}
