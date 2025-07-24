'use server';

import { createAuditLog } from '@/services/audit.services';
import { updateCompanyDocument } from '@/services/company.services';
import { auth } from '@/lib/firebase-admin';

interface UpdateCompanyResult {
  success: boolean;
  error?: string;
}

export async function updateCompanyAction(
  companyId: string,
  actorId: string,
  prevState: any,
  formData: FormData
): Promise<UpdateCompanyResult> {
  if (!companyId) {
    return { success: false, error: 'Company ID is missing.' };
  }
  if (!actorId) {
    return { success: false, error: 'User is not authenticated.' };
  }

  const actor = await auth.getUser(actorId);
  const actorDisplayName = actor.displayName || actor.email || actorId;
  const companyName = formData.get('companyName') as string;

  try {
    const updateData = {
      companyName,
      companyWebsite: (formData.get('companyWebsite') as string) || '',
      companyLogoUrl: (formData.get('companyLogoUrl') as string) || '',
      timezone: formData.get('timezone') as string,
      'settings.currency': formData.get('settings.currency') as string,
    };

    await updateCompanyDocument(companyId, updateData);

    await createAuditLog({
      actor: {
        id: actorId,
        displayName: actorDisplayName,
        role: 'company',
      },
      action: 'company_profile.update',
      target: {
        id: companyId,
        type: 'company',
        displayName: companyName,
      },
      status: 'success',
      companyId,
    });

    return { success: true };
  } catch (error: any) {
    const errorMessage =
      'An unexpected error occurred while updating the company profile.';

    await createAuditLog({
      actor: {
        id: actorId,
        displayName: actorDisplayName,
        role: 'company',
      },
      action: 'company_profile.update',
      target: {
        id: companyId,
        type: 'company',
        displayName: companyName,
      },
      status: 'failure',
      companyId,
      details: { error: error.message, code: error.code },
    });
    return { success: false, error: errorMessage };
  }
}
