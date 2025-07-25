'use server';

import { getResourcesByCompany } from '@/services/resource.services';
import type { Resource } from '@/lib/types';

export interface SkillsMatrixData {
  resources: Resource[];
  technicalSkills: string[];
  softSkills: string[];
}

export async function getSkillsMatrixData(
  companyId: string
): Promise<SkillsMatrixData> {
  const resources = await getResourcesByCompany(companyId);

  const technicalSkills = new Set<string>();
  const softSkills = new Set<string>();

  resources.forEach((resource) => {
    resource.skills?.technical?.forEach((skill) => {
      if (skill.skill) {
        technicalSkills.add(skill.skill);
      }
    });
    resource.skills?.soft?.forEach((skill) => {
      if (skill.skill) {
        softSkills.add(skill.skill);
      }
    });
  });

  return {
    resources,
    technicalSkills: Array.from(technicalSkills).sort(),
    softSkills: Array.from(softSkills).sort(),
  };
}
