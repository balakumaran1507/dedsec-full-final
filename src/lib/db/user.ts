/**
 * User Database Service
 *
 * Handles all user-related Firestore operations including:
 * - User CRUD operations
 * - Role management
 * - Badge management
 * - Stats tracking and updates
 * - Ranking calculations
 * - Contribution score updates
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  writeBatch,
  increment,
} from 'firebase/firestore';
import { db } from '../firebase/init';
import {
  User,
  UserCreationData,
  UserRole,
  UserStats,
  Badge,
  FOUNDER_BADGE,
  PublicUserProfile,
  UserProfileUpdate,
} from '@/types/user';
import {
  calculateContributionScore,
  getHexTitle,
} from '../utils/ranking';

// Collection name
const USERS_COLLECTION = 'users';

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
 * Create a new user document in Firestore
 *
 * Auto-calculates: title, contributionScore, rank, stats defaults
 */
export async function createUser(data: UserCreationData): Promise<User> {
  try {
    const userRef = doc(db, USERS_COLLECTION, data.uid);

    // Initialize stats with defaults
    const stats: UserStats = {
      writeupCount: data.stats?.writeupCount ?? 0,
      totalUpvotes: data.stats?.totalUpvotes ?? 0,
      ctfParticipation: data.stats?.ctfParticipation ?? 0,
    };

    // Calculate contribution score and title
    const contributionScore = calculateContributionScore(stats);
    const title = getHexTitle(contributionScore);

    const user: User = {
      uid: data.uid,
      email: data.email,
      displayName: data.displayName,
      role: data.role,
      title,
      badges: [],
      contributionScore,
      rank: 0, // Will be calculated after creation
      ctfBadges: [],
      stats,
      joinDate: Timestamp.now(),
      discordId: data.discordId,
      photoURL: data.photoURL ?? null,
      bio: data.bio ?? null,
      socialLinks: data.socialLinks ?? null,
    };

    await withTimeout(setDoc(userRef, user));

    // Recalculate ranks for all users
    await recalculateAllRanks();

    return user;
  } catch (error: any) {
    console.error('Error creating user:', error);
    throw new Error(`Failed to create user: ${error.message || error}`);
  }
}

/**
 * Get user by UID
 */
export async function getUser(uid: string): Promise<User | null> {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await withTimeout(getDoc(userRef));

    if (!userSnap.exists()) {
      return null;
    }

    return userSnap.data() as User;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where('email', '==', email), limit(1));
    const querySnapshot = await withTimeout(getDocs(q));

    if (querySnapshot.empty) {
      return null;
    }

    return querySnapshot.docs[0].data() as User;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  uid: string,
  updates: UserProfileUpdate
): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await withTimeout(updateDoc(userRef, updates as any));
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update profile');
  }
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await withTimeout(updateDoc(userRef, { role }));
  } catch (error) {
    console.error('Error updating user role:', error);
    throw new Error('Failed to update user role');
  }
}

/**
 * Award badge to user
 */
export async function awardBadge(uid: string, badge: Badge): Promise<void> {
  try {
    const user = await getUser(uid);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if badge already exists
    const hasBadge = user.badges.some((b) => b.id === badge.id);
    if (hasBadge) {
      console.log('User already has this badge');
      return;
    }

    const updatedBadges = [...user.badges, badge];
    const userRef = doc(db, USERS_COLLECTION, uid);
    await withTimeout(updateDoc(userRef, { badges: updatedBadges }));
  } catch (error) {
    console.error('Error awarding badge:', error);
    throw new Error('Failed to award badge');
  }
}

/**
 * Award founder badge to user
 */
export async function awardFounderBadge(uid: string): Promise<void> {
  await awardBadge(uid, FOUNDER_BADGE);
}

/**
 * Increment user stats and recalculate contribution score/title
 */
export async function incrementUserStats(
  uid: string,
  statUpdates: Partial<UserStats>
): Promise<void> {
  try {
    const user = await getUser(uid);
    if (!user) {
      throw new Error('User not found');
    }

    // Calculate new stats
    const newStats: UserStats = {
      writeupCount: user.stats.writeupCount + (statUpdates.writeupCount ?? 0),
      totalUpvotes: user.stats.totalUpvotes + (statUpdates.totalUpvotes ?? 0),
      ctfParticipation: user.stats.ctfParticipation + (statUpdates.ctfParticipation ?? 0),
    };

    // Recalculate contribution score and title
    const contributionScore = calculateContributionScore(newStats);
    const title = getHexTitle(contributionScore);

    const userRef = doc(db, USERS_COLLECTION, uid);
    await withTimeout(
      updateDoc(userRef, {
        stats: newStats,
        contributionScore,
        title,
      })
    );

    // Recalculate ranks if contribution score changed
    if (contributionScore !== user.contributionScore) {
      await recalculateAllRanks();
    }
  } catch (error) {
    console.error('Error incrementing user stats:', error);
    throw new Error('Failed to update user stats');
  }
}

/**
 * Recalculate ranks for all users based on contribution scores
 *
 * This is called after any operation that changes contribution scores
 */
export async function recalculateAllRanks(): Promise<void> {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, orderBy('contributionScore', 'desc'));
    const querySnapshot = await withTimeout(getDocs(q));

    const batch = writeBatch(db);
    let rank = 1;

    querySnapshot.docs.forEach((docSnapshot) => {
      const userRef = doc(db, USERS_COLLECTION, docSnapshot.id);
      batch.update(userRef, { rank });
      rank++;
    });

    await withTimeout(batch.commit());
  } catch (error) {
    console.error('Error recalculating ranks:', error);
    // Don't throw - this is a background operation
  }
}

/**
 * Get top contributors (leaderboard)
 */
export async function getTopContributors(limitCount = 10): Promise<User[]> {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(
      usersRef,
      orderBy('contributionScore', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await withTimeout(getDocs(q));

    return querySnapshot.docs.map((doc) => doc.data() as User);
  } catch (error) {
    console.error('Error getting top contributors:', error);
    return [];
  }
}

/**
 * Get all users (for admin)
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const querySnapshot = await withTimeout(getDocs(usersRef));

    return querySnapshot.docs.map((doc) => doc.data() as User);
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
}

/**
 * Get public user profile (safe to expose)
 */
export async function getPublicUserProfile(
  uid: string
): Promise<PublicUserProfile | null> {
  const user = await getUser(uid);
  if (!user) {
    return null;
  }

  return {
    uid: user.uid,
    displayName: user.displayName,
    title: user.title,
    badges: user.badges,
    contributionScore: user.contributionScore,
    rank: user.rank,
    stats: user.stats,
    joinDate: user.joinDate,
    photoURL: user.photoURL || undefined,
    bio: user.bio || undefined,
    socialLinks: user.socialLinks || undefined,
  };
}

/**
 * Check if user is admin or founder
 */
export async function isUserAdmin(uid: string): Promise<boolean> {
  const user = await getUser(uid);
  return user?.role === 'admin' || user?.role === 'founder';
}

/**
 * Get total user count
 */
export async function getTotalUserCount(): Promise<number> {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const querySnapshot = await withTimeout(getDocs(usersRef));
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting user count:', error);
    return 0;
  }
}
