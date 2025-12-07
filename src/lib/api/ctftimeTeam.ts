/**
 * CTFTime Team API Integration
 *
 * Fetches team statistics and ranking data from CTFTime.org via proxy
 */

// Use local proxy to avoid CORS issues
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const TEAM_ID = 409848; // DedSec team ID from your link

export interface CTFTimeTeamInfo {
  id: number;
  name: string;
  academic: boolean;
  country: string;
  logo?: string;
  rating: {
    '2024': number;
    '2023': number;
    '2022': number;
  };
}

export interface TeamStats {
  rank: number;
  points: number;
  rating: number;
  year: number;
  organizer_points: number;
}

/**
 * Fetch team information and statistics via proxy
 */
export async function fetchTeamInfo(): Promise<CTFTimeTeamInfo | null> {
  try {
    const response = await fetch(`${API_BASE}/api/ctftime/team/${TEAM_ID}`, {
      cache: 'no-store', // Don't cache team info
    });

    if (!response.ok) {
      throw new Error(`Proxy API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !data.team) {
      throw new Error('Invalid response from proxy');
    }

    return {
      id: data.team.id,
      name: data.team.name,
      academic: data.team.academic || false,
      country: data.team.country || 'Unknown',
      logo: data.team.logo,
      rating: data.team.rating || { '2024': 0, '2023': 0, '2022': 0 },
    };
  } catch (error) {
    console.error('Error fetching CTFTime team info:', error);
    return null;
  }
}

/**
 * Get current year team statistics
 */
export async function getCurrentYearStats(): Promise<TeamStats | null> {
  const teamInfo = await fetchTeamInfo();
  if (!teamInfo) return null;

  const currentYear = new Date().getFullYear();
  const ratingValue = (teamInfo.rating as Record<string, number>)[currentYear.toString()] || 0;
  const rating = typeof ratingValue === 'number' ? ratingValue : parseFloat(ratingValue) || 0;

  return {
    rank: 0, // CTFTime API doesn't provide direct rank in team endpoint
    points: rating,
    rating: rating,
    year: currentYear,
    organizer_points: 0,
  };
}

/**
 * Get team performance over years
 */
export async function getTeamPerformanceHistory(): Promise<
  { year: string; rating: number }[]
> {
  const teamInfo = await fetchTeamInfo();
  if (!teamInfo) return [];

  return Object.entries(teamInfo.rating)
    .map(([year, rating]) => ({
      year,
      rating: rating as number,
    }))
    .sort((a, b) => parseInt(b.year) - parseInt(a.year))
    .slice(0, 5); // Last 5 years
}

/**
 * Format team data for dashboard display
 */
export async function getTeamDashboardData() {
  const teamInfo = await fetchTeamInfo();
  const stats = await getCurrentYearStats();
  const history = await getTeamPerformanceHistory();

  if (!teamInfo || !stats) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return {
    teamName: teamInfo.name,
    country: teamInfo.country,
    logo: teamInfo.logo,
    currentRating: stats.rating,
    currentYear: currentYear,
    globalRank: stats.rank || 'N/A',
    yearlyPerformance: history,
    ctftimeUrl: `https://ctftime.org/team/${TEAM_ID}`,
  };
}
