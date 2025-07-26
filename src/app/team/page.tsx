'use server';

import { PageHeader } from '@/components/shared/PageHeader';
import { InviteMemberDialogWrapper } from '@/components/team/InviteMemberDialogWrapper';
import { TeamPageClient } from '@/components/team/TeamPageClient';
import { getTeamPageData } from '@/app/actions/teamActions';
import { getSessionUser } from '@/services/sessionManager';

async function getCompanyId() {
  const user = await getSessionUser();
  return user?.companyId ?? null;
}

export default async function TeamPage() {
  const companyId = await getCompanyId();
  const { displayMembers } = companyId
    ? await getTeamPageData(companyId)
    : { displayMembers: [] };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Team Members">
        <InviteMemberDialogWrapper />
      </PageHeader>
      <TeamPageClient
        initialMembers={displayMembers}
        companyId={companyId ?? ''}
      />
    </div>
  );
}
