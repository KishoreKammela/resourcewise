import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';

export const createUserProfileDocument = async (user: User, additionalData: Record<string, any> = {}) => {
  if (!user) return;

  const userRef = doc(db, `users/${user.uid}`);

  const { email } = user;
  const { displayName } = additionalData;

  try {
    await setDoc(userRef, {
      uid: user.uid,
      email,
      displayName: displayName || email,
      createdAt: serverTimestamp(),
      ...additionalData,
    });
  } catch (error) {
    console.error('Error creating user document', error);
  }
};
