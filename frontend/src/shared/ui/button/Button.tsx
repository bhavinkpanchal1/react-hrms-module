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
  primary: 'bg-primary text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus',
  secondary: 'bg-slate-150 text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450',
  danger: 'bg-error text-white hover:bg-error-focus focus:bg-error-focus active:bg-error-focus/90',
  ghost: 'text-slate-600 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:text-navy-200 dark:hover:bg-navy-300/20',
  outline: 'border border-slate-300 text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500',
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
