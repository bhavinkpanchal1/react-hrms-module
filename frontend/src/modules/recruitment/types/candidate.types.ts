export type CandidateStatus =
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected';

export type OfferStatus     = 'pending' | 'accepted' | 'declined' | 'expired';

export interface Candidate {
  id:          number;
  first_name:  string;
  last_name:   string;
  email:       string;
  phone:       string;
  jobId:       number;
  job_title:   string;
  status:      CandidateStatus;
  source:      string;
  resume_url:  string | null;
  applied_at:  string;
  notes:       string;
}



export interface Offer {
  id:              number;
  candidateId:     number;
  candidate_name:  string;
  job_title:       string;
  offered_salary:  number;
  joining_date:    string;
  status:          OfferStatus;
  issued_at:       string;
}

// Form input shapes
export type CreateCandidateInput = Pick<
  Candidate,
  'first_name' | 'last_name' | 'email' | 'phone' | 'jobId' | 'source' | 'notes'
>;
