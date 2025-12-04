/**
 * Admin Entity Types
 *
 * Defines types for admin operations: invites, join requests, sponsor contacts.
 */

import { Timestamp } from 'firebase/firestore';

/**
 * Invite status
 */
export type InviteStatus = 'pending' | 'accepted' | 'expired';

/**
 * Invite token document
 */
export interface Invite {
  id: string;
  token: string; // Unique invite token
  email: string; // Email address being invited
  invitedBy: string; // UID of admin who sent invite
  invitedByName: string;
  status: InviteStatus;
  createdAt: Date | Timestamp;
  expiresAt: Date | Timestamp; // 7 days from creation
  acceptedAt?: Date | Timestamp;
  acceptedBy?: string; // UID of user who accepted
}

/**
 * Join request status
 */
export type JoinRequestStatus = 'pending' | 'approved' | 'rejected';

/**
 * Join request document (public form submissions)
 */
export interface JoinRequest {
  id: string;
  name: string;
  email: string;
  experience: string; // User's CTF experience level
  reason: string; // Why they want to join
  date: Date | Timestamp;
  status: JoinRequestStatus;
  reviewedBy?: string; // UID of admin who reviewed
  reviewedAt?: Date | Timestamp;
  reviewNotes?: string;
  inviteToken?: string | null; // Generated invite token if approved
}

/**
 * Join request creation data
 */
export type JoinRequestCreationData = Pick<
  JoinRequest,
  'name' | 'email' | 'experience' | 'reason'
>;

/**
 * Sponsor contact status
 */
export type SponsorContactStatus = 'new' | 'contacted' | 'negotiating' | 'closed' | 'declined';

/**
 * Sponsor contact document
 */
export interface SponsorContact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  message: string;
  sponsorshipType?: string; // "Financial", "Prizes", "Infrastructure", etc.
  budget?: string;
  date: Date | Timestamp;
  status: SponsorContactStatus;
  assignedTo?: string; // UID of team member handling
  notes?: string;
  lastContactedAt?: Date | Timestamp;
}

/**
 * Sponsor contact creation data
 */
export type SponsorContactCreationData = Pick<
  SponsorContact,
  'name' | 'company' | 'email' | 'phone' | 'message' | 'sponsorshipType' | 'budget'
>;

/**
 * Admin action log (for audit trail)
 */
export interface AdminAction {
  id: string;
  adminUid: string;
  adminName: string;
  action: 'invite_sent' | 'join_request_approved' | 'join_request_rejected' | 'user_role_changed' | 'badge_awarded' | 'sponsor_contacted';
  targetId: string; // ID of affected entity (invite, join request, user, etc.)
  metadata?: Record<string, unknown>;
  timestamp: Date | Timestamp;
}

/**
 * Team statistics (for admin dashboard)
 */
export interface TeamStatistics {
  totalMembers: number;
  totalWriteups: number;
  totalUpvotes: number;
  activeCTFs: number;
  completedCTFs: number;
  pendingJoinRequests: number;
  pendingSponsorContacts: number;
  topContributors: {
    uid: string;
    displayName: string;
    contributionScore: number;
    title: string;
  }[];
  recentActivity: {
    type: 'writeup' | 'ctf' | 'user_joined';
    description: string;
    timestamp: Date | Timestamp;
  }[];
}
