import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  candidateSchema,
  type CandidateFormData,
} from "../schema/candidate.schema";
import { Button, StepNavigation } from "@/shared/ui";
import { useStepWizard } from "@/shared/hooks/useStepWizard";
import type { Job } from "../types";
import { CANDIDATE_STEPS } from "../constant/candidate-steps";
import { CandidateBasicStep } from "./forms/CandidateBasicStep";
import { CandidatePersonalStep } from "./forms/CandidatePersonalStep";
import { CandidateProfessionalStep } from "./forms/CandidateProfessionalStep";
import { CandidateEducationalStep } from "./forms/CandidateEducationalStep";
import { CandidateAdditionalStep } from "./forms/CandidateAdditionalStep";

interface CandidateFormProps {
  jobs: Job[];
  onSubmit: SubmitHandler<CandidateFormData>;
  isSubmitting?: boolean;
  defaultValues?: Partial<CandidateFormData>;
  mode?: "create" | "edit";
}

// Uses the same generic StepNavigation + useStepWizard as the Employee
// wizard — one stepper implementation shared across the app instead of
// each multi-step form rolling its own.
export const CandidateForm = ({
  jobs,
  onSubmit,
  isSubmitting,
  defaultValues,
  mode = "create",
}: CandidateFormProps) => {
  const form = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      notes: "",
      ...defaultValues,
    },
  });

  const wizard = useStepWizard({
    steps: CANDIDATE_STEPS,
    mode,
    form,
    initialCompletedSteps: mode === "edit" ? CANDIDATE_STEPS.map((s) => s.key) : [],
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <StepNavigation
          steps={CANDIDATE_STEPS}
          mode={mode}
          currentStepKey={wizard.currentStepKey}
          completedSteps={wizard.completedSteps}
          errorSteps={wizard.errorSteps}
          onStepClick={wizard.goToStep}
        />

        {/* Step Content */}
        {wizard.currentStepKey === "basic" && <CandidateBasicStep jobs={jobs} />}
        {wizard.currentStepKey === "personal" && <CandidatePersonalStep />}
        {wizard.currentStepKey === "professional" && <CandidateProfessionalStep />}
        {wizard.currentStepKey === "education" && <CandidateEducationalStep />}
        {wizard.currentStepKey === "additional" && <CandidateAdditionalStep />}

        {/* Navigation */}
        <div className="flex justify-between border-t border-slate-100 pt-5 dark:border-navy-700">
          <Button
            type="button"
            variant="outline"
            disabled={wizard.isFirstStep}
            onClick={wizard.goBack}
          >
            Previous
          </Button>

          {wizard.isLastStep ? (
            <Button type="submit" isLoading={isSubmitting}>
              {mode === "edit" ? "Update Candidate" : "Add Candidate"}
            </Button>
          ) : (
            <Button type="button" onClick={wizard.goNext}>
              Next
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};