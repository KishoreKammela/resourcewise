'use client';

import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

function ProfileContent() {
  const { user, userProfile, userRole, loading } = useAuth();

  if (loading || !user || !userProfile || !userRole) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="My Profile" />
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal information. This will be visible to others in
            your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm currentUser={{ ...userProfile, userRole, id: user.uid }} />
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            <PageHeader title="My Profile" />
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                        Update your personal information. This will be visible to others in your organization.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex justify-end">
                        <Skeleton className="h-10 w-32" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


export default function ProfilePage() {
  return (
    <AppShell>
      <ProfileContent />
    </AppShell>
  );
}
