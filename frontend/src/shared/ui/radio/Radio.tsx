import { cn } from '@/shared/lib/cn';
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className, ...props }, ref) => (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <input type="radio" ref={ref} {...props}
        className={cn(
          'size-4 cursor-pointer border-slate-300 text-primary',
          'focus:ring-1 focus:ring-primary/30 dark:border-navy-500',
          className,
        )}
      />
      <span className="text-sm text-slate-700 dark:text-navy-200">{label}</span>
    </label>
  )
);
Radio.displayName = 'Radio';

export interface RadioGroupProps { label?: string; error?: string; children: ReactNode; }

export const RadioGroup = ({ label, error, children }: RadioGroupProps) => (
  <div className="flex flex-col gap-2">
    {label && <span className="text-xs font-medium text-slate-700 dark:text-navy-100">{label}</span>}
    <div className="flex flex-wrap gap-4">{children}</div>
    {error && <p className="text-xs text-error">{error}</p>}
  </div>
);
