'use client';

import * as React from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import type { Client } from '@/lib/types';
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

interface ClientsClientPageProps {
  data: Client[];
  pageCount: number;
  totalCount: number;
}

const filterConfig: FilterConfig[] = [
  { columnId: 'name', placeholder: 'Filter by client name...' },
];

export function ClientsClientPage({
  data,
  pageCount,
  totalCount,
}: ClientsClientPageProps) {
  const columns = React.useMemo<ColumnDef<Client, unknown>[]>(
    () => [
      {
        accessorKey: 'basicInfo.clientName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Client Name" />
        ),
        cell: ({ row }) => (
          <Link
            href={`/clients/${row.original.id}`}
            className="font-medium hover:underline"
          >
            {row.original.basicInfo.clientName}
          </Link>
        ),
        id: 'name',
      },
      {
        accessorKey: 'contactInfo.primary.name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Contact Person" />
        ),
        id: 'contact',
      },
      {
        accessorKey: 'contactInfo.primary.email',
        header: 'Email',
      },
      {
        accessorKey: 'relationship.status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.relationship.status === 'Active'
                ? 'secondary'
                : 'outline'
            }
            className="capitalize"
          >
            {row.original.relationship.status}
          </Badge>
        ),
        id: 'status',
      },
      {
        accessorKey: 'analytics.activeProjectsCount',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Active Projects" />
        ),
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
                <Link href={`/clients/${row.original.id}`}>View</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/clients/${row.original.id}/edit`}>Edit</Link>
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
