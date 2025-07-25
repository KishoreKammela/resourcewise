'use server';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { getResourceById } from '@/services/resource.services';
import { EditResourceForm } from '@/components/resources/EditResourceForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function EditResourcePage({
  params,
}: {
  params: { resourceId: string };
}) {
  const resource = await getResourceById(params.resourceId, {
    serialize: true,
  });

  if (!resource) {
    notFound();
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/resources/${resource.id}`}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <PageHeader
            title={`Edit ${resource.personalInfo.firstName} ${resource.personalInfo.lastName}`}
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Resource Details</CardTitle>
            <CardDescription>
              Update the information for the resource.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EditResourceForm resource={resource} />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
