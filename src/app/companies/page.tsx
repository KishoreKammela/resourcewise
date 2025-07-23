import { PageHeader } from '@/components/shared/PageHeader';
import { AppShell } from '@/components/layout/AppShell';

export default function CompaniesPage() {
  return (
    <AppShell>
      <PageHeader title="Customer Companies" />
      <div className="p-4">
        <p>Content for managing customer companies goes here.</p>
      </div>
    </AppShell>
  );
}
