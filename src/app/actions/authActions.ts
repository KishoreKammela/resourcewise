'use server';

import { createPlatformUserDocument } from '@/services/user.services';
import { auth } from '@/lib/firebase-admin';
import { createCompanyAndAdmin } from '@/services/company.services';
import { createAuditLog } from '@/services/audit.services';

interface SignUpResult {
  success: boolean;
  error?: string;
}

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
    } else if (error.code === 'auth/invalid-password') {
      errorMessage =
        'The password is not strong enough. It must be at least 6 characters long.';
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
    } else if (error.code === 'auth/invalid-password') {
      errorMessage =
        'The password is not strong enough. It must be at least 6 characters long.';
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
