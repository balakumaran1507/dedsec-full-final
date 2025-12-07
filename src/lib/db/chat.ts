/**
 * Chat Database Service
 *
 * Firestore-based chat system (fallback for Socket.io).
 * Handles real-time messaging across multiple channels.
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
  onSnapshot,
  QuerySnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase/init';
import {
  ChatMessage,
  ChatMessageCreationData,
  ChatChannel,
  UserPresence,
} from '@/types/chat';

// Collection names
const MESSAGES_COLLECTION_PREFIX = 'chat_messages';
const PRESENCE_COLLECTION = 'user_presence';

// Max messages per channel (FIFO) - Rolling window of 100 messages
const MAX_MESSAGES_PER_CHANNEL = 100;

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
 * Get collection path for channel messages
 */
function getChannelCollectionPath(channel: ChatChannel): string {
  return `${MESSAGES_COLLECTION_PREFIX}/${channel}/messages`;
}

/**
 * Send a message to a channel
 */
export async function sendMessage(
  data: ChatMessageCreationData
): Promise<ChatMessage> {
  try {
    const channelPath = getChannelCollectionPath(data.channel);
    const messageRef = doc(collection(db, channelPath));

    const message: ChatMessage = {
      id: messageRef.id,
      ...data,
      timestamp: Timestamp.now(),
    };

    await withTimeout(setDoc(messageRef, message));

    // Clean up old messages if limit exceeded
    await cleanupOldMessages(data.channel);

    return message;
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message');
  }
}

/**
 * Get message history for a channel
 */
