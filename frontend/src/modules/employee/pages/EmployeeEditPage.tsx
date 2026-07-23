import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, UserCheck } from "lucide-react";
import { Button, StepNavigation } from "@/shared/ui";
import { PageSpinner } from "@/shared/ui/spinner/Spinner";
import { useEmployee, useUpdateEmployee } from "../hooks/useEmployees";
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

const STEP_COMPONENTS = {
  personal: EmployeePersonalStep,
  address: EmployeeAddressStep,
  employment: EmployeeEmploymentStep,
  account_details: EmployeeAccountDetailsStep,
  emergency: EmployeeEmergencyStep,
} satisfies Record<string, React.ComponentType<EmployeeStepProps>>;

// Editing an EXISTING employee — free navigation between sections via the
// step nav, each section has its own "Update Section" button that saves
// just that section's fields and stays put (never forces you to the
// Review tab), plus a single combined "Update All" action on Review for
// convenience once everything's been checked.
const EmployeeEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const employeeId = Number(id);

  const { data: employee, isLoading, error } = useEmployee(employeeId);
  const updateEmployee = useUpdateEmployee();
  const [savedStepKey, setSavedStepKey] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema) as Resolver<EmployeeFormData>,
  });
  const { register, handleSubmit, reset, getValues, control, formState: { errors } } = form;

  // Existing, presumably-valid record — every section starts "Completed"
  // rather than "Pending", since there's nothing left to finish; errors
  // only show up once the user actually changes something invalid.
  const wizard = useStepWizard({
    steps: EMPLOYEE_FORM_STEPS,
    mode: "edit",
    form,
    initialCompletedSteps: EMPLOYEE_FORM_STEPS.map((s) => s.key),
  });

  const stepProps: EmployeeStepProps = { register, control, errors };

  useEffect(() => {
    if (!employee) return;
    reset(employee);
  }, [employee, reset]);

  const handleSaveStep = () => {
    setMutationError(null);
    setSavedStepKey(null);
    wizard.saveStep(async (stepKey, values) => {
      await updateEmployee.mutateAsync(
        { id: employeeId, data: values },
        {
          onError: (error) => {
            setMutationError(error instanceof Error ? error.message : "Unable to save this section.");
          },
        },
      );
      setSavedStepKey(stepKey);
    });
  };

  const handleUpdateAll = handleSubmit((data) => {
    setMutationError(null);
    updateEmployee.mutate(
      { id: employeeId, data },
      {
        onSuccess: () => navigate(`/employees?updated=${employeeId}`),
        onError: (error) => {
          setMutationError(error instanceof Error ? error.message : "Unable to update employee.");
        },
      },
    );
  });

  if (isLoading) return <PageSpinner />;
  if (error || !employee) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500 dark:text-navy-300">
        Employee not found.
      </div>
    );
  }

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

  const isReview = wizard.currentStepKey === "review";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-navy-100">
          Edit Employee — {employee.first_name} {employee.last_name}
        </h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-navy-300">
          Jump to any section directly. Save a section on its own, or review everything and update all at once.
        </p>
      </div>

      {mutationError && (
        <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {mutationError}
        </div>
      )}

      <StepNavigation
        steps={EMPLOYEE_FORM_STEPS}
        mode="edit"
        currentStepKey={wizard.currentStepKey}
        completedSteps={wizard.completedSteps}
        errorSteps={wizard.errorSteps}
        onStepClick={(key) => {
          setSavedStepKey(null);
          wizard.goToStep(key);
        }}
      />

      <form onSubmit={(e) => e.preventDefault()} noValidate className="space-y-5">
        {renderStep()}

        {savedStepKey === wizard.currentStepKey && !isReview && (
          <div className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
            Section saved.
          </div>
        )}

        <div className="flex flex-wrap justify-between gap-3 border-t border-slate-100 pt-5 dark:border-navy-700">
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={wizard.goBack} disabled={wizard.isFirstStep}>
              Back
            </Button>
            {!wizard.isLastStep && (
              <Button type="button" variant="ghost" onClick={wizard.goNext}>
                Next
              </Button>
            )}
          </div>

          {isReview ? (
            <Button
              type="button"
              onClick={handleUpdateAll}
              isLoading={updateEmployee.isPending}
              leftIcon={<UserCheck className="size-4" />}
            >
              Update All
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSaveStep}
              isLoading={updateEmployee.isPending}
              leftIcon={<Save className="size-4" />}
            >
              Update Section
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EmployeeEditPage;