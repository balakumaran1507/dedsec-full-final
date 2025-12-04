/**
 * API Route: /api/writeups/[id]/upvote
 *
 * Handles writeup upvoting/un-upvoting.
 */

import { NextRequest, NextResponse } from 'next/server';
import { upvoteWriteup, removeUpvote } from '@/lib/db/writeups';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, action } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    if (action === 'remove') {
      await removeUpvote(params.id, userId);
    } else {
      await upvoteWriteup(params.id, userId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error upvoting writeup:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upvote writeup' },
      { status: 500 }
    );
  }
}
