import { cn } from '@/shared/lib/cn';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps {
  label: string; variant?: BadgeVariant; className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-150 text-slate-600 dark:bg-navy-600 dark:text-navy-200',
  primary: 'bg-primary/15 text-primary dark:text-accent-light',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  error: 'bg-error/15 text-error',
  info: 'bg-info/15 text-info',
};

export const Badge = ({ label, variant = 'default', className }: BadgeProps) => (
  <span className={cn('badge rounded-full px-2.5', variantClasses[variant], className)}>
    {label}
  </span>
);
