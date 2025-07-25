'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { AddProjectForm } from '@/components/projects/AddProjectForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AppShell } from '@/components/layout/AppShell';

function AddProjectPageContent() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/projects">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <PageHeader title="Add New Project" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Fill in the information for the new project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddProjectForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default function AddProjectPage() {
  return (
    <AppShell>
      <AddProjectPageContent />
    </AppShell>
  );
}
