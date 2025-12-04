/* eslint-disable */
/**
 * API Route: /api/writeups
 *
 * Handles writeup list retrieval and creation.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getWriteupsWithAuthors, createWriteup } from '@/lib/db/writeups';
import { WriteupFilters, WriteupCreationData } from '@/types/writeup';

/**
 * GET /api/writeups
 *
 * Query parameters:
 * - category: Filter by category
 * - authorUid: Filter by author
 * - ctfName: Filter by CTF name
 * - sortBy: Sort order (hot|date|upvotes)
 * - limit: Max results
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: WriteupFilters = {
      category: searchParams.get('category') as any || undefined,
      authorUid: searchParams.get('authorUid') || undefined,
      ctfName: searchParams.get('ctfName') || undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'hot',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
    };

    const writeups = await getWriteupsWithAuthors(filters);

    return NextResponse.json({
      success: true,
      writeups,
    });
  } catch (error) {
    console.error('Error fetching writeups:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch writeups',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/writeups
 *
 * Create a new writeup.
 *
 * Body: WriteupCreationData
 */
export async function POST(request: NextRequest) {
  try {
    const data: WriteupCreationData = await request.json();

    // Basic validation
    if (!data.title || !data.ctfName || !data.challengeName || !data.category || !data.content || !data.authorUid || !data.authorName) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    const writeup = await createWriteup(data);

    return NextResponse.json({
      success: true,
      writeup,
    });
  } catch (error) {
    console.error('Error creating writeup:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create writeup',
      },
      { status: 500 }
    );
  }
}
