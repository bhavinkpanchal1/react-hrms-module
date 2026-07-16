import type { Gender, MaritalStatus, CandidateStatus } from "../constant/candidate";

export interface Candidate {
  id: number;

  // Basic
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  jobId: number;
  source: string;
  notes?: string;

  // Personal
  dob?: string;
  gender?: Gender;
  marital_status?: MaritalStatus;

  address_line1: string;
  address_line2?: string;

  country_id: number;
  state_id: number;
  city_id: number;

  pincode: string;

  // Professional
  current_position?: string;
  current_company?: string;

  current_salary: number;
  expected_salary?: number;
  notice_period?: number;
  total_experience?: number;

  // Education
  highest_education: string;
  institution: string;
  graduation_year: number;

  // Additional
  resume_url?: string | null;
  referenced_by?: string;

  linkedin_url?: string | null;
  github_url?: string | null;
  portfolio_url?: string | null;

  skills?: string[];
  certifications?: string[];

  // System Fields
  job_title: string;
  applied_at: string;
  status: CandidateStatus;
}

export type CreateCandidateInput = Omit<
  Candidate,
  | "id"
  | "job_title"
  | "status"
  | "applied_at"
>;