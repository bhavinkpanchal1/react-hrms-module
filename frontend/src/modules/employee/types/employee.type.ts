import type {
  Gender,
  MaritalStatus,
} from "@/modules/recruitment/constant/candidate";

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

export interface Employee {
  /** Primary Key */
  id: number;

  /** Auto Generated (EMP000001) */
  employee_id: string;

  /* -----------------------------------------------------------------------
     Personal Information
     ----------------------------------------------------------------------- */

  first_name: string;
  middle_name?: string;
  last_name: string;
  name_as_per_aadhar: string;

  email: string;
  phone: string;

  dob: string;
  gender: Gender;
  marital_status: MaritalStatus;

  aadhar_card_number: string;
  pan_card_number: string;

  /* -----------------------------------------------------------------------
     Correspondence Address
     ----------------------------------------------------------------------- */

  corresponding_address_line1: string;
  corresponding_address_line2?: string;
  corresponding_country: string;
  corresponding_state: string;
  corresponding_city: string;
  corresponding_pincode: string;

  /* -----------------------------------------------------------------------
     Permanent Address
     ----------------------------------------------------------------------- */

  permanent_address_line1: string;
  permanent_address_line2?: string;
  permanent_country: string;
  permanent_state: string;
  permanent_city: string;
  permanent_pincode: string;

  /* -----------------------------------------------------------------------
     Employment Information
     ----------------------------------------------------------------------- */

  company: string;
  work_location: string;
  department: string;
  designation: string;
  reporting_manager?: string;
  employment_type: EmploymentType;
  date_of_joining: string;
  annual_salary: number;

  /* -----------------------------------------------------------------------
     Bank Details
     ----------------------------------------------------------------------- */

  account_holder_name: string;
  account_number: string;
  bank_name: string;
  branch_name: string;
  ifsc_code: string;

  /* -----------------------------------------------------------------------
     PF / ESIC
     ----------------------------------------------------------------------- */

  uan_number?: string;
  pf_number?: string;
  pf_joining_date?: string;
  esic_number?: string;
  esic_joining_date?: string;

  /* -----------------------------------------------------------------------
     Emergency Contact
     ----------------------------------------------------------------------- */

  emergency_contact_name: string;
  emergency_contact_number: string;
  emergency_contact_relation: string;

  /* -----------------------------------------------------------------------
     Recruitment Mapping
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
}