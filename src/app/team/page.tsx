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
import type { TeamMember, Invitation } from '@/lib/types';
import { cookies } from 'next/headers';
import { InviteMemberDialogWrapper } from '@/components/team/InviteMemberDialogWrapper';
import { getPendingCompanyInvitations } from '@/services/invitation.services';
import { revalidatePath } from 'next/cache';

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

export type DisplayMember = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'Active' | 'Suspended' | 'Invited';
  isRegistered: boolean;
  isActive?: boolean;
};

export default async function TeamPage() {
  const companyId = await getCompanyIdForCurrentUser();
  let displayMembers: DisplayMember[] = [];

  if (companyId) {
    const teamMembers: TeamMember[] = await getTeamMembersByCompany(companyId);
    const pendingInvitations: Invitation[] =
      await getPendingCompanyInvitations(companyId);

    revalidatePath('/team');

    displayMembers = [
      ...teamMembers.map((member) => ({
        id: member.id,
        firstName: member.personalInfo.firstName,
        lastName: member.personalInfo.lastName,
        email: member.email,
        role: member.permissions.accessLevel,
        status: (member.isActive ? 'Active' : 'Suspended') as
          | 'Active'
          | 'Suspended',
        isRegistered: true,
        isActive: member.isActive,
      })),
      ...pendingInvitations.map((invite) => ({
        id: invite.id,
        firstName: invite.firstName,
        lastName: invite.lastName,
        email: invite.email,
        role: invite.role,
        status: 'Invited' as const,
        isRegistered: false,
      })),
    ];
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
          <TeamMembersTable
            members={displayMembers}
            companyId={companyId ?? ''}
          />
        </CardContent>
      </Card>
    </AppShell>
  );
}
