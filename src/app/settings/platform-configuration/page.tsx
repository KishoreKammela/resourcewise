'use server';

import { PageHeader } from '@/components/shared/PageHeader';
import { AppShell } from '@/components/layout/AppShell';
import { getPlatformConfig } from '@/services/platform.services';
import { PlatformConfigForm } from '@/components/settings/PlatformConfigForm';
import { getSessionCookieValue } from '@/services/sessionManager';
import { auth, db } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';

async function checkUserRole(cookie: string | undefined) {
  if (!cookie) {
    return null;
  }
  try {
    const decodedToken = await auth.verifySessionCookie(cookie, true);
    const platformUserDoc = await db
      .collection('platformUsers')
      .doc(decodedToken.uid)
      .get();
    if (platformUserDoc.exists) {
      return 'platform';
    }
    return 'company';
  } catch (error) {
    return null;
  }
}

export default async function PlatformConfigurationPage() {
  const sessionCookie = await getSessionCookieValue();
  const userRole = await checkUserRole(sessionCookie || undefined);

  if (userRole !== 'platform') {
    redirect('/');
  }

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
