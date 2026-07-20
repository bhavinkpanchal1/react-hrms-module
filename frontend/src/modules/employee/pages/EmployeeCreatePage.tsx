import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, UserCheck } from "lucide-react";
import { Button, Input, Select, DatePicker } from "@/shared/ui";
import { PageSpinner } from "@/shared/ui/spinner/Spinner";
import {
  useCandidate,
  useUpdateCandidate,
} from "@/modules/recruitment/hooks/useCandidates";
import { useJobs } from "@/modules/recruitment/hooks/useJobs";
import { useOffers } from "@/modules/recruitment/hooks/useOffers";
import {
  GENDERS_OPTIONS,
  MARITAL_STATUS_OPTIONS,
} from "@/modules/recruitment/constant/candidate";
import { useCreateEmployee } from "../hooks/useEmployees";
import {
  employeeSchema,
  type EmployeeFormData,
} from "../schema/employee.schema";
import { EMPLOYMENT_TYPE_OPTIONS } from "../types/employee.type";
import { getDateYearsAgo } from "@/shared/utils/date";

const ReviewField = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-1 font-medium text-slate-700 dark:text-navy-50">
      {value || "—"}
    </p>
  </div>
);

const emptyDefaults: EmployeeFormData = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  marital_status: "",
  address_line1: "",
  address_line2: "",
  pincode: "",
  department: "",
  designation: "",
  reporting_manager: "",
  work_location: "",
  employment_type: "full_time",
  date_of_joining: "",
  annual_salary: 0,
};

const EmployeeCreatePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const candidateId = Number(searchParams.get("candidateId")) || 0;
  const offerId = Number(searchParams.get("offerId")) || 0;

  const isFromRecruitment = candidateId > 0;

  const { data: candidate, isLoading: candidateLoading } =
    useCandidate(candidateId);
  const { data: jobs = [] } = useJobs();
  const { data: offers = [] } = useOffers();
  const updateCandidate = useUpdateCandidate();
  const createEmployee = useCreateEmployee();

  const [isEditing, setIsEditing] = useState(!isFromRecruitment);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const job = jobs.find((j) => j.id === candidate?.jobId);
  const offer = offers.find((o) =>
    offerId ? o.id === offerId : o.candidateId === candidateId,
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: emptyDefaults,
  });

  // Populate once candidate/job/offer data has actually arrived — these
  // load asynchronously, so defaultValues at mount time would be empty.
  useEffect(() => {
    if (!isFromRecruitment) return;
    if (!candidate) return;
    reset({
      first_name: candidate.first_name,
      last_name: candidate.last_name,
      email: candidate.email,
      phone: candidate.phone,
      dob: candidate.dob ?? "",
      gender: candidate.gender ?? "",
      marital_status: candidate.marital_status ?? "",
      address_line1: candidate.address_line1 ?? "",
      address_line2: candidate.address_line2 ?? "",
      pincode: candidate.pincode ?? "",
      department: job?.department ?? "",
      designation: job?.title ?? "",
      reporting_manager: "",
      work_location: job?.location ?? "",
      employment_type: "full_time",
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
          setMutationError(
            error instanceof Error
              ? error.message
              : "Unable to create employee.",
          );
        },
      },
    );
  };

  // If required fields are missing (e.g. job/offer data was incomplete),
  // force edit mode so the errors are actually visible on real inputs
  // instead of being invisible on the read-only review.
  const onInvalid = () => setIsEditing(true);

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

  const values = watch();
  const isSubmitting = createEmployee.isPending || updateCandidate.isPending;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-navy-100">
            {isFromRecruitment ? "Onboard Employee" : "Add Employee"}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-navy-300">
            {isFromRecruitment
              ? "Verify the details below, then confirm to create the employee record."
              : "Enter the new employee's details."}
          </p>
        </div>
        {isFromRecruitment && !isEditing && (
          <Button
            variant="outline"
            leftIcon={<Pencil className="size-4" />}
            onClick={() => setIsEditing(true)}
          >
            Edit Details
          </Button>
        )}
      </div>

      {mutationError && (
        <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {mutationError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        noValidate
        className="space-y-5"
      >
        {isEditing ? (
          <>
            <section className="card p-6">
              <h3 className="mb-4 text-base font-semibold text-slate-800 dark:text-navy-100">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                <Input
                  label="First Name"
                  required
                  error={errors.first_name?.message}
                  {...register("first_name")}
                />
                <Input
                  label="Last Name"
                  required
                  error={errors.last_name?.message}
                  {...register("last_name")}
                />
                <Input
                  type="email"
                  label="Email"
                  required
                  error={errors.email?.message}
                  {...register("email")}
                />
                <Input
                  type="tel"
                  label="Phone"
                  required
                  error={errors.phone?.message}
                  {...register("phone")}
                />
                <Controller
                  control={control}
                  name="dob"
                  render={({ field, fieldState }) => (
                    <DatePicker
                      mode="date"
                      minDate={getDateYearsAgo(100)}
                      maxDate={getDateYearsAgo(18)}
                      label="Date of Birth" 
                      value={field.value}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Select
                  label="Gender"
                  options={GENDERS_OPTIONS}
                  placeholder="Select Gender"
                  error={errors.gender?.message}
                  {...register("gender")}
                />
                <Select
                  label="Marital Status"
                  options={MARITAL_STATUS_OPTIONS}
                  placeholder="Select Status"
                  error={errors.marital_status?.message}
                  {...register("marital_status")}
                />
                <Input
                  label="Pincode"
                  error={errors.pincode?.message}
                  {...register("pincode")}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Address Line 1"
                    error={errors.address_line1?.message}
                    {...register("address_line1")}
                  />
                </div>
              </div>
            </section>

            <section className="card p-6">
              <h3 className="mb-4 text-base font-semibold text-slate-800 dark:text-navy-100">
                Employment Details
              </h3>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                <Input
                  label="Department"
                  required
                  error={errors.department?.message}
                  {...register("department")}
                />
                <Input
                  label="Designation"
                  required
                  error={errors.designation?.message}
                  {...register("designation")}
                />
                <Input
                  label="Reporting Manager"
                  error={errors.reporting_manager?.message}
                  {...register("reporting_manager")}
                />
                <Input
                  label="Work Location"
                  required
                  error={errors.work_location?.message}
                  {...register("work_location")}
                />
                <Select
                  label="Employment Type"
                  required
                  options={EMPLOYMENT_TYPE_OPTIONS}
                  error={errors.employment_type?.message}
                  {...register("employment_type")}
                />
                <Controller
                  control={control}
                  name="date_of_joining"
                  render={({ field, fieldState }) => (
                    <DatePicker
                      mode="date"
                      label="Date of Joining"
                      required
                      value={field.value}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Input
                  type="number"
                  label="Annual Salary"
                  required
                  error={errors.annual_salary?.message}
                  {...register("annual_salary", { valueAsNumber: true })}
                />
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="card p-6">
              <h3 className="mb-4 text-base font-semibold text-slate-800 dark:text-navy-100">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                <ReviewField
                  label="Name"
                  value={`${values.first_name} ${values.last_name}`}
                />
                <ReviewField label="Email" value={values.email} />
                <ReviewField label="Phone" value={values.phone} />
                <ReviewField label="Date of Birth" value={values.dob} />
                <ReviewField label="Gender" value={values.gender} />
                <ReviewField
                  label="Marital Status"
                  value={values.marital_status}
                />
                <ReviewField label="Address" value={values.address_line1} />
                <ReviewField label="Pincode" value={values.pincode} />
              </div>
            </section>

            <section className="card p-6">
              <h3 className="mb-4 text-base font-semibold text-slate-800 dark:text-navy-100">
                Employment Details
              </h3>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                <ReviewField label="Department" value={values.department} />
                <ReviewField label="Designation" value={values.designation} />
                <ReviewField
                  label="Reporting Manager"
                  value={values.reporting_manager}
                />
                <ReviewField
                  label="Work Location"
                  value={values.work_location}
                />
                <ReviewField
                  label="Employment Type"
                  value={
                    EMPLOYMENT_TYPE_OPTIONS.find(
                      (o) => o.value === values.employment_type,
                    )?.label
                  }
                />
                <ReviewField
                  label="Date of Joining"
                  value={values.date_of_joining}
                />
                <ReviewField
                  label="Annual Salary"
                  value={
                    values.annual_salary
                      ? `₹${Number(values.annual_salary).toLocaleString("en-IN")}`
                      : undefined
                  }
                />
              </div>
            </section>
          </>
        )}

        <div className="flex justify-end gap-3">
          {isEditing && isFromRecruitment && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditing(false)}
            >
              Back to Review
            </Button>
          )}
          <Button
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<UserCheck className="size-4" />}
          >
            Confirm & Create Employee
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeCreatePage;
