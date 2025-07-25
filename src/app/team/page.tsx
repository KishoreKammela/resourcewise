'use server';

import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { InviteMemberDialogWrapper } from '@/components/team/InviteMemberDialogWrapper';
import { TeamPageClient } from '@/components/team/TeamPageClient';
import { getTeamPageData } from '@/app/actions/teamActions';
import { cookies } from 'next/headers';
import { auth, db } from '@/lib/firebase-admin';

async function getCompanyId() {
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
    console.error('Error verifying session cookie:', error);
    return null;
  }
}

export default async function TeamPage() {
  const companyId = await getCompanyId();
  const { displayMembers } = companyId
    ? await getTeamPageData(companyId)
    : { displayMembers: [] };

  return (
    <AppShell>
      <PageHeader title="Team Members">
        <InviteMemberDialogWrapper />
      </PageHeader>
      <TeamPageClient
        initialMembers={displayMembers}
        companyId={companyId ?? ''}
      />
    </AppShell>
  );
}
