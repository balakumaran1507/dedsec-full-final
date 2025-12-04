/**
 * Writeup Entity Types
 *
 * Defines types for CTF writeups, categories, and upvote system.
 */

import { Timestamp } from 'firebase/firestore';

/**
 * CTF challenge categories
 */
export type WriteupCategory =
  | 'Web'
  | 'Crypto'
  | 'Pwn'
  | 'Reverse Engineering'
  | 'Forensics'
  | 'Misc'
  | 'Steganography'
  | 'OSINT'
  | 'Mobile'
  | 'Hardware'
  | 'Blockchain';

/**
 * Writeup document structure
 */
export interface Writeup {
  id: string;
  title: string;
  ctfName: string;
  challengeName: string;
  category: WriteupCategory;
  content: string; // Markdown or HTML content
  authorUid: string;
  authorName: string;
  authorNotes?: string; // Private notes visible only to author
  date: Date | Timestamp;
  upvotes: number;
  upvotedBy: string[]; // Array of user UIDs who upvoted
  hotScore: number; // Reddit-style hot score
  tags?: string[];
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  points?: number; // Points the challenge was worth
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

/**
 * Writeup creation data (without auto-generated fields)
 */
export type WriteupCreationData = Omit<
  Writeup,
  'id' | 'date' | 'upvotes' | 'upvotedBy' | 'hotScore'
> & {
  date?: Date | Timestamp;
};

/**
 * Writeup update data (fields that can be edited)
 */
export interface WriteupUpdateData {
  title?: string;
  ctfName?: string;
  challengeName?: string;
  category?: WriteupCategory;
  content?: string;
  authorNotes?: string;
  tags?: string[];
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  points?: number;
}

/**
 * Writeup with author details (for display)
 */
export interface WriteupWithAuthor extends Writeup {
  author: {
    uid: string;
    displayName: string;
    title: string;
    photoURL?: string | null;
  };
}

/**
 * Writeup filters for querying
 */
export interface WriteupFilters {
  category?: WriteupCategory;
  authorUid?: string;
  ctfName?: string;
  sortBy?: 'date' | 'upvotes' | 'hot';
  limit?: number;
}

/**
 * Available sort orders for writeups
 */
export type WriteupSortOrder = 'hot' | 'new' | 'top';
