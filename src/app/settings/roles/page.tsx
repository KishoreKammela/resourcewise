
import { PageHeader } from '@/components/shared/PageHeader';
import { AppShell } from '@/components/layout/AppShell';

export default function RolesAndPermissionsPage() {
  return (
    <AppShell>
      <PageHeader title="Roles & Permissions" />
      <div className="p-4">
        <p>Content for managing platform roles and permissions goes here.</p>
      </div>
    </AppShell>
  );
}
