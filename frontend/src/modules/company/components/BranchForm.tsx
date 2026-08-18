import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, DatePicker, Input, Select, Textarea } from "@/shared/ui";
import { branchSchema, type BranchFormData } from "../schema/company.schema";
import type { Branch } from "../types/company.types";

interface BranchFormProps {
  branch?: Branch | null;
  onSubmit: (data: BranchFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submissionError?: string;
}

const getDefaultValues = (branch?: Branch | null): BranchFormData => ({
  branch_name: branch?.branch_name ?? "",
  email: branch?.email ?? "",
  contact_number: branch?.contact_number ?? "",
  address: branch?.address ?? "",
  pincode: branch?.pincode ?? "",
  latitude: branch?.latitude ?? 0,
  longitude: branch?.longitude ?? 0,
  radius_meters: branch?.radius_meters ?? 100,
  employee_id_series: branch?.employee_id_series ?? "",
  start_date: branch?.start_date ?? "",
  status: branch?.status ?? "active",
});

export const BranchForm = ({
  branch,
  onSubmit,
  onCancel,
  isSubmitting,
  submissionError,
}: BranchFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: getDefaultValues(branch),
  });

  useEffect(() => {
    reset(getDefaultValues(branch));
  }, [branch, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label="Branch Name"
          required
          error={errors.branch_name?.message}
          {...register("branch_name")}
        />
        <Input
          label="Email"
          type="email"
          required
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Contact Number"
          required
          error={errors.contact_number?.message}
          {...register("contact_number")}
        />
        <Input
          label="Pincode"
          required
          error={errors.pincode?.message}
          {...register("pincode")}
        />
        <div className="sm:col-span-2">
          <Textarea
            label="Full Address"
            required
            rows={3}
            error={errors.address?.message}
            {...register("address")}
          />
        </div>

        <div className="sm:col-span-2 rounded-lg border border-slate-200 p-4 dark:border-navy-600">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-navy-100">
            Geofence Configuration
          </h3>
          <p className="mb-4 mt-1 text-xs text-slate-500 dark:text-navy-300">
            Set the Branch location centre and allowed radius in meters. This phase stores configuration only.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="Latitude"
              type="number"
              step="any"
              required
              error={errors.latitude?.message}
              {...register("latitude", { valueAsNumber: true })}
            />
            <Input
              label="Longitude"
              type="number"
              step="any"
              required
              error={errors.longitude?.message}
              {...register("longitude", { valueAsNumber: true })}
            />
            <Input
              label="Geofence Radius (meters)"
              type="number"
              step="any"
              required
              error={errors.radius_meters?.message}
              {...register("radius_meters", { valueAsNumber: true })}
            />
          </div>
        </div>

        <Input
          label="Employee ID Series"
          required
          hint="Configuration value only; employee ID generation is outside this phase."
          error={errors.employee_id_series?.message}
          {...register("employee_id_series")}
        />
        <Controller
          control={control}
          name="start_date"
          render={({ field, fieldState }) => (
            <DatePicker
              mode="date"
              label="Branch Start Date"
              required
              value={field.value}
              onChange={(value) =>
                field.onChange(typeof value === "string" ? value : "")
              }
              error={fieldState.error?.message}
            />
          )}
        />
        <Select
          label="Status"
          required
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
          error={errors.status?.message}
          {...register("status")}
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
          {branch ? "Update Branch" : "Create Branch"}
        </Button>
      </div>
    </form>
  );
};
