export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intern';

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: 'full_time', label: 'Full-Time' },
  { value: 'part_time', label: 'Part-Time' },
  { value: 'contract',  label: 'Contract'  },
  { value: 'intern',    label: 'Intern'    },
] as const;

export interface Employee {
  id: number;
  employee_code: string; // auto-generated, e.g. EMP-0001

  // Personal — mirrors Candidate where applicable so the onboarding page
  // can carry data straight across without renaming fields.
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob?: string;
  gender?: string;
  marital_status?: string;
  address_line1?: string;
  address_line2?: string;
  country_id?: number;
  state_id?: number;
  city_id?: number;
  pincode?: string;

  // Employment — not present on Candidate at all; always collected fresh.
  department: string;
  designation: string;
  reporting_manager?: string;
  work_location: string;
  employment_type: EmploymentType;
  date_of_joining: string;
  annual_salary: number;

  // Traceability back to the recruitment flow — undefined for employees
  // added directly, not through Job → Candidate → Offer.
  source_candidate_id?: number;
  source_offer_id?: number;

  created_at: string;
}