export type JobStatus = 'draft' | 'open' | 'closed' | 'on_hold';

export interface Job {
  id: number;
  title: string;
  department: string;
  departmentId?: number;
  description: string;        // was incorrectly typed as number
  experience: number;
  location: string;        // was incorrectly "locations"
  openings: number;
  status: JobStatus;
  created_at?: string;
  closing_date?: string | null;
}
