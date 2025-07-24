'use server';

import { db } from '@/lib/firebase-admin';
import type { Company, TeamMember, Invitation } from '@/lib/types';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Creates a new company document and its initial admin user in Firestore.
 * @param adminUid - The Firebase Auth UID of the admin user.
 * @param companyData - Data for the new company.
 * @param adminData - Data for the admin user.
 * @returns The ID of the newly created company.
 */
export async function createCompanyAndAdmin(
  adminUid: string,
  companyData: { companyName: string; companyWebsite?: string },
  adminData: { firstName: string; lastName: string; email: string }
): Promise<{ companyId: string }> {
  const companyRef = db.collection('companies').doc(); // Auto-generate ID
  const teamMemberRef = db.collection('teamMembers').doc(adminUid);
  const companyId = companyRef.id;

  const newCompany: Omit<Company, 'id'> = {
    companyName: companyData.companyName,
    companyWebsite: companyData.companyWebsite,
    address: {},
    timezone: 'UTC', // Default value
    businessInfo: {},
    operationalData: {
      primaryTechnologies: [],
      serviceOfferings: [],
      billingModels: [],
      geographicPresence: { locations: [], remotePolicy: 'flexible' },
      certifications: [],
    },
    compliance: {},
    subscription: {
      plan: 'free', // Default plan
      status: 'active',
      billingCurrency: 'USD',
      billingCycle: 'monthly',
      limits: {
        maxResourcesAllowed: 10,
        maxProjectsAllowed: 5,
        maxTeamMembersAllowed: 5,
      },
    },
    settings: {
      dateFormat: 'MM/DD/YYYY',
      timeFormat: 'h:mm A',
      currency: 'USD',
      workingHours: {
        start: '09:00',
        end: '17:00',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      },
      holidays: [],
      fiscalYearStart: 'January',
    },
    analytics: {
      onboardingCompleted: false,
      featureUsageStats: {},
    },
    isActive: true,
    createdAt: FieldValue.serverTimestamp() as any,
    updatedAt: FieldValue.serverTimestamp() as any,
  };

  const newTeamMember: Omit<TeamMember, 'id'> = {
    companyId,
    email: adminData.email,
    personalInfo: {
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      email: adminData.email,
    },
    address: {},
    professionalInfo: {
      designation: 'Administrator',
    },
    authInfo: {
      userType: 'admin',
      isEmailVerified: false,
      loginAttempts: 0,
    },
    permissions: {
      accessLevel: 'admin',
      specificPermissions: { canManageAll: true },
    },
    contactInfo: {
      workEmail: adminData.email,
      communicationPreferences: {
        email: true,
        sms: false,
        pushNotifications: false,
      },
      notificationSettings: {},
    },
    employmentDetails: {
      status: 'active',
      type: 'full-time',
    },
    isActive: true,
    createdAt: FieldValue.serverTimestamp() as any,
    updatedAt: FieldValue.serverTimestamp() as any,
  };

  const batch = db.batch();
  batch.set(companyRef, newCompany);
  batch.set(teamMemberRef, newTeamMember);

  await batch.commit();
  return { companyId };
}

/**
 * Creates a new team member document in Firestore from an invitation.
 * @param uid - The new user's unique ID from Firebase Auth.
 * @param invitation - The invitation object.
 */
export async function createTeamMemberFromInvitation(
  uid: string,
  invitation: Invitation
): Promise<void> {
  if (!invitation.companyId) {
    throw new Error('Company ID is missing from the invitation.');
  }

  const teamMemberRef = db.collection('teamMembers').doc(uid);
  const newTeamMember: Omit<TeamMember, 'id'> = {
    companyId: invitation.companyId,
    email: invitation.email,
    personalInfo: {
      firstName: invitation.firstName,
      lastName: invitation.lastName,
      email: invitation.email,
    },
    address: {},
    professionalInfo: {
      designation: invitation.role,
    },
    authInfo: {
      userType: invitation.role,
      isEmailVerified: true,
      loginAttempts: 0,
    },
    permissions: {
      accessLevel: invitation.role,
      specificPermissions: {},
    },
    contactInfo: {
      workEmail: invitation.email,
      communicationPreferences: {
        email: true,
        sms: false,
        pushNotifications: true,
      },
      notificationSettings: {},
    },
    employmentDetails: {
      status: 'active',
      type: 'full-time',
    },
    isActive: true,
    createdAt: FieldValue.serverTimestamp() as any,
    updatedAt: FieldValue.serverTimestamp() as any,
    createdBy: invitation.createdBy,
  };

  await teamMemberRef.set(newTeamMember);
}

/**
 * Updates an existing company document in Firestore.
 * @param companyId - The company's unique ID.
 * @param data - The profile data to update.
 */
export async function updateCompanyDocument(
  companyId: string,
  data: { [key: string]: any }
): Promise<void> {
  const companyRef = db.collection('companies').doc(companyId);

  const updateData = {
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  };

  await companyRef.update(updateData);
}
