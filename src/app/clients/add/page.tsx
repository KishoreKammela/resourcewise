'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { AddClientForm } from '@/components/clients/AddClientForm';
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

export default function AddClientPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/clients">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <PageHeader title="Add New Client" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Client Details</CardTitle>
          <CardDescription>
            Fill in the information for the new client.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddClientForm />
        </CardContent>
      </Card>
    </div>
  );
}
