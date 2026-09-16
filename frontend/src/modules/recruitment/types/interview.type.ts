export const INTERVIEW_MODES = [{ value: "ONLINE", label: "Online" }, { value: "OFFLINE", label: "Offline" }] as const;
export type InterviewMode = (typeof INTERVIEW_MODES)[number]["value"];
export type InterviewStatus = "SCHEDULED" | "COMPLETED" | "NO_SHOW" | "CANCELLED";
export type NoShowAttribution = "CANDIDATE" | "INTERVIEWER" | "BOTH" | "UNKNOWN";

export interface Interview {
  id: number; companyId: number; applicationId: number; roundNumber: number; roundName: string; scheduledAt: string;
  reviewerEmployeeId: string; mode: InterviewMode; meetingLink?: string | null; locationDetails?: string | null; notes?: string;
  status: InterviewStatus; feedback?: string; noShowAttribution?: NoShowAttribution | null; noShowReason?: string | null;
  cancellationReason?: string | null; createdAt: string; updatedAt: string;
}
export type ScheduleInterviewInput = Pick<Interview, "applicationId" | "roundName" | "scheduledAt" | "reviewerEmployeeId" | "mode" | "meetingLink" | "locationDetails" | "notes">;
export type RescheduleInterviewInput = Pick<Interview, "scheduledAt" | "mode" | "meetingLink" | "locationDetails" | "notes">;
export type NextRoundInput = Omit<ScheduleInterviewInput, "applicationId">;
export interface ReviewerInterviewProjection { id: number; candidateName: string; jobTitle: string; roundNumber: number; roundName: string; scheduledAt: string; mode: InterviewMode; meetingLink?: string | null; locationDetails?: string | null; notes?: string; feedback?: string; resume?: { fileName: string; fileUrl: string } | null }
