import { Controller } from "react-hook-form";
import { DatePicker, Input, Select } from "@/shared/ui";
import {
  GENDERS_OPTIONS,
  MARITAL_STATUS_OPTIONS,
} from "@/modules/recruitment/constant/candidate";
import { getDateYearsAgo } from "@/shared/utils/date";
import type { EmployeeStepProps } from "../types/employeeStep.type";

export const EmployeePersonalStep = ({
  register,
  control,
  errors,
}: EmployeeStepProps) => {
  return (
    <div>
      <section className="card p-6">
        <h3 className="mb-4 text-base font-semibold text-slate-800 dark:text-navy-100">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Input
            label="First Name"
            placeholder="e.g. Rahul"
            required
            error={errors.first_name?.message}
            {...register("first_name")}
          />

          <Input
            label="Middle Name"
            placeholder="e.g. Kumar"
            error={errors.middle_name?.message}
            {...register("middle_name")}
          />

          <Input
            label="Last Name"
            placeholder="e.g. Sharma"
            required
            error={errors.last_name?.message}
            {...register("last_name")}
          />

          <Input
            label="Name as per Aadhaar"
            placeholder="Full name as printed on card"
            required
            error={errors.name_as_per_aadhar?.message}
            {...register("name_as_per_aadhar")}
          />

          <Input
            label="Email"
            type="email"
            placeholder="name@example.com"
            required
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Mobile Number"
            placeholder="10-digit mobile number"
            required
            error={errors.phone?.message}
            {...register("phone")}
          />

          <Controller
            control={control}
            name="dob"
            render={({ field, fieldState }) => (
              <DatePicker
                mode="date"
                label="Date of Birth"
                //placeholder="DD/MM/YYYY"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                minDate={getDateYearsAgo(100)}
                maxDate={getDateYearsAgo(18)}
              />
            )}
          />
          <Controller
            control={control}
            name="dob"
            render={({ field, fieldState }) => (
              <DatePicker
                mode="date"
                minDate={getDateYearsAgo(100)}
                maxDate={getDateYearsAgo(18)}
                label="Date of Birth"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <Select
            label="Gender"
            placeholder="Select Gender"
            options={GENDERS_OPTIONS}
            error={errors.gender?.message}
            {...register("gender")}
          />

          <Select
            label="Marital Status"
            placeholder="Select Marital Status"
            options={MARITAL_STATUS_OPTIONS}
            error={errors.marital_status?.message}
            {...register("marital_status")}
          />

          <Input
            label="Aadhaar Number"
            placeholder="12-digit Aadhaar number"
            required
            error={errors.aadhar_card_number?.message}
            {...register("aadhar_card_number")}
          />

          <Input
            label="PAN Number"
            placeholder="e.g. ABCDE1234F"
            required
            error={errors.pan_card_number?.message}
            {...register("pan_card_number")}
          />
        </div>
      </section>
    </div>
  );
};
