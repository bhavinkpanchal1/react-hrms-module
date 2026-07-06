import { cn } from '@/shared/lib/cn';

const sizeClasses = { sm: 'size-4 border-2', md: 'size-6 border-2', lg: 'size-10 border-4' };

export const Spinner = ({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) => (
  <div className={cn('animate-spin rounded-full border-primary border-t-transparent', sizeClasses[size], className)} />
);

export const PageSpinner = () => (
  <div className="grid h-full min-h-[60vh] place-items-center">
    <Spinner size="lg" />
  </div>
);
