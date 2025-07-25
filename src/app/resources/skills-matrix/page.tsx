'use server';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { getSkillsMatrixData } from '@/app/actions/skillsMatrixActions';
import { SkillsMatrixClient } from '@/components/resources/SkillsMatrixClient';
import { cookies } from 'next/headers';
import { auth, db } from '@/lib/firebase-admin';

async function getCompanyId(): Promise<string | null> {
  const sessionCookie = cookies().get('__session')?.value;
  if (!sessionCookie) return null;
  try {
    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    const teamMemberDoc = await db
      .collection('teamMembers')
      .doc(decodedToken.uid)
      .get();
    return teamMemberDoc.exists ? teamMemberDoc.data()?.companyId : null;
  } catch (error) {
    return null;
  }
}

export default async function SkillsMatrixPage() {
  const companyId = await getCompanyId();
  const skillsMatrixData = companyId
    ? await getSkillsMatrixData(companyId, { serialize: true })
    : { resources: [], technicalSkills: [], softSkills: [] };

  return (
    <AppShell>
      <PageHeader title="Skills Matrix" />
      <div className="mt-6">
        <SkillsMatrixClient initialData={skillsMatrixData} />
      </div>
    </AppShell>
  );
}
