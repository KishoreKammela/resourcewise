'use server';

import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { auth, db } from '@/lib/firebase-admin';
import { z } from 'zod';
import { getPaginatedClients } from '@/services/client.services';
import { ClientsClientPage } from '@/components/clients/ClientsClientPage';

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  name: z.string().optional(),
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
export default async function ClientsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const companyId = await getCompanyId();

  if (!companyId) {
    return (
      <AppShell>
        <PageHeader title="Client Portfolio" />
        <div className="p-4">
          <p>Unable to load clients. Company information not found.</p>
        </div>
      </AppShell>
    );
  }
  const { page, per_page, sort, ...filters } =
    searchParamsSchema.parse(searchParams);

  const { clients, totalCount } = await getPaginatedClients({
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
        <PageHeader title="Clients">
          <Button asChild>
            <Link href="/clients/add">
              <PlusCircle className="mr-2" />
              Add Client
            </Link>
          </Button>
        </PageHeader>
        <ClientsClientPage
          data={clients}
          pageCount={pageCount}
          totalCount={totalCount}
        />
      </div>
    </AppShell>
  );
}