import { z } from 'zod';

export const candidateSchema = z.object({
  first_name: z.string().trim().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().trim().min(2, 'Last name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().min(10, 'Enter a valid 10-digit phone number').max(15),
  jobId: z.number({ error: 'Please select a job' }).min(1, 'Please select a job'),
  source: z.string().trim().min(1, 'Please select a source'),
  notes: z.string().trim().default(''),
});

export type CandidateFormData = z.infer<typeof candidateSchema>;
