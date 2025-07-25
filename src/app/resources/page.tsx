'use server';

import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { getPaginatedResources } from '@/services/resource.services';
import { UserPlus } from 'lucide-react';
import Link from 'next/link';
import { z } from 'zod';
import { ResourcesClientPage } from '@/components/resources/ResourcesClientPage';
import { cookies } from 'next/headers';
import { auth, db } from '@/lib/firebase-admin';

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  name: z.string().optional(),
  designation: z.string().optional(),
  status: z.string().optional(),
});

async function getCompanyId() {
  const sessionCookie = cookies().get('__session')?.value;
  if (!sessionCookie) return null;
  try {
    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    const teamMemberDoc = await db
      .collection('teamMembers')
      .doc(decodedToken.uid)
      .get();
    return teamMemberDoc.exists ? teamMemberDoc.data()?.companyId : null;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return null;
  }
}
export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const companyId = await getCompanyId();

  if (!companyId) {
    // Handle case where companyId is not found, maybe redirect or show an error
    return (
      <AppShell>
        <PageHeader title="Resource Pool" />
        <div className="p-4">
          <p>Unable to load resources. Company information not found.</p>
        </div>
      </AppShell>
    );
  }
  const { page, per_page, sort, ...filters } =
    searchParamsSchema.parse(searchParams);

  const { resources, totalCount } = await getPaginatedResources({
    companyId,
    page,
    perPage: per_page,
    sort,
    filters,
  });

  const pageCount = Math.ceil(totalCount / per_page);

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        <PageHeader title="Resource Pool">
          <Button asChild>
            <Link href="/resources/add">
              <UserPlus className="mr-2" />
              Add Resource
            </Link>
          </Button>
        </PageHeader>
        <ResourcesClientPage
          data={resources}
          pageCount={pageCount}
          totalCount={totalCount}
        />
      </div>
    </AppShell>
  );
}
