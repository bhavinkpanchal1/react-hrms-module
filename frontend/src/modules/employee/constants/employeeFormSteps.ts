import type { StepDefinition } from "@/shared/ui";
import type { EmployeeFormData } from "../schema/employee.schema";



export const EMPLOYEE_FORM_STEPS: StepDefinition<EmployeeFormData>[] = [
  {
    key: "personal",
    title: "Personal",
    fields: [
      "first_name",
      "middle_name",
      "last_name",
      "name_as_per_aadhar",
      "dob",
      "gender",
      "marital_status",
      "email",
      "phone",
      "aadhar_card_number",
      "pan_card_number",
    ],
  },

  {
    key: "address",
    title: "Address",
    fields: [
      "corresponding_address_line1",
      "corresponding_address_line2",
      "corresponding_country",
      "corresponding_state",
      "corresponding_city",
      "corresponding_pincode",

      "permanent_address_line1",
      "permanent_address_line2",
      "permanent_country",
      "permanent_state",
      "permanent_city",
      "permanent_pincode",
    ],
  },

  {
    key: "employment",
    title: "Employment",
    fields: [
      "employee_id",
      "date_of_joining",
      "company",
      "work_location",
      "department",
      "designation",
      "reporting_manager",
      "employment_type",
      "annual_salary",
    ],
  },

  {
    key: "account_details",
    title: "Account details",
    fields: [
      "account_holder_name",
      "account_number",
      "bank_name",
      "branch_name",
      "ifsc_code",
      "uan_number",
      "pf_number",
      "pf_joining_date",
      "esic_number",
      "esic_joining_date",
    ],
  },
  
  {
    key: "emergency",
    title: "Emergency",
    fields: [
      "emergency_contact_name",
      "emergency_contact_number",
      "emergency_contact_relation",
    ],
  },

  {
    key: "review",
    title: "Review",
  },
];
