'use server';

import { db } from '@/lib/firebase-admin';
import type { Invitation } from '@/lib/types';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Creates a new invitation document in Firestore.
 * @param data - The data for the new invitation.
 * @returns The unique token for the invitation.
 */
export async function createInvitation(
  data: Omit<Invitation, 'id' | 'status' | 'expiresAt' | 'createdAt'>
): Promise<string> {
  const invitationRef = db.collection('invitations').doc();
  const token = invitationRef.id; // Use the document ID as the unique token

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

  const newInvitation: Omit<Invitation, 'id'> = {
    ...data,
    status: 'pending',
    createdAt: FieldValue.serverTimestamp() as any,
    expiresAt: expiresAt as any,
  };

  await invitationRef.set(newInvitation);

  return token;
}

/**
 * Retrieves an invitation document by its token.
 * @param token - The unique invitation token.
 * @returns The invitation data or null if not found or invalid.
 */
export async function getInvitationByToken(
  token: string
): Promise<Invitation | null> {
  const invitationRef = db.collection('invitations').doc(token);
  const doc = await invitationRef.get();

  if (!doc.exists) {
    return null;
  }

  const invitation = { id: doc.id, ...doc.data() } as Invitation;

  // Firestore Timestamps need to be converted to Dates for comparison
  const expiresAtDate =
    invitation.expiresAt && 'toDate' in invitation.expiresAt
      ? invitation.expiresAt.toDate()
      : new Date(0);

  if (invitation.status !== 'pending' || expiresAtDate < new Date()) {
    // Optionally, update the status to 'expired'
    if (invitation.status === 'pending') {
      await updateInvitationStatus(token, 'expired');
    }
    return null;
  }

  return invitation;
}

/**
 * Updates the status of an invitation.
 * @param token - The unique invitation token.
 * @param status - The new status to set.
 */
export async function updateInvitationStatus(
  token: string,
  status: 'accepted' | 'expired'
): Promise<void> {
  const invitationRef = db.collection('invitations').doc(token);
  await invitationRef.update({ status });
}
