'use client';

import * as React from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import type { Project } from '@/lib/types';
import { DataTable } from '@/components/shared/DataTable';
import { DataTableColumnHeader } from '@/components/shared/DataTableColumnHeader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Progress } from '../ui/progress';
import { formatDate } from '@/lib/helpers/date-helpers';

interface ProjectsClientPageProps {
  data: Project[];
  pageCount: number;
  totalCount: number;
}

export function ProjectsClientPage({
  data,
  pageCount,
  totalCount,
}: ProjectsClientPageProps) {
  const columns = React.useMemo<ColumnDef<Project, unknown>[]>(
    () => [
      {
        accessorKey: 'basicInfo.projectName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Project Name" />
        ),
        cell: ({ row }) => (
          <Link
            href={`/projects/${row.original.id}`}
            className="font-medium hover:underline"
          >
            {row.original.basicInfo.projectName}
          </Link>
        ),
      },
      {
        accessorKey: 'clientName',
        header: 'Client',
        enableSorting: false,
      },
      {
        accessorKey: 'status.projectStatus',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => (
          <Badge variant="secondary">{row.original.status.projectStatus}</Badge>
        ),
      },
      {
        accessorKey: 'timeline.plannedEndDate',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Deadline" />
        ),
        cell: ({ row }) => formatDate(row.original.timeline.plannedEndDate),
      },
      {
        accessorKey: 'status.progressPercentage',
        header: 'Progress',
        cell: ({ row }) => (
          <Progress
            value={row.original.status.progressPercentage}
            className="w-full"
          />
        ),
        enableSorting: false,
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/projects/${row.original.id}`}>View</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/projects/${row.original.id}/edit`}>Edit</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      totalCount={totalCount}
    />
  );
}
