/**
 * Activity Feed Types
 */

import { Timestamp } from 'firebase/firestore';

export type ActivityType =
  | 'writeup_created'
  | 'ctf_joined'
  | 'challenge_solved'
  | 'achievement_unlocked'
  | 'member_joined'
  | 'ctf_completed'
  | 'announcement_created';

export interface ActivityFeedItem {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string;
  userRole: 'member' | 'admin' | 'founder';
  content: string;
  metadata?: {
    ctfId?: string;
    ctfName?: string;
    writeupId?: string;
    writeupTitle?: string;
    achievementId?: string;
    achievementName?: string;
    category?: string;
    points?: number;
  };
  timestamp: Timestamp | Date;
  createdAt?: Timestamp;
}

export interface CreateActivityInput {
  type: ActivityType;
  userId: string;
  userName: string;
  userRole: 'member' | 'admin' | 'founder';
  content: string;
  metadata?: ActivityFeedItem['metadata'];
}
