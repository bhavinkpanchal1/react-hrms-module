import { useFormContext } from "react-hook-form";
import type { CandidateFormData } from "../../schema/candidate.schema";
import { Input } from "@/shared/ui";

export const CandidateProfessionalStep = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CandidateFormData>();

  return (
    <div className="space-y-8">

      {/* Current Employment */}
      <div>
        <div className="mb-5 border-b border-slate-200 pb-3 dark:border-navy-600">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-navy-100">
            Current Employment
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-navy-300">
            Information about the candidate's current role and employer.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            label="Current Position"
            placeholder="Senior Frontend Developer"
            error={errors.current_position?.message}
            {...register("current_position")}
          />

          <Input
            label="Current Company"
            placeholder="ABC Technologies Pvt Ltd"
            error={errors.current_company?.message}
            {...register("current_company")}
          />
        </div>
      </div>

      {/* Compensation */}
      <div>
        <div className="mb-5 border-b border-slate-200 pb-3 dark:border-navy-600">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-navy-100">
            Compensation
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-navy-300">
            Current and expected compensation details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            type="number"
            label="Current Salary"
            min={0}
            placeholder="500000"
            prefix="₹"
            error={errors.current_salary?.message}
            {...register("current_salary", {
              valueAsNumber: true,
            })}
          />

          <Input
            type="number"
            label="Expected Salary"
            min={0}
            placeholder="700000"
            prefix="₹"
            error={errors.expected_salary?.message}
            {...register("expected_salary", {
              valueAsNumber: true,
            })}
          />
        </div>
      </div>

      {/* Availability */}
      <div>
        <div className="mb-5 border-b border-slate-200 pb-3 dark:border-navy-600">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-navy-100">
            Availability
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-navy-300">
            Candidate joining timeline and total experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            type="number"
            label="Notice Period (Days)"
            min={0}
            max={90}
            placeholder="30"
            error={errors.notice_period?.message}
            {...register("notice_period", {
              valueAsNumber: true,
            })}
          />

          <Input
            type="number"
            label="Total Experience (Years)"
            min={0}
            max={50}
            placeholder="5"
            error={errors.total_experience?.message}
            {...register("total_experience", {
              valueAsNumber: true,
            })}
          />
        </div>
      </div>
    </div>
  );
};