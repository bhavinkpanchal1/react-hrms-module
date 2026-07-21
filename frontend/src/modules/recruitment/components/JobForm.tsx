import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema, type JobFormData } from "../schema/job.schema";
import { Button } from "@/shared/ui/button/Button";
import { Input } from "@/shared/ui/input/Input";
import { Textarea } from "@/shared/ui/textarea/Textarea";
import { Select } from "@/shared/ui/select/Select";
import { DatePicker } from "@/shared/ui/date-picker/DatePicker";
import type { Job } from "../types";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
  { value: "on_hold", label: "On Hold" },
];
const DEPARTMENT_OPTIONS = [
  { value: "Engineering", label: "Engineering" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "Product", label: "Product" },
  { value: "Sales", label: "Sales" },
  { value: "Finance", label: "Finance" },
  { value: "Operations", label: "Operations" },
  { value: "Marketing", label: "Marketing" },
];

export interface JobFormProps {
  defaultValues?: Partial<Job>;
  onSubmit: (data: JobFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const JobForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
}: JobFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      department: defaultValues?.department ?? "",
      description: defaultValues?.description ?? "",
      experience: defaultValues?.experience ?? 0,
      location: defaultValues?.location ?? "",
      openings: defaultValues?.openings ?? 1,
      status: (defaultValues?.status as JobFormData["status"]) ?? "draft",
      closing_date: defaultValues?.closing_date ?? "",
    },
  });

  useEffect(() => {
    reset({
      title: defaultValues?.title ?? "",
      department: defaultValues?.department ?? "",
      description: defaultValues?.description ?? "",
      experience: defaultValues?.experience ?? 0,
      location: defaultValues?.location ?? "",
      openings: defaultValues?.openings ?? 1,
      status: (defaultValues?.status as JobFormData["status"]) ?? "draft",
      closing_date: defaultValues?.closing_date ?? "",
    });
  }, [
    defaultValues?.closing_date,
    defaultValues?.department,
    defaultValues?.description,
    defaultValues?.experience,
    defaultValues?.location,
    defaultValues?.openings,
    defaultValues?.status,
    defaultValues?.title,
    reset,
  ]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            label="Job Title"
            required
            placeholder="e.g. Frontend Developer"
            error={errors.title?.message}
            {...register("title")}
          />
        </div>
        <Select
          label="Department"
          required
          options={DEPARTMENT_OPTIONS}
          placeholder="— Select department —"
          error={errors.department?.message}
          {...register("department")}
        />
        <Input
          label="Location"
          required
          placeholder="e.g. Vadodara / Remote"
          error={errors.location?.message}
          {...register("location")}
        />
        <Input
          label="Experience Required (years)"
          required
          type="number"
          min={0}
          error={errors.experience?.message}
          {...register("experience", { valueAsNumber: true })}
        />
        <Input
          label="Number of Openings"
          required
          type="number"
          min={1}
          error={errors.openings?.message}
          {...register("openings", { valueAsNumber: true })}
        />
        <Select
          label="Status"
          required
          options={STATUS_OPTIONS}
          error={errors.status?.message}
          {...register("status")}
        />
        <Controller
          control={control}
          name="closing_date"
          render={({ field, fieldState }) => (
            <DatePicker
              mode="date"
              label="Closing Date"
              hint="Leave blank for no deadline"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
        <div className="sm:col-span-2">
          <Textarea
            label="Job Description"
            required
            rows={4}
            placeholder="Describe responsibilities, requirements, and what you offer..."
            error={errors.description?.message}
            {...register("description")}
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {defaultValues?.id ? "Update Job" : "Create Job"}
        </Button>
      </div>
    </form>
  );
};
