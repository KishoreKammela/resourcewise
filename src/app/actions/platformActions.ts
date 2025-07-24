'use server';

import { auth } from '@/lib/firebase-admin';
import { updatePlatformConfig } from '@/services/platform.services';
import { createAuditLog } from '@/services/audit.services';
import { revalidatePath } from 'next/cache';

interface UpdateConfigResult {
  success: boolean;
  error?: string;
}

export async function updateSessionConfigAction(
  actorId: string,
  prevState: any,
  formData: FormData
): Promise<UpdateConfigResult> {
  if (!actorId) {
    return { success: false, error: 'User is not authenticated.' };
  }

  const actor = await auth.getUser(actorId);
  const actorDisplayName = actor.displayName || actor.email || actorId;

  try {
    const inactivityTimeoutMinutes = Number(
      formData.get('inactivityTimeoutMinutes')
    );
    const warningCountdownSeconds = Number(
      formData.get('warningCountdownSeconds')
    );

    if (
      isNaN(inactivityTimeoutMinutes) ||
      isNaN(warningCountdownSeconds) ||
      inactivityTimeoutMinutes <= 0 ||
      warningCountdownSeconds <= 0
    ) {
      return { success: false, error: 'Please enter valid positive numbers.' };
    }

    const configData = {
      inactivityTimeoutMinutes,
      warningCountdownSeconds,
    };

    await updatePlatformConfig('sessionManagement', configData);

    await createAuditLog({
      actor: {
        id: actorId,
        displayName: actorDisplayName,
        role: 'platform',
      },
      action: 'platform_config.update',
      target: {
        id: 'sessionManagement',
        type: 'config',
        displayName: 'Session Management Settings',
      },
      status: 'success',
      details: configData,
    });

    revalidatePath('/settings/platform-configuration');

    return { success: true };
  } catch (error: any) {
    const errorMessage =
      'An unexpected error occurred while updating the configuration.';

    await createAuditLog({
      actor: {
        id: actorId,
        displayName: actorDisplayName,
        role: 'platform',
      },
      action: 'platform_config.update',
      target: {
        id: 'sessionManagement',
        type: 'config',
        displayName: 'Session Management Settings',
      },
      status: 'failure',
      details: { error: error.message, code: error.code },
    });
    return { success: false, error: errorMessage };
  }
}
