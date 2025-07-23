
import { PageHeader } from '@/components/shared/PageHeader';
import { AppShell } from '@/components/layout/AppShell';

export default function SupportPage() {
  return (
    <AppShell>
      <PageHeader title="Support Tickets" />
      <div className="p-4">
        <p>Content for managing support tickets goes here.</p>
      </div>
    </AppShell>
  );
}
