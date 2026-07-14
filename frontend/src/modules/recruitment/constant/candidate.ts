
export const SOURCE_OPTIONS = [
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'Referral', label: 'Referral' },
  { value: 'Job Portal', label: 'Job Portal' },
  { value: 'Company Website', label: 'Company Website' },
  { value: 'Walk-in', label: 'Walk-in' },
  { value: 'Other', label: 'Other' },
];

export const GENDER_VALUES = [
  "male",
  "female",
  "other",
] as const;

export const MARITAL_STATUS_VALUES = [
  "single",
  "married",
] as const

export const COUNTRY_OPTIONS = [
  {value: 1, label: 'India'},
] as const;

export const STATE_OPTIONS = [
  {value: 101, label: "Gujarat"},
  {value: 102, label: "Maharatshtra"},
];

export const CITY_OPTIONS = [
  {value: "1001", label:'Vadodra'},
  {value: "1002", label:'Anand'},
  {value: "1003", label:'Rajkot'},
  {value: "1004", label:'Surat'},
  {value: "1005", label:'Mumbai'},
  {value: "1006", label:'Palghar'},
  {value: "1007", label:'Nanded'},
];


export const GENDERS_OPTIONS = [
  { value: "male", label: 'Male' },
  { value: "female", label: 'Female' },
  { value: "other", label: 'Other' },
];

export const MARITAL_STATUS_OPTIONS = [
  { value: "single", label: 'Single' },
  { value: "married", label: 'Married' },
];

export type Gender = typeof GENDERS_OPTIONS[number]["value"];

export type MaritalStatus = typeof MARITAL_STATUS_OPTIONS[number]["value"];