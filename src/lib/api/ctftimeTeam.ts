/**
 * CTFTime Team API Integration
 *
 * Fetches team statistics and ranking data from CTFTime.org
 */

const CTFTIME_API_BASE = 'https://ctftime.org/api/v1';
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
 * Fetch team information and statistics
 */
export async function fetchTeamInfo(): Promise<CTFTimeTeamInfo | null> {
  try {
    const response = await fetch(`${CTFTIME_API_BASE}/teams/${TEAM_ID}/`, {
      headers: {
        'User-Agent': 'DedSec-CTF-Dashboard/1.0',
      },
      cache: 'no-store', // Don't cache team info
    });

    if (!response.ok) {
      throw new Error(`CTFTime API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      academic: data.academic || false,
      country: data.country || 'Unknown',
      logo: data.logo,
      rating: data.rating || { '2024': 0, '2023': 0, '2022': 0 },
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
