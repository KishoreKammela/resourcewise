'use server';

import { auth } from '@/lib/firebase';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { updateUserProfile } from '@/services/user.services';
import type { UserProfileUpdate } from '@/lib/types';
import type { ChangePasswordFormValues } from '@/components/profile/ChangePasswordDialog';


export async function changePasswordAction(data: ChangePasswordFormValues) {
    const user = auth.currentUser;

    if (!user || !user.email) {
        return { success: false, error: 'No user is logged in or user has no email.' };
    }

    try {
        const credential = EmailAuthProvider.credential(user.email, data.currentPassword);
        
        // Re-authenticate the user to ensure they are the rightful owner of the account
        await reauthenticateWithCredential(user, credential);
        
        // If re-authentication is successful, update the password
        await updatePassword(user, data.newPassword);
        
        return { success: true };
    } catch (error: any) {
        console.error('Password change failed:', error);
        // Provide a more user-friendly error message
        let errorMessage = 'An unexpected error occurred. Please try again.';
        if (error.code === 'auth/wrong-password') {
            errorMessage = 'The current password you entered is incorrect.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'The new password is too weak. Please choose a stronger password.';
        }
        return { success: false, error: errorMessage };
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
