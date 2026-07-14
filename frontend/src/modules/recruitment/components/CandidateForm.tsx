import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  candidateSchema,
  type CandidateFormData,
} from "../schema/candidate.schema";
import { Button } from "@/shared/ui/button/Button";
import type { Job } from "../types";
import { useState } from "react";
import { CANDIDATE_STEPS } from "../constant/candidate-steps";
import { CandidateBasicStep } from "./forms/CandidateBasicStep";
import { CandidatePersonalStep } from "./forms/CandidatePersonalStep";
import { Stepper } from "@/shared/ui/stepper/Stepper";
import { CandidateProfessionalStep } from "./forms/CandidateProfessionalStep";
import { CandidateEducationalStep } from "./forms/CandidateEducationalStep";
import { CandidateAdditionalStep } from "./forms/CandidateAdditionalStep";

interface CandidateFormProps {
  jobs: Job[];
  onSubmit: (data: CandidateFormData) => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<CandidateFormData>;
  mode?: "create" | "edit";
}

export const CandidateForm = ({
  jobs,
  onSubmit,
  isSubmitting,
  defaultValues,
  mode = "create",
}: CandidateFormProps) => {
  const methods = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      notes: "",
      ...defaultValues,
    },
  });

  const [step, setStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const handleStepsValidation = async () => {
    const fields = CANDIDATE_STEPS[step].fields;

    const isValid = await methods.trigger(
      fields as (keyof CandidateFormData)[]
    );

    if(!isValid) return;

    setCompletedSteps(prev => {
      if(prev.includes(step)) return prev;
      return [...prev, step];
    });

    setStep((s) => s + 1);
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {/* Stepper */}
        <Stepper currentStep={step} steps={CANDIDATE_STEPS}  completedSteps={completedSteps}/>

        {/* Step Content */}
        {step === 0 && <CandidateBasicStep jobs={jobs} />}

        {/* future */}
        {step === 1 && <CandidatePersonalStep />}
        {step === 2 && <CandidateProfessionalStep />}
        {step === 3 && <CandidateEducationalStep />}
        {step === 4 && <CandidateAdditionalStep/>}

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <Button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
          >
            Previous
          </Button>

          {step === CANDIDATE_STEPS.length - 1 ? (
            <Button type="submit" isLoading={isSubmitting}>
              {mode === "edit" ? "Update Candidate" : "Add Candidate"}
            </Button>
          ) : (
            <Button type="button" onClick={handleStepsValidation}>
              Next
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};
