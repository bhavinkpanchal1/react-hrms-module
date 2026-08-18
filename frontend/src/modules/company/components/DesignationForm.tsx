import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select } from "@/shared/ui";
import {
  designationSchema,
  type DesignationFormData,
} from "../schema/company.schema";
import type { Department, Designation } from "../types/company.types";

interface DesignationFormProps {
  designation?: Designation | null;
  departments: Department[];
  departmentsLoading: boolean;
  departmentsError?: string;
  onSubmit: (data: DesignationFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submissionError?: string;
}

export const DesignationForm = ({
  designation,
  departments,
  departmentsLoading,
  departmentsError,
  onSubmit,
  onCancel,
  isSubmitting,
  submissionError,
}: DesignationFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DesignationFormData>({
    resolver: zodResolver(designationSchema),
    defaultValues: {
      name: designation?.name ?? "",
      department_id: designation?.department_id ?? null,
    },
  });

  useEffect(() => {
    reset({
      name: designation?.name ?? "",
      department_id: designation?.department_id ?? null,
    });
  }, [designation, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-5">
        <Input
          label="Designation Name"
          required
          error={errors.name?.message}
          {...register("name")}
        />
        <Controller
          control={control}
          name="department_id"
          render={({ field, fieldState }) => (
            <Select
              label="Department"
              placeholder="No Department"
              options={departments.map((department) => ({
                value: department.id,
                label: department.name,
              }))}
              value={field.value ?? ""}
              onChange={(event) =>
                field.onChange(event.target.value ? Number(event.target.value) : null)
              }
              disabled={departmentsLoading || Boolean(departmentsError)}
              hint="Optional in the provisional frontend contract."
              error={fieldState.error?.message ?? departmentsError}
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
          {designation ? "Update Designation" : "Create Designation"}
        </Button>
      </div>
    </form>
  );
};
