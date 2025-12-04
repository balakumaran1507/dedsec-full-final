/**
 * CTF Event Entity Types
 *
 * Defines types for CTF events from CTFTime API and internal management.
 */

import { Timestamp } from 'firebase/firestore';

/**
 * CTF event status
 */
export type CTFEventStatus = 'upcoming' | 'ongoing' | 'completed';

/**
 * CTF format types
 */
export type CTFFormat = 'Jeopardy' | 'Attack-Defense' | 'Mixed' | 'Other';

/**
 * CTF difficulty (derived from CTFTime weight)
 */
export type CTFDifficulty = 'Easy' | 'Medium' | 'Hard';

/**
 * CTF event organizer
 */
export interface CTFOrganizer {
  id: number;
  name: string;
}

/**
 * Complete CTF event structure
 */
export interface CTFEvent {
  id: string;
  ctftimeId: number;
  title: string;
  description: string;
  url: string;
  ctftimeUrl: string;
  logo?: string;
  weight: number; // CTFTime weight (0-100, higher = more prestigious)
  format: CTFFormat;
  startDate: Date | Timestamp;
  endDate: Date | Timestamp;
  duration: number; // Duration in days
  organizers: CTFOrganizer[];
  location?: string; // "Online" or physical location
  restrictions?: string; // "Open" or specific restrictions
  difficulty: CTFDifficulty;
  interestedMembers: string[]; // UIDs of members interested
  status: CTFEventStatus;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

/**
 * CTFTime API response structure (raw data)
 */
export interface CTFTimeEvent {
  id: number;
  title: string;
  description: string;
  url: string;
  logo: string;
  weight: number;
  format: string;
  start: string; // ISO 8601 date string
  finish: string; // ISO 8601 date string
  duration: {
    days: number;
    hours: number;
  };
  organizers: CTFOrganizer[];
  location?: string;
  restrictions?: string;
  ctftime_url: string;
}

/**
 * CTF event creation data (from CTFTime sync)
 */
export type CTFEventCreationData = Omit<
  CTFEvent,
  'id' | 'interestedMembers' | 'createdAt' | 'updatedAt'
>;

/**
 * CTF event filters for querying
 */
export interface CTFEventFilters {
  status?: CTFEventStatus;
  difficulty?: CTFDifficulty;
  format?: CTFFormat;
  startAfter?: Date;
  startBefore?: Date;
  limit?: number;
}

/**
 * CTF event with participation stats (for display)
 */
export interface CTFEventWithStats extends CTFEvent {
  interestedCount: number;
  isUserInterested: boolean; // Whether current user is interested
}

/**
 * User's CTF participation record
 */
export interface CTFParticipation {
  userId: string;
  ctfEventId: string;
  joinedAt: Date | Timestamp;
  teamName?: string;
  finalRank?: number;
  points?: number;
  notes?: string;
}
