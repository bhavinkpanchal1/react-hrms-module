import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select } from "@/shared/ui";
import { createWeekOffGrid } from "../lib/week-off-grid";
import { weekOffSchema, type WeekOffFormData } from "../schema/company.schema";
import {
  WEEKDAYS,
  WEEK_OFF_OCCURRENCES,
  type WeekOff,
  type WeekOffState,
} from "../types/company.types";

interface WeekOffFormProps {
  weekOff?: WeekOff | null;
  onSubmit: (data: WeekOffFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submissionError?: string;
}

const STATE_OPTIONS: { value: WeekOffState; label: string }[] = [
  { value: "working", label: "Working" },
  { value: "half_day", label: "Half Day" },
  { value: "week_off", label: "Week Off" },
];

const OCCURRENCE_LABELS = ["1st", "2nd", "3rd", "4th", "5th"] as const;

const getDefaultValues = (weekOff?: WeekOff | null): WeekOffFormData => ({
  policy_name: weekOff?.policy_name ?? "",
  grid: (weekOff?.grid ?? createWeekOffGrid()).map((cell) => ({ ...cell })),
});

export const WeekOffForm = ({
  weekOff,
  onSubmit,
  onCancel,
  isSubmitting,
  submissionError,
}: WeekOffFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WeekOffFormData>({
    resolver: zodResolver(weekOffSchema),
    defaultValues: getDefaultValues(weekOff),
  });

  useEffect(() => {
    reset(getDefaultValues(weekOff));
  }, [reset, weekOff]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        label="Policy Name"
        required
        error={errors.policy_name?.message}
        {...register("policy_name")}
      />

      <div className="mt-5">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-navy-100">
            Monthly Week Pattern
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-navy-300">
            Configure each weekday for its 1st through 5th occurrence in a month.
          </p>
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-navy-600">
          <table className="min-w-[56rem] w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-navy-700">
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 dark:text-navy-300">
                  Occurrence
                </th>
                {WEEKDAYS.map((weekday) => (
                  <th
                    key={weekday.value}
                    className="px-2 py-2 text-left text-xs font-semibold text-slate-500 dark:text-navy-300"
                  >
                    {weekday.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-600">
              {WEEK_OFF_OCCURRENCES.map((occurrence, occurrenceIndex) => (
                <tr key={occurrence}>
                  <th className="whitespace-nowrap px-3 py-2 text-left font-medium text-slate-700 dark:text-navy-100">
                    {OCCURRENCE_LABELS[occurrenceIndex]}
                  </th>
                  {WEEKDAYS.map((weekday, weekdayIndex) => {
                    const cellIndex = occurrenceIndex * WEEKDAYS.length + weekdayIndex;
                    return (
                      <td key={weekday.value} className="px-2 py-2">
                        <Controller
                          control={control}
                          name={`grid.${cellIndex}.state` as const}
                          render={({ field }) => (
                            <Select
                              aria-label={`${OCCURRENCE_LABELS[occurrenceIndex]} ${weekday.label}`}
                              options={STATE_OPTIONS}
                              value={field.value}
                              onChange={field.onChange}
                              className="min-w-28"
                            />
                          )}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {errors.grid?.message && (
          <p className="mt-1 text-xs text-error">{errors.grid.message}</p>
        )}
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
          {weekOff ? "Update Week Off" : "Create Week Off"}
        </Button>
      </div>
    </form>
  );
};
