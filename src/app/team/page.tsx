'use server';

import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getTeamMembersByCompany } from '@/services/user.services';
import { TeamMembersTable } from '@/components/team/TeamMembersTable';
import { auth } from '@/lib/firebase-admin';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { TeamMember } from '@/lib/types';
import { cookies } from 'next/headers';
import { InviteMemberDialogWrapper } from '@/components/team/InviteMemberDialogWrapper';

async function getCompanyIdForCurrentUser() {
  const sessionCookie = (await cookies()).get('__session')?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    const teamMemberDoc = await getDoc(
      doc(db, 'teamMembers', decodedToken.uid)
    );
    if (teamMemberDoc.exists()) {
      return (teamMemberDoc.data() as TeamMember).companyId;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export default async function TeamPage() {
  const companyId = await getCompanyIdForCurrentUser();
  let teamMembers: TeamMember[] = [];
  if (companyId) {
    teamMembers = await getTeamMembersByCompany(companyId);
  }

  return (
    <AppShell>
      <PageHeader title="Team Members">
        <InviteMemberDialogWrapper />
      </PageHeader>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Manage Team</CardTitle>
          <CardDescription>
            Invite, edit, and manage your team members and their roles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TeamMembersTable members={teamMembers} companyId={companyId ?? ''} />
        </CardContent>
      </Card>
    </AppShell>
  );
}
