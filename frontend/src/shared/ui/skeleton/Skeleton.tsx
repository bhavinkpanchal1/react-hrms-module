import { cn } from '@/shared/lib/cn';

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn(
    'rounded bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200',
    'dark:from-navy-600 dark:via-navy-500 dark:to-navy-600',
    'bg-[length:200%_100%] animate-shimmer', className,
  )} />
);

export const TableRowSkeleton = ({ cols = 5 }: { cols?: number }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>
    ))}
  </tr>
);

export const CardSkeleton = () => (
  <div className="card p-4 space-y-3">
    <Skeleton className="h-5 w-1/3" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);
