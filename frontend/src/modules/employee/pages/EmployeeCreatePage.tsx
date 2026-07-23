import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCheck } from "lucide-react";
import { Button, StepNavigation } from "@/shared/ui";
import { PageSpinner } from "@/shared/ui/spinner/Spinner";
import { useCandidate, useUpdateCandidate } from "@/modules/recruitment/hooks/useCandidates";
import { useJobs } from "@/modules/recruitment/hooks/useJobs";
import { useOffers } from "@/modules/recruitment/hooks/useOffers";
import { useCreateEmployee } from "../hooks/useEmployees";
import { employeeSchema, type EmployeeFormData } from "../schema/employee.schema";
import { useStepWizard } from "@/shared/hooks/useStepWizard";
import { EmployeePersonalStep } from "../forms/EmployeePersonalStep";
import { EmployeeAddressStep } from "../forms/EmployeeAddressStep";
import { EmployeeAccountDetailsStep } from "../forms/EmployeeAccountDetailsStep";
import { EmployeeEmergencyStep } from "../forms/EmployeeEmergencyStep";
import { EmployeeEmploymentStep } from "../forms/EmployeeEmploymentStep";
import { EmployeeReviewStep } from "../forms/EmployeeReviewStep";
import { EMPLOYEE_FORM_STEPS } from "../constants/employeeFormSteps";
import type { EmployeeStepProps } from "../types/employeeStep.type";

const emptyDefaults: Partial<EmployeeFormData> = {
  first_name: "", last_name: "", email: "", phone: "",
  employment_type: "full_time",
  same_as_above: false,
  clockin_remotely: false,
};

const STEP_COMPONENTS = {
  personal: EmployeePersonalStep,
  address: EmployeeAddressStep,
  employment: EmployeeEmploymentStep,
  account_details: EmployeeAccountDetailsStep,
  emergency: EmployeeEmergencyStep,
} satisfies Record<string, React.ComponentType<EmployeeStepProps>>;

// This page always CREATES a new employee record — whether launched
// standalone ("Add Employee" button, blank form) or from the recruitment
// flow (?candidateId=&offerId=, pre-filled from the candidate + offer).
// Both are still "create a brand-new employee", so the wizard always runs
// in "create" mode: linear, validation-gated, single final submit.
// Editing an EXISTING employee is a separate page/mode — see
// EmployeeEditPage, which uses mode="edit" (free nav + per-tab Update).
const EmployeeCreatePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const candidateId = Number(searchParams.get("candidateId")) || 0;
  const offerId = Number(searchParams.get("offerId")) || 0;
  const isFromRecruitment = candidateId > 0;

  const { data: candidate, isLoading: candidateLoading } = useCandidate(candidateId);
  const { data: jobs = [] } = useJobs();
  const { data: offers = [] } = useOffers();
  const updateCandidate = useUpdateCandidate();
  const createEmployee = useCreateEmployee();

  const [mutationError, setMutationError] = useState<string | null>(null);

  const job = jobs.find((j) => j.id === candidate?.jobId);
  const offer = offers.find((o) => (offerId ? o.id === offerId : o.candidateId === candidateId));

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema) as Resolver<EmployeeFormData>,
    defaultValues: emptyDefaults,
  });
  const { register, handleSubmit, reset, getValues, control, formState: { errors } } = form;

  const wizard = useStepWizard({
    steps: EMPLOYEE_FORM_STEPS,
    mode: "create",
    form,
  });

  const stepProps: EmployeeStepProps = { register, control, errors };

  // Populate once candidate/job/offer data has actually arrived — these
  // load asynchronously, so defaultValues at mount time would be empty.
  useEffect(() => {
    if (!isFromRecruitment || !candidate) return;
    reset({
      ...emptyDefaults,
      first_name: candidate.first_name,
      last_name: candidate.last_name,
      email: candidate.email,
      phone: candidate.phone,
      dob: candidate.dob ?? "",
      gender: candidate.gender ?? "",
      marital_status: candidate.marital_status ?? "",
      corresponding_address_line1: candidate.address_line1 ?? "",
      corresponding_address_line2: candidate.address_line2 ?? "",
      corresponding_pincode: candidate.pincode ?? "",
      department: job?.department ?? "",
      designation: job?.title ?? "",
      work_location: job?.location ?? "",
      date_of_joining: offer?.joining_date ?? "",
      annual_salary: offer?.offered_salary ?? 0,
    });
    // Only re-run when the underlying records change, not on every render —
    // job/offer resolve slightly after candidate since they come from
    // separate list queries.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidate?.id, job?.id, offer?.id]);

  const onSubmit = (data: EmployeeFormData) => {
    setMutationError(null);
    createEmployee.mutate(
      {
        ...data,
        source_candidate_id: isFromRecruitment ? candidateId : undefined,
        source_offer_id: isFromRecruitment ? offer?.id : undefined,
      },
      {
        onSuccess: (employee) => {
          if (isFromRecruitment) {
            updateCandidate.mutate({
              id: candidateId,
              data: { status: "hired", converted_to_employee: true },
            });
          }
          navigate(`/employees?created=${employee.id}`);
        },
        onError: (error) => {
          setMutationError(error instanceof Error ? error.message : "Unable to create employee.");
        },
      },
    );
  };

  if (isFromRecruitment && candidateLoading) {
    return <PageSpinner />;
  }
  if (isFromRecruitment && !candidate) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500 dark:text-navy-300">
        Candidate not found.
      </div>
    );
  }

  const isSubmitting = createEmployee.isPending || updateCandidate.isPending;

  const renderStep = () => {
    if (wizard.currentStepKey === "review") {
      return (
        <EmployeeReviewStep
          values={getValues()}
          onEditSection={wizard.goToStep}
          errorSectionKeys={wizard.errorSteps}
        />
      );
    }
    const StepComponent = STEP_COMPONENTS[wizard.currentStepKey as keyof typeof STEP_COMPONENTS];
    return StepComponent ? <StepComponent {...stepProps} /> : null;
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-navy-100">
          {isFromRecruitment ? "Onboard Employee" : "Add Employee"}
        </h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-navy-300">
          {isFromRecruitment
            ? "Verify the details below, then complete each step to create the employee record."
            : "Enter the new employee's details step by step."}
        </p>
      </div>

      {mutationError && (
        <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {mutationError}
        </div>
      )}

      <StepNavigation
        steps={EMPLOYEE_FORM_STEPS}
        mode="create"
        currentStepKey={wizard.currentStepKey}
        completedSteps={wizard.completedSteps}
        errorSteps={wizard.errorSteps}
        onStepClick={wizard.goToStep}
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {renderStep()}

        <div className="flex justify-between border-t border-slate-100 pt-5 dark:border-navy-700">
          <Button type="button" variant="outline" onClick={wizard.goBack} disabled={wizard.isFirstStep}>
            Back
          </Button>

          {!wizard.isLastStep ? (
            <Button type="button" onClick={wizard.goNext}>
              Next
            </Button>
          ) : (
            <Button type="submit" isLoading={isSubmitting} leftIcon={<UserCheck className="size-4" />}>
              Create Employee
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EmployeeCreatePage;