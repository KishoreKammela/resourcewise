'use server';

import { getPendingCompanyInvitations } from '@/services/invitation.services';
import { getTeamMembersByCompany } from '@/services/user.services';
import type { Invitation, TeamMember } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getTeamPageData(companyId: string): Promise<{
  teamMembers: TeamMember[];
  pendingInvitations: Invitation[];
}> {
  if (!companyId) {
    return { teamMembers: [], pendingInvitations: [] };
  }

  const [teamMembers, pendingInvitations] = await Promise.all([
    getTeamMembersByCompany(companyId),
    getPendingCompanyInvitations(companyId),
  ]);

  revalidatePath('/team');

  return { teamMembers, pendingInvitations };
}
