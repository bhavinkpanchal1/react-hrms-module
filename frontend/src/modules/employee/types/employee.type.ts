import type { EmployeeFormData } from "../schema/employee.schema";

/* ==========================================================================
   Employment Types
   ========================================================================== */

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: "full_time", label: "Full-Time" },
  { value: "part_time", label: "Part-Time" },
  { value: "contract", label: "Contract" },
  { value: "intern", label: "Intern" },
] as const;

export type EmploymentType =
  (typeof EMPLOYMENT_TYPE_OPTIONS)[number]["value"];

/* ==========================================================================
   Employee
   ========================================================================== */

export type Employee = Omit<EmployeeFormData, "employee_id"> & {
  /** Primary Key */
  id: number;

  /** Auto Generated (EMP000001) */
  employee_id: string;

  /* -----------------------------------------------------------------------
     Personal Information
     ----------------------------------------------------------------------- */

  source_candidate_id?: number;
  source_offer_id?: number;

  /* -----------------------------------------------------------------------
     Audit
     ----------------------------------------------------------------------- */

  created_at: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
  is_active: boolean;
};

export type CreateEmployeeInput = EmployeeFormData & {
  source_candidate_id?: number;
  source_offer_id?: number;
};

export type UpdateEmployeeInput = Partial<EmployeeFormData>;
