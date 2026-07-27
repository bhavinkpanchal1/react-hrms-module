import { cn } from "@/shared/lib/cn";
import { forwardRef, useId, type InputHTMLAttributes } from "react";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      label,
      error,
      helperText,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={inputId}
          className={cn(
            "inline-flex items-center gap-2",
            disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
          )}
        >
          <input
            id={inputId}
            ref={ref}
            type="checkbox"
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            className={cn(
              "size-4 rounded border-slate-300 text-primary",
              "focus:ring-2 focus:ring-primary/30",
              "dark:border-navy-500 dark:bg-navy-700",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-error",
              className
            )}
            {...props}
          />

          {label && (
            <span className="text-sm text-slate-700 dark:text-navy-200">
              {label}
            </span>
          )}
        </label>

        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="text-xs text-slate-500 dark:text-navy-300"
          >
            {helperText}
          </p>
        )}

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-xs text-error"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";