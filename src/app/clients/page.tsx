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
import { clients } from '@/lib/placeholder-data';


function ClientsContent() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Clients">
        <Button>
          <PlusCircle className="mr-2" />
          Add Client
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Client Portfolio</CardTitle>
          <CardDescription>
            Manage your clients and their information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No clients found. Start by adding a new client.
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

export default function ClientsPage() {
  return (
    <AppShell>
      <ClientsContent />
    </AppShell>
  );
}
