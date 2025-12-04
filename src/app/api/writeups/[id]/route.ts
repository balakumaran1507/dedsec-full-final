/**
 * API Route: /api/writeups/[id]
 *
 * Handles single writeup operations (GET, PUT, DELETE).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getWriteupWithAuthor, updateWriteup, deleteWriteup } from '@/lib/db/writeups';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const writeup = await getWriteupWithAuthor(params.id);

    if (!writeup) {
      return NextResponse.json(
        { success: false, error: 'Writeup not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, writeup });
  } catch (error) {
    console.error('Error fetching writeup:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch writeup' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    await updateWriteup(params.id, updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating writeup:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update writeup' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteWriteup(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting writeup:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete writeup' },
      { status: 500 }
    );
  }
}
