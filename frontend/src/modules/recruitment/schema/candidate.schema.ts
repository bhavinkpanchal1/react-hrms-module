import { z } from "zod";
import { GENDER_VALUES, MARITAL_STATUS_VALUES } from "../constant/candidate";

export const candidateBasicSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters"),
  last_name: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(10, "Enter a valid phone number").max(15),
  jobId: z.number().min(1, "Please select a job"),
  source: z.string().trim().min(1, "Please select source"),
  notes: z.string().trim().optional(),
});

export const candidatePersonalSchema = z.object({
  dob: z.string().optional(),
  gender: z.enum(GENDER_VALUES).optional(),
  marital_status: z.enum(MARITAL_STATUS_VALUES).optional(),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  country_id: z.coerce.number().optional(),
  state_id: z.coerce.number().optional(),
  city_id: z.coerce.number().optional(),
  pincode: z.string().optional(),
});

export const candidateProfessionalSchema = z.object({
  current_position: z.string().optional(),
  current_company: z.string().optional(),
  current_salary: z.coerce.number().optional(),
  expected_salary: z.coerce.number().optional(),
  notice_period: z.coerce.number().optional(),
  total_experience: z.coerce.number().optional(),
});

export const candidateEducationSchema = z.object({
  highest_education: z.string().optional(),
  institution: z.string().optional(),
  graduation_year: z.coerce.number().optional(),
});

export const candidateAdditionalSchema = z.object({
  resume_url: z.string().url().optional(),
  referenced_by: z.string().optional(),
  linkedin_url: z.string().url().optional(),
  github_url: z.string().url().optional(),
  portfolio_url: z.string().url().optional(),
  skills: z.string().optional(),
  certifications: z.string().optional(),
});

export const candidateSchema = candidateBasicSchema
  .extend(candidatePersonalSchema.shape)
  .extend(candidateProfessionalSchema.shape)
  .extend(candidateEducationSchema.shape)
  .extend(candidateAdditionalSchema.shape);

export type CandidateFormData = z.infer<typeof candidateSchema>;
