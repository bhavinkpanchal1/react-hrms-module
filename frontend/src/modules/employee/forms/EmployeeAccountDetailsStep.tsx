import { Controller } from "react-hook-form";
import type { EmployeeStepProps } from "../types/employeeStep.type";
import { DatePicker, Input } from "@/shared/ui";
import { getToday } from "@/shared/utils/date";

export const EmployeeAccountDetailsStep = ({
  register,
  control,
  errors,
}: EmployeeStepProps) => {
  return (
    <section className="card p-6">
      <h3 className="mb-4 text-base font-semibold text-slate-800 dark:text-navy-100">
        Account Details
      </h3>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Input
          label="UAN Number"
          placeholder="Enter UAN Number"
          maxLength={12}
          allowPattern={/[0-9]/}
          error={errors.uan_number?.message}
          {...register("uan_number")}
        />

        <Input
          label="PF Number"
          placeholder="Enter PF Number"
          maxLength={30}
          allowPattern={/[A-Z0-9]/}
          error={errors.pf_number?.message}
          {...register("pf_number")}
        />

        <Controller
          control={control}
          name="pf_joining_date"
          render={({ field, fieldState }) => (
            <DatePicker
              label="PF Joining Date"
              value={field.value}
              maxDate={getToday()}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Input
          label="ESIC Number"
          placeholder="Enter ESIC Number"
          maxLength={17}
          allowPattern={/[0-9]/}
          error={errors.esic_number?.message}
          {...register("esic_number")}
        />

        <Controller
          control={control}
          name="esic_joining_date"
          render={({ field, fieldState }) => (
            <DatePicker
              label="ESIC Joining Date"
              value={field.value}
               maxDate={getToday()}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />


        <div className="col-span-full mt-6">
          <hr className="my-4" />
          <h4 className="mb-4 text-sm font-semibold text-slate-700 dark:text-navy-100">
            Bank Details
          </h4>
        </div>

        <Input
          label="IFSC Code"
          placeholder="e.g. SBIN0001234"
          textTransform="uppercase"
          maxLength={11}
          allowPattern={/[A-Z0-9]/}
          error={errors.ifsc_code?.message}
          {...register("ifsc_code", {
            setValueAs: (value) => value?.toUpperCase(),
          })}
        />

        <Input
          label="Bank Name"
          placeholder="Enter Bank Name"
          error={errors.bank_name?.message}
          {...register("bank_name")}
        />

        <Input
          label="Branch Name"
          placeholder="Enter Branch Name"
          error={errors.branch_name?.message}
          {...register("branch_name")}
        />

        <Input
          label="Account Number"
          placeholder="Enter Account Number"
          maxLength={20}
          allowPattern={/[0-9]/}
          error={errors.account_number?.message}
          {...register("account_number")}
        />

        <Input
          label="Account Holder Name"
          placeholder="Enter Account Holder Name"
          maxLength={75}
          allowPattern={/[A-Za-z .'-]/}
          error={errors.account_holder_name?.message}
          {...register("account_holder_name")}
        />
        </div>
    </section>
  );
};