export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'expired' | 'withdrawn';

export interface Offer {
  id: number;
  candidateId: number;
  candidate_name: string;
  job_title: string;
  position?: string;
  offered_salary: number;
  salary?: number;
  joining_date: string;
  status: OfferStatus;
  issued_at: string;
  expires_at?: string;
  notes?: string;
}
