import { useFormContext } from "react-hook-form"
import type { CandidateFormData } from "../../schema/candidate.schema"
import { Input, Select } from "@/shared/ui";
import { CITY_OPTIONS, COUNTRY_OPTIONS, GENDERS_OPTIONS, MARITAL_STATUS_OPTIONS, STATE_OPTIONS } from "../../constant/candidate";

export const CandidatePersonalStep = () => {
  const { register, formState: { errors }, } = useFormContext<CandidateFormData>();

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Input
        label="Date of Birth"
        error={errors.dob?.message}
        {...register("dob")}
      />

      <Select options={GENDERS_OPTIONS}
        label="Gender"
        error={errors.gender?.message}
        {...register("gender")}
      />

      <Select options={MARITAL_STATUS_OPTIONS}
        label="marital_status"
        error={errors.marital_status?.message}
        {...register("marital_status")}
      />

      <Input
        label="Address Line 1"
        error={errors.address_line1?.message}
        {...register("address_line1")}
      />

      <Input
        label="Address Line 2"
        error={errors.address_line2?.message}
        {...register("address_line2")}
      />

      <Select options={COUNTRY_OPTIONS}
        label="Country"
        error={errors.country_id?.message}
        {...register("country_id")}
      />

      <Select options={STATE_OPTIONS}
        label="State"
        error={errors.state_id?.message}
        {...register("state_id")}
      />


      <Select options={CITY_OPTIONS}
        label="City"
        error={errors.city_id?.message}
        {...register("city_id")}
      />


    </div>
  )
}