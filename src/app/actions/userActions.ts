'use server';

import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { updateUserProfile } from '@/services/user.services';
import type { UserProfileUpdate } from '@/lib/types';

export async function sendPasswordResetEmailAction(email: string) {
  if (!email) {
    return { success: false, error: 'Email address is required.' };
  }

  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    console.error('Password reset failed:', error);
    return { success: false, error: error.message };
  }
}

export async function updateUserProfileAction(
  userId: string,
  userRole: 'platform' | 'company',
  data: UserProfileUpdate
) {
  if (!userId) {
    return { success: false, error: 'User ID is required.' };
  }

  try {
    await updateUserProfile(userId, userRole, data);
    return { success: true };
  } catch (error: any) {
    console.error('Profile update failed:', error);
    return {
      success: false,
      error: 'Failed to update profile. Please try again.',
    };
  }
}
