import Link from 'next/link';
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
import { MoreHorizontal, PlusCircle, UserPlus } from 'lucide-react';
import { resources } from '@/lib/placeholder-data';
import type { Resource } from '@/lib/types';

const getAvailabilityBadgeVariant = (
  availability: Resource['availability']
): 'default' | 'secondary' | 'outline' => {
  switch (availability) {
    case 'Available':
      return 'default';
    case 'Partially Allocated':
      return 'secondary';
    case 'Fully Allocated':
      return 'outline';
    default:
      return 'secondary';
  }
};

export default function ResourcesPage() {
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
                  <TableCell className="font-medium">{resource.name}</TableCell>
                  <TableCell>{resource.designation}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {resource.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getAvailabilityBadgeVariant(resource.availability)}
                    >
                      {resource.availability}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Progress value={resource.allocation} className="w-24" />
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
