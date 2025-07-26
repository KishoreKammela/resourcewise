'use server';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { getClientById } from '@/services/client.services';
import { EditClientForm } from '@/components/clients/EditClientForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function EditClientPage({
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
          <Link href={`/clients/${client.id}`}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <PageHeader title={`Edit ${client.basicInfo.clientName}`} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Client Details</CardTitle>
          <CardDescription>
            Update the information for the client.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditClientForm client={client} />
        </CardContent>
      </Card>
    </div>
  );
}