export async function getMessageHistory(
  channel: ChatChannel,
  limitCount = 100
): Promise<ChatMessage[]> {
  try {
    const channelPath = getChannelCollectionPath(channel);
    const messagesRef = collection(db, channelPath);
    const q = query(
      messagesRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await withTimeout(getDocs(q));
    const messages = querySnapshot.docs.map((doc) => doc.data() as ChatMessage);

    // Return in chronological order (oldest first)
    return messages.reverse();
  } catch (error) {
    console.error('Error getting message history:', error);
    return [];
  }
}

/**
 * Subscribe to real-time messages in a channel
 */
export function subscribeToMessages(
  channel: ChatChannel,
  callback: (messages: ChatMessage[]) => void,
  limitCount = 100
): Unsubscribe {
  const channelPath = getChannelCollectionPath(channel);
  const messagesRef = collection(db, channelPath);
  const q = query(
    messagesRef,
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );

  return onSnapshot(q, (snapshot: QuerySnapshot) => {
    const messages = snapshot.docs.map((doc) => doc.data() as ChatMessage);
    callback(messages.reverse()); // Return in chronological order
  });
}

/**
 * Edit a message
 */
export async function editMessage(
  channel: ChatChannel,
  messageId: string,
  newContent: string
): Promise<void> {
  try {
    const channelPath = getChannelCollectionPath(channel);
    const messageRef = doc(db, channelPath, messageId);

    await withTimeout(
      updateDoc(messageRef, {
        content: newContent,
        edited: true,
        editedAt: Timestamp.now(),
      })
    );
  } catch (error) {
    console.error('Error editing message:', error);
    throw new Error('Failed to edit message');
  }
}

/**
 * Delete a message
 */
export async function deleteMessage(
  channel: ChatChannel,
  messageId: string
): Promise<void> {
  try {
    const channelPath = getChannelCollectionPath(channel);
    const messageRef = doc(db, channelPath, messageId);

    await withTimeout(deleteDoc(messageRef));
  } catch (error) {
    console.error('Error deleting message:', error);
    throw new Error('Failed to delete message');
  }
}

/**
 * Clean up old messages (keep only MAX_MESSAGES_PER_CHANNEL)
 */
async function cleanupOldMessages(channel: ChatChannel): Promise<void> {
  try {
    const channelPath = getChannelCollectionPath(channel);
    const messagesRef = collection(db, channelPath);
    const q = query(messagesRef, orderBy('timestamp', 'desc'));

    const querySnapshot = await withTimeout(getDocs(q));

    // If we have more messages than the limit, delete the oldest ones
    if (querySnapshot.size > MAX_MESSAGES_PER_CHANNEL) {
      const messagesToDelete = querySnapshot.docs.slice(MAX_MESSAGES_PER_CHANNEL);

      for (const docSnapshot of messagesToDelete) {
        await deleteDoc(doc(db, channelPath, docSnapshot.id));
      }
    }
  } catch (error) {
    console.error('Error cleaning up old messages:', error);
    // Don't throw - this is a background operation
  }
}

/**
 * Update user presence
 */
export async function updateUserPresence(
  userId: string,
  username: string,
  channel: ChatChannel,
  userPhotoURL?: string | null,
  userTitle?: string
): Promise<void> {
  try {
    const presenceRef = doc(db, PRESENCE_COLLECTION, userId);

    const presence: UserPresence = {
      userId,
      username,
      userPhotoURL,
      userTitle,
      channel,
      lastSeen: Timestamp.now(),
      status: 'online',
    };

    await withTimeout(setDoc(presenceRef, presence));
  } catch (error) {
    console.error('Error updating user presence:', error);
    // Don't throw - presence is not critical
  }
}

/**
 * Set user as offline
 */
export async function setUserOffline(userId: string): Promise<void> {
  try {
    const presenceRef = doc(db, PRESENCE_COLLECTION, userId);

    await withTimeout(
      updateDoc(presenceRef, {
        status: 'offline',
        lastSeen: Timestamp.now(),
      })
    );
  } catch (error) {
    console.error('Error setting user offline:', error);
    // Don't throw - presence is not critical
  }
}

/**
 * Get online users in a channel
 */
export async function getOnlineUsersInChannel(
  channel: ChatChannel
): Promise<UserPresence[]> {
  try {
    const presenceRef = collection(db, PRESENCE_COLLECTION);
    const q = query(
      presenceRef,
      where('channel', '==', channel),
      where('status', '==', 'online')
    );

    const querySnapshot = await withTimeout(getDocs(q));
    return querySnapshot.docs.map((doc) => doc.data() as UserPresence);
  } catch (error) {
    console.error('Error getting online users:', error);
    return [];
  }
}

/**
 * Subscribe to online users in a channel
 */
export function subscribeToOnlineUsers(
  channel: ChatChannel,
  callback: (users: UserPresence[]) => void
): Unsubscribe {
  const presenceRef = collection(db, PRESENCE_COLLECTION);
  const q = query(
    presenceRef,
    where('channel', '==', channel),
    where('status', '==', 'online')
  );

  return onSnapshot(q, (snapshot: QuerySnapshot) => {
    const users = snapshot.docs.map((doc) => doc.data() as UserPresence);
    callback(users);
  });
}

/**
 * Get all online users (across all channels)
 */
export async function getAllOnlineUsers(): Promise<UserPresence[]> {
  try {
    const presenceRef = collection(db, PRESENCE_COLLECTION);
    const q = query(presenceRef, where('status', '==', 'online'));

    const querySnapshot = await withTimeout(getDocs(q));
    return querySnapshot.docs.map((doc) => doc.data() as UserPresence);
  } catch (error) {
    console.error('Error getting all online users:', error);
    return [];
  }
}

/**
 * Clean up stale presence records (users offline for > 5 minutes)
 */
export async function cleanupStalePresence(): Promise<void> {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const presenceRef = collection(db, PRESENCE_COLLECTION);
    const querySnapshot = await withTimeout(getDocs(presenceRef));

    for (const docSnapshot of querySnapshot.docs) {
      const presence = docSnapshot.data() as UserPresence;
      const lastSeen =
        presence.lastSeen instanceof Date
          ? presence.lastSeen
          : presence.lastSeen.toDate();

      if (lastSeen < fiveMinutesAgo && presence.status === 'online') {
        await setUserOffline(presence.userId);
      }
    }
  } catch (error) {
    console.error('Error cleaning up stale presence:', error);
    // Don't throw - this is a background operation
  }
}
