'use client';

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ShieldOff, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { updateTeamMemberStatusAction } from '@/app/actions/userActions';
import type { DisplayMember } from './TeamPageClient';
import { DataTable } from '../shared/DataTable';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '../shared/DataTableColumnHeader';

export function TeamMembersTable({
  members,
  companyId,
}: {
  members: DisplayMember[];
  companyId: string;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loadingStates, setLoadingStates] = React.useState<
    Record<string, boolean>
  >({});

  const handleStatusChange = async (
    targetUserId: string,
    isActive: boolean
  ) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to perform this action.',
      });
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [targetUserId]: true }));

    const result = await updateTeamMemberStatusAction({
      actorId: user.uid,
      companyId,
      targetUserId,
      isActive,
    });

    if (result.success) {
      toast({
        title: 'Status Updated',
        description: `User has been successfully ${
          isActive ? 'activated' : 'suspended'
        }.`,
      });
      // Note: In a real app, you'd trigger a re-fetch of the data here
      // instead of relying on a full page reload.
    } else {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: result.error,
      });
    }
    setLoadingStates((prev) => ({ ...prev, [targetUserId]: false }));
  };

  const getBadgeVariant = (
    status: 'Active' | 'Suspended' | 'Invited'
  ): 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'Active':
        return 'secondary';
      case 'Suspended':
        return 'destructive';
      case 'Invited':
        return 'outline';
    }
  };

  const columns = React.useMemo<ColumnDef<DisplayMember>[]>(
    () => [
      {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        id: 'name',
      },
      {
        accessorKey: 'email',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
      },
      {
        accessorKey: 'role',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => (
          <span className="capitalize">{row.original.role}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => (
          <Badge variant={getBadgeVariant(row.original.status)}>
            {row.original.status}
          </Badge>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const member = row.original;
          return (
            member.isRegistered && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-haspopup="true"
                    size="icon"
                    variant="ghost"
                    disabled={
                      loadingStates[member.id] || member.id === user?.uid
                    }
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {member.isActive ? (
                    <DropdownMenuItem
                      onSelect={() => handleStatusChange(member.id, false)}
                    >
                      <ShieldOff className="mr-2 h-4 w-4" />
                      Suspend Member
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onSelect={() => handleStatusChange(member.id, true)}
                    >
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Activate Member
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loadingStates, user]
  );

  return (
    <DataTable
      columns={columns}
      data={members}
      pageCount={Math.ceil(members.length / 10)} // Client-side pagination
      totalCount={members.length}
    />
  );
}
