/**
 * Scoring System
 *
 * Implements Reddit-style hot score algorithm for writeups.
 */

import { Timestamp } from 'firebase/firestore';

/**
 * Calculate hot score for a writeup (Reddit-style algorithm)
 *
 * Formula: (upvotes - 1) / ((hours since post + 2) ^ 1.5)
 *
 * This ensures:
 * - Newer posts with fewer upvotes can rank higher than older posts with more upvotes
 * - Posts decay over time
 * - The +2 prevents division issues for brand new posts
 * - The -1 on upvotes normalizes the baseline
 *
 * @param upvotes - Number of upvotes
 * @param createdAt - Date or Timestamp when post was created
 * @returns Hot score (higher = hotter)
 */
export function calculateHotScore(
  upvotes: number,
  createdAt: Date | Timestamp
): number {
  // Convert Firestore Timestamp to Date if needed
  const postDate = createdAt instanceof Date ? createdAt : createdAt.toDate();
  const now = new Date();

  // Calculate hours since post
  const millisecondsSincePost = now.getTime() - postDate.getTime();
  const hoursSincePost = millisecondsSincePost / (1000 * 60 * 60);

  // Apply hot score formula
  const score = (upvotes - 1) / Math.pow(hoursSincePost + 2, 1.5);

  // Return score rounded to 6 decimal places for consistency
  return Math.round(score * 1000000) / 1000000;
}

/**
 * Calculate hot score from a timestamp string (ISO 8601)
 */
export function calculateHotScoreFromString(
  upvotes: number,
  createdAtString: string
): number {
  const createdAt = new Date(createdAtString);
  return calculateHotScore(upvotes, createdAt);
}

/**
 * Determine if a writeup's hot score should be recalculated
 *
 * Recalculate if:
 * - More than 1 hour has passed since last calculation
 * - Upvote count has changed significantly (>10% change or >5 votes)
 */
export function shouldRecalculateHotScore(
  currentUpvotes: number,
  lastUpvotes: number,
  lastCalculatedAt: Date | Timestamp
): boolean {
  // Convert Firestore Timestamp to Date if needed
  const lastCalcDate =
    lastCalculatedAt instanceof Date
      ? lastCalculatedAt
      : lastCalculatedAt.toDate();

  const hoursSinceCalc =
    (Date.now() - lastCalcDate.getTime()) / (1000 * 60 * 60);

  // Recalculate if more than 1 hour passed
  if (hoursSinceCalc >= 1) {
    return true;
  }

  // Recalculate if upvotes changed significantly
  const upvoteDiff = Math.abs(currentUpvotes - lastUpvotes);
  const upvotePercentChange = lastUpvotes > 0 ? upvoteDiff / lastUpvotes : 0;

  return upvoteDiff >= 5 || upvotePercentChange >= 0.1;
}

/**
 * Calculate CTF difficulty from CTFTime weight
 *
 * Weight ranges:
 * - 0-33: Easy
 * - 34-66: Medium
 * - 67-100: Hard
 */
export function getDifficultyFromWeight(weight: number): 'Easy' | 'Medium' | 'Hard' {
  if (weight <= 33) return 'Easy';
  if (weight <= 66) return 'Medium';
  return 'Hard';
}

/**
 * Calculate days until event starts
 */
export function getDaysUntilEvent(startDate: Date | Timestamp): number {
  const start = startDate instanceof Date ? startDate : startDate.toDate();
  const now = new Date();
  const diffMs = start.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Calculate event duration in days from start and end dates
 */
export function calculateEventDuration(
  startDate: Date | Timestamp,
  endDate: Date | Timestamp
): number {
  const start = startDate instanceof Date ? startDate : startDate.toDate();
  const end = endDate instanceof Date ? endDate : endDate.toDate();

  const diffMs = end.getTime() - start.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return Math.max(0, Math.round(diffDays * 10) / 10); // Round to 1 decimal
}
