export const LIFECYCLE_STATUSES = ["probation", "regular", "notice_period", "resigned", "temp"] as const;
export type EmployeeLifecycleStatus = (typeof LIFECYCLE_STATUSES)[number];
export const LIFECYCLE_LABELS: Record<EmployeeLifecycleStatus, string> = { probation: "Probation", regular: "Regular", notice_period: "Notice Period", resigned: "Resigned", temp: "Temp" };
export const EMPLOYMENT_TYPE_OPTIONS = [{ value: "full_time", label: "Full-Time" }, { value: "part_time", label: "Part-Time" }, { value: "contract", label: "Contract" }, { value: "intern", label: "Intern" }] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPE_OPTIONS)[number]["value"];
export type EmployeeId = string;
export type MasterStatus = "active" | "inactive";
export interface MasterOption { id: string; companyId: number; name: string; status: MasterStatus }
export interface Address { line1: string; line2?: string; city: string; state: string; country: string; pincode: string }
export interface EmergencyContact { name: string; phone: string; relationship: string }
export interface BankAccount { id: string; accountNumber: string; accountHolder: string; bankName: string; branchName: string; ifsc: string; active: boolean; effectiveFrom: string }
export interface StatutoryRecord { uan?: string; pfNumber?: string; pfJoiningDate?: string; esicNumber?: string; esicJoiningDate?: string }
export interface HistoryEntry { id: string; field: string; previousValue: string; currentValue: string; changedBy: string; changedAt: string; reason?: string }
export interface RecruitmentProvenance { source: string; candidateId: string; applicationId?: string; offerId: string; convertedAt?: string; convertedBy?: string }
export interface AccountSummary { state: "not_created" | "active" | "disabled" | "fnf_pending" | "closed"; officeEmail?: string }
export interface PayrollSummary { ctcLabel: string; latestPayslip?: string; taxYear: string }
export interface AttendanceSummary { presentDays: number; absentDays: number; pendingRegularizations: number }
export interface LeaveSummary { available: number; used: number; pending: number }
export interface AssetsSummary { assigned: number; labels: string[] }
export interface Employee {
  id: EmployeeId; companyId: number; company: string; employeeCode: string; branchId: string; branch: string; departmentId: string; department: string;
  designationId: string; designation: string; weekOffMasterId: string; weekOffMaster: string; holidayListMasterId: string; holidayListMaster: string;
  firstName: string; middleName?: string; lastName: string; fullName: string; personalEmail: string; phone: string; dob: string;
  gender?: string; maritalStatus?: string; bloodGroup?: string; aadhaarName: string; aadhaarNumber: string; pan: string;
  permanentAddress: Address; correspondenceAddress: Address; emergencyContact: EmergencyContact; reportingManager?: { id: EmployeeId; name: string };
  joiningDate: string; endDate?: string; resignationDate?: string; noticeStartDate?: string; lifecycleStatus: EmployeeLifecycleStatus; profilePhoto?: string;
  accountSummary: AccountSummary; payrollSummary: PayrollSummary; attendanceSummary: AttendanceSummary; leaveSummary: LeaveSummary; assetsSummary: AssetsSummary;
  recruitmentProvenance?: RecruitmentProvenance; history: HistoryEntry[]; createdAt: string; updatedAt: string;
  transferClosure?: { destinationEmployeeId: EmployeeId; exitDate: string };
}
export interface EmployeeListParams { companyId: number; page: number; pageSize: number; search?: string; statuses: EmployeeLifecycleStatus[]; branchIds: string[]; departmentIds: string[]; designationIds: string[]; sortBy: "fullName" | "employeeCode" | "joiningDate" | "department" | "designation" | "branch" | "lifecycleStatus" | "updatedAt"; sortDirection: "asc" | "desc" }
export interface EmployeeListResult { items: Employee[]; total: number; page: number; pageSize: number }
export interface EmployeeMasters { companies: { id: number; name: string; prefix: string }[]; branches: MasterOption[]; departments: MasterOption[]; designations: MasterOption[]; weekOffs: MasterOption[]; holidayLists: MasterOption[] }
export interface CreateEmployeeInput { companyId: number; branchId: string; departmentId: string; designationId: string; weekOffMasterId: string; holidayListMasterId: string; firstName: string; middleName?: string; lastName: string; personalEmail: string; phone: string; dob: string; aadhaarName: string; aadhaarNumber: string; pan: string; joiningDate: string; lifecycleStatus: "probation" | "regular" | "temp"; permanentAddress: Address; correspondenceAddress: Address; emergencyContact: EmergencyContact; bank: Omit<BankAccount, "id" | "active" | "effectiveFrom">; recruitmentProvenance?: RecruitmentProvenance }
export interface ChangeLifecycleInput { status: EmployeeLifecycleStatus; noticeStartDate?: string; endDate?: string; resignationDate?: string; reason?: string }
export interface CorrectEmployeeCodeInput { newCode: string; reason: string }
export type UpdateProfileInput = Pick<Employee, "firstName" | "lastName" | "personalEmail" | "phone" | "dob" | "aadhaarName" | "aadhaarNumber" | "pan" | "permanentAddress" | "correspondenceAddress" | "emergencyContact"> & Pick<Partial<Employee>, "middleName" | "gender" | "maritalStatus" | "bloodGroup">;
export interface UpdateOrganizationInput { branchId: string; departmentId: string; designationId: string; weekOffMasterId: string; holidayListMasterId: string; reportingManagerId?: string; reason: string }
export type ReplaceBankInput = Omit<BankAccount, "id" | "active" | "effectiveFrom"> & { effectiveFrom: string; reason: string };
export type UpdateStatutoryInput = StatutoryRecord;
export interface TransferEmployeeInput { destinationCompanyId: number; exitDate: string; joiningDate: string; branchId: string; departmentId: string; designationId: string; weekOffMasterId: string; holidayListMasterId: string }
export interface BulkLifecycleInput { employeeIds: string[]; change: ChangeLifecycleInput }
export type OrganizationAssignmentField = "branchId" | "departmentId" | "designationId" | "weekOffMasterId" | "holidayListMasterId";
export interface BulkOrganizationInput { employeeIds: string[]; field: OrganizationAssignmentField; masterId: string; reason: string }
export type EmployeeExportFormat = "csv" | "excel" | "pdf" | "clipboard";
export interface EmployeeExportInput { companyId: number; scope: "current" | "all" | "selected"; format: EmployeeExportFormat; params?: EmployeeListParams; employeeIds?: string[] }
export interface EmployeeExportResult { contents: string; fileName: string; mimeType: string; count: number }
export interface UpdateReportingManagerInput { reportingManagerId?: string; reason: string }
export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;
export type EmployeeServiceErrorCode = "validation" | "not_found" | "forbidden" | "conflict" | "unknown";
