'use client';

import { useState } from 'react';
import type { Project, Resource, Allocation } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/helpers/date-helpers';
import { Button } from '../ui/button';
import { PlusCircle, Star } from 'lucide-react';
import { AllocateResourceDialog } from '../allocations/AllocateResourceDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined | null;
}) {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base">{value}</p>
    </div>
  );
}

function RatingDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-muted-foreground'
          }`}
        />
      ))}
    </div>
  );
}

export function ProjectDetailClient({
  project,
  resources,
  initialAllocations,
}: {
  project: Project;
  resources: Resource[];
  initialAllocations: Allocation[];
}) {
  const [isAllocateDialogOpen, setAllocateDialogOpen] = useState(false);
  const [allocations, setAllocations] = useState(initialAllocations);

  const allocatedResourceIds = new Set(allocations.map((a) => a.resourceId));
  const availableResources = resources.filter(
    (r) => !allocatedResourceIds.has(r.id)
  );

  return (
    <>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DetailItem
                label="Project Name"
                value={project.basicInfo.projectName}
              />
              <DetailItem label="Project Code" value={project.projectCode} />
              <DetailItem label="Project Type" value={project.basicInfo.type} />
              <DetailItem
                label="Priority"
                value={project.basicInfo.priorityLevel}
              />
              <DetailItem
                label="Project Status"
                value={project.status.projectStatus}
              />
              <DetailItem
                label="Health Status"
                value={project.status.healthStatus}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {project.basicInfo.description || 'No description provided.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Allocated Team</CardTitle>
                <CardDescription>
                  Resources currently assigned to this project.
                </CardDescription>
              </div>
              <Button onClick={() => setAllocateDialogOpen(true)}>
                <PlusCircle className="mr-2" />
                Allocate Resource
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Allocation</TableHead>
                    <TableHead>Quality</TableHead>
                    <TableHead>Productivity</TableHead>
                    <TableHead>Communication</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allocations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        No resources allocated yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    allocations.map((alloc) => {
                      const resource = resources.find(
                        (r) => r.id === alloc.resourceId
                      );
                      return (
                        <TableRow key={alloc.id}>
                          <TableCell>
                            {resource
                              ? `${resource.personalInfo.firstName} ${resource.personalInfo.lastName}`
                              : 'Unknown Resource'}
                          </TableCell>
                          <TableCell>
                            {alloc.allocationDetails.roleInProject}
                          </TableCell>
                          <TableCell>
                            {alloc.allocationDetails.allocationPercentage}%
                          </TableCell>
                          <TableCell>
                            <RatingDisplay
                              rating={alloc.performance.qualityRating}
                            />
                          </TableCell>
                          <TableCell>
                            <RatingDisplay
                              rating={alloc.performance.productivityScore}
                            />
                          </TableCell>
                          <TableCell>
                            <RatingDisplay
                              rating={alloc.performance.communicationScore}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DetailItem
                label="Total Budget"
                value={project.budget.projectBudget?.toLocaleString('en-US', {
                  style: 'currency',
                  currency: project.budget.currency,
                })}
              />
              <DetailItem
                label="Billing Model"
                value={project.budget.billingModel}
              />
              <DetailItem label="Currency" value={project.budget.currency} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DetailItem
                label="Planned Start Date"
                value={formatDate(project.timeline.plannedStartDate)}
              />
              <DetailItem
                label="Planned End Date"
                value={formatDate(project.timeline.plannedEndDate)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <AllocateResourceDialog
        isOpen={isAllocateDialogOpen}
        setOpen={setAllocateDialogOpen}
        project={project}
        availableResources={availableResources}
      />
    </>
  );
}
