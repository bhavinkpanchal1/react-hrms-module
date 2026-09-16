import { useFormContext } from "react-hook-form";
import type { CandidateFormData } from "../../schema/candidate.schema";
import { Input } from "@/shared/ui";
import { GraduationCap } from "lucide-react";

export const CandidateEducationalStep = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CandidateFormData>();

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-navy-600">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <GraduationCap className="size-5" />
          </div>

          <div>
            <h3 className="text-base font-medium tracking-wide text-slate-700 dark:text-navy-100">
              Education Information
            </h3>

            <p className="text-sm text-slate-500 dark:text-navy-300">
              Add the candidate's educational qualifications.
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Input
            label="Highest Qualification"
            placeholder="Bachelor of Engineering"
            error={errors.highest_education?.message}
            {...register("highest_education")}
          />

          <Input
            label="Institution / University"
            placeholder="GTU University"
            error={errors.institution?.message}
            {...register("institution")}
          />

          <Input
            type="text"
            label="Graduation Year"
            placeholder="2023"

            error={errors.graduation_year?.message}
            {...register("graduation_year", {
              valueAsNumber: true,
            })}
          />
        </div>
      </div>
    </div>
  );
};
