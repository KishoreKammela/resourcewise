'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import type { DisplayMember } from '@/app/team/page';

export function TeamMembersTable({
  members,
  companyId,
}: {
  members: DisplayMember[];
  companyId: string;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

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
    } else {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: result.error,
      });
    }
    setLoadingStates((prev) => ({ ...prev, [targetUserId]: false }));
  };

  if (members.length === 0) {
    return (
      <div className="h-24 text-center flex items-center justify-center">
        No team members found. Start by inviting a new member.
      </div>
    );
  }

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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell>
              {member.firstName} {member.lastName}
            </TableCell>
            <TableCell>{member.email}</TableCell>
            <TableCell className="capitalize">{member.role}</TableCell>
            <TableCell>
              <Badge variant={getBadgeVariant(member.status)}>
                {member.status}
              </Badge>
            </TableCell>
            <TableCell>
              {member.isRegistered && (
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
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
