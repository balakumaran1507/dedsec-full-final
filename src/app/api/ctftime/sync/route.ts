/* eslint-disable */
/**
 * API Route: /api/ctftime/sync
 *
 * Syncs CTF events from CTFTime API.
 *
 * TODO: Implement actual CTFTime API fetch
 * For now, this is a stub that would fetch from https://ctftime.org/api/v1/events/
 */

import { NextRequest, NextResponse } from 'next/server';
import { syncCTFTimeEvents } from '@/lib/db/ctfEvents';
import { CTFTimeEvent } from '@/types/ctf';

export async function POST(request: NextRequest) {
  try {
    // TODO: Implement actual CTFTime API fetch
    // const response = await fetch('https://ctftime.org/api/v1/events/?limit=100&start=...');
    // const ctfTimeEvents: CTFTimeEvent[] = await response.json();

    // For now, return a placeholder response
    return NextResponse.json({
      success: true,
      message: 'CTFTime sync endpoint - implement actual API fetch',
      // TODO: Call syncCTFTimeEvents(ctfTimeEvents) when implemented
    });
  } catch (error) {
    console.error('Error syncing CTFTime events:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync CTFTime events',
      },
      { status: 500 }
    );
  }
}
