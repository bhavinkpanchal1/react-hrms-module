import { cn } from '@/shared/lib/cn';
import { forwardRef, type SelectHTMLAttributes } from 'react';

export interface SelectOption { value: string | number; label: string; }

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, required, className, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-slate-700 dark:text-navy-100">
          {label}{required && <span className="ml-0.5 text-error">*</span>}
        </label>
      )}
      <select ref={ref} {...props}
        className={cn(
          'form-input w-full cursor-pointer rounded-lg border bg-white px-3 py-2 text-sm text-slate-800',
          'dark:bg-navy-700 dark:text-navy-100',
          error
            ? 'border-error focus:border-error focus:ring-1 focus:ring-error/30'
            : 'border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary/30 dark:border-navy-500',
          className,
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-error">{error}</p>}
      {!error && hint && <p className="text-xs text-slate-400 dark:text-navy-400">{hint}</p>}
    </div>
  )
);
Select.displayName = 'Select';
