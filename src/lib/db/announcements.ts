/**
 * Announcements Database Service
 *
 * Handles team announcement operations in Firestore.
 */

import {
  doc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/init';
import { logAnnouncementCreated } from './activityFeed';
import { getUser } from './user';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorUid: string;
  type: 'info' | 'urgent' | 'success';
  pinned: boolean;
  createdAt: Date | Timestamp;
}

export interface AnnouncementCreationData {
  title: string;
  content: string;
  author: string;
  authorUid: string;
  type: 'info' | 'urgent' | 'success';
  pinned?: boolean;
}

const ANNOUNCEMENTS_COLLECTION = 'announcements';

/**
 * Firestore timeout wrapper
 */
async function withTimeout<T>(promise: Promise<T>, timeoutMs = 5000): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Firestore operation timed out')), timeoutMs)
  );
  return Promise.race([promise, timeoutPromise]);
}

/**
 * Get all announcements
 */
export async function getAnnouncements(limitCount = 50): Promise<Announcement[]> {
  try {
    const announcementsRef = collection(db, ANNOUNCEMENTS_COLLECTION);
    const q = query(
      announcementsRef,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await withTimeout(getDocs(q));
    return querySnapshot.docs.map((doc) => doc.data() as Announcement);
  } catch (error) {
    console.error('Error getting announcements:', error);
    return [];
  }
}

/**
 * Create announcement
 */
export async function createAnnouncement(
  data: AnnouncementCreationData
): Promise<Announcement> {
  try {
    const announcementRef = doc(collection(db, ANNOUNCEMENTS_COLLECTION));

    const announcement: Announcement = {
      id: announcementRef.id,
      ...data,
      pinned: data.pinned ?? false,
      createdAt: Timestamp.now(),
    };

    await withTimeout(setDoc(announcementRef, announcement));

    // Log activity (fire and forget)
    try {
      const author = await getUser(data.authorUid);
      if (author) {
        logAnnouncementCreated(
          data.authorUid,
          data.author,
          author.role,
          announcement.title
        ).catch(err => console.warn('Failed to log announcement activity:', err));
      }
    } catch (err) {
      console.warn('Failed to log announcement activity:', err);
    }

    return announcement;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw new Error('Failed to create announcement');
  }
}
