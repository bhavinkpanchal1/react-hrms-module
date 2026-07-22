import {
  GENDER_VALUES,
  MARITAL_STATUS_VALUES,
} from "@/modules/recruitment/constant/candidate";
import { isAgeBetween } from "@/shared/utils/validation";
import { z } from "zod";

export const employeeSchema = z.object({
  // ===========================
  // Personal Information
  // ===========================
  first_name: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters"),
  middle_name: z.string().trim().optional(),

  last_name: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters"),

  name_as_per_aadhar: z.string().trim().min(6, "Name as per Aadhar card"),

  email: z.string().trim().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter valid mobile number"),
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
  aadhar_card_number: z
    .string()
    .trim()
    .regex(/^\d{12}$/, "Aadhaar must contain exactly 12 digits"),
  pan_card_number: z
    .string()
    .trim()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Enter a valid PAN Number"),

  // ===========================
  // Correspondence Address
  // ===========================
  corresponding_address_line1: z.string().trim().min(1, "Address is required"),
  corresponding_address_line2: z.string().optional(),
  corresponding_country: z.string().min(1, "Select Country"),
  corresponding_state: z.string().min(1, "Select State"),
  corresponding_city: z.string().min(1, "Select City"),
  corresponding_pincode: z.string().regex(/^\d{6}$/, "Enter valid pincode"),

  // ===========================
  // Permanent Address
  // ===========================
  same_as_above: z.boolean().default(false),
  permanent_address_line1: z.string(),
  permanent_address_line2: z.string().optional(),
  permanent_country: z.string().min(1, "Select Country"),
  permanent_state: z.string().min(1, "Select State"),
  permanent_city: z.string().min(1, "Select City"),
  permanent_pincode: z.string().regex(/^\d{6}$/, "Enter valid pincode"),

  // ===========================
  // Employment
  // ===========================
  employee_id: z.string().optional(),
  date_of_joining: z.string().min(1, "Joining date is required"),
  work_location: z.string().min(1, "Work location is required"),
  company: z.string().optional(),
  department: z.string().min(1, "Department is required"),
  designation: z.string().min(1, "Designation is required"),
  reporting_manager: z.string().optional(),
  job_role: z.string().optional(),
  employment_type: z.enum(["full_time", "part_time", "contract", "intern"]),
  annual_salary: z.coerce.number().min(1, "Enter Annual Salary"),
  week_off: z.string().optional(),
  holiday_master: z.string().optional(),
  clockin_remotely: z.boolean().default(false),

  // ===========================
  // PF / UAN and ESIC
  // ===========================
  uan_number: z.string().optional(),
  pf_number: z.string().optional(),
  pf_joining_date: z.string().optional(),
  esic_number: z.string().optional(),
  esic_joining_date: z.string().optional(),

  // ===========================
  // Bank Details
  // ===========================
  ifsc_code: z
    .string()
    .trim()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter valid IFSC"),
  branch_name: z.string(),
  bank_name: z.string(),
  account_number: z.string().trim().min(8).max(20),
  account_holder_name: z.string(),

  // ===========================
  // Emergency Contact
  // ===========================
  emergency_contact_name: z.string().optional(),
  emergency_contact_number: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter valid mobile number")
    .optional(),
  emergency_contact_relation: z.string().optional(),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
