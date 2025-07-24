'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { TeamMembersTable } from './TeamMembersTable';
import { getTeamPageData } from '@/app/actions/teamActions';
import type { TeamMember, Invitation } from '@/lib/types';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!companyProfile?.id) {
        if (!authLoading) {
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      const { teamMembers, pendingInvitations } = await getTeamPageData(
        companyProfile.id
      );

      const members: DisplayMember[] = [
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
      setDisplayMembers(members);
      setLoading(false);
    }

    fetchData();
  }, [companyProfile, authLoading]);

  if (loading || authLoading) {
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
