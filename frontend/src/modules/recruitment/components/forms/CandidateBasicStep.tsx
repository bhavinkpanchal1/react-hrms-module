import { Input, Select } from "@/shared/ui";
import { useFormContext } from "react-hook-form";
import type { CandidateFormData } from "../../schema/candidate.schema";
import { SOURCE_OPTIONS } from "../../constant/candidate";
import type { Job } from "../../types";

interface CandidateBasicStepProps {
  jobs: Job[];
}

export const CandidateBasicStep = ({ jobs }: CandidateBasicStepProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CandidateFormData>();

  const openJobs = jobs
    .filter((j) => j.status === "open")
    .map((j) => ({
      value: j.id,
      label: `${j.title} — ${j.department}`,
    }));

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-slate-200 pb-4 dark:border-navy-600">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-navy-100">
          Basic Information
        </h3>

        <p className="mt-1 text-sm text-slate-500 dark:text-navy-300">
          Candidate identity and application details.
        </p>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-2">
        <Input
          label="First Name"
          required
          placeholder="John"
          error={errors.first_name?.message}
          {...register("first_name")}
        />

        <Input
          label="Last Name"
          required
          placeholder="Doe"
          error={errors.last_name?.message}
          {...register("last_name")}
        />

        <Input
          type="email"
          label="Email Address"
          required
          placeholder="john.doe@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          type="tel"
          label="Phone Number"
          required
          placeholder="+91 9876543210"
          error={errors.phone?.message}
          {...register("phone")}
        />

        <Select
          label="Applying For"
          required
          placeholder="Select Job Position"
          options={openJobs}
          error={errors.jobId?.message}
          {...register("jobId", {
            valueAsNumber: true,
          })}
        />

        <Select
          label="Application Source"
          required
          placeholder="Select Source"
          options={SOURCE_OPTIONS}
          error={errors.source?.message}
          {...register("source")}
        />
      </div>
    </div>
  );
};