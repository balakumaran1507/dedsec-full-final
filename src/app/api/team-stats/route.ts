/**
 * API Route: Fetch CTFTime Team Stats
 *
 * GET /api/team-stats
 * Fetches team statistics from CTFTime
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTeamDashboardData } from '@/lib/api/ctftimeTeam';

export async function GET(request: NextRequest) {
  try {
    const teamData = await getTeamDashboardData();

    if (!teamData) {
      return NextResponse.json(
        { error: 'Failed to fetch team data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: teamData,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
