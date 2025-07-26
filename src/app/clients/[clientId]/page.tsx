'use server';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Pencil } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { getClientById } from '@/services/client.services';
import { ClientDetailClient } from '@/components/clients/ClientDetailClient';

export default async function ClientDetailPage({
  params,
}: {
  params: { clientId: string };
}) {
  const client = await getClientById(params.clientId, {
    serialize: true,
  });

  if (!client) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/clients">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <PageHeader title={client.basicInfo.clientName} />
        <Button variant="outline" asChild className="ml-auto">
          <Link href={`/clients/${client.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Client
          </Link>
        </Button>
      </div>
      <ClientDetailClient client={client} />
    </div>
  );
}
