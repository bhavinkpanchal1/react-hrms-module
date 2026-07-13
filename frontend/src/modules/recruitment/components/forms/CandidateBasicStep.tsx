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
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

      <Input
        label="First Name"
        error={errors.first_name?.message}
        {...register("first_name")}
      />

      <Input
        label="Last Name"
        error={errors.last_name?.message}
        {...register("last_name")}
      />

      <Input
        label="Email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Phone"
        error={errors.phone?.message}
        {...register("phone")}
      />

      <Select
        label="Applying For"
        options={openJobs}
        {...register("jobId", {
          valueAsNumber: true,
        })}
      />

      <Select
        label="Source"
        options={SOURCE_OPTIONS}
        {...register("source")}
      />

    </div>
  );
};