import { Banknote, Briefcase, Contact, MapPin, User } from "lucide-react";
import { ReviewSummary, type ReviewSectionData } from "@/shared/ui";
import { GENDERS_OPTIONS, MARITAL_STATUS_OPTIONS } from "@/modules/recruitment/constant/candidate";
import { EMPLOYMENT_TYPE_OPTIONS } from "../types/employee.type";
import type { EmployeeFormData } from "../schema/employee.schema";

const labelOf = (options: readonly { value: string; label: string }[], value?: string) =>
  options.find((o) => o.value === value)?.label ?? value;

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : undefined;

interface EmployeeReviewStepProps {
  values: EmployeeFormData;
  onEditSection?: (key: string) => void;
  errorSectionKeys?: string[];
}

export const EmployeeReviewStep = ({ values, onEditSection, errorSectionKeys }: EmployeeReviewStepProps) => {
  const sections: ReviewSectionData[] = [
    {
      key: "personal",
      title: "Personal Information",
      icon: User,
      fields: [
        { label: "Full Name", value: [values.first_name, values.middle_name, values.last_name].filter(Boolean).join(" ") },
        { label: "Name as per Aadhaar", value: values.name_as_per_aadhar },
        { label: "Date of Birth", value: formatDate(values.dob) },
        { label: "Gender", value: labelOf(GENDERS_OPTIONS, values.gender) },
        { label: "Marital Status", value: labelOf(MARITAL_STATUS_OPTIONS, values.marital_status) },
        { label: "Email", value: values.email },
        { label: "Phone", value: values.phone },
        { label: "Aadhaar Number", value: values.aadhar_card_number },
        { label: "PAN Number", value: values.pan_card_number },
      ],
    },
    {
      key: "address",
      title: "Address",
      icon: MapPin,
      fields: [
        {
          label: "Correspondence Address", wide: true,
          value: [values.corresponding_address_line1, values.corresponding_address_line2, values.corresponding_city, values.corresponding_state, values.corresponding_pincode].filter(Boolean).join(", "),
        },
        {
          label: "Permanent Address", wide: true,
          value: values.same_as_above
            ? "Same as correspondence address"
            : [values.permanent_address_line1, values.permanent_address_line2, values.permanent_city, values.permanent_state, values.permanent_pincode].filter(Boolean).join(", "),
        },
      ],
    },
    {
      key: "employment",
      title: "Employment Details",
      icon: Briefcase,
      fields: [
        { label: "Employee ID", value: values.employee_id },
        { label: "Date of Joining", value: formatDate(values.date_of_joining) },
        { label: "Company", value: values.company },
        { label: "Work Location", value: values.work_location },
        { label: "Department", value: values.department },
        { label: "Designation", value: values.designation },
        { label: "Reporting Manager", value: values.reporting_manager },
        { label: "Employment Type", value: labelOf(EMPLOYMENT_TYPE_OPTIONS, values.employment_type) },
        { label: "Annual Salary", value: values.annual_salary ? `₹${Number(values.annual_salary).toLocaleString("en-IN")}` : undefined },
      ],
    },
    {
      key: "account_details",
      title: "Bank & Statutory Details",
      icon: Banknote,
      fields: [
        { label: "Account Holder Name", value: values.account_holder_name },
        { label: "Account Number", value: values.account_number },
        { label: "Bank Name", value: values.bank_name },
        { label: "Branch Name", value: values.branch_name },
        { label: "IFSC Code", value: values.ifsc_code },
        { label: "UAN Number", value: values.uan_number },
        { label: "PF Number", value: values.pf_number },
        { label: "PF Joining Date", value: formatDate(values.pf_joining_date) },
        { label: "ESIC Number", value: values.esic_number },
        { label: "ESIC Joining Date", value: formatDate(values.esic_joining_date) },
      ],
    },
    {
      key: "emergency",
      title: "Emergency Contact",
      icon: Contact,
      fields: [
        { label: "Contact Name", value: values.emergency_contact_name },
        { label: "Contact Number", value: values.emergency_contact_number },
        { label: "Relation", value: values.emergency_contact_relation },
      ],
    },
  ];

  return (
    <ReviewSummary
      sections={sections}
      onEditSection={onEditSection}
      errorSectionKeys={errorSectionKeys}
    />
  );
};