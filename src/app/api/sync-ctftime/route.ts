/**
 * API Route: Sync CTFTime Events
 *
 * POST /api/sync-ctftime
 * Fetches upcoming CTFs from CTFTime and syncs to Firestore
 */

import { NextRequest, NextResponse } from 'next/server';
import { syncUpcomingCTFs } from '@/lib/api/ctftime';

export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication check here
    // const session = await getServerSession();
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const result = await syncUpcomingCTFs(50);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Sync failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'CTFTime events synced successfully',
      created: result.created,
      updated: result.updated,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Use POST to sync CTFTime events',
    endpoint: '/api/sync-ctftime',
    method: 'POST',
  });
}
