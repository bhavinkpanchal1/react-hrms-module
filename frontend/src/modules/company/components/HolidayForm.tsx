import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, DatePicker, Input, Textarea } from "@/shared/ui";
import { holidaySchema, type HolidayFormData } from "../schema/company.schema";
import type { Holiday, HolidayList } from "../types/company.types";

interface HolidayFormProps {
  holidayList: HolidayList;
  holiday?: Holiday | null;
  onSubmit: (data: HolidayFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submissionError?: string;
}

const getDefaultValues = (holiday?: Holiday | null): HolidayFormData => ({
  date: holiday?.date ?? "",
  name: holiday?.name ?? "",
  description: holiday?.description ?? "",
});

export const HolidayForm = ({
  holidayList,
  holiday,
  onSubmit,
  onCancel,
  isSubmitting,
  submissionError,
}: HolidayFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HolidayFormData>({
    resolver: zodResolver(holidaySchema),
    defaultValues: getDefaultValues(holiday),
  });

  useEffect(() => {
    reset(getDefaultValues(holiday));
  }, [holiday, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-navy-700 dark:text-navy-200">
        {holidayList.name} · {holidayList.year}
      </div>
      <Controller
        control={control}
        name="date"
        render={({ field, fieldState }) => (
          <DatePicker
            mode="date"
            label="Holiday Date"
            required
            minDate={`${holidayList.year}-01-01`}
            maxDate={`${holidayList.year}-12-31`}
            value={field.value}
            onChange={(value) =>
              field.onChange(typeof value === "string" ? value : "")
            }
            error={fieldState.error?.message}
          />
        )}
      />
      <Input
        label="Holiday Name"
        required
        error={errors.name?.message}
        {...register("name")}
      />
      <Textarea
        label="Description"
        error={errors.description?.message}
        {...register("description")}
      />
      {submissionError && (
        <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {submissionError}
        </div>
      )}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {holiday ? "Update Holiday" : "Create Holiday"}
        </Button>
      </div>
    </form>
  );
};
