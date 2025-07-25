'use server';

import { createPlatformUserDocument } from '@/services/user.services';
import { auth } from '@/lib/firebase-admin';
import {
  createCompanyAndAdmin,
  createTeamMemberFromInvitation,
} from '@/services/company.services';
import { createAuditLog } from '@/services/audit.services';
import { updateInvitationStatus } from '@/services/invitation.services';
import type { Invitation } from '@/lib/types';
import { z } from 'zod';

interface SignUpResult {
  success: boolean;
  error?: string;
}

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
  .regex(/[0-9]/, 'Password must contain at least one number.')
  .regex(
    /[^A-Za-z0-9]/,
    'Password must contain at least one special character.'
  );

export async function createPlatformUserAction(
  prevState: any,
  formData: FormData
): Promise<SignUpResult> {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const displayName = `${firstName} ${lastName}`;

  if (!firstName || !lastName || !email || !password) {
    return { success: false, error: 'All fields are required.' };
  }

  const passwordValidation = passwordSchema.safeParse(password);
  if (!passwordValidation.success) {
    return {
      success: false,
      error: passwordValidation.error.errors.map((e) => e.message).join(' '),
    };
  }

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
    });

    if (userRecord) {
      await createPlatformUserDocument(userRecord.uid, {
        firstName,
        lastName,
        email,
        role: 'admin', // Default role for self-signup
      });

      await createAuditLog({
        actor: {
          id: userRecord.uid,
          displayName,
          role: 'platform',
        },
        action: 'platform_user.create',
        target: {
          id: userRecord.uid,
          type: 'user',
          displayName,
        },
        status: 'success',
      });

      return { success: true };
    }
    return { success: false, error: 'Could not create user account.' };
  } catch (error: any) {
    let errorMessage = 'An unexpected error occurred. Please try again.';
    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'This email address is already in use by another account.';
    }

    await createAuditLog({
      actor: {
        id: 'system',
        displayName: 'System',
        role: 'system',
      },
      action: 'platform_user.create',
      target: {
        id: email,
        type: 'user',
        displayName: email,
      },
      status: 'failure',
      details: { error: errorMessage, errorCode: error.code },
    });

    return { success: false, error: errorMessage };
  }
}

export async function createCompanyAndUserAction(
  prevState: any,
  formData: FormData
): Promise<SignUpResult> {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const companyName = formData.get('companyName') as string;
  const companyWebsite = formData.get('companyWebsite') as string;
  const displayName = `${firstName} ${lastName}`;

  if (!firstName || !lastName || !email || !password || !companyName) {
    return { success: false, error: 'All fields are required.' };
  }

  const passwordValidation = passwordSchema.safeParse(password);
  if (!passwordValidation.success) {
    return {
      success: false,
      error: passwordValidation.error.errors.map((e) => e.message).join(' '),
    };
  }

  let userRecord;
  try {
    userRecord = await auth.createUser({
      email,
      password,
      displayName,
    });

    if (userRecord) {
      const { companyId } = await createCompanyAndAdmin(
        userRecord.uid,
        { companyName, companyWebsite },
        { firstName, lastName, email }
      );

      await createAuditLog({
        actor: {
          id: userRecord.uid,
          displayName,
          role: 'company',
        },
        action: 'company.create',
        target: {
          id: companyId,
          type: 'company',
          displayName: companyName,
        },
        status: 'success',
        companyId,
        details: { adminUserId: userRecord.uid },
      });

      return { success: true };
    }
    return { success: false, error: 'Could not create user account.' };
  } catch (error: any) {
    let errorMessage = 'An unexpected error occurred. Please try again.';
    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'This email address is already in use by another account.';
    }

    await createAuditLog({
      actor: {
        id: userRecord?.uid || 'system',
        displayName: userRecord?.displayName || 'System',
        role: 'system',
      },
      action: 'company.create',
      target: {
        id: companyName,
        type: 'company',
        displayName: companyName,
      },
      status: 'failure',
      details: { error: errorMessage, errorCode: error.code },
    });

    return { success: false, error: errorMessage };
  }
}

export async function acceptInvitationAction(
  invitation: Invitation,
  prevState: any,
  formData: FormData
): Promise<SignUpResult> {
  const password = formData.get('password') as string;
  const displayName = `${invitation.firstName} ${invitation.lastName}`;

  if (!password) {
    return { success: false, error: 'Password is required.' };
  }
  if (!invitation || !invitation.id) {
    return { success: false, error: 'Invalid invitation.' };
  }

  const passwordValidation = passwordSchema.safeParse(password);
  if (!passwordValidation.success) {
    return {
      success: false,
      error: passwordValidation.error.errors.map((e) => e.message).join(' '),
    };
  }

  try {
    const userRecord = await auth.createUser({
      email: invitation.email,
      password,
      displayName,
    });

    if (userRecord) {
      if (invitation.type === 'platform') {
        await createPlatformUserDocument(userRecord.uid, {
          firstName: invitation.firstName,
          lastName: invitation.lastName,
          email: invitation.email,
          role: invitation.role,
        });
      } else if (invitation.type === 'company' && invitation.companyId) {
        await createTeamMemberFromInvitation(userRecord.uid, invitation);
      } else {
        throw new Error('Invalid invitation type or missing companyId.');
      }

      await updateInvitationStatus(invitation.id, 'accepted');

      await createAuditLog({
        actor: {
          id: userRecord.uid,
          displayName,
          role: invitation.type,
        },
        action: 'user.accept_invitation',
        target: {
          id: userRecord.uid,
          type: 'user',
          displayName,
        },
        companyId: invitation.companyId,
        status: 'success',
        details: { role: invitation.role },
      });

      return { success: true };
    }

    return { success: false, error: 'Could not create user account.' };
  } catch (error: any) {
    let errorMessage = 'An unexpected error occurred. Please try again.';
    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'This email address is already in use by another account.';
    }

    await createAuditLog({
      actor: { id: 'system', displayName: 'System', role: 'system' },
      action: 'user.accept_invitation',
      target: {
        id: invitation.email,
        type: 'user',
        displayName: invitation.email,
      },
      status: 'failure',
      companyId: invitation.companyId,
      details: { error: errorMessage, errorCode: error.code },
    });
    return { success: false, error: errorMessage };
  }
}
