import { z } from "zod";
import { GENDER_VALUES, MARITAL_STATUS_VALUES } from "../constant/candidate";
import { isAgeBetween } from "@/shared/utils/validation";

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
  phone: z.string().trim().min(10, "Enter a valid phone number").max(10),
  jobId: z.number().min(1, "Please select a job"),
  source: z.string().trim().min(1, "Please select source"),
  notes: z.string().trim().optional(),
});

export const candidatePersonalSchema = z.object({
  dob: z
    .string()
    .min(1, 'Date of Birth is required"')
    .refine(
      (value) =>
        isAgeBetween(value, {
          minAge: 18,
          maxAge: 100,
        }),
      {
        message: "Candidate must be 18 years old",
      },
    ),
  gender: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(GENDER_VALUES).optional(),
  ),

  marital_status: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(MARITAL_STATUS_VALUES).optional(),
  ),
  address_line1: z.string(),
  address_line2: z.string().optional(),
  country_id: z.coerce.number(),
  state_id: z.coerce.number(),
  city_id: z.coerce.number(),
  pincode: z.string().regex(/^\d{6}$/, "PIN Code must be exactly 6 digits"),
});

export const candidateProfessionalSchema = z.object({
  current_position: z.string().optional(),
  current_company: z.string().optional(),
  current_salary: z.coerce.number(),
  expected_salary: z.coerce.number().optional(),
  notice_period: z.coerce.number().optional(),
  total_experience: z.coerce.number().optional(),
});

export const candidateEducationSchema = z.object({
  highest_education: z.string(),
  institution: z.string(),
  graduation_year: z.coerce.number(),
});

export const candidateAdditionalSchema = z.object({
  resume_url: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().url("Please enter a valid URL").optional(),
  ),
  referenced_by: z.string().optional(),
  linkedin_url: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().url("Please enter a valid LinkedIn URL").optional(),
  ),
  github_url: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().url("Please enter a valid GitHub URL").optional(),
  ),
  portfolio_url: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().url("Please enter a valid Portfolio URL").optional(),
  ),
  skills: z.preprocess((value) => {
    if (!value || value === "") return [];

    if (typeof value === "string") {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    return value;
  }, z.array(z.string()).optional()),

  certifications: z.preprocess((value) => {
    if (!value || value === "") return [];

    if (typeof value === "string") {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    return value;
  }, z.array(z.string()).optional()),
});

export const candidateSchema = candidateBasicSchema
  .extend(candidatePersonalSchema.shape)
  .extend(candidateProfessionalSchema.shape)
  .extend(candidateEducationSchema.shape)
  .extend(candidateAdditionalSchema.shape);

export type CandidateFormData = z.infer<typeof candidateSchema>;
