'use server';
import { PageHeader } from '@/components/shared/PageHeader';
import { getSkillsMatrixData } from '@/app/actions/skillsMatrixActions';
import { SkillsMatrixClient } from '@/components/resources/SkillsMatrixClient';
import { getSessionUser } from '@/services/sessionManager';

async function getCompanyId(): Promise<string | null> {
  const user = await getSessionUser();
  return user?.companyId ?? null;
}

export default async function SkillsMatrixPage() {
  const companyId = await getCompanyId();
  const skillsMatrixData = companyId
    ? await getSkillsMatrixData(companyId, { serialize: true })
    : { resources: [], technicalSkills: [], softSkills: [] };

  return (
    <>
      <PageHeader title="Skills Matrix" />
      <div className="mt-6">
        <SkillsMatrixClient initialData={skillsMatrixData} />
      </div>
    </>
  );
}
