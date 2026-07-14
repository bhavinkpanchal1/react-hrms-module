import type { StepItem } from "@/modules/recruitment/constant/candidate-steps";
import { cn } from "@/shared/lib/cn";
import { Check } from "lucide-react";

export type StepperProps = {
  steps: StepItem[];
  currentStep: number;
  completedSteps: number[];
};

export const Stepper = ({
  steps,
  currentStep,
  completedSteps,
}: StepperProps) => {
  const getStepState = (index: number) => {
    if (completedSteps.includes(index)) return "completed";
    if (index === currentStep) return "active";
    return "pending";
  };
  return (
    <div className="mb-8 flex items-center justify-between">
      {steps.map((s, index) => {
        const state = getStepState(index);
        return (
          <div key={s.key} className="flex flex-col items-center">
            <div
              className={cn(
                "mb-2 flex h-10 w-10 items-center justify-center rounded-full border font-semibold transition-all",

                state === "completed" &&
                  "border-green-600 bg-green-600 text-white",
                state === "active" && "border-primary bg-primary text-white",
                state === "pending" &&
                  "border-slate-300 bg-white text-slate-400 dark:bg-navy-700",
              )}
            >
              {state === "completed" ? <Check className="size-5" /> : index + 1}
            </div>

            <div
              className={cn(
                "text-sm text-center",
                state === "completed" && "text-green-600",
                state === "active" && "text-primary",
                state === "pending" && "text-slate-400",
              )}
            >
              {s.title}
            </div>
          </div>
        );
      })}
    </div>
  );
};
