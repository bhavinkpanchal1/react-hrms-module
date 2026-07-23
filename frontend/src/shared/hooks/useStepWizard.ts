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

export interface UseStepWizardReturn<TFieldValues extends FieldValues = FieldValues> {
  currentStepKey: string;
  currentStepIndex: number;
  currentStep: StepDefinition<TFieldValues> | undefined;
  completedSteps: string[];
  errorSteps: string[];
  isFirstStep: boolean;
  isLastStep: boolean;
  // Validates the current step's fields, then advances. In BOTH modes, an
  // invalid current step blocks the move — you can't Next past a broken
  // section either way (edit mode's "freedom" is about jumping via the
  // nav, not about skipping validation on the step you're actively
  // leaving via Next).
  goNext: () => Promise<boolean>;
  goBack: () => void;
  // Direct jump from clicking a step in the nav.
  // - Moving BACKWARD (or in edit mode, anywhere): always allowed — you
  //   can always go back to review/fix something without being blocked.
  // - Moving FORWARD in create mode: the step you're leaving must pass
  //   validation first, and you can only reach a step you've already
  //   completed or the very next pending one — never skip further ahead.
  goToStep: (key: string) => Promise<boolean>;
  // Validates the current step and, if valid, hands its field values to
  // the caller (e.g. to PATCH just that section) — WITHOUT navigating
  // anywhere. This is the per-tab "Update" action for edit mode: save this
  // section, stay right where you are.
  saveStep: (
    onSave: (stepKey: string, values: Partial<TFieldValues>) => Promise<void> | void,
  ) => Promise<boolean>;
}

export function useStepWizard<TFieldValues extends FieldValues>({
  steps,
  mode,
  form,
  initialStepKey,
  initialCompletedSteps = [],
}: UseStepWizardOptions<TFieldValues>): UseStepWizardReturn<TFieldValues> {
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
    // A failing step blocks Next in both modes — edit mode's free
    // navigation is about the step nav (goToStep/clicking tabs), not about
    // letting Next silently skip past a broken section.
    if (!valid) return false;

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStepKey(steps[nextIndex].key);
    }
    return true;
  }, [validateStep, currentStepKey, currentStepIndex, steps]);

  const goBack = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) setCurrentStepKey(steps[prevIndex].key);
  }, [currentStepIndex, steps]);

  const goToStep = useCallback(
    async (key: string) => {
      if (key === currentStepKey) return true;
      const targetIndex = steps.findIndex((s) => s.key === key);
      const movingForward = targetIndex > currentStepIndex;

      if (mode === "create" && movingForward) {
        // Leaving the current step to go further ahead — it must be valid,
        // and you can't skip past a step you haven't reached yet.
        const valid = await validateStep(currentStepKey);
        if (!valid) return false;
        const canReach = completedSteps.includes(key) || targetIndex === currentStepIndex + 1;
        if (!canReach) return false;
      } else {
        // Backward navigation (either mode), or any jump in edit mode:
        // always allowed. Still validate so the nav indicator you're
        // leaving reflects reality.
        await validateStep(currentStepKey);
      }

      setCurrentStepKey(key);
      return true;
    },
    [currentStepKey, mode, steps, completedSteps, currentStepIndex, validateStep],
  );

  const saveStep = useCallback(
    async (onSave: (stepKey: string, values: Partial<TFieldValues>) => Promise<void> | void) => {
      const valid = await validateStep(currentStepKey);
      if (!valid) return false;

      const step = steps.find((s) => s.key === currentStepKey);
      const allValues = form.getValues();
      const values: Partial<TFieldValues> = step?.fields
        ? (Object.fromEntries(step.fields.map((f) => [f, allValues[f as keyof TFieldValues]])) as Partial<TFieldValues>)
        : allValues;

      await onSave(currentStepKey, values);
      // Does NOT change currentStepKey — the whole point is "save this
      // section without being forced to the last tab."
      return true;
    },
    [currentStepKey, steps, form, validateStep],
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
      saveStep,
    }),
    [currentStepKey, currentStepIndex, currentStep, completedSteps, errorSteps, steps.length, goNext, goBack, goToStep, saveStep],
  );
}