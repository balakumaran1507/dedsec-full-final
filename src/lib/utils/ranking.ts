/**
 * User Ranking System
 *
 * Handles calculation of contribution scores, hex titles, and user rankings.
 */

import { HexTitle, UserStats } from '@/types/user';

/**
 * Calculate contribution score from user stats
 *
 * Formula: (totalUpvotes × 10) + (writeupCount × 50) + (ctfParticipation × 30)
 */
export function calculateContributionScore(stats: UserStats): number {
  const { totalUpvotes, writeupCount, ctfParticipation } = stats;

  return (
    totalUpvotes * 10 +
    writeupCount * 50 +
    ctfParticipation * 30
  );
}

/**
 * Get hex title based on contribution score
 *
 * Tier breakdown:
 * - 2500+: 0x0000 (Legendary)
 * - 2000-2499: 0x0003 (Elite)
 * - 1600-1999: 0x0002 (Advanced)
 * - 1200-1599: 0x0001 (Expert)
 * - 800-1199: 0x00A1 (Skilled)
 * - 500-799: 0x00B1 (Intermediate)
 * - 300-499: 0x00C1 (Proficient)
 * - 150-299: 0x00D1 (Novice)
 * - 50-149: 0x00E1 (Apprentice)
 * - 0-49: 0x00F1 (Initiate)
 */
export function getHexTitle(contributionScore: number): HexTitle {
  if (contributionScore >= 2500) return '0x0000';
  if (contributionScore >= 2000) return '0x0003';
  if (contributionScore >= 1600) return '0x0002';
  if (contributionScore >= 1200) return '0x0001';
  if (contributionScore >= 800) return '0x00A1';
  if (contributionScore >= 500) return '0x00B1';
  if (contributionScore >= 300) return '0x00C1';
  if (contributionScore >= 150) return '0x00D1';
  if (contributionScore >= 50) return '0x00E1';
  return '0x00F1';
}

/**
 * Get title name from hex code
 */
export function getTitleName(title: HexTitle): string {
  const titleNames: Record<HexTitle, string> = {
    '0x0000': 'Legendary',
    '0x0003': 'Elite',
    '0x0002': 'Advanced',
    '0x0001': 'Expert',
    '0x00A1': 'Skilled',
    '0x00B1': 'Intermediate',
    '0x00C1': 'Proficient',
    '0x00D1': 'Novice',
    '0x00E1': 'Apprentice',
    '0x00F1': 'Initiate',
  };

  return titleNames[title];
}

/**
 * Get next title and score needed to reach it
 */
export function getNextTitle(currentScore: number): {
  nextTitle: HexTitle | null;
  nextTitleName: string | null;
  scoreNeeded: number;
} {
  const thresholds: [number, HexTitle][] = [
    [2500, '0x0000'],
    [2000, '0x0003'],
    [1600, '0x0002'],
    [1200, '0x0001'],
    [800, '0x00A1'],
    [500, '0x00B1'],
    [300, '0x00C1'],
    [150, '0x00D1'],
    [50, '0x00E1'],
    [0, '0x00F1'],
  ];

  for (const [threshold, title] of thresholds) {
    if (currentScore < threshold) {
      return {
        nextTitle: title,
        nextTitleName: getTitleName(title),
        scoreNeeded: threshold - currentScore,
      };
    }
  }

  // Already at max title
  return {
    nextTitle: null,
    nextTitleName: null,
    scoreNeeded: 0,
  };
}

/**
 * Calculate progress percentage to next title
 */
export function getTitleProgress(currentScore: number): number {
  const currentTitle = getHexTitle(currentScore);
  const next = getNextTitle(currentScore);

  if (!next.nextTitle) {
    return 100; // Max title reached
  }

  const thresholds: Record<HexTitle, number> = {
    '0x0000': 2500,
    '0x0003': 2000,
    '0x0002': 1600,
    '0x0001': 1200,
    '0x00A1': 800,
    '0x00B1': 500,
    '0x00C1': 300,
    '0x00D1': 150,
    '0x00E1': 50,
    '0x00F1': 0,
  };

  const currentThreshold = thresholds[currentTitle];
  const nextThreshold = thresholds[next.nextTitle];
  const range = nextThreshold - currentThreshold;
  const progress = currentScore - currentThreshold;

  return Math.round((progress / range) * 100);
}

/**
 * Compare two users for ranking (higher score = lower rank number)
 */
export function compareUsers(
  a: { contributionScore: number },
  b: { contributionScore: number }
): number {
  return b.contributionScore - a.contributionScore;
}
