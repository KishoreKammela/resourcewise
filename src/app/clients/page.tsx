'use server';

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
import { getClientsByCompany } from '@/services/client.services';
import { cookies } from 'next/headers';
import { auth, db } from '@/lib/firebase-admin';
import { Badge } from '@/components/ui/badge';
import { createAuditLog } from '@/services/audit.services';

export const dynamic = 'force-dynamic';

async function getCompanyIdForCurrentUser(): Promise<string | null> {
  const cookiesStore = await cookies();
  const sessionCookie = cookiesStore.get('__session')?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    const teamMemberDoc = await db
      .collection('teamMembers')
      .doc(decodedToken.uid)
      .get();
    if (teamMemberDoc.exists) {
      return teamMemberDoc.data()?.companyId || null;
    }
    return null;
  } catch (error: any) {
    await createAuditLog({
      actor: {
        id: 'system',
        displayName: 'System',
        role: 'system',
      },
      action: 'auth.session_verify',
      target: {
        id: 'session',
        type: 'session',
        displayName: 'Session Verification',
      },
      status: 'failure',
      details: { error: error.message },
    });
    return null;
  }
}

function ClientsContent({
  clients,
}: {
  clients: Awaited<ReturnType<typeof getClientsByCompany>>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Clients">
        <Button asChild>
          <Link href="/clients/add">
            <PlusCircle className="mr-2" />
            Add Client
          </Link>
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
                clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/clients/${client.id}`}
                        className="hover:underline"
                      >
                        {client.basicInfo.clientName}
                      </Link>
                    </TableCell>
                    <TableCell>{client.contactInfo.primary.name}</TableCell>
                    <TableCell>{client.contactInfo.primary.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          client.relationship.status === 'Active'
                            ? 'secondary'
                            : 'outline'
                        }
                        className="capitalize"
                      >
                        {client.relationship.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {client.analytics.activeProjectsCount}
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/clients/${client.id}`}>View</Link>
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

export default async function ClientsPage() {
  const companyId = await getCompanyIdForCurrentUser();
  const clients = companyId ? await getClientsByCompany(companyId) : [];

  return (
    <AppShell>
      <ClientsContent clients={clients} />
    </AppShell>
  );
}
