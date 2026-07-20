import { useSearchParams, useNavigate } from "react-router-dom";
import { Plus, Users, CheckCircle2 } from "lucide-react";
import { useEmployees } from "../hooks/useEmployees";
import { Button }            from "@/shared/ui/button/Button";
import { Badge }             from "@/shared/ui/badge/Badge";
import { TableRowSkeleton }  from "@/shared/ui/skeleton/Skeleton";
import EmptyState            from "@/shared/ui/empty-state/EmptyState";
import { EMPLOYMENT_TYPE_OPTIONS } from "../types/employee.type";

const EmployeeListPage = () => {
  const { data: employees = [], isLoading } = useEmployees();
  const [searchParams] = useSearchParams(); 
  const justCreatedId = Number(searchParams.get("created")) || 0;
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-navy-100">Employees</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-navy-300">
            {employees.length} employee{employees.length !== 1 ? "s" : ""} onboarded
          </p>
        </div>
        <Button onClick={() => navigate("/employees/new")} leftIcon={<Plus className="size-4" />}>
          Add Employee
        </Button>
      </div>

      {justCreatedId > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          <CheckCircle2 className="size-4 shrink-0" />
          Employee created successfully.
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="is-hoverable w-full text-sm">
            <thead>
              <tr className="border-b border-slate-150 dark:border-navy-600">
                {["Employee", "Department", "Designation", "Type", "Joining Date", "Source"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-navy-300">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-600">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
                : employees.length === 0
                ? (
                  <tr><td colSpan={6}>
                    <EmptyState icon={Users} title="No employees yet"
                      description="Employees onboarded from the recruitment flow, or added directly, will appear here." />
                  </td></tr>
                )
                : employees.map((e) => (
                  <tr key={e.id} className={e.id === justCreatedId ? "bg-success/5" : undefined}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800 dark:text-navy-100">{e.first_name} {e.last_name}</div>
                      <div className="text-xs text-slate-400 dark:text-navy-400">{e.employee_code} · {e.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-navy-300">{e.department}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-navy-300">{e.designation}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-navy-300">
                      {EMPLOYMENT_TYPE_OPTIONS.find((o) => o.value === e.employment_type)?.label ?? e.employment_type}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-navy-400">
                      {new Date(e.date_of_joining).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      {e.source_candidate_id
                        ? <Badge label="Recruitment" variant="primary" />
                        : <Badge label="Direct" variant="default" />}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeListPage;