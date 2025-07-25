'use server';

import { createAuditLog } from '@/services/audit.services';
import { createAllocation } from '@/services/allocation.services';
import type { Allocation } from '@/lib/types';
import { auth } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { Timestamp } from 'firebase-admin/firestore';

interface ActionResult {
  success: boolean;
  error?: string;
}

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
      if (obj.hasOwnProperty(key)) {
        const value = cleanUndefined(obj[key]);
        if (value !== undefined) {
          newObj[key] = value;
        }
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
  const date = new Date(dateString);
  return Timestamp.fromDate(date);
}

function safeToNumber(value: FormDataEntryValue | null): number | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  const num = Number(value);
  return isNaN(num) ? undefined : num;
}

function buildAllocationData(
  formData: FormData,
  companyId: string,
  projectId: string,
  actorId: string
): Omit<Allocation, 'id' | 'createdAt' | 'updatedAt'> {
  const rawData: Omit<Allocation, 'id' | 'createdAt' | 'updatedAt'> = {
    companyId,
    projectId,
    resourceId: formData.get('resourceId') as string,
    allocationDetails: {
      roleInProject: formData.get('roleInProject') as string,
      allocationPercentage:
        safeToNumber(formData.get('allocationPercentage')) ?? 100,
      allocationType: formData.get('allocationType') as string,
      allocatedHoursPerDay: safeToNumber(formData.get('allocatedHoursPerDay')),
    },
    timeline: {
      startDate: safeToDate(formData.get('startDate') as string)!,
      endDate: safeToDate(formData.get('endDate') as string),
    },
    status: {
      allocationStatus: 'Active',
      completionPercentage: 0,
    },
    financial: {
      currency: 'USD', // Should come from project or company settings
      totalBillableHours: 0,
      totalBilledAmount: 0,
      totalCost: 0,
    },
    performance: {
      actualHoursTotal: 0,
      qualityRating: 0,
      productivityScore: 0,
      communicationScore: 0,
    },
    responsibilities: {},
    skills: {},
    management: {
      allocatedBy: actorId,
    },
    timeTracking: {
      enabled: false,
      pendingTimesheetApprovals: 0,
    },
    feedback: {},
    conflictManagement: {},
    isActive: true,
    createdBy: actorId,
  };

  return rawData;
}

export async function createAllocationAction(
  {
    companyId,
    projectId,
    actorId,
  }: { companyId: string; projectId: string; actorId: string },
  prevState: any,
  formData: FormData
): Promise<ActionResult> {
  const actor = await auth.getUser(actorId);
  const rawAllocationData = buildAllocationData(
    formData,
    companyId,
    projectId,
    actorId
  );
  const finalAllocationData = cleanUndefined(rawAllocationData);

  try {
    await createAllocation(finalAllocationData as any);

    await createAuditLog({
      actor: {
        id: actorId,
        displayName: actor.displayName ?? actor.email ?? actorId,
        role: 'company',
      },
      action: 'allocation.create',
      target: {
        id: finalAllocationData.resourceId,
        type: 'allocation',
        displayName: `Resource allocated to project ${projectId}`,
      },
      status: 'success',
      companyId,
    });

    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error: any) {
    await createAuditLog({
      actor: {
        id: actorId,
        displayName: actor.displayName ?? actor.email ?? actorId,
        role: 'company',
      },
      action: 'allocation.create',
      target: {
        id: finalAllocationData.resourceId,
        type: 'allocation',
        displayName: `Resource allocated to project ${projectId}`,
      },
      status: 'failure',
      details: { error: error.message },
      companyId,
    });
    return { success: false, error: error.message };
  }
}
