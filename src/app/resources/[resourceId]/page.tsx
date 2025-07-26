'use server';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Pencil } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { getResourceById } from '@/services/resource.services';
import { ResourceDetailClient } from '@/components/resources/ResourceDetailClient';

export default async function ResourceDetailPage({
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/resources">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <PageHeader
          title={`${resource.personalInfo?.firstName || ''} ${resource.personalInfo?.lastName || ''}`}
        />
        <Button variant="outline" asChild className="ml-auto">
          <Link href={`/resources/${resource.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Resource
          </Link>
        </Button>
      </div>
      <ResourceDetailClient resource={resource} />
    </div>
  );
}
