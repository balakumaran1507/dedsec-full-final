/**
 * Admin Database Service
 *
 * Handles admin-related Firestore operations including:
 * - Invite token management
 * - Join request management
 * - Sponsor contact management
 * - Team statistics
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase/init';
import {
  Invite,
  InviteStatus,
  JoinRequest,
  JoinRequestCreationData,
  JoinRequestStatus,
  SponsorContact,
  SponsorContactCreationData,
  SponsorContactStatus,
  TeamStatistics,
} from '@/types/admin';
import {
  generateInviteToken,
} from '../utils/validation';
import {
  getTotalUserCount,
  getTopContributors,
} from './user';
import {
  getTotalWriteupCount,
  getRecentWriteups,
} from './writeups';
import {
  getOngoingCTFEvents,
  getCompletedCTFEvents,
} from './ctfEvents';

// Collection names
const INVITES_COLLECTION = 'invites';
const JOIN_REQUESTS_COLLECTION = 'join_requests';
const SPONSOR_CONTACTS_COLLECTION = 'sponsor_contacts';

/**
 * Firestore timeout wrapper (5 seconds)
 */
async function withTimeout<T>(promise: Promise<T>, timeoutMs = 5000): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Firestore operation timed out')), timeoutMs)
  );
  return Promise.race([promise, timeoutPromise]);
}

// ===== INVITE MANAGEMENT =====

/**
 * Create an invite token
 */
export async function createInvite(
  email: string,
  invitedBy: string,
  invitedByName: string
): Promise<Invite> {
  try {
    const inviteRef = doc(collection(db, INVITES_COLLECTION));
    const token = generateInviteToken();
    const now = Timestamp.now();
    const expiresAt = Timestamp.fromMillis(
      now.toMillis() + 7 * 24 * 60 * 60 * 1000 // 7 days
    );

    const invite: Invite = {
      id: inviteRef.id,
      token,
      email,
      invitedBy,
      invitedByName,
      status: 'pending',
      createdAt: now,
      expiresAt,
    };

    await withTimeout(setDoc(inviteRef, invite));
    return invite;
  } catch (error) {
    console.error('Error creating invite:', error);
    throw new Error('Failed to create invite');
  }
}

/**
 * Get invite by token
 */
export async function getInviteByToken(token: string): Promise<Invite | null> {
  try {
    const invitesRef = collection(db, INVITES_COLLECTION);
    const q = query(invitesRef, where('token', '==', token), limit(1));
    const querySnapshot = await withTimeout(getDocs(q));

    if (querySnapshot.empty) {
      return null;
    }

    return querySnapshot.docs[0].data() as Invite;
  } catch (error) {
    console.error('Error getting invite by token:', error);
    return null;
  }
}

/**
 * Validate and mark invite as accepted
 */
export async function acceptInvite(
  token: string,
  acceptedBy: string
): Promise<boolean> {
  try {
    const invite = await getInviteByToken(token);

    if (!invite) {
      return false;
    }

    // Check if already accepted
    if (invite.status === 'accepted') {
      return false;
    }

    // Check if expired
    const now = new Date();
    const expiresAt =
      invite.expiresAt instanceof Date
        ? invite.expiresAt
        : invite.expiresAt.toDate();

    if (now > expiresAt) {
      // Mark as expired
      const inviteRef = doc(db, INVITES_COLLECTION, invite.id);
      await withTimeout(updateDoc(inviteRef, { status: 'expired' }));
      return false;
    }

    // Mark as accepted
    const inviteRef = doc(db, INVITES_COLLECTION, invite.id);
    await withTimeout(
      updateDoc(inviteRef, {
        status: 'accepted',
        acceptedAt: Timestamp.now(),
        acceptedBy,
      })
    );

    return true;
  } catch (error) {
    console.error('Error accepting invite:', error);
    return false;
  }
}

/**
 * Get all invites (admin only)
 */
