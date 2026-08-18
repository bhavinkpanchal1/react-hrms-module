export type CompanyEntityId = number;
export type ISODate = string;
export type ISODateTime = string;
export type EntityStatus = "active" | "inactive";

export interface MockFileMetadata {
  file_name: string;
  mime_type: string;
  size_bytes: number;
  uploaded_at: ISODateTime;
  mock_object_url?: string;
  mock_fixture_path?: string;
}

export interface CompanyAddress {
  address_line_1: string;
  address_line_2?: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
}

export interface CompanyEmailConfiguration {
  host: string;
  port: number;
  username: string;
  from_email: string;
  use_tls: boolean;
  password_configured: boolean;
}

export interface CompanyBankInformation {
  bank_name: string;
  branch_name: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
}

export interface Company {
  id: CompanyEntityId;
  company_name: string;
  industry_type: string;
  company_start_date: ISODate;
  status: EntityStatus;
  logo?: MockFileMetadata | null;
  contact_email?: string;
  contact_number?: string;
  website?: string;
  smtp?: CompanyEmailConfiguration;
  registered_office?: CompanyAddress;
  corporate_office?: CompanyAddress;
  bank_information?: CompanyBankInformation;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface CompanyListParams {
  page: number;
  page_size: number;
  search?: string;
  status?: EntityStatus;
  industry_type?: string;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export type CreateCompanyInput = Pick<
  Company,
  "company_name" | "industry_type" | "company_start_date"
>;

export type UpdateCompanyInput = Partial<
  Omit<Company, "id" | "created_at" | "updated_at">
>;

export interface Branch {
  id: CompanyEntityId;
  company_id: CompanyEntityId;
  branch_name: string;
  email: string;
  contact_number: string;
  address: string;
  pincode: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  employee_id_series: string;
  start_date: ISODate;
  status: EntityStatus;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface BranchListParams {
  page: number;
  page_size: number;
  search?: string;
  status?: EntityStatus;
}

export type CreateBranchInput = Omit<
  Branch,
  "id" | "company_id" | "created_at" | "updated_at"
>;

export type UpdateBranchInput = Partial<CreateBranchInput>;

export interface Department {
  id: CompanyEntityId;
  company_id: CompanyEntityId;
  name: string;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface DepartmentListParams {
  page: number;
  page_size: number;
  search?: string;
}

export type CreateDepartmentInput = Pick<Department, "name">;
export type UpdateDepartmentInput = Partial<CreateDepartmentInput>;

export interface Designation {
  id: CompanyEntityId;
  company_id: CompanyEntityId;
  name: string;
  department_id: CompanyEntityId | null;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface DesignationListParams {
  page: number;
  page_size: number;
  search?: string;
  department_id?: CompanyEntityId;
}

export type CreateDesignationInput = Pick<
  Designation,
  "name" | "department_id"
>;
export type UpdateDesignationInput = Partial<CreateDesignationInput>;

export const WEEKDAYS = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
] as const;

export const WEEK_OFF_OCCURRENCES = [1, 2, 3, 4, 5] as const;
export type Weekday = (typeof WEEKDAYS)[number]["value"];
export type WeekOffOccurrence = (typeof WEEK_OFF_OCCURRENCES)[number];
export type WeekOffState = "working" | "half_day" | "week_off";

export interface WeekOffCell {
  occurrence: WeekOffOccurrence;
  weekday: Weekday;
  state: WeekOffState;
}

export type WeekOffGrid = readonly WeekOffCell[];

export interface WeekOff {
  id: CompanyEntityId;
  company_id: CompanyEntityId;
  policy_name: string;
  grid: WeekOffGrid;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export type CreateWeekOffInput = Pick<WeekOff, "policy_name" | "grid">;
export type UpdateWeekOffInput = Partial<CreateWeekOffInput>;

export interface HolidayList {
  id: CompanyEntityId;
  company_id: CompanyEntityId;
  name: string;
  year: number;
  remarks?: string;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface HolidayListParams {
  page: number;
  page_size: number;
  search?: string;
  year?: number;
}

export type CreateHolidayListInput = Pick<
  HolidayList,
  "name" | "year" | "remarks"
>;
export type UpdateHolidayListInput = Partial<CreateHolidayListInput>;

export interface Holiday {
  id: CompanyEntityId;
  company_id: CompanyEntityId;
  holiday_list_id: CompanyEntityId;
  date: ISODate;
  name: string;
  description?: string;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface HolidayParams {
  page: number;
  page_size: number;
  search?: string;
}

export type CreateHolidayInput = Pick<Holiday, "date" | "name" | "description">;
export type UpdateHolidayInput = Partial<CreateHolidayInput>;

export interface AssetType {
  id: CompanyEntityId;
  company_id: CompanyEntityId;
  name: string;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface AssetTypeParams {
  page: number;
  page_size: number;
  search?: string;
}

export type CreateAssetTypeInput = Pick<AssetType, "name">;
export type UpdateAssetTypeInput = Partial<CreateAssetTypeInput>;

export type PolicyFileMetadata = MockFileMetadata;

export interface Policy {
  id: CompanyEntityId;
  company_id: CompanyEntityId;
  policy_name: string;
  description?: string;
  file: PolicyFileMetadata;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface PolicyListParams {
  page: number;
  page_size: number;
  search?: string;
}

export interface CreatePolicyInput {
  policy_name: string;
  description?: string;
  file: File;
}

export interface PolicyFileAccess {
  url: string;
  file_name: string;
  mime_type: string;
  can_preview: boolean;
}

export interface PolicyFileDownload {
  blob: Blob;
  file_name: string;
}
