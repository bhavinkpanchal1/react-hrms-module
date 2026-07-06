import { cn } from '@/shared/lib/cn';
import { forwardRef, type TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, required, className, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-slate-700 dark:text-navy-100">
          {label}{required && <span className="ml-0.5 text-error">*</span>}
        </label>
      )}
      <textarea ref={ref} {...props}
        className={cn(
          'form-input w-full resize-y rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 min-h-[80px]',
          'placeholder:text-slate-400 dark:bg-navy-700 dark:text-navy-100 dark:placeholder:text-navy-400',
          error
            ? 'border-error focus:border-error focus:ring-1 focus:ring-error/30'
            : 'border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary/30 dark:border-navy-500',
          className,
        )}
      />
      {error && <p className="text-xs text-error">{error}</p>}
      {!error && hint && <p className="text-xs text-slate-400 dark:text-navy-400">{hint}</p>}
    </div>
  )
);
Textarea.displayName = 'Textarea';
