import { Checkbox, Input, Select } from "@/shared/ui";
import { useLocation } from "@/shared/hooks/useLocation";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import type { EmployeeFormData } from "../schema/employee.schema";


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
  const { countries, states, cities } = useLocation();
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
        <Controller control={control} name="corresponding_country" key="corresponding_country"
          render={({ field, fieldState }) => (
            <Select
              label="Country"
              required
              options={countries}
              placeholder="Select Country"
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}>

        </Controller>

        <Controller control={control} name="corresponding_state" key="corresponding_state"
          render={({ field, fieldState }) => (
            <Select
              label="State"
              required
              options={states}
              placeholder="Select State"
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}>

        </Controller>

        <Controller control={control} name="corresponding_city" key="corresponding_city"
          render={({ field, fieldState }) => (
            <Select
              label="city"
              required
              options={cities}
              placeholder="Select City"
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        >

        </Controller>
        <Input label="Pincode"
          error={errors.corresponding_pincode?.message}
          {...register("corresponding_pincode")}
        />

      </div>
      <div className="my-4">
        <Checkbox className="flex "
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
        <Controller
          control={control}
          name="permanent_country"
          render={({ field, fieldState }) => (
            <Select
              label="Country"
              required
              options={countries}
              placeholder="Select Country"
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        ></Controller>

        <Controller
          control={control}
          name="permanent_state"
          render={({ field, fieldState }) => (
            <Select
              label="State"
              required
              options={states}
              placeholder="Select State"
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        ></Controller>
        <Controller
          control={control}
          name="permanent_city"
          render={({ field, fieldState }) => (
            <Select
              mode="searchable"
              label="City"
              options={cities}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        ></Controller>
        <Input label="Pincode" required
          error={errors.permanent_pincode?.message}
          {...register("permanent_pincode")}
        />
      </div>
    </section>
  );
};
