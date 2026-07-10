import { z } from "zod";

export const interviewSchema = z.object({
  //candidate: z.string().trim().optional(),
  //department: z.string().trim().min(1, 'Department is required'),
  //designation: z.string().trim().min(1, "Designation is required"),
  date: z.string().trim().min(1, "Date is required"),
  time: z.string().trim().min(1, "Time is required"),
  round: z.string().trim().min(1, "Round is required"),
  mode: z.string().trim().min(1, "Interview Mode is required"),
  interviewer: z.string().trim().min(1, "Interviewer is required"),
})

export type InterviewFormData = z.infer<typeof interviewSchema>;