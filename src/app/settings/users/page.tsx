'use server';

import { PageHeader } from '@/components/shared/PageHeader';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { InviteUserDialog } from '@/components/settings/InviteUserDialog';
import { useState } from 'react';
import { getPlatformUsers } from '@/services/user.services';
import { UsersTable } from '@/components/settings/UsersTable';

// Note: This is a server component that fetches data and passes it to a client component.
// We are using a temporary state solution for the dialog which is not ideal in a server component
// but works for this prototype. In a real app, you might lift state management higher
// or use query params to control the dialog visibility from the server.

export default async function PlatformUsersPage() {
  const users = await getPlatformUsers();

  return (
    <AppShell>
      <PageHeader title="Platform Users">
        {/* The Dialog state management is simplified here for prototyping */}
        {/* In a production app, consider a more robust state management solution */}
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
            <UsersTable users={users} />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

// Helper client component to manage dialog state
function InviteUserDialogWrapper() {
  const [isInviteDialogOpen, setInviteDialogOpen] = useState(false);

  return (
    <Dialog open={isInviteDialogOpen} onOpenChange={setInviteDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2" />
          Invite User
        </Button>
      </DialogTrigger>
      <InviteUserDialog setOpen={setInviteDialogOpen} />
    </Dialog>
  );
}
