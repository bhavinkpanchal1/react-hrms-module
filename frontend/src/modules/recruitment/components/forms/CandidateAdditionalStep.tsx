import { useFormContext } from "react-hook-form";
import type { CandidateFormData } from "../../schema/candidate.schema";
import { Input, Textarea } from "@/shared/ui";

export const CandidateAdditionalStep = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CandidateFormData>();
  return (
    <div className="space-y-8">

  {/* Resume & Reference */}
  <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-navy-600 dark:bg-navy-700">
    <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-navy-100">
      Resume & Reference
    </h3>

    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Input
        label="Resume URL"
        placeholder="https://drive.google.com/..."
        error={errors.resume_url?.message}
        {...register("resume_url")}
      />

      <Input
        label="Referred By"
        placeholder="Employee name or reference source"
        error={errors.referenced_by?.message}
        {...register("referenced_by")}
      />
    </div>
  </div>

  {/* Professional Links */}
  <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-navy-600 dark:bg-navy-700">
    <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-navy-100">
      Professional Links
    </h3>

    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Input
        label="LinkedIn Profile"
        placeholder="https://linkedin.com/in/johndoe"
        error={errors.linkedin_url?.message}
        {...register("linkedin_url")}
      />

      <Input
        label="GitHub Profile"
        placeholder="https://github.com/johndoe"
        error={errors.github_url?.message}
        {...register("github_url")}
      />

      <div className="md:col-span-2">
        <Input
          label="Portfolio Website"
          placeholder="https://johndoe.com"
          error={errors.portfolio_url?.message}
          {...register("portfolio_url")}
        />
      </div>
    </div>
  </div>

  {/* Skills */}
  <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-navy-600 dark:bg-navy-700">
    <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-navy-100">
      Skills & Certifications
    </h3>

    <div className="space-y-5">
      <Textarea
        label="Skills"
        rows={3}
        placeholder="React, TypeScript, Tailwind CSS, Node.js"
        //helperText="Separate multiple skills with commas."
        error={errors.skills?.message}
        {...register("skills")}
      />

      <Textarea
        label="Certifications"
        rows={3}
        placeholder="AWS Certified Developer, Google UX Certification"
        //helperText="Separate multiple certifications with commas."
        error={errors.certifications?.message}
        {...register("certifications")}
      />
    </div>
  </div>
</div>
  );
};
