'use client';

import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/shared/PageHeader';
import AnalyticsPage from '../analytics/page';

function PlatformAdminDashboard() {
  return (
    <div>
      <PageHeader title="Platform Admin Dashboard" />
      <div className="p-4">
        <p>Welcome to the platform administration area.</p>
        <p>
          Here you can manage companies, subscriptions, and platform settings.
        </p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { userRole } = useAuth();

  return userRole === 'platform' ? (
    <PlatformAdminDashboard />
  ) : (
    <AnalyticsPage />
  );
}
