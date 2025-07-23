import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';

export const createPlatformUserDocument = async (
  user: User,
  additionalData: { firstName: string; lastName: string }
) => {
  if (!user) return;

  const userRef = doc(db, `platformUsers/${user.uid}`);
  const now = serverTimestamp();

  try {
    await setDoc(userRef, {
      id: user.uid,
      email: user.email,
      firstName: additionalData.firstName,
      lastName: additionalData.lastName,
      userType: 'admin', // Default userType
      permissions: {},
      isActive: true,
      loginAttempts: 0,
      twoFactorEnabled: false,
      createdAt: now,
      updatedAt: now,
    });
  } catch (error) {
    console.error('Error creating platform user document', error);
  }
};
