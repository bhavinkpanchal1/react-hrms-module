import { cn } from '@/shared/lib/cn';
import { forwardRef, type InputHTMLAttributes } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <label className="inline-flex cursor-pointer items-center gap-2">
        <input type="checkbox" ref={ref} {...props}
          className={cn(
            'size-4 cursor-pointer rounded border-slate-300 text-primary',
            'focus:ring-1 focus:ring-primary/30 dark:border-navy-500 dark:bg-navy-700',
            error && 'border-error', className,
          )}
        />
        {label && <span className="text-sm text-slate-700 dark:text-navy-200">{label}</span>}
      </label>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
);
Checkbox.displayName = 'Checkbox';
