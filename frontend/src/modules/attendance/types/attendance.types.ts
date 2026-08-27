export type AttendanceRole = "hr" | "manager" | "employee";
export type LifecycleStatus = "probation" | "regular" | "notice_period" | "temp" | "resigned" | "closed";
export type DayType = "WORKING_DAY" | "HOLIDAY" | "WEEK_OFF";
export type AttendanceResult = "PRESENT" | "HALF_DAY" | "ABSENT" | "NO_RESULT";
export type ClockMethod = "OFFICE_GPS" | "REMOTE_GPS";
export type AttendanceMethod = ClockMethod | "HR_MANUAL";
export type RegularizationStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
export type RegularizationReason = "MISSING_CLOCK_IN" | "MISSING_CLOCK_OUT" | "INCORRECT_CLOCK_TIME" | "PUNCH_ISSUE" | "INCORRECT_CALCULATION";
export type PunchRequirement = "PUNCH_REQUIRED" | "PUNCH_OPTIONAL";
export interface GeoPoint { lat:number; lng:number; accuracy?:number; observedAt?:string }
export interface AttendanceActor { userId:number; role:AttendanceRole; employeeId?:string; name:string }
export interface AttendanceEmployee { id:string; companyId:number; employeeCode:string; name:string; branchId:string; branch:string; department:string; designation:string; lifecycleStatus:LifecycleStatus; joiningDate:string; lastWorkingDate?:string; remoteClockApproved:boolean; wfhApproved:boolean; punchRequirement:PunchRequirement; managerId?:string }
export interface BranchAttendanceConfig { id:string; companyId:number; name:string; timezone:string; latitude:number|null; longitude:number|null; radiusMeters:number|null; lateEarly:{enabled:boolean;expectedStart:string;expectedEnd:string;graceMinutes:number;lateToHalfDay:boolean;minimumHoursToHalfDay:boolean;minimumHours:number;earlyToHalfDay:boolean} }
export interface AttendanceAttributes { late:boolean; earlyDeparture:boolean; remote:boolean; regularized:boolean; workedOnNonWorkingDay:boolean; manual:boolean }
export interface AttendanceRecord { id:string; companyId:number; employeeId:string; employeeCode:string; employeeName:string; branchId:string; branch:string; department:string; designation:string; attendanceDate:string; appliedTimezone:string; dayType:DayType; result:AttendanceResult; clockInAt:string|null; clockOutAt:string|null; workedMinutes:number; method:AttendanceMethod|null; attributes:AttendanceAttributes; leaveReference?:string; regularizationStatus?:RegularizationStatus; version:number }
export interface AttendanceAudit { id:string; attendanceId:string; companyId:number; employeeId:string; changedBy:string; actorRole:AttendanceRole; oldClockIn:string|null; newClockIn:string|null; oldClockOut:string|null; newClockOut:string|null; oldResult:AttendanceResult; newResult:AttendanceResult; reason:string; createdAt:string; action:"CLOCK_IN"|"CLOCK_OUT"|"MANUAL_CORRECTION"|"REGULARIZATION"|"GEOFENCE_OVERRIDE"|"REOPEN"|"MONTHLY_EDIT"|"BULK"; sourceMethod?:AttendanceMethod; approvalSource?:string; approvalReference?:string; approver?:string; approvalDate?:string; geofenceEvidence?:string }
export interface RegularizationRequest { id:string; companyId:number; employeeId:string; employeeName:string; attendanceId?:string; attendanceDate:string; reasonType:RegularizationReason; reason:string; requestedClockIn?:string; requestedClockOut?:string; status:RegularizationStatus; requestedBy:string; createdAt:string; updatedAt:string; decisionReason?:string; decidedBy?:string; approvalSource?:string; version:number }
export interface AttendanceListParams { companyId:number; actor:AttendanceActor; page:number; pageSize:number; search:string; employeeId?:string; dateFrom?:string; dateTo?:string; results:AttendanceResult[]; branch?:string; department?:string; designation?:string; regularizationStatus?:RegularizationStatus|""; sortBy:"attendanceDate"|"employeeName"|"employeeCode"|"result"; sortDirection:"asc"|"desc" }
export interface AttendanceListResult { items:AttendanceRecord[]; total:number; page:number; pageSize:number }
export interface ClockInPayload { latitude:number; longitude:number; accuracy?:number; observedAt?:string; method?:"OFFICE_GPS"|"REMOTE_GPS" }
export type ClockOutPayload = ClockInPayload;
export interface ClockMutationResult { message:string; attendance:AttendanceRecord }
export interface RegularizationInput { attendance_date:string; requested_clock_in?:string; requested_clock_out?:string; reason:string; reasonType?:RegularizationReason }
export interface ManualAttendanceInput { employeeId:string; attendanceDate:string; clockInAt?:string; clockOutAt?:string; result:AttendanceResult; dayType?:DayType; reason:string; approvalSource?:string; approvalReference?:string; approver?:string; approvalDate?:string }
export interface GeofenceOverrideInput { employeeId:string; attendanceDate:string; originalResult:string; reason:string; overrideAllowed:boolean }
export interface BulkAttendanceInput { employeeIds:string[]; dateFrom:string; dateTo:string; result:AttendanceResult; reason:string; preview:boolean; confirmationId?:string }
export interface BulkAttendanceResult { confirmationId?:string; previewCount:number; results:{employeeId:string;attendanceDate:string;success:boolean;message:string}[] }
export interface MonthlyAttendanceInput { employeeId:string; year:number; month:number; changes:{attendanceDate:string;result:AttendanceResult;reason:string}[] }
export interface GeofenceResult { allowed:boolean; distanceMeters:number|null; radiusMeters:number|null; accuracyAccepted:boolean; reason:string }
export interface AttendanceResolution { dayType:DayType; reference:string; historical:boolean }
export interface AttendancePolicy { punchRequirement:PunchRequirement; lateEarly:BranchAttendanceConfig["lateEarly"] }
export interface LegacyAttendanceRecord extends AttendanceRecord { employee_id:string; attendance_date:string; clock_in_at:string|null; clock_out_at:string|null; clock_in_location:GeoPoint|null; clock_out_location:GeoPoint|null; clock_method:"office"|"remote"|null; status:"present"|"absent"|"half_day"|"leave"|"holiday"|"weekend"|"regularization_pending"|"regularized"; work_hours:number|null; regularization_reason:string|null; regularization_requested_at:string|null }
export const ATTENDANCE_STATUS_META={PRESENT:{label:"Present",colorClass:"text-success"},HALF_DAY:{label:"Half Day",colorClass:"text-warning"},ABSENT:{label:"Absent",colorClass:"text-error"},NO_RESULT:{label:"No Result",colorClass:"text-slate-500"}} as const;
