import { z } from "zod";

export const companySchema = z.object({
  company_name: z.string().trim().min(1, "Company name is required"),
  industry_type: z.string().trim().min(1, "Industry is required"),
  company_start_date: z.string().min(1, "Company start date is required"),
});

export type CompanyFormData = z.infer<typeof companySchema>;

const companyAddressSchema = z.object({
  address_line_1: z.string(),
  address_line_2: z.string().optional(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  pincode: z.string(),
});

export const companyOverviewSchema = z.object({
  company_name: z.string().trim().min(1, "Company name is required"),
  industry_type: z.string().trim().min(1, "Industry is required"),
  company_start_date: z.string().min(1, "Company start date is required"),
  status: z.enum(["active", "inactive"]),
  contact_email: z.string().optional(),
  contact_number: z.string().optional(),
  website: z.string().optional(),
  smtp: z.object({
    host: z.string(),
    port: z.number(),
    username: z.string(),
    from_email: z.string(),
    use_tls: z.boolean(),
    password_configured: z.boolean(),
  }),
  registered_office: companyAddressSchema,
  corporate_office: companyAddressSchema,
  bank_information: z.object({
    bank_name: z.string(),
    branch_name: z.string(),
    account_holder_name: z.string(),
    account_number: z.string(),
    ifsc_code: z.string(),
  }),
});

export type CompanyOverviewFormData = z.infer<typeof companyOverviewSchema>;

export const branchSchema = z.object({
  branch_name: z.string().trim().min(1, "Branch name is required"),
  email: z.email("Enter a valid email address"),
  contact_number: z.string().trim().min(1, "Contact number is required"),
  address: z.string().trim().min(1, "Address is required"),
  pincode: z.string().trim().min(1, "Pincode is required"),
  latitude: z
    .number()
    .min(-90, "Latitude must be at least -90")
    .max(90, "Latitude must be at most 90"),
  longitude: z
    .number()
    .min(-180, "Longitude must be at least -180")
    .max(180, "Longitude must be at most 180"),
  radius_meters: z.number().positive("Geofence radius must be greater than zero"),
  employee_id_series: z
    .string()
    .trim()
    .min(1, "Employee ID series is required"),
  start_date: z.string().min(1, "Branch start date is required"),
  status: z.enum(["active", "inactive"]),
});

export type BranchFormData = z.infer<typeof branchSchema>;

export const departmentSchema = z.object({
  name: z.string().trim().min(1, "Department name is required"),
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;

export const designationSchema = z.object({
  name: z.string().trim().min(1, "Designation name is required"),
  department_id: z.number().nullable(),
});

export type DesignationFormData = z.infer<typeof designationSchema>;

const weekOffCellSchema = z.object({
  occurrence: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  weekday: z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]),
  state: z.enum(["working", "half_day", "week_off"]),
});

export const weekOffSchema = z.object({
  policy_name: z.string().trim().min(1, "Policy name is required"),
  grid: z
    .array(weekOffCellSchema)
    .length(35, "Week Off grid must contain exactly 35 cells")
    .superRefine((grid, context) => {
      const combinations = new Set(
        grid.map((cell) => `${cell.occurrence}:${cell.weekday}`),
      );
      if (combinations.size !== 35) {
        context.addIssue({
          code: "custom",
          message: "Every occurrence and weekday combination must appear once",
        });
      }
    }),
});

export type WeekOffFormData = z.infer<typeof weekOffSchema>;

export const holidayListSchema = z.object({
  name: z.string().trim().min(1, "Holiday List name is required"),
  year: z
    .number()
    .int("Year must be a whole number")
    .min(1000, "Enter a four-digit year")
    .max(9999, "Enter a four-digit year"),
  remarks: z.string().optional(),
});

export type HolidayListFormData = z.infer<typeof holidayListSchema>;

export const holidaySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Holiday date is required"),
  name: z.string().trim().min(1, "Holiday name is required"),
  description: z.string().optional(),
});

export type HolidayFormData = z.infer<typeof holidaySchema>;

export const assetTypeSchema = z.object({
  name: z.string().trim().min(1, "Asset Type name is required"),
});

export type AssetTypeFormData = z.infer<typeof assetTypeSchema>;

export const policySchema = z.object({
  policy_name: z.string().trim().min(1, "Policy name is required"),
  description: z.string().optional(),
  file: z.custom<File>(
    (value) => typeof File !== "undefined" && value instanceof File,
    "Policy file is required",
  ),
});

export type PolicyFormData = z.infer<typeof policySchema>;
