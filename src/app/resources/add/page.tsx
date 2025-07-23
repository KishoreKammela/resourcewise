import { PageHeader } from '@/components/shared/PageHeader';
// import { AddResourceForm } from '@/components/resources/AddResourceForm';
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

export default function AddResourcePage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/resources">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <PageHeader title="Add New Resource" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Resource Details</CardTitle>
          <CardDescription>
            Fill in the information for the new resource. You can upload a
            resume to automatically extract skills.
          </CardDescription>
        </CardHeader>
        <CardContent>{/* <AddResourceForm /> */}</CardContent>
      </Card>
    </div>
  );
}
