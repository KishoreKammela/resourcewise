
import { PageHeader } from '@/components/shared/PageHeader';
import { AppShell } from '@/components/layout/AppShell';

export default function PlatformUsersPage() {
  return (
    <AppShell>
      <PageHeader title="Platform Users" />
      <div className="p-4">
        <p>Content for managing platform users goes here.</p>
      </div>
    </AppShell>
  );
}
