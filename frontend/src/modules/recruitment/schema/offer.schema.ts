import { z } from "zod";

export const offerSchema = z.object({
  offered_salary: z.coerce.number()
    .min(1, "Enter the offered annual salary"),
  joining_date: z.string().trim().min(1, "Joining date is required"),
  expires_at: z.string().optional(),
  notes: z.string().trim().optional(),
});

export type OfferFormData = z.infer<typeof offerSchema>;