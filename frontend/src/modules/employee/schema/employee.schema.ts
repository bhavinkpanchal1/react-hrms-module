import { z } from "zod";

export const employeeSchema = z.object({
  first_name: z.string().trim().min(2, "First name must be at least 2 characters"),
  last_name: z.string().trim().min(2, "Last name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(10, "Enter a valid phone number").max(15),
  dob: z.string().optional(),
  gender: z.string().optional(),
  marital_status: z.string().optional(),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  pincode: z.string().optional(),

  department: z.string().trim().min(1, "Department is required"),
  designation: z.string().trim().min(1, "Designation is required"),
  reporting_manager: z.string().optional(),
  work_location: z.string().trim().min(1, "Work location is required"),
  employment_type: z.enum(["full_time", "part_time", "contract", "intern"], "Employment type is required"),
  date_of_joining: z.string().trim().min(1, "Joining date is required"),
  annual_salary: z.coerce.number().min(1, "Enter the annual salary"),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;