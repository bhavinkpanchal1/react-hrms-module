import { useFormContext, Controller } from "react-hook-form";
import type { CandidateFormData } from "../../schema/candidate.schema";
import { Input, Select, DatePicker } from "@/shared/ui";
import {
  CITY_OPTIONS,
  COUNTRY_OPTIONS,
  GENDERS_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  STATE_OPTIONS,
} from "../../constant/candidate";
import { getDateYearsAgo } from "@/shared/utils/date";

export const CandidatePersonalStep = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CandidateFormData>();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 dark:border-navy-600">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-navy-100">
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
        <Select
          options={COUNTRY_OPTIONS}
          label="Country"
          placeholder="Select Country"
          error={errors.country_id?.message}
          {...register("country_id")}
        />

        {/* State */}
        <Select
          options={STATE_OPTIONS}
          label="State"
          placeholder="Select State"
          error={errors.state_id?.message}
          {...register("state_id")}
        />

        {/* City */}
        <Select
          options={CITY_OPTIONS}
          label="City"
          placeholder="Select City"
          error={errors.city_id?.message}
          {...register("city_id")}
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
