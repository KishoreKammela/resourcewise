'use server';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Pencil } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { getProjectById } from '@/services/project.services';
import { ProjectDetailClient } from '@/components/projects/ProjectDetailClient';
import { getResourcesByCompany } from '@/services/resource.services';
import { getProjectAllocations } from '@/services/allocation.services';

export default async function ProjectDetailPage({
  params,
}: {
  params: { projectId: string };
}) {
  const project = await getProjectById(params.projectId, { serialize: true });

  if (!project) {
    notFound();
  }

  const [resources, allocations] = await Promise.all([
    getResourcesByCompany(project.companyId),
    getProjectAllocations(params.projectId, { serialize: true }),
  ]);

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/projects">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <PageHeader title={project.basicInfo.projectName} />
          <Button variant="outline" asChild className="ml-auto">
            <Link href={`/projects/${project.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Project
            </Link>
          </Button>
        </div>
        <ProjectDetailClient
          project={project}
          resources={resources}
          initialAllocations={allocations}
        />
      </div>
    </AppShell>
  );
}
