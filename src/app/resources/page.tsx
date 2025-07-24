
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
import { getResourcesByCompany } from '@/services/resource.services';
import { cookies } from 'next/headers';
import { auth, db } from '@/lib/firebase-admin';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

async function getCompanyIdForCurrentUser(): Promise<string | null> {
  const sessionCookie = cookies().get('__session')?.value;
  if (!sessionCookie) return null;

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
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return null;
  }
}

function ResourcesContent({
  resources,
}: {
  resources: Awaited<ReturnType<typeof getResourcesByCompany>>;
}) {
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
                resources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/resources/${resource.id}`}
                        className="hover:underline"
                      >
                        {resource.personalInfo?.firstName}{' '}
                        {resource.personalInfo?.lastName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {resource.professionalInfo?.designation}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {resource.skills?.technical
                          ?.slice(0, 3)
                          .map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill.skill}
                            </Badge>
                          ))}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">
                      {resource.availability?.status}
                    </TableCell>
                    <TableCell>
                      {resource.availability?.currentAllocationPercentage}%
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/resources/${resource.id}`}>View</Link>
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
export default async function ResourcesPage() {
  const companyId = await getCompanyIdForCurrentUser();
  const resources = companyId ? await getResourcesByCompany(companyId) : [];

  return (
    <AppShell>
      <ResourcesContent resources={resources} />
    </AppShell>
  );
}
