export type AppRole = "hr" | "manager" | "employee";

export type Permission =
  | "employee.view"
  | "employee.write"
  | "payroll.view"
  | "payroll.run"
  | "leave.approve"
  | "settings.manage"
  | "recruitment.read"
  | "dashboard.view"
  | "attendance.read";
