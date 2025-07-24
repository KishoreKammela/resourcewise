'use server';

import { db } from '@/lib/firebase-admin';
import type { PlatformUser, UserProfileUpdate } from '@/lib/types';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Creates a new platform user document in Firestore.
 * @param uid - The user's unique ID from Firebase Auth.
 * @param userData - The basic user data (firstName, lastName, email).
 */
export async function createPlatformUserDocument(
  uid: string,
  userData: { firstName: string; lastName: string; email: string }
): Promise<void> {
  const userRef = db.collection('platformUsers').doc(uid);

  const newUserProfile: Omit<
    PlatformUser,
    'id' | 'createdAt' | 'updatedAt' | 'lastLogin'
  > & {
    createdAt: FieldValue;
    updatedAt: FieldValue;
  } = {
    email: userData.email,
    userType: 'admin', // Default user type
    personalInfo: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
    },
    address: {},
    professionalInfo: {},
    permissions: {
      canManageUsers: true,
    },
    isActive: true,
    loginAttempts: 0,
    twoFactorEnabled: false,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  await userRef.set(newUserProfile, { merge: true });
}

/**
 * Updates an existing platform user document in Firestore.
 * @param uid - The user's unique ID.
 * @param data - The profile data to update.
 */
export async function updatePlatformUserDocument(
  uid: string,
  data: UserProfileUpdate
): Promise<void> {
  const userRef = db.collection('platformUsers').doc(uid);

  const rawUpdateData = {
    'personalInfo.firstName': data.personalInfo.firstName,
    'personalInfo.lastName': data.personalInfo.lastName,
    'personalInfo.phone': data.personalInfo.phone,
    'personalInfo.gender': data.personalInfo.gender,
    'personalInfo.dateOfBirth': data.personalInfo.dateOfBirth,
    'address.line1': data.address.line1,
    'address.line2': data.address.line2,
    'address.city': data.address.city,
    'address.state': data.address.state,
    'address.country': data.address.country,
    'address.postalCode': data.address.postalCode,
    'professionalInfo.designation': data.professionalInfo.designation,
    'professionalInfo.department': data.professionalInfo.department,
    updatedAt: FieldValue.serverTimestamp(),
  };

  // Filter out undefined values to prevent Firestore errors
  const finalUpdateData = Object.fromEntries(
    Object.entries(rawUpdateData).filter(([_, v]) => v !== undefined)
  );

  if (Object.keys(finalUpdateData).length === 0) {
    // No actual data to update, maybe just return
    return;
  }

  await userRef.update(finalUpdateData);
}
