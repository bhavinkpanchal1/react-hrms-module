import type { EmployeeStepProps } from "../types/employeeStep.type";

const EmployeeDocumentStep = ({ register, errors }: EmployeeStepProps) => {
  return (
    <section className="card p-6">
      <h3 className="mb-4 text-base font-semibold text-slate-800 dark:text-navy-100">
        Emergency Contact Details
      </h3>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Input
          label="Contact Name"
          placeholder="Enter Contact Name"
          allowPattern={/[A-Za-z ]/}
          error={errors.emergency_contact_name?.message}
          {...register("emergency_contact_name")}
        />
        <Input
          label="Contact Number"
          placeholder="Enter Contact Number"
          maxLength={10}
          allowPattern={/[0-9]/}
          error={errors.emergency_contact_number?.message}
          {...register("emergency_contact_number")}
        />
        <Input
          label="Relation"
          placeholder="Enter Relation with employee"
          error={errors.emergency_contact_relation?.message}
          {...register("emergency_contact_relation")}
        />
      </div>
    </section>
  )
}

export default EmployeeDocumentStep;