import { cn } from '@/shared/lib/cn';
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:     string;
  error?:     string;
  hint?:      string;
  leftIcon?:  ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, required, className, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-slate-700 dark:text-navy-100">
          {label}{required && <span className="ml-0.5 text-error">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 dark:text-navy-300">
            {leftIcon}
          </div>
        )}
        <input ref={ref} {...props}
          className={cn(
            'form-input w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800',
            'placeholder:text-slate-400 dark:bg-navy-700 dark:text-navy-100 dark:placeholder:text-navy-400',
            error
              ? 'border-error focus:border-error focus:ring-1 focus:ring-error/30'
              : 'border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary/30 dark:border-navy-500',
            leftIcon && 'pl-9', rightIcon && 'pr-9', className,
          )}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-3 flex items-center text-slate-400 dark:text-navy-300">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
      {!error && hint && <p className="text-xs text-slate-400 dark:text-navy-400">{hint}</p>}
    </div>
  )
);
Input.displayName = 'Input';
