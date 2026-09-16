import { useFormContext, Controller } from "react-hook-form";
import type { CandidateFormData } from "../../schema/candidate.schema";
import { Input, Select, DatePicker } from "@/shared/ui";
import {
  GENDERS_OPTIONS,
  MARITAL_STATUS_OPTIONS,
} from "../../constant/candidate";

import { getDateYearsAgo } from "@/shared/utils/date";
import { useLocation } from "@/shared/hooks/useLocation";

export const CandidatePersonalStep = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CandidateFormData>();

  const {countries,states, cities } = useLocation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 dark:border-navy-500">
        <h3 className="text-base font-medium tracking-wide text-slate-700 dark:text-navy-100">
          Personal Information
        </h3>

        <p className="mt-1 text-sm text-slate-500 dark:text-navy-300">
          Personal and contact details of the candidate.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {/* DOB */}
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

        {/* Gender */}
        <Select
          options={GENDERS_OPTIONS}
          label="Gender"
          placeholder="Select Gender"
          error={errors.gender?.message}
          {...register("gender")}
        />

        {/* Marital Status */}
        <Select
          options={MARITAL_STATUS_OPTIONS}
          label="Marital Status"
          placeholder="Select Marital Status"
          error={errors.marital_status?.message}
          {...register("marital_status")}
        />

        {/* Country */}
        <Controller
  control={control}
  name="country_id"
  render={({ field, fieldState }) => (
    <Select
      label="Country"
      options={countries}
      value={field.value}
      onChange={field.onChange}
      error={fieldState.error?.message}
    />
  )}
/>
        

        {/* State */}
        <Controller
  control={control}
  name="country_id"
  render={({ field, fieldState }) => (
    <Select
      label="State"
      options={states}
      value={field.value}
      onChange={field.onChange}
      error={fieldState.error?.message}
    />
  )}
/>
        

        {/* City */}
        <Controller
          control={control}
          name="city_id"
          render={({ field, fieldState }) => (
            <Select
              mode="searchable"
              label="City"
              options={cities}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )
          }
        />

        {/* Pincode */}
        <Input
          label="Pincode"
          placeholder="380015"
          error={errors.pincode?.message}
          {...register("pincode")}
        />

        {/* Address 1 */}
        <div className="md:col-span-2 xl:col-span-3">
          <Input
            label="Address Line 1"
            placeholder="Street, Building, Area"
            error={errors.address_line1?.message}
            {...register("address_line1")}
          />
        </div>

        {/* Address 2 */}
        <div className="md:col-span-2 xl:col-span-3">
          <Input
            label="Address Line 2"
            placeholder="Apartment, Landmark (Optional)"
            error={errors.address_line2?.message}
            {...register("address_line2")}
          />
        </div>
      </div>
    </div>
  );
};
