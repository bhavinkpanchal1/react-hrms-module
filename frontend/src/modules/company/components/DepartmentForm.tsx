import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@/shared/ui";
import {
  departmentSchema,
  type DepartmentFormData,
} from "../schema/company.schema";
import type { Department } from "../types/company.types";

interface DepartmentFormProps {
  department?: Department | null;
  onSubmit: (data: DepartmentFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submissionError?: string;
}

export const DepartmentForm = ({
  department,
  onSubmit,
  onCancel,
  isSubmitting,
  submissionError,
}: DepartmentFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: { name: department?.name ?? "" },
  });

  useEffect(() => {
    reset({ name: department?.name ?? "" });
  }, [department, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        label="Department Name"
        required
        error={errors.name?.message}
        {...register("name")}
      />
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
          {department ? "Update Department" : "Create Department"}
        </Button>
      </div>
    </form>
  );
};
