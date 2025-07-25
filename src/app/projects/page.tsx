'use client';

import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, useTransition } from 'react';
import type { Project } from '@/lib/types';
import { getProjectsByCompany } from '@/services/project.services';
import { formatDate } from '@/lib/helpers/date-helpers';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

function ProjectsContent() {
  const { companyProfile, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isPending, startTransition] = useTransition();

  const loading = authLoading || isPending;

  useEffect(() => {
    if (companyProfile?.id) {
      startTransition(() => {
        getProjectsByCompany(companyProfile.id, { serialize: true }).then(
          setProjects
        );
      });
    }
  }, [companyProfile]);

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
      <Card>
        <CardHeader>
          <CardTitle>Project Portfolio</CardTitle>
          <CardDescription>
            An overview of all your company&apos;s projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ) : projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No projects found. Start by adding a new project.
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/projects/${project.id}`}
                        className="hover:underline"
                      >
                        {project.basicInfo.projectName}
                      </Link>
                    </TableCell>
                    <TableCell>{project.clientId}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {project.status.projectStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDate(project.timeline.plannedEndDate)}
                    </TableCell>
                    <TableCell>
                      <Progress
                        value={project.status.progressPercentage}
                        className="w-[60%]"
                      />
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/projects/${project.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <AppShell>
      <ProjectsContent />
    </AppShell>
  );
}
