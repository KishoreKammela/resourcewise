'use server';

import { createInvitation } from '@/services/invitation.services';
import { auth } from '@/lib/firebase-admin';
import { createAuditLog } from '@/services/audit.services';
import type { Company } from '@/lib/types';

interface InviteResult {
  success: boolean;
  error?: string;
  inviteLink?: string;
}

export async function invitePlatformUserAction(
  actorId: string,
  prevState: any,
  formData: FormData
): Promise<InviteResult> {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;

  if (!firstName || !lastName || !email || !role) {
    return { success: false, error: 'All fields are required.' };
  }

  const actor = await auth.getUser(actorId);
  const actorDisplayName = actor.displayName || actor.email || actorId;

  try {
    const token = await createInvitation({
      type: 'platform',
      email,
      firstName,
      lastName,
      role,
      createdBy: actorId,
    });

    // TODO: Make this URL dynamic based on environment
    const inviteLink = `http://localhost:9002/signup/invite/${token}`;

    await createAuditLog({
      actor: {
        id: actorId,
        displayName: actorDisplayName,
        role: 'platform',
      },
      action: 'platform_user.invite',
      target: {
        id: email,
        type: 'user_invitation',
        displayName: `${firstName} ${lastName}`,
      },
      status: 'success',
      details: { role, inviteLink },
    });

    return { success: true, inviteLink };
  } catch (error: any) {
    const errorMessage =
      'An unexpected error occurred while sending the invitation.';

    await createAuditLog({
      actor: {
        id: actorId,
        displayName: actorDisplayName,
        role: 'platform',
      },
      action: 'platform_user.invite',
      target: {
        id: email,
        type: 'user_invitation',
        displayName: `${firstName} ${lastName}`,
      },
      status: 'failure',
      details: { error: error.message, errorCode: error.code },
    });

    return { success: false, error: errorMessage };
  }
}

export async function inviteTeamMemberAction(
  {
    actorId,
    companyId,
    companyName,
  }: { actorId: string; companyId: string; companyName: string },
  prevState: any,
  formData: FormData
): Promise<InviteResult> {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;

  if (!firstName || !lastName || !email || !role) {
    return { success: false, error: 'All fields are required.' };
  }
  if (!companyId) {
    return { success: false, error: 'Company information is missing.' };
  }

  const actor = await auth.getUser(actorId);
  const actorDisplayName = actor.displayName || actor.email || actorId;

  try {
    const token = await createInvitation({
      type: 'company',
      companyId,
      email,
      firstName,
      lastName,
      role,
      createdBy: actorId,
    });

    // TODO: Make this URL dynamic based on environment
    const inviteLink = `http://localhost:9002/signup/invite/${token}`;

    await createAuditLog({
      actor: {
        id: actorId,
        displayName: actorDisplayName,
        role: 'company',
      },
      action: 'team_member.invite',
      target: {
        id: email,
        type: 'user_invitation',
        displayName: `${firstName} ${lastName}`,
      },
      companyId,
      status: 'success',
      details: { role, inviteLink },
    });

    return { success: true, inviteLink };
  } catch (error: any) {
    const errorMessage =
      'An unexpected error occurred while sending the invitation.';

    await createAuditLog({
      actor: {
        id: actorId,
        displayName: actorDisplayName,
        role: 'company',
      },
      action: 'team_member.invite',
      target: {
        id: email,
        type: 'user_invitation',
        displayName: `${firstName} ${lastName}`,
      },
      companyId,
      status: 'failure',
      details: { error: error.message, errorCode: error.code },
    });

    return { success: false, error: errorMessage };
  }
}
