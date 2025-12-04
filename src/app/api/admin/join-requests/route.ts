/* eslint-disable */
/**
 * API Route: /api/admin/join-requests
 *
 * Handles join request management (list, create, approve, reject).
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  createJoinRequest,
  getAllJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
} from '@/lib/db/admin';
import { JoinRequestCreationData } from '@/types/admin';

/**
 * GET /api/admin/join-requests
 *
 * Query parameters:
 * - status: Filter by status (pending|approved|rejected)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as any;

    const joinRequests = await getAllJoinRequests(status);

    return NextResponse.json({
      success: true,
      joinRequests,
    });
  } catch (error) {
    console.error('Error fetching join requests:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch join requests',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/join-requests
 *
 * Create a new join request (public endpoint).
 *
 * Body: JoinRequestCreationData
 */
export async function POST(request: NextRequest) {
  try {
    const data: JoinRequestCreationData = await request.json();

    if (!data.name || !data.email || !data.experience || !data.reason) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    const joinRequest = await createJoinRequest(data);

    return NextResponse.json({
      success: true,
      joinRequest,
    });
  } catch (error) {
    console.error('Error creating join request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create join request',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/join-requests
 *
 * Approve or reject a join request (admin only).
 *
 * Body: { id, action: 'approve'|'reject', reviewedBy, reviewNotes? }
 */
export async function PUT(request: NextRequest) {
  try {
    const { id, action, reviewedBy, reviewNotes } = await request.json();

    if (!id || !action || !reviewedBy) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    if (action === 'approve') {
      const inviteToken = await approveJoinRequest(id, reviewedBy, reviewNotes);
      return NextResponse.json({
        success: true,
        inviteToken,
      });
    } else if (action === 'reject') {
      await rejectJoinRequest(id, reviewedBy, reviewNotes);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid action',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error processing join request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process join request',
      },
      { status: 500 }
    );
  }
}
