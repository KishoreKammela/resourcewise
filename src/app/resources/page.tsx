import Link from 'next/link';
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
import { UserPlus } from 'lucide-react';
import { resources } from '@/lib/placeholder-data';

function ResourcesContent() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Resource Pool">
        <Button asChild>
          <Link href="/resources/add">
            <UserPlus className="mr-2" />
            Add Resource
          </Link>
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Talent Pool</CardTitle>
          <CardDescription>
            Browse, manage, and assign your company&apos;s resources.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Allocation</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No resources found. Start by adding a new resource.
                  </TableCell>
                </TableRow>
              ) : (
                <></>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
export default function ResourcesPage() {
  return (
    <AppShell>
      <ResourcesContent />
    </AppShell>
  );
}
