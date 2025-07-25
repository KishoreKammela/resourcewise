'use server';

import { createAuditLog } from '@/services/audit.services';
import { createResource, updateResource } from '@/services/resource.services';
import type { Resource } from '@/lib/types';
import { auth } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { Timestamp } from 'firebase-admin/firestore';
import { redirect } from 'next/navigation';

interface ActionResult {
  success: boolean;
  error?: string;
  resourceId?: string;
}

function safeToDate(
  dateString: string | FormDataEntryValue | null
): Timestamp | undefined {
  if (!dateString || typeof dateString !== 'string') {
    return undefined;
  }
  if (dateString === 'undefined' || dateString === 'null' || dateString === '') {
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

function getArrayFromFormData(formData: FormData, fieldName: string): any[] {
  const arrayData: { [key: number]: any } = {};
  formData.forEach((value, key) => {
    const match = key.match(new RegExp(`^${fieldName}\\.(\\d+)\\.(.+)$`));
    if (match) {
      const [, index, prop] = match;
      const numIndex = Number(index);
      if (!arrayData[numIndex]) {
        arrayData[numIndex] = {};
      }
      arrayData[numIndex][prop] = value;
    }
  });
  return Object.values(arrayData).map((item: any) => {
    if (item.year) {
      item.year = Number(item.year);
    }
    // Handle date conversion for certifications
    if (item.issueDate) {
      item.issueDate = safeToDate(item.issueDate);
    }
    if (item.expiryDate) {
      item.expiryDate = safeToDate(item.expiryDate);
    }
    return item;
  });
}

function buildResourceData(
  formData: FormData,
  companyId: string,
  actorId: string
): Omit<Resource, 'id' | 'createdAt' | 'updatedAt'> {
  const languages =
    (formData.get('personalInfo.languagesSpoken') as string)
      ?.split(',')
      .map((s) => s.trim())
      .filter(Boolean) ?? [];
  const technicalSkills =
    (formData.get('skills.technical') as string)
      ?.split(',')
      .map((s) => s.trim())
      .filter(Boolean) ?? [];
  const softSkills =
    (formData.get('skills.soft') as string)
      ?.split(',')
      .map((s) => s.trim())
      .filter(Boolean) ?? [];
  const devAreas =
    (formData.get('performance.developmentAreas') as string)
      ?.split(',')
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  const previousCompanies = getArrayFromFormData(
    formData,
    'experience.previousCompanies'
  );
  const education = getArrayFromFormData(formData, 'experience.education');
  const certifications = getArrayFromFormData(
    formData,
    'experience.certifications'
  );

  const rawData: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'> = {
    companyId,
    resourceCode: (formData.get('resourceCode') as string) || '',
    personalInfo: {
      firstName: formData.get('personalInfo.firstName') as string,
      lastName: formData.get('personalInfo.lastName') as string,
      email: (formData.get('personalInfo.email') as string) || '',
      phone: (formData.get('personalInfo.phone') as string) || '',
      profilePictureUrl:
        (formData.get('personalInfo.profilePictureUrl') as string) || '',
      dateOfBirth: safeToDate(formData.get('personalInfo.dateOfBirth')),
      gender: (formData.get('personalInfo.gender') as string) || '',
      nationality: (formData.get('personalInfo.nationality') as string) || '',
      languagesSpoken: languages,
    },
    address: {
      line1: (formData.get('address.line1') as string) || '',
      line2: (formData.get('address.line2') as string) || '',
      city: (formData.get('address.city') as string) || '',
      state: (formData.get('address.state') as string) || '',
      country: (formData.get('address.country') as string) || '',
      postalCode: (formData.get('address.postalCode') as string) || '',
    },
    professionalInfo: {
      designation:
        (formData.get('professionalInfo.designation') as string) || '',
      department:
        (formData.get('professionalInfo.department') as string) || '',
      practiceArea:
        (formData.get('professionalInfo.practiceArea') as string) || '',
      seniorityLevel:
        (formData.get('professionalInfo.seniorityLevel') as string) || '',
      employmentType: formData.get('professionalInfo.employmentType') as string,
    },
    employmentDetails: {
      joiningDate: safeToDate(formData.get('employmentDetails.joiningDate')),
      probationEndDate: safeToDate(
        formData.get('employmentDetails.probationEndDate')
      ),
      reportingManagerId:
        (formData.get('employmentDetails.reportingManagerId') as string) || '',
      workLocation:
        (formData.get('employmentDetails.workLocation') as string) || '',
      workMode: (formData.get('employmentDetails.workMode') as string) || '',
      status: formData.get('employmentDetails.status') as string,
    },
    experience: {
      totalYears: safeToNumber(formData.get('experience.totalYears')),
      yearsWithCompany: safeToNumber(
        formData.get('experience.yearsWithCompany')
      ),
      previousCompanies,
      education,
      certifications,
    },
    skills: {
      technical: technicalSkills.map((skill) => ({
        skill,
        level: 'intermediate',
        yearsOfExperience: 1,
      })),
      soft: softSkills.map((skill) => ({ skill })),
    },
    availability: {
      status: formData.get('availability.status') as string,
      currentAllocationPercentage:
        safeToNumber(
          formData.get('availability.currentAllocationPercentage')
        ) ?? 0,
      maxAllocationPercentage:
        safeToNumber(formData.get('availability.maxAllocationPercentage')) ??
        100,
      noticePeriodDays: safeToNumber(
        formData.get('availability.noticePeriodDays')
      ),
      preferredProjectTypes: [],
    },
    financial: {
      hourlyRate: safeToNumber(formData.get('financial.hourlyRate')),
      dailyRate: safeToNumber(formData.get('financial.dailyRate')),
      monthlySalary: safeToNumber(formData.get('financial.monthlySalary')),
      currency: formData.get('financial.currency') as string,
      billingRateClient: safeToNumber(
        formData.get('financial.billingRateClient')
      ),
      costCenter: (formData.get('financial.costCenter') as string) || '',
    },
    performance: {
      rating: safeToNumber(formData.get('performance.rating')),
      careerGoals: (formData.get('performance.careerGoals') as string) || '',
      developmentAreas: devAreas,
    },
    externalProfiles: {
      portfolioUrl:
        (formData.get('externalProfiles.portfolioUrl') as string) || '',
      linkedinProfile:
        (formData.get('externalProfiles.linkedinProfile') as string) || '',
      githubProfile:
        (formData.get('externalProfiles.githubProfile') as string) || '',
    },
    isActive: true,
    createdBy: actorId,
  };

  const cleanObject = (obj: any): any => {
    const newObj: any = {};
    for (const key in obj) {
      if (obj[key] !== undefined && obj[key] !== null) {
        if (
          typeof obj[key] === 'object' &&
          !Array.isArray(obj[key]) &&
          !(obj[key] instanceof Timestamp)
        ) {
          const cleanedChild = cleanObject(obj[key]);
          if (Object.keys(cleanedChild).length > 0) {
            newObj[key] = cleanedChild;
          }
        } else if (Array.isArray(obj[key])) {
          newObj[key] = obj[key].map(cleanObject).filter(item => Object.keys(item).length > 0 || (typeof item !== 'object'));
        } else {
          newObj[key] = obj[key];
        }
      }
    }
    return newObj;
  };

  return cleanObject(rawData);
}

export async function createResourceAction(
  { companyId, actorId }: { companyId: string; actorId: string },
  prevState: any,
  formData: FormData
): Promise<ActionResult> {
  const actor = await auth.getUser(actorId);
  const finalResourceData = buildResourceData(formData, companyId, actorId);

  try {
    const resourceId = await createResource(finalResourceData);

    await createAuditLog({
      actor: {
        id: actorId,
        displayName: actor.displayName ?? actor.email ?? actorId,
        role: 'company',
      },
      action: 'resource.create',
      target: {
        id: resourceId,
        type: 'resource',
        displayName: `${finalResourceData.personalInfo.firstName} ${finalResourceData.personalInfo.lastName}`,
      },
      status: 'success',
      companyId,
    });

    revalidatePath('/resources');
    revalidatePath(`/resources/${resourceId}`);
    return { success: true, resourceId };
  } catch (error: any) {
    await createAuditLog({
      actor: {
        id: actorId,
        displayName: actor.displayName ?? actor.email ?? actorId,
        role: 'company',
      },
      action: 'resource.create',
      target: {
        id: 'new_resource',
        type: 'resource',
        displayName: `${finalResourceData.personalInfo.firstName} ${finalResourceData.personalInfo.lastName}`,
      },
      status: 'failure',
      details: { error: error.message },
      companyId,
    });
    return { success: false, error: error.message };
  }
}

export async function updateResourceAction(
  {
    resourceId,
    companyId,
    actorId,
  }: { resourceId: string; companyId: string; actorId: string },
  prevState: any,
  formData: FormData
): Promise<ActionResult> {
  const actor = await auth.getUser(actorId);
  const finalResourceData = buildResourceData(formData, companyId, actorId);

  try {
    await updateResource(resourceId, finalResourceData);

    await createAuditLog({
      actor: {
        id: actorId,
        displayName: actor.displayName ?? actor.email ?? actorId,
        role: 'company',
      },
      action: 'resource.update',
      target: {
        id: resourceId,
        type: 'resource',
        displayName: `${finalResourceData.personalInfo.firstName} ${finalResourceData.personalInfo.lastName}`,
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
      action: 'resource.update',
      target: {
        id: resourceId,
        type: 'resource',
        displayName: `${finalResourceData.personalInfo.firstName} ${finalResourceData.personalInfo.lastName}`,
      },
      status: 'failure',
      details: { error: error.message },
      companyId,
    });
    return { success: false, error: error.message };
  }

  revalidatePath('/resources');
  revalidatePath(`/resources/${resourceId}`);
  redirect(`/resources/${resourceId}`);
}
