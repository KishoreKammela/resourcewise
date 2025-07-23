import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function ProfileContent() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="My Profile" />
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            This is your personal information. Update it as needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Profile editing form will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
    // This page needs to determine which shell to use based on user role
    // For now, we default to the company AppShell
  return (
    <AppShell>
      <ProfileContent />
    </AppShell>
  );
}
