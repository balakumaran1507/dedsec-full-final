/**
 * Chat Entity Types
 *
 * Defines types for real-time chat system (Firestore-based fallback).
 */

import { Timestamp } from 'firebase/firestore';

/**
 * Available chat channels
 */
export type ChatChannel = 'general' | 'ops' | 'intel' | 'ai-lab';

/**
 * Chat message structure
 */
export interface ChatMessage {
  id: string;
  channel: ChatChannel;
  userId: string;
  username: string;
  userPhotoURL?: string | null;
  userTitle?: string;
  content: string;
  timestamp: Date | Timestamp;
  edited?: boolean;
  editedAt?: Date | Timestamp;
  replyTo?: string; // Message ID being replied to
  reactions?: {
    [emoji: string]: string[]; // emoji -> array of user IDs
  };
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
}

/**
 * Chat message creation data
 */
export type ChatMessageCreationData = Omit<
  ChatMessage,
  'id' | 'timestamp' | 'edited' | 'editedAt'
>;

/**
 * Online user presence
 */
export interface UserPresence {
  userId: string;
  username: string;
  userPhotoURL?: string | null;
  userTitle?: string;
  channel: ChatChannel;
  lastSeen: Date | Timestamp;
  status: 'online' | 'away' | 'offline';
}

/**
 * Channel info with metadata
 */
export interface ChannelInfo {
  channel: ChatChannel;
  name: string;
  description: string;
  icon: string;
  onlineUsers: number;
  unreadCount?: number;
}

/**
 * System message types
 */
export type SystemMessageType = 'user_joined' | 'user_left' | 'channel_announcement';

/**
 * System message
 */
export interface SystemMessage {
  type: SystemMessageType;
  username: string;
  timestamp: Date | Timestamp;
  metadata?: Record<string, unknown>;
}
