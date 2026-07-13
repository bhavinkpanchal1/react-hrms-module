export type CandidateStatus =
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected';

export type OfferStatus = 'pending' | 'accepted' | 'declined' | 'expired';

export type Gender =
  | "male"
  | "female"
  | "other";

export type MaritalStatus =
  | "single"
  | "married";

export interface Candidate {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;
  gender: Gender;
  marital_status: MaritalStatus;

  address_line1: string;
  address_line2?: string;
  country_id: number;
  state_id: number;
  city_id: number;
  pincode: string;

  current_position?: string;
  current_company?: string;
  current_salary?: number;
  expected_salary?: number;
  notice_period?: number;
  total_experience?: number;

  highest_education?: string;
  institution?: string;
  graduation_year?: number;

  jobId: number;
  job_title: string;
  source: string;
  applied_at: string;
  resume_url?: string | null;
  referenced_by?: string;

  skills?: string[];
  certifications?: string[];
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;

  notes: string;

  status: CandidateStatus;
}



export interface Offer {
  id: number;
  candidateId: number;
  candidate_name: string;
  job_title: string;
  offered_salary: number;
  joining_date: string;
  status: OfferStatus;
  issued_at: string;
}

// Form input shapes
// export type CreateCandidateInput = Pick<
//   Candidate,
//   'first_name' | 'last_name' | 'email' | 'phone' | 'jobId' | 'source' | 'notes'
// >;

export type CreateCandidateInput = Omit<
  Candidate,
  | "id"
  | "job_title"
  | "status"
  | "applied_at"
>;