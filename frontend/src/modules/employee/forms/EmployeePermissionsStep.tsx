import { Wifi } from "lucide-react";
import { Checkbox } from "@/shared/ui";
import type { EmployeeStepProps } from "../types/employeeStep.type";

export const EmployeePermissionsStep = ({ register }: EmployeeStepProps) => {
  return (
    <section className="card p-6">
      <h3 className="mb-1 text-base font-semibold text-slate-800 dark:text-navy-100">
        Permissions
      </h3>
      <p className="mb-6 text-sm text-slate-500 dark:text-navy-300">
        Attendance and access exceptions for this employee.
      </p>

      <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 dark:border-navy-600">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-info/10 text-info">
          <Wifi className="size-4" />
        </div>
        <div className="flex-1">
          <Checkbox
            label="Allow Remote Clock-in"
            {...register("clockin_remotely")}
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-navy-400">
            When enabled, this employee can clock in from outside their assigned office's
            geofence. When disabled, clock-in is only allowed from within the office radius.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EmployeePermissionsStep;