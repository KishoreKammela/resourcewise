'use client';

import * as React from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import type { Resource } from '@/lib/types';
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
import { type FilterConfig } from '../shared/DataTableToolbar';

interface ResourcesClientPageProps {
  data: Resource[];
  pageCount: number;
  totalCount: number;
}

const filterConfig: FilterConfig[] = [
  { columnId: 'name', placeholder: 'Filter by name...' },
  { columnId: 'designation', placeholder: 'Filter by designation...' },
];

export function ResourcesClientPage({
  data,
  pageCount,
  totalCount,
}: ResourcesClientPageProps) {
  // Memoize columns to prevent unnecessary re-renders
  const columns = React.useMemo<ColumnDef<Resource, unknown>[]>(
    () => [
      {
        accessorKey: 'personalInfo.firstName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => {
          const name = `${row.original.personalInfo.firstName} ${row.original.personalInfo.lastName}`;
          return (
            <Link
              href={`/resources/${row.original.id}`}
              className="hover:underline"
            >
              {name}
            </Link>
          );
        },
        accessorFn: (row) =>
          `${row.personalInfo.firstName} ${row.personalInfo.lastName}`,
        id: 'name',
      },
      {
        accessorKey: 'professionalInfo.designation',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Designation" />
        ),
        id: 'designation',
      },
      {
        accessorKey: 'skills.technical',
        header: 'Skills',
        cell: ({ row }) => {
          const skills = row.original.skills?.technical?.slice(0, 3) || [];
          return (
            <div className="flex flex-wrap gap-1">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill.skill}
                </Badge>
              ))}
            </div>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: 'availability.status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Availability" />
        ),
        cell: ({ row }) => (
          <span className="capitalize">
            {row.original.availability?.status}
          </span>
        ),
        id: 'status',
      },
      {
        accessorKey: 'availability.currentAllocationPercentage',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Allocation" />
        ),
        cell: ({ row }) =>
          `${row.original.availability?.currentAllocationPercentage}%`,
        id: 'allocation',
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
                <Link href={`/resources/${row.original.id}`}>View</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/resources/${row.original.id}/edit`}>Edit</Link>
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
      filterConfig={filterConfig}
    />
  );
}
