export type JobStatus = "draft" | "open" | "closed";

export interface Job {
  id: number;
  title: string;
  departmentId: number;
  description: number;
  experience: number;
  locations: string;
  openings: number;
  status: string;
}
