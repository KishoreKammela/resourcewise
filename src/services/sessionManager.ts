// Centralized session and cookie management utility
'use server';

import { cookies } from 'next/headers';
import { auth, db } from '@/lib/firebase-admin';
import { createAuditLog } from '@/services/audit.services';
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_EXPIRATION,
} from '@/services/sessionManager.constants';

export async function getSessionCookieValue(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value || null;
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function setSessionCookie(sessionCookie: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    maxAge: SESSION_COOKIE_EXPIRATION / 1000, // seconds
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSessionUser(): Promise<{
  uid: string;
  email?: string;
  companyId?: string;
} | null> {
  const sessionCookie = await getSessionCookieValue();
  if (!sessionCookie) {
    return null;
  }
  try {
    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    // Try to get companyId from teamMembers or platformUsers
    let companyId: string | undefined = undefined;
    let email: string | undefined = decodedToken.email;
    let uid: string = decodedToken.uid;
    // Try teamMembers first
    const teamMemberDoc = await db.collection('teamMembers').doc(uid).get();
    if (teamMemberDoc.exists) {
      companyId = teamMemberDoc.data()?.companyId;
    } else {
      // Try platformUsers
      const platformUserDoc = await db
        .collection('platformUsers')
        .doc(uid)
        .get();
      if (platformUserDoc.exists) {
        companyId = undefined; // Platform users may not have companyId
      }
    }
    return { uid, email, companyId };
  } catch (error) {
    await createAuditLog({
      actor: { id: 'system', displayName: 'System', role: 'system' },
      action: 'auth.sessionCookie.verify',
      target: { id: 'unknown', type: 'session', displayName: 'Session Cookie' },
      status: 'failure',
      details: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
    return null;
  }
}
