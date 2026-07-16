export type Role = "hr" | "manager" | "employee";

//For single link
export interface NavPanelLink {
  kind: "link";
  label: string;
  to: string;
}

//For Group Link
export interface NavGroup {
  kind: "group";
  label: string;
  children: NavPanelLink[];
}

// One item in the panel list (either a link or a group)
export type NavItems = NavPanelLink | NavGroup;

export interface NavModule {
  id: string;
  label: string;
  icon: string;
  roles: Role[];
  sectionLabel: string;
  items: NavItems[];
}

//Module

export const ALL_MODULES: NavModule[] = [
  {
    id: "my-access",
    label: "My Access",
    icon: "user",
    roles: ["hr", "manager", "employee"],
    sectionLabel: "My Access",
    items: [
      { kind: "link", label: "Attendance", to: "/attendance" },
      { kind: "link", label: "Salary", to: "/employee/salary" },
      { kind: "link", label: "Notifications", to: "/notifications" },
      { kind: "link", label: "Company Policy", to: "/policy" },
      { kind: "link", label: "Appraisal", to: "/employee/cycles" },
      {
        kind: "group",
        label: "Tax & Compliance",
        children: [
          { kind: "link", label: "Tax Regime", to: "/employee/tax-regime" },
          {
            kind: "link",
            label: "Tax Declarations",
            to: "/employee/tax-declarations",
          },
          { kind: "link", label: "My Form 16s", to: "/employee/form16" },
        ],
      },
      { kind: "link", label: "Assets", to: "/employee/assets" },
    ],
  },

  // ── Manager Access (manager + hr) ─────────────
  {
    id: "manager",
    label: "Manager",
    icon: "users-plus",
    roles: ["hr", "manager"],
    sectionLabel: "Manager Access",
    items: [
      { kind: "link", label: "Attendance Report",         to: "/report/team-attendance" },
      { kind: "link", label: "Monthly Attendance Report", to: "/report/team-monthly-attendance" },
      { kind: "link", label: "Leave Approve",             to: "/hr/team_leave_approval_list" },
      { kind: "link", label: "Regularization Approve",    to: "/hr/team_regularization_approval_list" },
      { kind: "link", label: "Resignation Approve",       to: "/employee/team_resignation" },
      { kind: "link", label: "Appraisal Review",          to: "/supervisor/cycles" },
    ],
  },

  // ── HR Access (hr only) ───────────────────────
  {
    id: "hr",
    label: "HR",
    icon: "users",
    roles: ["hr"],
    sectionLabel: "HR Access",
    items: [
      { kind: "link", label: "Dashboard",    to: "/hr/dashboard" },
      { kind: "link", label: "Company",      to: "/hr/companies" },
      { kind: "link", label: "Employee",     to: "/hr/employees" },
      { kind: "link", label: "Annual Leave", to: "/hr/annual-leave" },
      {
        kind: "group",
        label: "Payroll",
        children: [
          { kind: "link", label: "Salary Generate",    to: "/payroll/salary" },
          { kind: "link", label: "Salary Register",    to: "/payroll/salary-sheet" },
          { kind: "link", label: "Tax Approvals",      to: "/payroll/tax-approvals" },
          { kind: "link", label: "Form 16 Dashboard",  to: "/payroll/form16" },
        ],
      },
      { kind: "link", label: "Salary Slip", to: "/payroll/salary-slip" },
      {
        kind: "group",
        label: "Approvals",
        children: [
          { kind: "link", label: "Leave",           to: "/hr/leave-approval" },
          { kind: "link", label: "Regularizations", to: "/hr/regularization-approval" },
          { kind: "link", label: "Resignation",     to: "/hr/resignation" },
        ],
      },
      { kind: "link", label: "Announcements", to: "/hr/announcements" },
      {
        kind: "group",
        label: "Appraisal",
        children: [
          { kind: "link", label: "Questions", to: "/hr/appraisal/questions" },
          { kind: "link", label: "Cycles",    to: "/hr/appraisal/cycles" },
        ],
      },
    ],
  },

  // ── Recruitment (hr + manager) ─────────────────
  {
    id: "recruitment",
    label: "Recruitment",
    icon: "briefcase",
    roles: ["hr", "manager"],
    sectionLabel: "Recruitment",
    items: [
      { kind: "link", label: "Job Listings", to: "/recruitment/jobs" },
      {
        kind: "group",
        label: "Candidates",
        children: [
          { kind: "link", label: "All Candidates", to: "/recruitment/candidates" },
          { kind: "link", label: "Pipeline",        to: "/recruitment/pipeline" },
          { kind: "link", label: "Interviews",      to: "/recruitment/interviews" },
        ],
      },
      { kind: "link", label: "Offers",       to: "/recruitment/offers" },
    ],
  },

  // ── Admin (hr + manager) ───────────────────────
  {
    id: "admin",
    label: "Admin",
    icon: "settings",
    roles: ["hr", "manager"],
    sectionLabel: "Admin",
    items: [
      { kind: "link", label: "Assets",         to: "/admin/assets" },
      { kind: "link", label: "Asset Requests", to: "/asset/request/list" },
      {
        kind: "group",
        label: "Vendor",
        children: [
          { kind: "link", label: "Service Category", to: "/vendor/service-category" },
          { kind: "link", label: "Vendor List",       to: "/vendor/list" },
        ],
      },
      { kind: "link", label: "Visitors", to: "/vendor/gate-scan" },
      {
        kind: "group",
        label: "Petty Cash / Expense",
        children: [
          { kind: "link", label: "Expense Claims", to: "/expense/claims" },
          { kind: "link", label: "Petty Cash",     to: "/expense/petty-cash" },
        ],
      },
    ],
  },

  // ── Reports (hr + manager) ──────────────────────
  {
    id: "reports",
    label: "Reports",
    icon: "bar-chart",
    roles: ["hr", "manager"],
    sectionLabel: "Reports",
    items: [
      {
        kind: "group",
        label: "Candidates",
        children: [
          { kind: "link", label: "Hiring Funnel",   to: "/reports/candidates/funnel" },
          { kind: "link", label: "Source Analysis", to: "/reports/candidates/source" },
          { kind: "link", label: "Offer Acceptance",to: "/reports/candidates/offers" },
        ],
      },
      {
        kind: "group",
        label: "Employee",
        children: [
          { kind: "link", label: "Headcount",          to: "/reports/employee/headcount" },
          { kind: "link", label: "Attrition",           to: "/reports/employee/attrition" },
          { kind: "link", label: "Attendance Summary",  to: "/reports/employee/attendance" },
        ],
      },
    ],
  },

];

export const getModulesForRole = (role: Role) => {
  return ALL_MODULES.filter((m) => m.roles.includes(role));
};