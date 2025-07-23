'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PageHeader } from '@/components/shared/PageHeader';


function PlatformAdminDashboard() {
  return (
    <div>
      <PageHeader title="Platform Admin Dashboard" />
      <div className="p-4">
        <p>Welcome to the platform administration area.</p>
        <p>Here you can manage companies, subscriptions, and platform settings.</p>
      </div>
    </div>
  );
}

function CompanyDashboardContents() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Executive Dashboard" />
       <Card>
        <CardHeader>
          <CardTitle>Welcome to ResourceWise</CardTitle>
          <CardDescription>
            Your central hub for resource and project management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-10">
            <p>Your dashboard is being set up.</p>
            <p>Key metrics and reports will appear here soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function Dashboard() {
  const { userRole } = useAuth();
  
  return (
    <AppShell>
      {userRole === 'platform' ? <PlatformAdminDashboard /> : <CompanyDashboardContents />}
    </AppShell>
  )
}
