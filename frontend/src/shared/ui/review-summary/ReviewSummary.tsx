import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, Pencil } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/shared/ui/button/Button";

export interface ReviewFieldItem {
  label: string;
  value?: ReactNode;
  // Spans 2 grid columns on desktop — useful for addresses, notes, etc.
  wide?: boolean;
}

export interface ReviewSectionData {
  key: string; // matches the StepDefinition key, used to jump back via onEditSection
  title: string;
  icon?: LucideIcon;
  fields: ReviewFieldItem[];
}

export interface ReviewSummaryProps {
  sections: ReviewSectionData[];
  onEditSection?: (key: string) => void;
  // Sections to visually flag as needing attention (e.g. wizard.errorSteps)
  errorSectionKeys?: string[];
  // Grid columns per section on desktop — 3 fits most HRMS field sets well
  columns?: 2 | 3 | 4;
  className?: string;
}

const colsClass: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

const ReviewField = ({ label, value, wide }: ReviewFieldItem) => (
  <div className={cn(wide && "sm:col-span-2 lg:col-span-3")}>
    <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-navy-400">{label}</p>
    <p className="mt-1 truncate text-sm font-medium text-slate-700 dark:text-navy-50">
      {value !== undefined && value !== null && value !== "" ? value : <span className="text-slate-300 dark:text-navy-500">—</span>}
    </p>
  </div>
);

export const ReviewSummary = ({
  sections,
  onEditSection,
  errorSectionKeys = [],
  columns = 3,
  className,
}: ReviewSummaryProps) => (
  <div className={cn("space-y-4", className)}>
    {sections.map((section) => {
      const hasError = errorSectionKeys.includes(section.key);
      const Icon = section.icon;

      return (
        <Card
          key={section.key}
          className={cn(hasError && "ring-1 ring-error/40")}
        >
          <CardContent className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-navy-700">
              <div className="flex items-center gap-2">
                {Icon && <Icon className="size-4 text-primary" />}
                <h4 className="text-sm font-semibold text-slate-800 dark:text-navy-100">
                  {section.title}
                </h4>
                {hasError && (
                  <span className="flex items-center gap-1 rounded-full bg-error/10 px-2 py-0.5 text-xs font-medium text-error">
                    <AlertCircle className="size-3" /> Needs attention
                  </span>
                )}
              </div>
              {onEditSection && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  leftIcon={<Pencil className="size-3.5" />}
                  onClick={() => onEditSection(section.key)}
                >
                  Edit
                </Button>
              )}
            </div>

            <div className={cn("grid grid-cols-1 gap-x-6 gap-y-4", colsClass[columns])}>
              {section.fields.map((field, idx) => (
                <ReviewField key={idx} {...field} />
              ))}
            </div>
          </CardContent>
        </Card>
      );
    })}
  </div>
);