'use server';

import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

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
