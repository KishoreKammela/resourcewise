'use server';

import type { UserProfileUpdate } from '@/lib/types';
import {
  updatePlatformUserDocument,
  updateTeamMemberDocument,
} from '@/services/user.services';
import { revalidatePath } from 'next/cache';
import { createAuditLog } from '@/services/audit.services';
import { auth, db } from '@/lib/firebase-admin';

interface UpdateProfileResult {
  success: boolean;
  error?: string;
}

export async function updateUserProfile(
  userId: string,
  userRole: 'platform' | 'company',
  prevState: any,
  formData: FormData
): Promise<UpdateProfileResult> {
  const actor = await auth.getUser(userId);
  const actorDisplayName = actor.displayName || actor.email || userId;

  try {
    const dateOfBirthString = formData.get(
      'personalInfo.dateOfBirth'
    ) as string;

    const dateOfBirth = dateOfBirthString
      ? new Date(dateOfBirthString)
      : undefined;

    const updateData: UserProfileUpdate = {
      personalInfo: {
        firstName: formData.get('personalInfo.firstName') as string,
        lastName: formData.get('personalInfo.lastName') as string,
        phone: (formData.get('personalInfo.phone') as string) || undefined,
        gender: (formData.get('personalInfo.gender') as string) || undefined,
        dateOfBirth,
        profilePictureUrl:
          (formData.get('personalInfo.profilePictureUrl') as string) ||
          undefined,
      },
      address: {
        line1: (formData.get('address.line1') as string) || undefined,
        line2: (formData.get('address.line2') as string) || undefined,
        city: (formData.get('address.city') as string) || undefined,
        state: (formData.get('address.state') as string) || undefined,
        country: (formData.get('address.country') as string) || undefined,
        postalCode: (formData.get('address.postalCode') as string) || undefined,
      },
      professionalInfo: {
        designation:
          (formData.get('professionalInfo.designation') as string) || undefined,
        department:
          (formData.get('professionalInfo.department') as string) || undefined,
        employeeId:
          (formData.get('professionalInfo.employeeId') as string) || undefined,
        workLocation:
          (formData.get('professionalInfo.workLocation') as string) ||
          undefined,
        workMode:
          (formData.get('professionalInfo.workMode') as string) || undefined,
      },
    };

    if (userRole === 'platform') {
      await updatePlatformUserDocument(userId, updateData);
    } else if (userRole === 'company') {
      await updateTeamMemberDocument(userId, updateData);
    } else {
      throw new Error('Invalid user role specified for profile update.');
    }

    revalidatePath('/profile');
    revalidatePath('/settings/users');

    await createAuditLog({
      actor: {
        id: userId,
        displayName: actorDisplayName,
        role: userRole,
      },
      action: 'user_profile.update',
      target: {
        id: userId,
        type: 'user',
        displayName: actorDisplayName,
      },
      status: 'success',
    });

    return { success: true };
  } catch (error: any) {
    const errorMessage =
      'An unexpected error occurred while updating the profile.';

    await createAuditLog({
      actor: {
        id: userId,
        displayName: actorDisplayName,
        role: userRole,
      },
      action: 'user_profile.update',
      target: {
        id: userId,
        type: 'user',
        displayName: actorDisplayName,
      },
      status: 'failure',
      details: { error: error.message, code: error.code },
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

interface UpdateStatusResult {
  success: boolean;
  error?: string;
}

export async function updatePlatformUserStatusAction(
  actorId: string,
  targetUserId: string,
  isActive: boolean
): Promise<UpdateStatusResult> {
  try {
    const actor = await auth.getUser(actorId);
    const targetUser = await auth.getUser(targetUserId);

    await db.collection('platformUsers').doc(targetUserId).update({ isActive });

    await createAuditLog({
      actor: {
        id: actorId,
        displayName: actor.displayName || actorId,
        role: 'platform',
      },
      action: `platform_user.${isActive ? 'activate' : 'suspend'}`,
      target: {
        id: targetUserId,
        type: 'user',
        displayName: targetUser.displayName || targetUserId,
      },
      status: 'success',
    });

    revalidatePath('/settings/users');
    return { success: true };
  } catch (error: any) {
    const actor = await auth.getUser(actorId);
    const targetUser = await auth.getUser(targetUserId).catch(() => null);

    await createAuditLog({
      actor: {
        id: actorId,
        displayName: actor.displayName || actorId,
        role: 'platform',
      },
      action: `platform_user.${isActive ? 'activate' : 'suspend'}`,
      target: {
        id: targetUserId,
        type: 'user',
        displayName: targetUser?.displayName || targetUserId,
      },
      status: 'failure',
      details: { error: error.message, code: error.code },
    });

    return {
      success: false,
      error: `Failed to ${isActive ? 'activate' : 'suspend'} user.`,
    };
  }
}

export async function updateTeamMemberStatusAction({
  actorId,
  companyId,
  targetUserId,
  isActive,
}: {
  actorId: string;
  companyId: string;
  targetUserId: string;
  isActive: boolean;
}): Promise<UpdateStatusResult> {
  try {
    const actor = await auth.getUser(actorId);
    const targetUser = await auth.getUser(targetUserId);

    await db.collection('teamMembers').doc(targetUserId).update({ isActive });

    await createAuditLog({
      actor: {
        id: actorId,
        displayName: actor.displayName || actorId,
        role: 'company',
      },
      action: `team_member.${isActive ? 'activate' : 'suspend'}`,
      target: {
        id: targetUserId,
        type: 'user',
        displayName: targetUser.displayName || targetUserId,
      },
      status: 'success',
      companyId,
    });

    revalidatePath('/team');
    return { success: true };
  } catch (error: any) {
    const actor = await auth.getUser(actorId);
    const targetUser = await auth.getUser(targetUserId).catch(() => null);

    await createAuditLog({
      actor: {
        id: actorId,
        displayName: actor.displayName || actorId,
        role: 'company',
      },
      action: `team_member.${isActive ? 'activate' : 'suspend'}`,
      target: {
        id: targetUserId,
        type: 'user',
        displayName: targetUser?.displayName || targetUserId,
      },
      status: 'failure',
      companyId,
      details: { error: error.message, code: error.code },
    });

    return {
      success: false,
      error: `Failed to ${isActive ? 'activate' : 'suspend'} user.`,
    };
  }
}
