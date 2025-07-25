'use server';

import { createAuditLog } from '@/services/audit.services';
import { createClient, updateClient } from '@/services/client.services';
import type { Client } from '@/lib/types';
import { auth } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { Timestamp } from 'firebase-admin/firestore';
import { redirect } from 'next/navigation';

interface ActionResult {
  success: boolean;
  error?: string;
  clientId?: string;
}

function safeToDate(
  dateString: string | FormDataEntryValue | null
): Timestamp | undefined {
  if (!dateString || typeof dateString !== 'string') {
    return undefined;
  }
  if (
    dateString === 'undefined' ||
    dateString === 'null' ||
    dateString === ''
  ) {
    return undefined;
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return undefined;
  }
  return Timestamp.fromDate(date);
}

function buildClientData(
  formData: FormData,
  companyId: string,
  actorId: string
): Omit<Client, 'id' | 'createdAt' | 'updatedAt'> {
  const rawData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> = {
    companyId,
    clientCode: (formData.get('clientCode') as string) || '',
    basicInfo: {
      clientName: formData.get('basicInfo.clientName') as string,
      clientType: formData.get('basicInfo.clientType') as string,
      industry: formData.get('basicInfo.industry') as string,
      website: formData.get('basicInfo.website') as string,
      logoUrl: formData.get('basicInfo.logoUrl') as string,
    },
    contactInfo: {
      primary: {
        name: formData.get('contactInfo.primary.name') as string,
        email: formData.get('contactInfo.primary.email') as string,
        phone: formData.get('contactInfo.primary.phone') as string,
        designation: formData.get('contactInfo.primary.designation') as string,
      },
    },
    address: {
      line1: formData.get('address.line1') as string,
      line2: formData.get('address.line2') as string,
      city: formData.get('address.city') as string,
      state: formData.get('address.state') as string,
      country: formData.get('address.country') as string,
      postalCode: formData.get('address.postalCode') as string,
      timezone: formData.get('address.timezone') as string,
    },
    relationship: {
      accountManagerId: formData.get('relationship.accountManagerId') as string,
      status: formData.get('relationship.status') as string,
      startDate: safeToDate(formData.get('relationship.startDate')),
      healthScore: Number(formData.get('relationship.healthScore')) || 5, // Default to 5
    },
    commercial: {
      billingCurrency: formData.get('commercial.billingCurrency') as string,
    },
    analytics: {
      totalProjectsCount: 0,
      activeProjectsCount: 0,
      totalRevenueGenerated: 0,
    },
    isActive: true,
    createdBy: actorId,
  };

  return rawData;
}

export async function createClientAction(
  { companyId, actorId }: { companyId: string; actorId: string },
  prevState: any,
  formData: FormData
): Promise<ActionResult> {
  const actor = await auth.getUser(actorId);
  const finalClientData = buildClientData(formData, companyId, actorId);

  try {
    const clientId = await createClient(finalClientData);

    await createAuditLog({
      actor: {
        id: actorId,
        displayName: actor.displayName ?? actor.email ?? actorId,
        role: 'company',
      },
      action: 'client.create',
      target: {
        id: clientId,
        type: 'client',
        displayName: finalClientData.basicInfo.clientName,
      },
      status: 'success',
      companyId,
    });

    revalidatePath('/clients');
    return { success: true, clientId };
  } catch (error: any) {
    await createAuditLog({
      actor: {
        id: actorId,
        displayName: actor.displayName ?? actor.email ?? actorId,
        role: 'company',
      },
      action: 'client.create',
      target: {
        id: 'new_client',
        type: 'client',
        displayName: finalClientData.basicInfo.clientName,
      },
      status: 'failure',
      details: { error: error.message },
      companyId,
    });
    return { success: false, error: error.message };
  }
}

export async function updateClientAction(
  {
    clientId,
    companyId,
    actorId,
  }: { clientId: string; companyId: string; actorId: string },
  prevState: any,
  formData: FormData
): Promise<ActionResult> {
  const actor = await auth.getUser(actorId);
  const finalClientData = buildClientData(formData, companyId, actorId);

  try {
    await updateClient(clientId, finalClientData);

    await createAuditLog({
      actor: {
        id: actorId,
        displayName: actor.displayName ?? actor.email ?? actorId,
        role: 'company',
      },
      action: 'client.update',
      target: {
        id: clientId,
        type: 'client',
        displayName: finalClientData.basicInfo.clientName,
      },
      status: 'success',
      companyId,
    });
  } catch (error: any) {
    await createAuditLog({
      actor: {
        id: actorId,
        displayName: actor.displayName ?? actor.email ?? actorId,
        role: 'company',
      },
      action: 'client.update',
      target: {
        id: clientId,
        type: 'client',
        displayName: finalClientData.basicInfo.clientName,
      },
      status: 'failure',
      details: { error: error.message },
      companyId,
    });
    return { success: false, error: error.message };
  }

  revalidatePath('/clients');
  revalidatePath(`/clients/${clientId}`);
  redirect(`/clients/${clientId}`);
}
