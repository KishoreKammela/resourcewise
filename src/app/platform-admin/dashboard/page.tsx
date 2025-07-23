import { PageHeader } from '@/components/shared/PageHeader';

export default function PlatformAdminDashboardPage() {
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
