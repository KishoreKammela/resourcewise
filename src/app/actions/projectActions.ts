'use server';

import { createAuditLog } from '@/services/audit.services';
import { createProject } from '@/services/project.services';
import type { Project } from '@/lib/types';
import { auth } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { Timestamp } from 'firebase-admin/firestore';

interface ActionResult {
  success: boolean;
  error?: string;
  projectId?: string;
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

function buildProjectData(
  formData: FormData,
  companyId: string,
  actorId: string
): Omit<Project, 'id' | 'createdAt' | 'updatedAt'> {
  const rawData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
    companyId,
    clientId: formData.get('clientId') as string,
    projectCode: (formData.get('projectCode') as string) || undefined,
    basicInfo: {
      projectName: formData.get('basicInfo.projectName') as string,
      description:
        (formData.get('basicInfo.description') as string) || undefined,
      type: (formData.get('basicInfo.type') as string) || undefined,
      priorityLevel:
        (formData.get('basicInfo.priorityLevel') as string) || undefined,
    },
    timeline: {
      plannedStartDate: safeToDate(formData.get('timeline.plannedStartDate')),
      plannedEndDate: safeToDate(formData.get('timeline.plannedEndDate')),
    },
    status: {
      projectStatus: formData.get('status.projectStatus') as string,
      healthStatus: formData.get('status.healthStatus') as string,
      progressPercentage:
        safeToNumber(formData.get('status.progressPercentage')) ?? 0,
    },
    budget: {
      projectBudget: safeToNumber(formData.get('budget.projectBudget')),
      currency: formData.get('budget.currency') as string,
      billingModel:
        (formData.get('budget.billingModel') as string) || undefined,
      totalBilledAmount: 0,
      totalCost: 0,
    },
    technical: {},
    team: {},
    management: {},
    communication: {},
    qualityRisk: {},
    documents: {},
    analytics: {},
    legal: {},
    isActive: true,
    createdBy: actorId,
  };

  return rawData;
}

export async function createProjectAction(
  { companyId, actorId }: { companyId: string; actorId: string },
  prevState: any,
  formData: FormData
): Promise<ActionResult> {
  const actor = await auth.getUser(actorId);
  const rawProjectData = buildProjectData(formData, companyId, actorId);
  const finalProjectData = cleanUndefined(rawProjectData);

  try {
    const projectId = await createProject(finalProjectData as any);

    await createAuditLog({
      actor: {
        id: actorId,
        displayName: actor.displayName ?? actor.email ?? actorId,
        role: 'company',
      },
      action: 'project.create',
      target: {
        id: projectId,
        type: 'project',
        displayName: finalProjectData.basicInfo.projectName,
      },
      status: 'success',
      companyId,
    });

    revalidatePath('/projects');
    return { success: true, projectId };
  } catch (error: any) {
    await createAuditLog({
      actor: {
        id: actorId,
        displayName: actor.displayName ?? actor.email ?? actorId,
        role: 'company',
      },
      action: 'project.create',
      target: {
        id: 'new_project',
        type: 'project',
        displayName: finalProjectData.basicInfo.projectName,
      },
      status: 'failure',
      details: { error: error.message },
      companyId,
    });
    return { success: false, error: error.message };
  }
}
