'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { PlatformUser } from '@/lib/types';
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
import { updatePlatformUserStatusAction } from '@/app/actions/userActions';

export function UsersTable({ users }: { users: PlatformUser[] }) {
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

    const result = await updatePlatformUserStatusAction(
      user.uid,
      targetUserId,
      isActive
    );

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

  if (users.length === 0) {
    return (
      <div className="h-24 text-center flex items-center justify-center">
        No platform users found.
      </div>
    );
  }

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
        {users.map((platformUser) => (
          <TableRow key={platformUser.id}>
            <TableCell>
              {platformUser.personalInfo.firstName}{' '}
              {platformUser.personalInfo.lastName}
            </TableCell>
            <TableCell>{platformUser.email}</TableCell>
            <TableCell className="capitalize">
              {platformUser.userType}
            </TableCell>
            <TableCell>
              <Badge
                variant={platformUser.isActive ? 'secondary' : 'destructive'}
              >
                {platformUser.isActive ? 'Active' : 'Suspended'}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-haspopup="true"
                    size="icon"
                    variant="ghost"
                    disabled={
                      loadingStates[platformUser.id] ||
                      platformUser.id === user?.uid
                    }
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {platformUser.isActive ? (
                    <DropdownMenuItem
                      onSelect={() =>
                        handleStatusChange(platformUser.id, false)
                      }
                    >
                      <ShieldOff className="mr-2 h-4 w-4" />
                      Suspend User
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onSelect={() => handleStatusChange(platformUser.id, true)}
                    >
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Activate User
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
