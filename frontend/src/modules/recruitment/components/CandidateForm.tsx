import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { candidateSchema, type CandidateFormData } from '../schema/candidate.schema';
import { Button } from '@/shared/ui/button/Button';
import type { Job } from '../types';
import { useState } from 'react';
import { CANDIDATE_STEPS } from '../constant/candidate-steps';
import { CandidateBasicStep } from './forms/CandidateBasicStep';
import { CandidatePersonalStep } from './forms/CandidatePersonalStep';


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
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
      >

        {/* Stepper */}
        <div className="mb-8 flex items-center justify-between">
          {CANDIDATE_STEPS.map((s, index) => (
            <div
              key={s.key}
              className={`flex flex-col items-center ${index <= step
                ? "text-primary"
                : "text-slate-400"
                }`}
            >
              <div
                className={`
                  mb-2 flex h-10 w-10 items-center justify-center rounded-full border
                  ${index <= step
                    ? "border-primary bg-primary text-white"
                    : "border-slate-300"
                  }
                `}
              >
                {index + 1}
              </div>

              <span className="text-xs">
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 0 && (
          <CandidateBasicStep jobs={jobs} />
        )}

        {/* future */}
        {step === 1 && (<CandidatePersonalStep />)}
        {/* step === 2 && <CandidateProfessionalStep /> */}

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
            <Button
              type="submit"
              isLoading={isSubmitting}
            >
              {mode === "edit"
                ? "Update Candidate"
                : "Add Candidate"}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => setStep((s) => s + 1)}
            >
              Next
            </Button>
          )}

        </div>

      </form>
    </FormProvider>
  );
};