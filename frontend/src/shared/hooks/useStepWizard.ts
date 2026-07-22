import { useCallback, useMemo, useState } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import type { StepDefinition, StepNavigationMode } from "../ui/step-navigation/types";

export interface UseStepWizardOptions<TFieldValues extends FieldValues> {
  steps: StepDefinition<TFieldValues>[];
  mode: StepNavigationMode;
  form: UseFormReturn<TFieldValues>;
  initialStepKey?: string;
  // Edit mode is usually opened on an existing, already-valid record — so
  // every section starts "Completed" until something changes. Create mode
  // starts with nothing completed. Override if a form needs something else.
  initialCompletedSteps?: string[];
}

export interface UseStepWizardReturn {
  currentStepKey: string;
  currentStepIndex: number;
  currentStep: StepDefinition | undefined;
  completedSteps: string[];
  errorSteps: string[];
  isFirstStep: boolean;
  isLastStep: boolean;
  // Validates the current step's fields, then advances. In create mode,
  // an invalid step blocks advancing and marks it as errored. In edit
  // mode, validation still runs (to update the error indicator) but never
  // blocks the move — edit mode's whole premise is free navigation.
  goNext: () => Promise<boolean>;
  goBack: () => void;
  // Direct jump from clicking a step in the nav. In create mode, only
  // completed/current/errored steps are reachable (StepNavigation already
  // disables the rest, this is a defensive re-check). Edit mode allows any
  // step unconditionally.
  goToStep: (key: string) => Promise<void>;
}

export function useStepWizard<TFieldValues extends FieldValues>({
  steps,
  mode,
  form,
  initialStepKey,
  initialCompletedSteps = [],
}: UseStepWizardOptions<TFieldValues>): UseStepWizardReturn {
  const [currentStepKey, setCurrentStepKey] = useState<string>(initialStepKey ?? steps[0]?.key);
  const [completedSteps, setCompletedSteps] = useState<string[]>(initialCompletedSteps);
  const [errorSteps, setErrorSteps] = useState<string[]>([]);

  const currentStepIndex = steps.findIndex((s) => s.key === currentStepKey);
  const currentStep = steps[currentStepIndex];

  const markStep = useCallback((key: string, valid: boolean) => {
    setCompletedSteps((prev) => (valid ? [...new Set([...prev, key])] : prev.filter((k) => k !== key)));
    setErrorSteps((prev) => (valid ? prev.filter((k) => k !== key) : [...new Set([...prev, key])]));
  }, []);

  const validateStep = useCallback(
    async (key: string) => {
      const step = steps.find((s) => s.key === key);
      if (!step?.fields || step.fields.length === 0) {
        markStep(key, true);
        return true;
      }
      const valid = await form.trigger(step.fields);
      markStep(key, valid);
      return valid;
    },
    [steps, form, markStep],
  );

  const goNext = useCallback(async () => {
    const valid = await validateStep(currentStepKey);
    // Create mode: a failing step blocks the move so users can't skip
    // required sections. Edit mode: never blocks — the point of edit mode
    // is that you can move around freely and fix errors whenever you like,
    // right up to the final Review/Update step.
    if (mode === "create" && !valid) return false;

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStepKey(steps[nextIndex].key);
    }
    return true;
  }, [validateStep, currentStepKey, mode, currentStepIndex, steps]);

  const goBack = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) setCurrentStepKey(steps[prevIndex].key);
  }, [currentStepIndex, steps]);

  const goToStep = useCallback(
    async (key: string) => {
      if (key === currentStepKey) return;

      if (mode === "create") {
        const targetIndex = steps.findIndex((s) => s.key === key);
        const canJump =
          completedSteps.includes(key) || errorSteps.includes(key) || targetIndex <= currentStepIndex;
        if (!canJump) return;
      }

      // Validate whatever step we're leaving so its nav indicator reflects
      // reality, but never block the jump itself — StepNavigation's own
      // clickability rules already decided whether this jump is allowed.
      await validateStep(currentStepKey);
      setCurrentStepKey(key);
    },
    [currentStepKey, mode, steps, completedSteps, errorSteps, currentStepIndex, validateStep],
  );

  return useMemo(
    () => ({
      currentStepKey,
      currentStepIndex,
      currentStep,
      completedSteps,
      errorSteps,
      isFirstStep: currentStepIndex === 0,
      isLastStep: currentStepIndex === steps.length - 1,
      goNext,
      goBack,
      goToStep,
    }),
    [currentStepKey, currentStepIndex, currentStep, completedSteps, errorSteps, steps.length, goNext, goBack, goToStep],
  );
}