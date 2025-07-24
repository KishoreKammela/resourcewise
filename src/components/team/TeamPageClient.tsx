'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { TeamMembersTable } from './TeamMembersTable';
import { getTeamPageData } from '@/app/actions/teamActions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';

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

function TeamPageSkeleton() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Manage Team</CardTitle>
        <CardDescription>
          Invite, edit, and manage your team members and their roles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function TeamPageClient() {
  const { companyProfile, loading: authLoading } = useAuth();
  const [displayMembers, setDisplayMembers] = useState<DisplayMember[]>([]);
  const [isPending, startTransition] = useTransition();

  const loading = authLoading || isPending;

  const fetchTeamData = useCallback(async (companyId: string) => {
    const { displayMembers: data } = await getTeamPageData(companyId);
    setDisplayMembers(data);
  }, []);

  useEffect(() => {
    if (companyProfile?.id) {
      startTransition(() => {
        fetchTeamData(companyProfile.id);
      });
    }
  }, [companyProfile, fetchTeamData]);

  if (loading) {
    return <TeamPageSkeleton />;
  }

  return (
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
          companyId={companyProfile?.id ?? ''}
        />
      </CardContent>
    </Card>
  );
}
