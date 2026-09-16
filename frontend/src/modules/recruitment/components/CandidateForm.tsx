import { FormProvider, useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  candidateSchema,
  type CandidateFormData,
} from "../schema/candidate.schema";
import { Button, StepNavigation, type StepDefinition } from "@/shared/ui";
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
    resolver: zodResolver(candidateSchema) as Resolver<CandidateFormData>,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="card overflow-hidden">
        <div className="border-b border-slate-200 px-4 py-5 dark:border-navy-500 sm:px-5">
        <StepNavigation
          steps={CANDIDATE_STEPS as unknown as StepDefinition[]}
          mode={mode}
          currentStepKey={wizard.currentStepKey}
          completedSteps={wizard.completedSteps}
          errorSteps={wizard.errorSteps}
          onStepClick={wizard.goToStep}
        />
        </div>

        {/* Step Content */}
        <div className="px-4 py-5 sm:px-5 lg:p-6">
        {wizard.currentStepKey === "basic" && <CandidateBasicStep jobs={jobs} />}
        {wizard.currentStepKey === "personal" && <CandidatePersonalStep />}
        {wizard.currentStepKey === "professional" && <CandidateProfessionalStep />}
        {wizard.currentStepKey === "education" && <CandidateEducationalStep />}
        {wizard.currentStepKey === "additional" && <CandidateAdditionalStep />}
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-between gap-3 border-t border-slate-200 px-4 py-4 dark:border-navy-500 sm:px-5">
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