export async function getAllInvites(): Promise<Invite[]> {
  try {
    const invitesRef = collection(db, INVITES_COLLECTION);
    const q = query(invitesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await withTimeout(getDocs(q));

    return querySnapshot.docs.map((doc) => doc.data() as Invite);
  } catch (error) {
    console.error('Error getting all invites:', error);
    return [];
  }
}

// ===== JOIN REQUEST MANAGEMENT =====

/**
 * Create a join request
 */
export async function createJoinRequest(
  data: JoinRequestCreationData
): Promise<JoinRequest> {
  try {
    const joinRequestRef = doc(collection(db, JOIN_REQUESTS_COLLECTION));

    const joinRequest: JoinRequest = {
      id: joinRequestRef.id,
      ...data,
      date: Timestamp.now(),
      status: 'pending',
    };

    await withTimeout(setDoc(joinRequestRef, joinRequest));

    // TODO: Send email notification to admin
    // This would be handled by an API route

    return joinRequest;
  } catch (error) {
    console.error('Error creating join request:', error);
    throw new Error('Failed to create join request');
  }
}

/**
 * Get join request by ID
 */
export async function getJoinRequest(id: string): Promise<JoinRequest | null> {
  try {
    const joinRequestRef = doc(db, JOIN_REQUESTS_COLLECTION, id);
    const joinRequestSnap = await withTimeout(getDoc(joinRequestRef));

    if (!joinRequestSnap.exists()) {
      return null;
    }

    return joinRequestSnap.data() as JoinRequest;
  } catch (error) {
    console.error('Error getting join request:', error);
    return null;
  }
}

/**
 * Get all join requests (admin only)
 */
export async function getAllJoinRequests(
  status?: JoinRequestStatus
): Promise<JoinRequest[]> {
  try {
    const joinRequestsRef = collection(db, JOIN_REQUESTS_COLLECTION);
    let q = query(joinRequestsRef, orderBy('date', 'desc'));

    if (status) {
      q = query(joinRequestsRef, where('status', '==', status), orderBy('date', 'desc'));
    }

    const querySnapshot = await withTimeout(getDocs(q));
    return querySnapshot.docs.map((doc) => doc.data() as JoinRequest);
  } catch (error) {
    console.error('Error getting join requests:', error);
    return [];
  }
}

/**
 * Get pending join requests count
 */
export async function getPendingJoinRequestsCount(): Promise<number> {
  try {
    const joinRequestsRef = collection(db, JOIN_REQUESTS_COLLECTION);
    const q = query(joinRequestsRef, where('status', '==', 'pending'));
    const querySnapshot = await withTimeout(getDocs(q));
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting pending join requests count:', error);
    return 0;
  }
}

/**
 * Approve a join request (creates invite token)
 */
export async function approveJoinRequest(
  id: string,
  reviewedBy: string,
  reviewNotes?: string
): Promise<string | null> {
  try {
    const joinRequest = await getJoinRequest(id);
    if (!joinRequest) {
      throw new Error('Join request not found');
    }

    // Create invite token
    const invite = await createInvite(
      joinRequest.email,
      reviewedBy,
      'Admin'
    );

    // Update join request
    const joinRequestRef = doc(db, JOIN_REQUESTS_COLLECTION, id);
    await withTimeout(
      updateDoc(joinRequestRef, {
        status: 'approved',
        reviewedBy,
        reviewedAt: Timestamp.now(),
        reviewNotes,
        inviteToken: invite.token,
      })
    );

    // TODO: Send invite email to applicant
    // This would be handled by an API route

    return invite.token;
  } catch (error) {
    console.error('Error approving join request:', error);
    throw new Error('Failed to approve join request');
  }
}

/**
 * Reject a join request
 */
export async function rejectJoinRequest(
  id: string,
  reviewedBy: string,
  reviewNotes?: string
): Promise<void> {
  try {
    const joinRequestRef = doc(db, JOIN_REQUESTS_COLLECTION, id);
    await withTimeout(
      updateDoc(joinRequestRef, {
        status: 'rejected',
        reviewedBy,
        reviewedAt: Timestamp.now(),
        reviewNotes,
      })
    );
  } catch (error) {
    console.error('Error rejecting join request:', error);
    throw new Error('Failed to reject join request');
  }
}

// ===== SPONSOR CONTACT MANAGEMENT =====

/**
 * Create a sponsor contact
 */
export async function createSponsorContact(
  data: SponsorContactCreationData
): Promise<SponsorContact> {
  try {
    const sponsorContactRef = doc(collection(db, SPONSOR_CONTACTS_COLLECTION));

    const sponsorContact: SponsorContact = {
      id: sponsorContactRef.id,
      ...data,
      date: Timestamp.now(),
      status: 'new',
    };

    await withTimeout(setDoc(sponsorContactRef, sponsorContact));

    // TODO: Send email notification to admin
    // This would be handled by an API route

    return sponsorContact;
  } catch (error) {
    console.error('Error creating sponsor contact:', error);
    throw new Error('Failed to create sponsor contact');
  }
}

/**
 * Get sponsor contact by ID
 */
export async function getSponsorContact(
  id: string
): Promise<SponsorContact | null> {
  try {
    const sponsorContactRef = doc(db, SPONSOR_CONTACTS_COLLECTION, id);
    const sponsorContactSnap = await withTimeout(getDoc(sponsorContactRef));

    if (!sponsorContactSnap.exists()) {
      return null;
    }

    return sponsorContactSnap.data() as SponsorContact;
  } catch (error) {
    console.error('Error getting sponsor contact:', error);
    return null;
  }
}

/**
 * Get all sponsor contacts (admin only)
 */
export async function getAllSponsorContacts(
  status?: SponsorContactStatus
): Promise<SponsorContact[]> {
  try {
    const sponsorContactsRef = collection(db, SPONSOR_CONTACTS_COLLECTION);
    let q = query(sponsorContactsRef, orderBy('date', 'desc'));

    if (status) {
      q = query(
        sponsorContactsRef,
        where('status', '==', status),
        orderBy('date', 'desc')
      );
    }

    const querySnapshot = await withTimeout(getDocs(q));
    return querySnapshot.docs.map((doc) => doc.data() as SponsorContact);
  } catch (error) {
    console.error('Error getting sponsor contacts:', error);
    return [];
  }
}

/**
 * Update sponsor contact status
 */
export async function updateSponsorContactStatus(
  id: string,
  status: SponsorContactStatus,
  notes?: string,
  assignedTo?: string
): Promise<void> {
  try {
    const sponsorContactRef = doc(db, SPONSOR_CONTACTS_COLLECTION, id);
    const updates: Partial<SponsorContact> = {
      status,
      lastContactedAt: Timestamp.now(),
    };

    if (notes) {
      updates.notes = notes;
    }

    if (assignedTo) {
      updates.assignedTo = assignedTo;
    }

    await withTimeout(updateDoc(sponsorContactRef, updates));
  } catch (error) {
    console.error('Error updating sponsor contact status:', error);
    throw new Error('Failed to update sponsor contact status');
  }
}

/**
 * Get pending sponsor contacts count
 */
export async function getPendingSponsorContactsCount(): Promise<number> {
  try {
    const sponsorContactsRef = collection(db, SPONSOR_CONTACTS_COLLECTION);
    const q = query(sponsorContactsRef, where('status', '==', 'new'));
    const querySnapshot = await withTimeout(getDocs(q));
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting pending sponsor contacts count:', error);
    return 0;
  }
}

// ===== TEAM STATISTICS =====

/**
 * Get team statistics for admin dashboard
 */
export async function getTeamStatistics(): Promise<TeamStatistics> {
  try {
    const [
      totalMembers,
      totalWriteups,
      activeCTFs,
      completedCTFs,
      pendingJoinRequests,
      pendingSponsorContacts,
      topContributors,
      recentWriteups,
    ] = await Promise.all([
      getTotalUserCount(),
      getTotalWriteupCount(),
      getOngoingCTFEvents().then((events) => events.length),
      getCompletedCTFEvents().then((events) => events.length),
      getPendingJoinRequestsCount(),
      getPendingSponsorContactsCount(),
      getTopContributors(5),
      getRecentWriteups(5),
    ]);

    // Calculate total upvotes from top contributors
    const totalUpvotes = topContributors.reduce(
      (sum, user) => sum + user.stats.totalUpvotes,
      0
    );

    // Format recent activity
    const recentActivity = recentWriteups.map((writeup) => ({
      type: 'writeup' as const,
      description: `${writeup.authorName} published "${writeup.title}"`,
      timestamp: writeup.date,
    }));

    return {
      totalMembers,
      totalWriteups,
      totalUpvotes,
      activeCTFs,
      completedCTFs,
      pendingJoinRequests,
      pendingSponsorContacts,
      topContributors: topContributors.map((user) => ({
        uid: user.uid,
        displayName: user.displayName,
        contributionScore: user.contributionScore,
        title: user.title,
      })),
      recentActivity,
    };
  } catch (error) {
    console.error('Error getting team statistics:', error);
    throw new Error('Failed to get team statistics');
  }
}
