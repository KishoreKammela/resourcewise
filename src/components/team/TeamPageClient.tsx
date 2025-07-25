'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TeamMembersTable } from './TeamMembersTable';

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

export function TeamPageClient({
  initialMembers,
  companyId,
}: {
  initialMembers: DisplayMember[];
  companyId: string;
}) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Manage Team</CardTitle>
        <CardDescription>
          Invite, edit, and manage your team members and their roles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TeamMembersTable members={initialMembers} companyId={companyId} />
      </CardContent>
    </Card>
  );
}
