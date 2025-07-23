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
import { teamMembers } from '@/lib/placeholder-data';


function TeamContent() {
  return (
     <div className="flex flex-col gap-4">
      <PageHeader title="Team Members">
        <Button>
          <PlusCircle className="mr-2" />
          Add Member
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Manage Team</CardTitle>
          <CardDescription>
            Invite, edit, and manage your team members and their roles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No team members found. Start by adding a new member.
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
  )
}
export default function TeamPage() {
  return (
    <AppShell>
      <TeamContent />
    </AppShell>
  );
}
