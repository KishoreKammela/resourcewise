'use server';

import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { z } from 'zod';
import { getPaginatedClients } from '@/services/client.services';
import { ClientsClientPage } from '@/components/clients/ClientsClientPage';
import { getSessionUser } from '@/services/sessionManager';

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  name: z.string().optional(),
  status: z.string().optional(),
});

async function getCompanyId() {
  const user = await getSessionUser();
  return user?.companyId ?? null;
}
export default async function ClientsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const companyId = await getCompanyId();

  if (!companyId) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader title="Client Portfolio" />
        <div className="p-4">
          <p>Unable to load clients. Company information not found.</p>
        </div>
      </div>
    );
  }
  const plainSearchParams = {
    page: searchParams.page,
    per_page: searchParams.per_page,
    sort: searchParams.sort,
    name: searchParams.name,
    status: searchParams.status,
  };
  const { page, per_page, sort, ...filters } =
    searchParamsSchema.parse(plainSearchParams);

  const { clients, totalCount } = await getPaginatedClients({
    companyId,
    page,
    perPage: per_page,
    sort,
    filters,
  });

  const pageCount = Math.ceil(totalCount / per_page);

  return (
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
  );
}
