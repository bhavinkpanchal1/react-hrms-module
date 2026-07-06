import { cn } from '@/shared/lib/cn';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-focus focus:ring-2 focus:ring-primary/40',
  secondary: 'bg-slate-150 text-slate-800 hover:bg-slate-200 dark:bg-navy-600 dark:text-navy-100 dark:hover:bg-navy-500',
  danger: 'bg-error text-white hover:bg-error-focus focus:ring-2 focus:ring-error/40',
  ghost: 'text-slate-600 hover:bg-slate-100 dark:text-navy-200 dark:hover:bg-navy-600',
  outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-navy-500 dark:text-navy-200 dark:hover:bg-navy-600',
};
const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-5 py-2 text-sm gap-2',
  lg: 'px-6 py-2.5 text-base gap-2',
};

export const Button = ({
  variant = 'primary', size = 'md', isLoading = false,
  leftIcon, rightIcon, children, className, disabled, ...props
}: ButtonProps) => (
  <button {...props} disabled={disabled || isLoading}
    className={cn('btn font-medium', variantClasses[variant], sizeClasses[size], className)}>
    {isLoading
      ? <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      : leftIcon && <span className="shrink-0">{leftIcon}</span>}
    <span>{children}</span>
    {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
  </button>
);
