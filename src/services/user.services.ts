import { db } from '@/lib/firebase';
import {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import type { UserProfileUpdate } from '@/lib/types';

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
      personalInfo: {
        firstName: additionalData.firstName,
        lastName: additionalData.lastName,
      },
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
    throw error;
  }
};

export const updateUserProfile = async (
  userId: string,
  userRole: 'platform' | 'company',
  data: UserProfileUpdate
) => {
  const collectionName =
    userRole === 'platform' ? 'platformUsers' : 'teamMembers';
  const userRef = doc(db, collectionName, userId);

  const docSnap = await getDoc(userRef);
  if (!docSnap.exists()) {
    throw new Error("User document doesn't exist.");
  }

  let updateData: { [key: string]: any } = {
    updatedAt: serverTimestamp(),
  };

  const aDate = data.dateOfBirth
    ? Timestamp.fromDate(data.dateOfBirth)
    : undefined;

  if (userRole === 'company') {
    updateData['personalInfo.firstName'] = data.firstName;
    updateData['personalInfo.lastName'] = data.lastName;
    updateData['personalInfo.phone'] = data.phone || '';
    updateData['personalInfo.dateOfBirth'] = aDate;
    updateData['personalInfo.gender'] = data.gender || '';
    updateData['address.city'] = data.city || '';
    updateData['address.country'] = data.country || '';
    updateData['professionalInfo.designation'] = data.designation || '';
  } else {
    // For 'platform' users
    updateData['personalInfo.firstName'] = data.firstName;
    updateData['personalInfo.lastName'] = data.lastName;
    updateData['personalInfo.phone'] = data.phone || '';
    updateData['personalInfo.dateOfBirth'] = aDate;
    updateData['personalInfo.gender'] = data.gender || '';
    updateData['designation'] = data.designation || '';
  }

  try {
    await updateDoc(userRef, updateData);
  } catch (error) {
    console.error('Error updating user profile in Firestore:', error);
    throw error;
  }
};
