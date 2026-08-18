import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Textarea } from "@/shared/ui";
import {
  holidayListSchema,
  type HolidayListFormData,
} from "../schema/company.schema";
import type { HolidayList } from "../types/company.types";

interface HolidayListFormProps {
  holidayList?: HolidayList | null;
  onSubmit: (data: HolidayListFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submissionError?: string;
}

const getDefaultValues = (
  holidayList?: HolidayList | null,
): HolidayListFormData => ({
  name: holidayList?.name ?? "",
  year: holidayList?.year ?? new Date().getFullYear(),
  remarks: holidayList?.remarks ?? "",
});

export const HolidayListForm = ({
  holidayList,
  onSubmit,
  onCancel,
  isSubmitting,
  submissionError,
}: HolidayListFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HolidayListFormData>({
    resolver: zodResolver(holidayListSchema),
    defaultValues: getDefaultValues(holidayList),
  });

  useEffect(() => {
    reset(getDefaultValues(holidayList));
  }, [holidayList, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Input
        label="Holiday List Name"
        required
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        label="Year"
        type="number"
        min={1000}
        max={9999}
        required
        error={errors.year?.message}
        {...register("year", { valueAsNumber: true })}
      />
      <Textarea
        label="Remarks"
        error={errors.remarks?.message}
        {...register("remarks")}
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
          {holidayList ? "Update Holiday List" : "Create Holiday List"}
        </Button>
      </div>
    </form>
  );
};
