'use server';

import { getPendingCompanyInvitations } from '@/services/invitation.services';
import { getTeamMembersByCompany } from '@/services/user.services';
import type { Invitation, TeamMember } from '@/lib/types';
import type { DisplayMember } from '@/components/team/TeamPageClient';

export async function getTeamPageData(companyId: string): Promise<{
  displayMembers: DisplayMember[];
}> {
  if (!companyId) {
    return { displayMembers: [] };
  }

  const [teamMembers, pendingInvitations] = await Promise.all([
    getTeamMembersByCompany(companyId),
    getPendingCompanyInvitations(companyId),
  ]);

  const displayMembers: DisplayMember[] = [
    ...teamMembers.map((member: TeamMember) => ({
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
    ...pendingInvitations.map((invite: Invitation) => ({
      id: invite.id,
      firstName: invite.firstName,
      lastName: invite.lastName,
      email: invite.email,
      role: invite.role,
      status: 'Invited' as const,
      isRegistered: false,
    })),
  ];

  return { displayMembers };
}
