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

// Helper to remove undefined properties from an object, which Firestore doesn't allow.
function cleanUndefined(obj: any): any {
  if (obj === null || obj === undefined) {
    return undefined;
  }
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined).filter((v) => v !== undefined);
  }
  if (typeof obj === 'object' && !(obj instanceof Timestamp)) {
    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
      const value = cleanUndefined(obj[key]);
      if (value !== undefined) {
        newObj[key] = value;
      }
    }
    return newObj;
  }
  return obj;
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

function safeToNumber(value: FormDataEntryValue | null): number | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  const num = Number(value);
  return isNaN(num) ? undefined : num;
}

function safeToBoolean(value: FormDataEntryValue | null): boolean {
  return value === 'on' || value === 'true';
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
      companySize: formData.get('basicInfo.companySize') as string,
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
      secondary: {
        name: formData.get('contactInfo.secondary.name') as string,
        email: formData.get('contactInfo.secondary.email') as string,
        phone: formData.get('contactInfo.secondary.phone') as string,
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
    businessInfo: {
      registrationNumber: formData.get(
        'businessInfo.registrationNumber'
      ) as string,
      taxIdentificationNumber: formData.get(
        'businessInfo.taxIdentificationNumber'
      ) as string,
      annualRevenueRange: formData.get(
        'businessInfo.annualRevenueRange'
      ) as string,
      employeeCountRange: formData.get(
        'businessInfo.employeeCountRange'
      ) as string,
      businessModel: formData.get('businessInfo.businessModel') as string,
    },
    relationship: {
      accountManagerId: formData.get('relationship.accountManagerId') as string,
      status: formData.get('relationship.status') as string,
      startDate: safeToDate(formData.get('relationship.startDate')),
      healthScore: safeToNumber(formData.get('relationship.healthScore')) || 3,
      satisfactionRating:
        safeToNumber(formData.get('relationship.satisfactionRating')) || 3,
    },
    commercial: {
      contractType: formData.get('commercial.contractType') as string,
      paymentTerms: formData.get('commercial.paymentTerms') as string,
      billingCurrency: formData.get('commercial.billingCurrency') as string,
      standardBillingRate: safeToNumber(
        formData.get('commercial.standardBillingRate')
      ),
      discountPercentage: safeToNumber(
        formData.get('commercial.discountPercentage')
      ),
      creditLimit: safeToNumber(formData.get('commercial.creditLimit')),
      paymentHistoryRating: formData.get(
        'commercial.paymentHistoryRating'
      ) as string,
    },
    contract: {
      startDate: safeToDate(formData.get('contract.startDate')),
      endDate: safeToDate(formData.get('contract.endDate')),
      value: safeToNumber(formData.get('contract.value')),
      documentUrl: formData.get('contract.documentUrl') as string,
      ndaSigned: safeToBoolean(formData.get('contract.ndaSigned')),
      ndaExpiryDate: safeToDate(formData.get('contract.ndaExpiryDate')),
      msaSigned: safeToBoolean(formData.get('contract.msaSigned')),
      msaExpiryDate: safeToDate(formData.get('contract.msaExpiryDate')),
    },
    communication: {
      preferredMethod: formData.get('communication.preferredMethod') as string,
      frequency: formData.get('communication.frequency') as string,
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
  const rawClientData = buildClientData(formData, companyId, actorId);
  const finalClientData = cleanUndefined(rawClientData);

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
  const rawClientData = buildClientData(formData, companyId, actorId);
  const finalClientData = cleanUndefined(rawClientData);

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
