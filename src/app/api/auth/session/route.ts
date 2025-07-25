import { auth } from '@/lib/firebase-admin';
import { NextRequest, NextResponse } from 'next/server';
import { createAuditLog } from '@/services/audit.services';

const SESSION_COOKIE_EXPIRATION = 60 * 60 * 24 * 5 * 1000; // 5 days

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    if (!body.idToken || typeof body.idToken !== 'string') {
      return NextResponse.json(
        { success: false, error: 'ID token is required' },
        { status: 400 }
      );
    }

    const decodedToken = await auth.verifyIdToken(body.idToken);

    // Create session cookie
    const sessionCookie = await auth.createSessionCookie(body.idToken, {
      expiresIn: SESSION_COOKIE_EXPIRATION,
    });

    const response = NextResponse.json({ success: true }, { status: 200 });

    // Set cookie in response
    response.cookies.set('__session', sessionCookie, {
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

    return response;
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

    return NextResponse.json(
      { success: false, error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
