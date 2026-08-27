# Employee Integration Matrix

## Company and master relationships

| Integration | Legacy evidence | Current React Employee | Current frontend master | Safe next action | Contract/decision | Status |
|---|---|---|---|---|---|---|
| Employee ↔ Company | Selected Company/tenant scopes operational data | Optional Company display string from static options | `Company.id: number`; active Company from auth | Consume active Company and scoped option adapter in mock contract | Tenant DTO and whether HR may select another membership | REFACTOR REQUIRED |
| Employee ↔ Branch | Branch drives work context/code; exact Employee FK unavailable | No Branch field; work location string | `Branch.id: number`, company ID, geofence, ID series | Model a provisional frontend `branch_id` only after product approval; never generate final code client-side | Cardinality, effective dates, code ownership | BLOCKED/MISSING |
| Employee ↔ Department | Legacy dependency verified; Branch relation unresolved | Required string from static constants | `Department.id: number`, company ID | Employee option hook can safely expose ID/label scoped to active Company after migration strategy approval | Branch relationship and data migration | REFACTOR REQUIRED |
| Employee ↔ Designation | Verified dependent master | Required string from static constants | `Designation.id: number`, company ID, nullable department ID | Filter ID/label options by approved Department relationship | Cardinality and historic-label retention | REFACTOR REQUIRED |
| Employee ↔ Week Off | Assignment affects Attendance/Leave/Payroll | Optional schema string, not rendered | `WeekOff.id: number`, company ID, 5×7 grid | Mock selection can use ID only after assignment/effective-date decision | Effective assignment/history | BLOCKED |
| Employee ↔ Holiday List | Assignment affects Attendance/Leave/Payroll | Optional `holiday_master` string, not rendered | `HolidayList.id: number`, company/year | Mock ID selection only after year/effective/timezone behavior is approved | Assignment and timezone | BLOCKED |
| Employee ↔ Asset Type | Asset Type master exists; exact direct Employee field unconfirmed | None | `AssetType.id: number` | Do not add an Employee field; later Assets domain owns allocation | Legacy relation and asset lifecycle | UNKNOWN/DEFERRED |
| Employee ↔ Policy | Employee-facing policy link exists but audience unapproved | None | Company Policy admin records/files | Keep separate; do not treat policies as Employee documents | Publication/audience/access | DEFERRED |
| Employee ↔ Shift | Legacy assignment required operationally | None | Company Shift absent | Do not invent | Shift model/assignment | BLOCKED |

## Recruitment integration

| Data/action | Current mapping | Finding | Required direction | Status |
|---|---|---|---|---|
| Candidate identity | first/last/email/phone/DOB/gender/marital/address labels copied | Broad but no authoritative map/uniqueness | Typed application handoff with mapped IDs and provenance | PARTIAL |
| Job | Department/title/location strings copied | Bypasses Company masters; Job legacy mapping unresolved | Resolve Job/position and master IDs before submit | BLOCKED |
| Offer | Joining date/salary copied | Sensitive/contract ownership unclear | Server-authorized accepted-offer handoff | PARTIAL |
| Conversion | Employee create, then Candidate `hired` mutation | Non-atomic; possible partial success | One atomic backend/application action with deterministic mock rollback | REFACTOR REQUIRED |
| Provenance | Candidate/Offer numeric IDs saved | Useful frontend evidence | Retain only in approved DTO | PARTIAL |
| Interviewer options | Recruitment imports static Employee names | Cross-domain static duplication | Employee option hook/service scoped by tenant/permission | REFACTOR REQUIRED |

Legacy evidence says Candidate conversion uses `IsEmployee`, but exact field mapping and transaction behavior are unavailable. React Jobs/Offers are not assumed legacy-equivalent.

## Attendance integration

