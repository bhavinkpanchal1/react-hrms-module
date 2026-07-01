import { z } from "zod";

export const jobSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  departmentId: z.number().min(1, "Please select a department"),

  description: z.string().trim().min(10, "Description is required"),

  experience: z.number().min(0, "Experice cannot be negative"),

  location: z.string().trim().min(2, "Location is required"),

  openings: z.number().min(1, "At least one opening is required"),

  status: z.enum(["draft", "open", "closed"]),
});

export type JobFormData = z.infer<typeof jobSchema>;