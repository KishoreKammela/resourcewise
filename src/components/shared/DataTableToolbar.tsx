'use client';

import { type Table } from '@tanstack/react-table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';
import * as React from 'react';
import { Input } from '@/components/ui/input';

export interface FilterConfig {
  columnId: string;
  placeholder: string;
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterConfig: FilterConfig[];
}

export function DataTableToolbar<TData>({
  table,
  filterConfig,
}: DataTableToolbarProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());
      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === '') {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }
      return newSearchParams.toString();
    },
    [searchParams]
  );

  return (
    <div className="flex items-center gap-2">
      {filterConfig.map((filter) => (
        <DebouncedInput
          key={filter.columnId}
          placeholder={filter.placeholder}
          initialValue={(searchParams.get(filter.columnId) as string) ?? ''}
          onChange={(value) => {
            router.push(
              `${pathname}?${createQueryString({
                [filter.columnId]: value,
                page: 1,
              })}`
            );
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
      ))}
    </div>
  );
}

interface DebouncedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  initialValue: string;
  onChange: (value: string) => void;
  debounce?: number;
}

function DebouncedInput({
  initialValue,
  onChange,
  debounce = 500,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = React.useState(initialValue);
  const debouncedValue = useDebounce(value, debounce);

  React.useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
