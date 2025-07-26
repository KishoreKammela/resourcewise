'use server';

import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { z } from 'zod';
import { getPaginatedProjects } from '@/services/project.services';
import { getClientsByCompany } from '@/services/client.services';
import { ProjectsClientPage } from '@/components/projects/ProjectsClientPage';
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
export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const companyId = await getCompanyId();

  if (!companyId) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader title="Project Portfolio" />
        <div className="p-4">
          <p>Unable to load projects. Company information not found.</p>
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

  const [{ projects, totalCount }, clients] = await Promise.all([
    getPaginatedProjects({
      companyId,
      page,
      perPage: per_page,
      sort,
      filters,
    }),
    getClientsByCompany(companyId),
  ]);

  const pageCount = Math.ceil(totalCount / per_page);

  const clientMap = new Map(
    clients.map((client) => [client.id, client.basicInfo.clientName])
  );

  const projectsWithClientNames = projects.map((project) => ({
    ...project,
    clientName: clientMap.get(project.clientId) || 'Unknown Client',
  }));

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Projects">
        <Button asChild>
          <Link href="/projects/add">
            <PlusCircle className="mr-2" />
            Add Project
          </Link>
        </Button>
      </PageHeader>
      <ProjectsClientPage
        data={projectsWithClientNames}
        pageCount={pageCount}
        totalCount={totalCount}
      />
    </div>
  );
}
