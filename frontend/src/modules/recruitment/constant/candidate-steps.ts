export const CANDIDATE_STEPS = [
  {
    key: "basic",
    title: "Basic Information",
    fields: [
      "first_name",
      "last_name",
      "email",
      "phone",
      "jobId",
      "source",
    ],
  },
  {
    key: "personal",
    title: "Personal Information",
    fields: [
      "dob",
      "gender",
      "marital_status",
      "address_line1",
      "address_line2",
      "country_id",
      "state_id",
      "city_id",
      "pincode",
    ],
  },
  {
    key: "professional",
    title: "Professional Information",
    fields: [
      "current_position",
      "current_company",
      "current_salary",
      "expected_salary",
      "notice_period",
      "total_experience",
    ],
  },
  {
    key: "education",
    title: "Education Information",
    fields: [
      "highest_education",
      "institution",
      "graduation_year",
    ],
  },
  {
    key: "additional",
    title: "Additional Information",
    fields: [
      "linkedin_url",
      "github_url",
      "portfolio_url",
      "skills",
      "certifications",
      "resume_url",
      "notes",
    ],
  },
] as const;