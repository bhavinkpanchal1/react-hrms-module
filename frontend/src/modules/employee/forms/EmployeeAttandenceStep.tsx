import { DatePicker } from "@/shared/ui";
import { Controller } from "react-hook-form";
import type { EmployeeStepProps } from "../types/employeeStep.type";
import { getToday } from "@/shared/utils/date";

const EmployeeAttandenceStep = ({register, control, errors}: EmployeeStepProps) => {
  return (
    <section className="card p-6">
      <h3 className="mb-4 text-base font-semibold text-slate-800 dark:text-navy-100">
        Attendance Details
      </h3>
      <div>
        <Controller
          control={control}
          name="date_of_joining"
          render={({ field, fieldState }) => (
            <DatePicker
              mode="date"
              label="Select Month"
              required
              placeholder="Select Joining Date"
              maxDate={getToday()}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
        <DatePicker mode={"month"} label="Select Month" onChange={}/>
      </div>
    </section>
  )
}

export default EmployeeAttandenceStep;