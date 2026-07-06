import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string().trim()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),

  department: z.string().trim().min(1, 'Department is required'),

  description: z.string().trim().min(10, 'Description must be at least 10 characters'),

  experience: z.number({ error: 'Enter a number' })
    .min(0, 'Experience cannot be negative').max(30),

  location: z.string().trim().min(2, 'Location is required'),

  openings: z.number({ error: 'Enter a number' })
    .min(1, 'At least one opening is required'),

  status: z.enum(['draft', 'open', 'closed', 'on_hold']),

  closing_date: z.string().optional().nullable(),
});

export type JobFormData = z.infer<typeof jobSchema>;
