'use server';

import { db } from '@/lib/firebase-admin';
import type { PlatformUser, UserProfileUpdate } from '@/lib/types';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

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
  await updateUserDocument(userRef, data);
}

/**
 * Updates an existing team member document in Firestore.
 * @param uid - The user's unique ID.
 * @param data - The profile data to update.
 */
export async function updateTeamMemberDocument(
  uid: string,
  data: UserProfileUpdate
): Promise<void> {
  const userRef = db.collection('teamMembers').doc(uid);
  await updateUserDocument(userRef, data);
}

/**
 * Generic function to update a user document in either platformUsers or teamMembers.
 * @param userRef - The DocumentReference to the user document.
 * @param data - The profile data to update.
 */
async function updateUserDocument(
  userRef: FirebaseFirestore.DocumentReference,
  data: UserProfileUpdate
): Promise<void> {
  const updateData: { [key: string]: any } = {};

  // A helper to add a field to the updateData object if it has a value
  const addField = (path: string, value: any) => {
    // We check for undefined because an empty string '' is a valid value to clear a field.
    if (value !== undefined) {
      updateData[path] = value;
    }
  };

  // Personal Info
  addField('personalInfo.firstName', data.personalInfo.firstName);
  addField('personalInfo.lastName', data.personalInfo.lastName);
  addField('personalInfo.phone', data.personalInfo.phone);
  addField('personalInfo.gender', data.personalInfo.gender);
  if (data.personalInfo.dateOfBirth) {
    updateData['personalInfo.dateOfBirth'] = Timestamp.fromDate(
      data.personalInfo.dateOfBirth
    );
  }
  addField(
    'personalInfo.profilePictureUrl',
    data.personalInfo.profilePictureUrl
  );

  // Address
  addField('address.line1', data.address.line1);
  addField('address.line2', data.address.line2);
  addField('address.city', data.address.city);
  addField('address.state', data.address.state);
  addField('address.country', data.address.country);
  addField('address.postalCode', data.address.postalCode);

  // Professional Info
  addField('professionalInfo.designation', data.professionalInfo.designation);
  addField('professionalInfo.department', data.professionalInfo.department);

  // Team Member specific fields
  addField('employeeId', data.professionalInfo.employeeId);
  addField(
    'employmentDetails.workLocation',
    data.professionalInfo.workLocation
  );
  addField('employmentDetails.workMode', data.professionalInfo.workMode);

  // Always update the timestamp
  updateData['updatedAt'] = FieldValue.serverTimestamp();

  if (Object.keys(updateData).length <= 1) {
    // Only updatedAt is present, no actual data changed
    return;
  }

  await userRef.update(updateData);
}
