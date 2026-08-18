import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, DatePicker, Input } from "@/shared/ui";
import {
  companySchema,
  type CompanyFormData,
} from "../schema/company.schema";
import type { Company } from "../types/company.types";

interface CompanyFormProps {
  company?: Company | null;
  onSubmit: (data: CompanyFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submissionError?: string;
}

const getDefaultValues = (company?: Company | null): CompanyFormData => ({
  company_name: company?.company_name ?? "",
  industry_type: company?.industry_type ?? "",
  company_start_date: company?.company_start_date ?? "",
});

export const CompanyForm = ({
  company,
  onSubmit,
  onCancel,
  isSubmitting,
  submissionError,
}: CompanyFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: getDefaultValues(company),
  });

  useEffect(() => {
    reset(getDefaultValues(company));
  }, [company, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            label="Company Name"
            required
            placeholder="Enter company name"
            error={errors.company_name?.message}
            {...register("company_name")}
          />
        </div>

        <Input
          label="Industry"
          required
          placeholder="Enter industry"
          error={errors.industry_type?.message}
          {...register("industry_type")}
        />

        <Controller
          control={control}
          name="company_start_date"
          render={({ field, fieldState }) => (
            <DatePicker
              mode="date"
              label="Company Start Date"
              required
              value={field.value}
              onChange={(value) => field.onChange(typeof value === "string" ? value : "")}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      {submissionError && (
        <div className="mt-5 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {submissionError}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {company ? "Update Company" : "Create Company"}
        </Button>
      </div>
    </form>
  );
};

