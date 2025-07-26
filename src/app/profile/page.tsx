'use client';

import { PageHeader } from '@/components/shared/PageHeader';
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
      <ProfileForm currentUser={{ ...userProfile, userRole, id: user.uid }} />
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="My Profile" />
      <div className="space-y-6">
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
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return <ProfileContent />;
}
