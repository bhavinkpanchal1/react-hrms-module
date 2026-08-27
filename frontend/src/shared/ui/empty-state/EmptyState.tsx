import type { LucideIcon } from "lucide-react";
import type React from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-slate-100 dark:bg-navy-700">
        <Icon className="size-8 text-slate-400 dark:text-navy-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-700 dark:text-navy-100">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-xs text-sm text-slate-400 dark:text-navy-400">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
      {!action && actionLabel && onAction && (
        <button type="button" className="btn mt-4 bg-primary px-4 py-2 text-sm text-white" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
