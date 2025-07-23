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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, UserPlus } from 'lucide-react';
import { resources } from '@/lib/placeholder-data';
import type { Resource } from '@/lib/types';

const getAvailabilityBadgeVariant = (
  availability: Resource['availability']['status']
): 'default' | 'secondary' | 'outline' => {
  switch (availability) {
    case 'Available':
      return 'default';
    case 'Partially Available':
      return 'secondary';
    case 'Unavailable':
      return 'outline';
    default:
      return 'secondary';
  }
};


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
            Browse, manage, and assign your company's resources.
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
              {resources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">{resource.personalInfo.firstName} {resource.personalInfo.lastName}</TableCell>
                  <TableCell>{resource.professionalInfo.designation}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {resource.skills.technical.slice(0, 3).map((skill) => (
                        <Badge key={skill.skill} variant="secondary">
                          {skill.skill}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getAvailabilityBadgeVariant(resource.availability.status)}
                    >
                      {resource.availability.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Progress value={resource.availability.currentAllocationPercentage} className="w-24" />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Allocate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
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
