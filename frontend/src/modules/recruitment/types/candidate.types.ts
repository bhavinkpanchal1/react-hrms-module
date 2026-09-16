import type { Gender, MaritalStatus } from "../constant/candidate";

export interface Candidate {
  id: number;
  companyId: number;
  status: CandidateLifecycleStatus;
  deactivationReason?: string | null;

  // Basic
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
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
  referenced_by?: string;

  linkedin_url?: string | null;
  github_url?: string | null;
  portfolio_url?: string | null;

  skills?: string[];
  certifications?: string[];

}

// The existing create form supplies jobId as initial Application context.
// It is never persisted on Candidate.
export type CandidateLifecycleStatus = "ACTIVE" | "INACTIVE";

export type CreateCandidateInput = Omit<Candidate, "id" | "companyId" | "status" | "deactivationReason"> & {
  jobId: number;
  allowDuplicate?: boolean;
};

export type CandidateDuplicateMatch = Pick<Candidate, "id" | "first_name" | "last_name" | "email" | "phone" | "status"> & {
  matchedBy: ("EMAIL" | "MOBILE")[];
};
