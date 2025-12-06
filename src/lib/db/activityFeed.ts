/**
 * Activity Feed Firestore Service
 *
 * Manages the activity feed for team activities
 */

import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  onSnapshot,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/init';
import { ActivityFeedItem, CreateActivityInput } from '@/types/activity';

const ACTIVITY_FEED_COLLECTION = 'activity_feed';
const DEFAULT_TIMEOUT = 10000;

/**
 * Firestore timeout wrapper
 */
async function withTimeout<T>(promise: Promise<T>, timeoutMs = 10000): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Firestore operation timed out')), timeoutMs)
  );
  return Promise.race([promise, timeoutPromise]);
}

/**
 * Create a new activity feed item
 */
export async function createActivity(
  data: CreateActivityInput
): Promise<ActivityFeedItem> {
  try {
    const activityData = {
      type: data.type,
      userId: data.userId,
      userName: data.userName,
      userRole: data.userRole,
      content: data.content,
      metadata: data.metadata || {},
      timestamp: Timestamp.now(),
      createdAt: Timestamp.now(),
    };

    const docRef = await withTimeout(
      addDoc(collection(db, ACTIVITY_FEED_COLLECTION), activityData),
      DEFAULT_TIMEOUT
    );

    return {
      id: docRef.id,
      ...activityData,
    };
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
}

/**
 * Get recent activity feed items
 */
export async function getRecentActivities(
  maxItems: number = 20
): Promise<ActivityFeedItem[]> {
  try {
    const q = query(
      collection(db, ACTIVITY_FEED_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(maxItems)
    );

    const snapshot = await withTimeout(getDocs(q), DEFAULT_TIMEOUT);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data.type,
        userId: data.userId,
        userName: data.userName,
        userRole: data.userRole,
        content: data.content,
        metadata: data.metadata || {},
        timestamp: data.timestamp,
        createdAt: data.createdAt,
      } as ActivityFeedItem;
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
}

/**
 * Get activities for a specific user
 */
export async function getUserActivities(
  userId: string,
  maxItems: number = 50
): Promise<ActivityFeedItem[]> {
  try {
    const q = query(
      collection(db, ACTIVITY_FEED_COLLECTION),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(maxItems)
    );

    const snapshot = await withTimeout(getDocs(q), DEFAULT_TIMEOUT);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data.type,
        userId: data.userId,
        userName: data.userName,
        userRole: data.userRole,
        content: data.content,
        metadata: data.metadata || {},
        timestamp: data.timestamp,
        createdAt: data.createdAt,
      } as ActivityFeedItem;
    });
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return [];
  }
}

/**
 * Subscribe to real-time activity feed updates
 */
export function subscribeToActivities(
  maxItems: number = 20,
  callback: (activities: ActivityFeedItem[]) => void
): () => void {
  const q = query(
    collection(db, ACTIVITY_FEED_COLLECTION),
    orderBy('timestamp', 'desc'),
    limit(maxItems)
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const activities = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.type,
          userId: data.userId,
          userName: data.userName,
          userRole: data.userRole,
          content: data.content,
          metadata: data.metadata || {},
          timestamp: data.timestamp,
          createdAt: data.createdAt,
        } as ActivityFeedItem;
      });
      callback(activities);
    },
    (error) => {
      console.error('Error in activity subscription:', error);
    }
  );

  return unsubscribe;
}

/**
 * Helper: Create activity when user joins
 */
export async function logMemberJoined(
  userId: string,
  userName: string
): Promise<void> {
  await createActivity({
    type: 'member_joined',
    userId,
    userName,
    userRole: 'member',
    content: `${userName} joined the team`,
  });
}

/**
 * Helper: Create activity when writeup is created
 */
export async function logWriteupCreated(
  userId: string,
  userName: string,
  userRole: 'member' | 'admin' | 'founder',
  writeupId: string,
  writeupTitle: string,
  category: string
): Promise<void> {
  await createActivity({
    type: 'writeup_created',
    userId,
    userName,
    userRole,
    content: `${userName} wrote a ${category} writeup: "${writeupTitle}"`,
    metadata: {
      writeupId,
      writeupTitle,
      category,
    },
  });
}

/**
 * Helper: Create activity when user joins CTF
 */
export async function logCTFJoined(
  userId: string,
  userName: string,
  userRole: 'member' | 'admin' | 'founder',
  ctfId: string,
  ctfName: string
): Promise<void> {
  await createActivity({
    type: 'ctf_joined',
    userId,
    userName,
    userRole,
    content: `${userName} is participating in ${ctfName}`,
    metadata: {
      ctfId,
      ctfName,
    },
  });
}

/**
 * Helper: Create activity when announcement is created
 */
export async function logAnnouncementCreated(
  userId: string,
  userName: string,
  userRole: 'member' | 'admin' | 'founder',
  announcementTitle: string
): Promise<void> {
  await createActivity({
    type: 'announcement_created',
    userId,
    userName,
    userRole,
    content: `${userName} posted: "${announcementTitle}"`,
  });
}
