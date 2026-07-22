import { Controller } from "react-hook-form";

import { DatePicker, Input, Select } from "@/shared/ui";

import type { EmployeeStepProps } from "../types/employeeStep.type";
import { COMPANY_OPTIONS } from "@/shared/constants/company";
import { DEPARTMENT_OPTIONS } from "@/shared/constants/department";
import { DESIGNATION_OPTIONS } from "@/shared/constants/designation";
import { WORK_LOCATIONS_OPTIONS } from "../constants/work-locations";
import { EMPLOYMENT_TYPE_OPTIONS } from "../types/employee.type";
import { getDateYearsAgo, getToday } from "@/shared/utils/date";
import { date } from "zod";

export const EmployeeEmploymentStep = ({
  register,
  control,
  errors,
}: EmployeeStepProps) => {
  return (
    <section className="card p-6">
      <h3 className="mb-4 text-base font-semibold text-slate-800 dark:text-navy-100">
        Employment Information
      </h3>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Input
          label="Employee ID"
          placeholder="Auto Generated"
          disabled
          {...register("employee_id")}
        />

        <Controller
          control={control}
          name="company"
          render={({ field, fieldState }) => (
            <Select
              label="Company"
              required
              placeholder="Select Company"
              options={COMPANY_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="department"
          render={({ field, fieldState }) => (
            <Select
              label="Department"
              required
              placeholder="Select Department"
              options={DEPARTMENT_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="designation"
          render={({ field, fieldState }) => (
            <Select
              label="Designation"
              required
              placeholder="Select Designation"
              options={DESIGNATION_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Input
          label="Reporting Manager"
          placeholder="Enter Reporting Manager"
          error={errors.reporting_manager?.message}
          {...register("reporting_manager")}
        />

        <Controller
          control={control}
          name="work_location"
          render={({ field, fieldState }) => (
            <Select
              mode="searchable"
              label="Work Location"
              required
              placeholder="Select Work Location"
              options={WORK_LOCATIONS_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="employment_type"
          render={({ field, fieldState }) => (
            <Select
              label="Employment Type"
              required
              placeholder="Select Employment Type"
              options={EMPLOYMENT_TYPE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="date_of_joining"
          render={({ field, fieldState }) => (
            <DatePicker
              mode="date"
              label="Date of Joining"
              required
              placeholder="Select Joining Date"
              maxDate={getToday()}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Input
          type="number"
          label="Annual Salary"
          required
          placeholder="Enter Annual Salary"
          error={errors.annual_salary?.message}
          {...register("annual_salary", {
            valueAsNumber: true,
          })}
        />
      </div>
    </section>
  );
};
