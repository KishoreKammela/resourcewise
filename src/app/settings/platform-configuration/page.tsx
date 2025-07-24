'use server';

import { PageHeader } from '@/components/shared/PageHeader';
import { AppShell } from '@/components/layout/AppShell';
import { getPlatformConfig } from '@/services/platform.services';
import { PlatformConfigForm } from '@/components/settings/PlatformConfigForm';

export default async function PlatformConfigurationPage() {
  const sessionConfig = await getPlatformConfig('sessionManagement');

  return (
    <AppShell>
      <PageHeader title="Platform Configuration" />
      <div className="mt-6">
        <PlatformConfigForm sessionConfig={sessionConfig} />
      </div>
    </AppShell>
  );
}
