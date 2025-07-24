import { PageHeader } from '@/components/shared/PageHeader';
import { AppShell } from '@/components/layout/AppShell';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getPlatformUsers } from '@/services/user.services';
import { UsersTable } from '@/components/settings/UsersTable';
import { InviteUserDialogWrapper } from '@/components/settings/InviteUserDialogWrapper';
import { getPendingPlatformInvitations } from '@/services/invitation.services';
import type { PlatformUser, Invitation } from '@/lib/types';

export type DisplayUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'Active' | 'Suspended' | 'Invited';
  isRegistered: boolean;
  isActive?: boolean;
};

export const dynamic = 'force-dynamic';

async function PlatformUsersPage() {
  const users: PlatformUser[] = await getPlatformUsers();
  const pendingInvitations: Invitation[] =
    await getPendingPlatformInvitations();

  const displayUsers: DisplayUser[] = [
    ...users.map((user) => ({
      id: user.id,
      firstName: user.personalInfo.firstName,
      lastName: user.personalInfo.lastName,
      email: user.email,
      role: user.userType,
      status: (user.isActive ? 'Active' : 'Suspended') as
        | 'Active'
        | 'Suspended',
      isRegistered: true,
      isActive: user.isActive,
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

  return (
    <AppShell>
      <PageHeader title="Platform Users">
        <InviteUserDialogWrapper />
      </PageHeader>
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Invite, manage, and view all platform users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UsersTable users={displayUsers} />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

export default PlatformUsersPage;
