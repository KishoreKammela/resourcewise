'use server';

import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { InviteMemberDialogWrapper } from '@/components/team/InviteMemberDialogWrapper';
import { TeamPageClient } from '@/components/team/TeamPageClient';

export default async function TeamPage() {
  return (
    <AppShell>
      <PageHeader title="Team Members">
        <InviteMemberDialogWrapper />
      </PageHeader>
      <TeamPageClient />
    </AppShell>
  );
}
