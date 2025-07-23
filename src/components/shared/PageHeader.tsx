import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  children?: ReactNode;
};

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
      <h1 className="font-serif text-2xl font-bold tracking-tight md:text-3xl">
        {title}
      </h1>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
