'use server';

import { updateUserProfile } from '@/services/user.services';
import type { UserProfileUpdate } from '@/lib/types';


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
