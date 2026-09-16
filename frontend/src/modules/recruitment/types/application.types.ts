export type ApplicationStatus =
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "OFFERED"
  | "OFFER_ACCEPTED"
  | "CONVERTED"
  | "REJECTED";

export interface Application {
  id: number;
  companyId: number;
  candidateId: number;
  jobId: number;
  status: ApplicationStatus;
  appliedAt: string;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationInput {
  candidateId: number;
  jobId: number;
}
