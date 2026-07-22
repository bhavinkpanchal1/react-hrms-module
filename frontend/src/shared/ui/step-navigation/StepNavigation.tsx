import { useEffect, useRef } from "react";
import { Check, AlertCircle } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import type { StepDefinition, StepNavigationMode, StepStatus } from "./types";

export interface StepNavigationProps {
  steps: StepDefinition[];
  currentStepKey: string;
  completedSteps: string[];
  errorSteps?: string[];
  mode: StepNavigationMode;
  onStepClick?: (key: string) => void;
  className?: string;
}

const getStatus = (
  key: string,
  currentStepKey: string,
  completedSteps: string[],
  errorSteps: string[],
): StepStatus => {
  if (errorSteps.includes(key)) return "error";
  if (key === currentStepKey) return "current";
  if (completedSteps.includes(key)) return "completed";
  return "pending";
};

const isClickable = (status: StepStatus, mode: StepNavigationMode) => {
  if (mode === "edit") return true; // edit mode: jump anywhere, always
  // create mode: only revisit what's already done, or the current step —
  // never skip ahead to a step you haven't reached yet.
  return status === "completed" || status === "current" || status === "error";
};

const circleClasses = (status: StepStatus) =>
  cn(
    "relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
    status === "completed" && "border-success bg-success text-white",
    status === "current" && "border-primary bg-primary text-white ring-4 ring-primary/15",
    status === "error" && "border-error bg-error text-white",
    status === "pending" && "border-slate-300 bg-white text-slate-400 dark:border-navy-500 dark:bg-navy-700 dark:text-navy-400",
  );

const StepIcon = ({ status, index, icon: Icon }: { status: StepStatus; index: number; icon?: StepDefinition["icon"] }) => {
  if (status === "completed") return <Check className="size-4" />;
  if (status === "error") return <AlertCircle className="size-4" />;
  if (Icon) return <Icon className="size-4" />;
  return <>{index + 1}</>;
};

export const StepNavigation = ({
  steps,
  currentStepKey,
  completedSteps,
  errorSteps = [],
  mode,
  onStepClick,
  className,
}: StepNavigationProps) => {
  const currentIndex = steps.findIndex((s) => s.key === currentStepKey);
  const mobileDotRef = useRef<HTMLButtonElement>(null);

  // Keep the active dot in view when it changes on the mobile scroll strip.
  useEffect(() => {
    mobileDotRef.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [currentStepKey]);

  return (
    <nav className={cn("w-full", className)} aria-label="Form steps">
      {/* ── Desktop: full horizontal stepper ─────────────────────────── */}
      <div className="hidden md:block">
        <div className="flex items-start overflow-x-auto pb-1">
          {steps.map((step, idx) => {
            const status = getStatus(step.key, currentStepKey, completedSteps, errorSteps);
            const clickable = isClickable(status, mode);
            const isLast = idx === steps.length - 1;

            return (
              <div key={step.key} className={cn("flex items-start", !isLast && "flex-1")}>
                <button
                  type="button"
                  disabled={!clickable}
                  onClick={() => clickable && onStepClick?.(step.key)}
                  className={cn(
                    "flex shrink-0 flex-col items-center gap-1.5 px-1 text-center",
                    clickable ? "cursor-pointer" : "cursor-not-allowed",
                  )}
                >
                  <span className={circleClasses(status)}>
                    <StepIcon status={status} index={idx} icon={step.icon} />
                  </span>
                  <span
                    className={cn(
                      "max-w-[6.5rem] text-xs font-medium leading-tight transition-colors",
                      status === "current" && "font-semibold text-primary",
                      status === "completed" && "text-slate-700 dark:text-navy-100",
                      status === "error" && "text-error",
                      status === "pending" && "text-slate-400 dark:text-navy-400",
                    )}
                  >
                    {step.title}
                  </span>
                </button>

                {/* Connecting line to the next step */}
                {!isLast && (
                  <div
                    className={cn(
                      "mt-[18px] h-0.5 min-w-6 flex-1",
                      idx < currentIndex || completedSteps.includes(step.key)
                        ? "bg-success"
                        : "bg-slate-200 dark:bg-navy-600",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mobile: compact "Step X of N" + progress bar + dot strip ──── */}
      <div className="md:hidden">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-xs font-medium text-slate-400 dark:text-navy-400">
            Step {currentIndex + 1} of {steps.length}
          </span>
          <span className="text-sm font-semibold text-slate-800 dark:text-navy-100">
            {steps[currentIndex]?.title}
          </span>
        </div>

        <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-150 dark:bg-navy-600">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {steps.map((step, idx) => {
            const status = getStatus(step.key, currentStepKey, completedSteps, errorSteps);
            const clickable = isClickable(status, mode);
            return (
              <button
                key={step.key}
                ref={status === "current" ? mobileDotRef : undefined}
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick?.(step.key)}
                title={step.title}
                className={cn(circleClasses(status), clickable ? "cursor-pointer" : "cursor-not-allowed")}
              >
                <StepIcon status={status} index={idx} icon={step.icon} />
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};