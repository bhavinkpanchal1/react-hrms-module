import { z } from "zod";
import { INTERVIEW_ROUND } from "../types/interview.type";

const ROUND_VALUES = INTERVIEW_ROUND.map((r) => r.value) as [string, ...string[]];

export const interviewSchema = z.object({
  scheduled_at: z.string().trim().min(1, "Date & time is required"),
  round: z.enum(ROUND_VALUES, "Round is required"),
  mode: z.enum(["online", "in_person"], "Interview Mode is required"),
  interviewer: z.string().trim().min(1, "Interviewer is required"),
})

export type InterviewFormData = z.infer<typeof interviewSchema>;

// Used when HR records the outcome of a scheduled interview.
export const interviewResponseSchema = z.object({
  status: z.enum(["completed", "cancelled", "no_show"], "Status is required"),
  result: z.enum(["pending", "pass", "fail"], "Result is required"),
  feedback: z.string().trim().min(1, "Feedback is required"),
});

export type InterviewResponseFormData = z.infer<typeof interviewResponseSchema>;