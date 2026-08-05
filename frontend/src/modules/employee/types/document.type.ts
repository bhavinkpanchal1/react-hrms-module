export const DOCUMENT_CATEGORY_OPTIONS = [
  {
    category_id: 1,
    value: "resume",
    label: "Resume",
  },
  {
    category_id: 2,
    value: "kyc",
    label: "KYC",
  },
  {
    category_id: 3,
    value: "educational",
    label: "Educational",
  },
  {
    category_id: 4,
    value: "employment",
    label: "Employment",
  },
  {
    category_id: 5,
    value: "other",
    label: "Other",
  },
] as const;

export const DOCUMENT_TYPE_OPTIONS = [
  // Resume
  {
    value: "resume",
    label: "Resume",
    category_id: 1,
  },

  // KYC
  {
    value: "aadhaar_card",
    label: "Aadhaar Card",
    category_id: 2,
  },
  {
    value: "pan_card",
    label: "PAN Card",
    category_id: 2,
  },
  {
    value: "passport",
    label: "Passport",
    category_id: 2,
  },
  {
    value: "voter_id",
    label: "Voter ID",
    category_id: 2,
  },
  {
    value: "driving_license",
    label: "Driving License",
    category_id: 2,
  },
  {
    value: "photograph",
    label: "Photograph",
    category_id: 2,
  },
  {
    value: "cheque_passbook",
    label: "Cheque / Passbook",
    category_id: 2,
  },
  {
    value: "bank_statement",
    label: "Bank Statement",
    category_id: 2,
  },

  // Educational
  {
    value: "10th_marksheet",
    label: "10th Marksheet",
    category_id: 3,
  },
  {
    value: "12th_marksheet",
    label: "12th Marksheet",
    category_id: 3,
  },
  {
    value: "degree_certificate",
    label: "Degree Certificate",
    category_id: 3,
  },
  {
    value: "masters_degree",
    label: "Master's Degree",
    category_id: 3,
  },
  {
    value: "diploma_certificate",
    label: "Diploma Certificate",
    category_id: 3,
  },
  {
    value: "other_certificate",
    label: "Other Certificate",
    category_id: 3,
  },

  // Employment
  {
    value: "offer_letter",
    label: "Offer Letter",
    category_id: 4,
  },
  {
    value: "experience_letter",
    label: "Experience Letter",
    category_id: 4,
  },
  {
    value: "relieving_letter",
    label: "Relieving Letter",
    category_id: 4,
  },
  {
    value: "pay_slip",
    label: "Pay Slip",
    category_id: 4,
  },

  // Other
  {
    value: "declaration",
    label: "Declaration",
    category_id: 5,
  },
  {
    value: "medical_certificate",
    label: "Medical Certificate",
    category_id: 5,
  },
  {
    value: "other",
    label: "Other",
    category_id: 5,
  },
] as const;


export type DocumentCategoryType =
  (typeof DOCUMENT_CATEGORY_OPTIONS)[number]["value"];

export type DocumentType = (typeof DOCUMENT_TYPE_OPTIONS)[number]["value"];

export const DOCUMENT_CATEGORY_VALUES = DOCUMENT_CATEGORY_OPTIONS.map(
  (item) => item.value
) as [DocumentCategoryType, ...DocumentCategoryType[]];

export const DOCUMENT_TYPE_VALUES = DOCUMENT_TYPE_OPTIONS.map(
  (item) => item.value
) as [DocumentType, ...DocumentType[]];


export interface EmployeeDocument {
  id: number;
  employee_id: number;

  document_category: DocumentCategoryType;
  document_name: DocumentType;

  document_description?: string;

  file_name: string;
  file_url: string;
  file_size: string;
  file_type: string;

  uploaded_at: string;
  uploaded_by: string;
}