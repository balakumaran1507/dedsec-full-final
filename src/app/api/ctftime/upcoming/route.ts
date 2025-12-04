/**
 * API Route: /api/ctftime/upcoming
 *
 * Fetches upcoming CTF events from Firestore.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUpcomingCTFEvents } from '@/lib/db/ctfEvents';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;

    const events = await getUpcomingCTFEvents(limit);

    return NextResponse.json({
      success: true,
      events,
    });
  } catch (error) {
    console.error('Error fetching upcoming CTF events:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch CTF events',
      },
      { status: 500 }
    );
  }
}
