import { Input, Select } from "@/shared/ui";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import type { EmployeeFormData } from "../schema/employee.schema";
import { COUNTRY_OPTIONS } from "@/modules/recruitment/constant/candidate";

type EmployeeAddressStepprops = {
  register: UseFormRegister<EmployeeFormData>;
  control: Control<EmployeeFormData>;
  errors: FieldErrors<EmployeeFormData>;
};

export const EmployeeAddressStep = ({
  register,
  control,
  errors,
}: EmployeeAddressStepprops) => {
  return (
    <section className="card p-6">
      <h3 className="mb-4 text-base font-semibold text-slate-800 dark:text-navy-100">
        Personal Information
      </h3>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Input
          label="Address line 1"
          required
          error={errors.corresponding_address_line1?.message}
          {...register("corresponding_address_line1")}
        />
        <Input
          label="Address line 2"
          error={errors.corresponding_address_line2?.message}
          {...register("corresponding_address_line2")}
        />
        <Select
          label="Country"
          required
          options={COUNTRY_OPTIONS}
          error={errors.corresponding_country?.message}
        />
        <Select
          label="State"
          required
          options={COUNTRY_OPTIONS}
          error={errors.corresponding_state?.message}
        />
        <Select
          label="city"
          required
          options={COUNTRY_OPTIONS}
          error={errors.corresponding_city?.message}
        />
      </div>
      <div>
        <Input
          type="checkbox"
          label="Same As Above"
          {...register("same_as_above")}
        />
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Input
          label="Address line 1"
          required
          error={errors.permanent_address_line1?.message}
          {...register("permanent_address_line1")}
        />
        <Input
          label="Address line 2"
          error={errors.permanent_address_line2?.message}
          {...register("permanent_address_line2")}
        />
        <Select
          label="Country"
          required
          options={COUNTRY_OPTIONS}
          error={errors.permanent_country?.message}
        />
        <Select
          label="State"
          required
          options={COUNTRY_OPTIONS}
          error={errors.permanent_state?.message}
        />
        <Controller
          control={control}
          name="permanent_city"
          render={() => (
            <Select
              label="city"
              required
              options={COUNTRY_OPTIONS}
              error={errors.permanent_city?.message}
            />
          )}
        ></Controller>
      </div>
    </section>
  );
};
