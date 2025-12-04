/**
 * User Entity Types
 *
 * Defines all user-related types including roles, badges, stats, and ranking.
 */

import { Timestamp } from 'firebase/firestore';

/**
 * User roles in the system
 */
export type UserRole = 'member' | 'admin' | 'founder';

/**
 * User badge
 */
export interface Badge {
  id: string;
  name: string;
  animated: boolean;
  description?: string;
  earnedAt?: Date | Timestamp;
}

/**
 * User statistics
 */
export interface UserStats {
  writeupCount: number;
  totalUpvotes: number;
  ctfParticipation: number;
}

/**
 * Hex title levels based on contribution score
 *
 * Score >= 2500: 0x0000 (Legendary)
 * Score >= 2000: 0x0003 (Elite)
 * Score >= 1600: 0x0002 (Advanced)
 * Score >= 1200: 0x0001 (Expert)
 * Score >= 800:  0x00A1 (Skilled)
 * Score >= 500:  0x00B1 (Intermediate)
 * Score >= 300:  0x00C1 (Proficient)
 * Score >= 150:  0x00D1 (Novice)
 * Score >= 50:   0x00E1 (Apprentice)
 * Default:       0x00F1 (Initiate)
 */
export type HexTitle =
  | '0x0000'
  | '0x0003'
  | '0x0002'
  | '0x0001'
  | '0x00A1'
  | '0x00B1'
  | '0x00C1'
  | '0x00D1'
  | '0x00E1'
  | '0x00F1';

/**
 * Complete user document structure
 */
export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  title: HexTitle;
  badges: Badge[];
  contributionScore: number;
  rank: number; // Overall rank in team (1 = highest)
  ctfBadges: Badge[]; // CTF-specific badges
  stats: UserStats;
  joinDate: Date | Timestamp;
  discordId: string | null;
  photoURL?: string | null;
  bio?: string | null;
  socialLinks?: {
    twitter?: string;
    github?: string;
    website?: string;
  } | null;
}

/**
 * Partial user for creation (without calculated fields)
 */
export type UserCreationData = Omit<User, 'uid' | 'title' | 'contributionScore' | 'rank' | 'badges' | 'ctfBadges' | 'stats' | 'joinDate'> & {
  uid: string;
  stats?: Partial<UserStats>;
};

/**
 * User profile update data (fields that can be edited by user)
 */
export interface UserProfileUpdate {
  displayName?: string;
  bio?: string;
  discordId?: string;
  photoURL?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    website?: string;
  };
}

/**
 * Founder badge constant
 */
export const FOUNDER_BADGE: Badge = {
  id: '0x00',
  name: 'Founder',
  animated: true,
  description: 'Original founder of DedSec CTF Team',
};

/**
 * Public user profile (safe to expose)
 */
export interface PublicUserProfile {
  uid: string;
  displayName: string;
  title: HexTitle;
  badges: Badge[];
  contributionScore: number;
  rank: number;
  stats: UserStats;
  joinDate: Date | Timestamp;
  photoURL?: string | null;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    website?: string;
  };
}
