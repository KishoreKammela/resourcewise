import { PageHeader } from '@/components/shared/PageHeader';
import { AppShell } from '@/components/layout/AppShell';

export default function SubscriptionsPage() {
  return (
    <AppShell>
      <PageHeader title="Subscription Management" />
      <div className="p-4">
        <p>Content for managing customer subscriptions goes here.</p>
      </div>
    </AppShell>
  );
}