| Requirement | Current state | Required integration | Status |
|---|---|---|---|
| Employee identity | Attendance records have numeric `employee_id` but current page uses fixed mock record | Authenticated/authorized subject or selected Employee ID | PARTIAL |
| Branch/work location | Hardcoded Attendance geofence is disconnected from Employee | Server-authorized assigned Branch/location DTO | REFACTOR REQUIRED |
| Remote clock | Employee edit boolean describes geofence bypass | Backend policy and actor permission must enforce | BLOCKED |
| Shift | Absent | Effective Shift assignment/result | MISSING/BLOCKED |
| Week Off/Holiday | Employee strings not consumed | Effective schedule resolution returned by backend | MISSING/BLOCKED |
| Attendance profile/history | No Employee detail integration | Attendance-owned scoped query embedded only after permission approval | MISSING |

## Leave and resignation integration

| Requirement | Current state | Required dependency | Status |
|---|---|---|---|
| Leave subject/company/team | Leave absent | Employee ID, active Company, manager/team scope | DEFERRED |
| Balance and schedule | Absent | Effective Shift/Week Off/Holiday and backend calculation | BLOCKED |
| Approval authority | Nav labels only | Team graph and permission matrix | BLOCKED |
| Resignation lifecycle | No Employee lifecycle representation | Canonical status transition and staged supervisor/HR/F&F workflow | DEFERRED/BLOCKED |
| Resigned editability | `is_active` only | Product rules for profile, attendance, files and payroll access | BLOCKED |

Leave and Resignation implementation belongs to a later phase.

## Payroll, tax and Form 16 integration

| Employee input/relationship | Current React | Required integration | Status |
|---|---|---|---|
| Annual salary | Required editable number | Approved compensation DTO, effective dates and field permission | PARTIAL/BLOCKED |
| Bank details | Required in all Employee forms | Secure storage, masking and payroll authorization | PARTIAL/BLOCKED |
| UAN/PF/ESIC | Optional strings/dates | Statutory DTO/validation/effective-date rules | PARTIAL/BLOCKED |
| Joining/resignation bounds | Joining date only | Backend payroll eligibility inputs and lifecycle dates | MISSING |
| Tax/Form16 | PAN captured; nav only otherwise | Private tax/proof/file contracts and employee-own access | DEFERRED |
| Payslip/salary view | Nav only | Payroll-owned calculation/files/authorization | DEFERRED |

Employee must store authoritative inputs only; it must not calculate payroll, tax or statutory results.

## Employee documents integration

| Concern | Current React | Required direction | Status |
|---|---|---|---|
| Ownership | `employee_id` filter in hook/mock | Tenant + Employee + actor authorization | PARTIAL |
| Categories/types | React constants | Confirm exact legacy/product taxonomy | UNKNOWN |
| Storage | Static mock paths and object URLs; direct URLs in records | Authorized view/download operations; mock URL lifecycle | REFACTOR REQUIRED |
| CRUD | List/upload/delete; UI view/download | Add update/replace only if confirmed | PARTIAL |
| ZIP | None | Export contract, sync/queue decision | MISSING/BLOCKED |
| Permissions | None at component/service level | File action matrix and backend denial | MISSING/BLOCKED |
| Audit | uploaded-at/by strings | Authoritative identity/event metadata | PARTIAL |

## Safe mock classification

| Capability | Classification | Boundary |
|---|---|---|
| Tenant-scoped list/detail/create/update fixtures | SAFE MOCK | Use frontend IDs and deterministic failures; do not claim backend DTO parity. |
| Company master ID/label options | SAFE MOCK after product mapping approval | Consume Company service/hooks, never constants or mock imports. |
| Status display/transitions | BACKEND + PRODUCT CONTRACT REQUIRED | Raw values and allowed transitions unknown. |
| Employee code | BACKEND CONTRACT REQUIRED | Branch/temp rules must be server-owned. |
| Atomic Candidate conversion | SAFE MOCK simulation; backend transaction required | Include rollback/conflict fixtures. |
| Document CRUD/access | SAFE MOCK metadata/blob behavior; backend contract required | Private authorization and URL expiry remain backend-owned. |
| Team/account/permissions | PRODUCT + BACKEND DECISION REQUIRED | Actor model/codes/actions unknown. |
| Attendance/Leave/Payroll calculations | DEFERRED | Owning operational domains/backend. |
