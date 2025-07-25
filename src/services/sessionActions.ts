'use server';

import { auth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { createAuditLog } from '@/services/audit.services';
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_EXPIRATION,
} from '@/services/sessionManager.constants';

export async function createSessionCookie(
  idToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);

    // Create session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_COOKIE_EXPIRATION,
    });

    // Set cookie in response
    const cookieStore = await cookies();

    // Clear any existing session
    cookieStore.delete(SESSION_COOKIE_NAME);

    // Set new session cookie with proper options
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: SESSION_COOKIE_EXPIRATION / 1000, // Convert to seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    await createAuditLog({
      actor: {
        id: decodedToken.uid,
        displayName: decodedToken.email || 'Unknown',
        role: 'system',
      },
      action: 'auth.session.create',
      target: {
        id: decodedToken.uid,
        type: 'session',
        displayName: 'Session Cookie',
      },
      status: 'success',
      details: { email: decodedToken.email },
    });

    return { success: true };
  } catch (error) {
    await createAuditLog({
      actor: {
        id: 'system',
        displayName: 'System',
        role: 'system',
      },
      action: 'auth.session.create',
      target: {
        id: 'session',
        type: 'session',
        displayName: 'Session Cookie',
      },
      status: 'failure',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    return {
      success: false,
      error: 'Failed to create session',
    };
  }
}

// Optional: Add a function to clear the session
export async function clearSessionCookie(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);

    return { success: true };
  } catch (error) {
    await createAuditLog({
      actor: {
        id: 'system',
        displayName: 'System',
        role: 'system',
      },
      action: 'auth.session.clear',
      target: {
        id: 'session',
        type: 'session',
        displayName: 'Session Cookie',
      },
      status: 'failure',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });
    return { success: false };
  }
}
