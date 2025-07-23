'use server';

import { createPlatformUserDocument } from '@/services/user.services';
import { auth } from '@/lib/firebase-admin';

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

  if (!firstName || !lastName || !email || !password) {
    return { success: false, error: 'All fields are required.' };
  }

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    if (userRecord) {
      await createPlatformUserDocument(userRecord.uid, {
        firstName,
        lastName,
        email,
      });
      return { success: true };
    }
    return { success: false, error: 'Could not create user account.' };
  } catch (error: any) {
    console.error('Platform User Creation Error:', error);
    let errorMessage = 'An unexpected error occurred. Please try again.';
    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'This email address is already in use by another account.';
    } else if (error.code === 'auth/invalid-password') {
      errorMessage =
        'The password is not strong enough. It must be at least 6 characters long.';
    }
    return { success: false, error: errorMessage };
  }
}
