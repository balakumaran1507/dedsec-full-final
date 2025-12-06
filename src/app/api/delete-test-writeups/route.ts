/**
 * API Route: Delete Test Writeups
 * POST /api/delete-test-writeups
 */

import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/init';

const testAuthorUids = [
  'test-uid-001',
  'test-uid-002',
  'test-uid-003',
  'test-uid-004',
  'test-uid-005',
  'test-uid-006',
  'test-uid-007',
  'test-uid-008'
];

export async function POST() {
  try {
    let deleted = 0;

    // Delete all writeups from test users
    for (const uid of testAuthorUids) {
      const q = query(
        collection(db, 'writeups'),
        where('authorUid', '==', uid)
      );

      const snapshot = await getDocs(q);

      for (const docSnapshot of snapshot.docs) {
        await deleteDoc(doc(db, 'writeups', docSnapshot.id));
        deleted++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${deleted} test writeups`,
      deleted
    });
  } catch (error) {
    console.error('Error deleting test writeups:', error);
    return NextResponse.json(
      { error: 'Failed to delete test writeups' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to delete test writeups',
    endpoint: '/api/delete-test-writeups',
    method: 'POST',
  });
}
