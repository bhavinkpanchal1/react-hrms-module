# Employee Cross-Module Dependency Decision

## Status

CORE-12 is **PARTIALLY RESOLVED**. Domain ownership and legacy relationships are evidenced; final DTOs, IDs, effective history, tenant enforcement and mutation/event contracts remain Backend/Product decisions.

## Cross-module matrix

| Domain | Employee dependency | Legacy evidence | Current React | Target implication | Backend dependency |
|---|---|---|---|---|---|
| Company | Company derived through Branch | `StaffProfile.company_branch`; Company-scoped views | Optional Company string | Employment resolves Company from Branch; never conflicting strings | Tenant context/invariant |
| Branch | Required create FK; code series/work scope | HR model/create/code generator | Missing; `work_location` string | Required Employment master ID | Scope/retirement/history |
| Department | Required create FK, PROTECT | HR model/service | Required string | Company-scoped ID | Validation/history |
| Designation | Required create FK, PROTECT | HR model/service | Required string | Company-scoped ID; Department compatibility decision | Validation/history |
| Week Off | Optional employment FK, PROTECT | HR/Attendance calculations | Optional string | Scheduling reference/effective history | DTO/effective assignment |
| Holiday List | Optional HolidayMaster FK, PROTECT | HR/Attendance/Leave | Optional string | Employment scheduling/default policy | Year/default/history |
| Shift | Master exists, no Staff FK | HR models | Absent | Deferred to Attendance | Ownership TBD |
| Asset Type/Assets | Asset Company/type and assigned Staff | HR detail/assets models | Company Asset Type exists | Asset module owns assignment; Employee detail links/summary | Lifecycle/return rules |
| Policy | Company policy, not Staff relationship | Company/HR models | Company Policy exists | Do not add Employee FK without evidence | None until Product need |
| Attendance | FK to Staff; Branch/geofence/remote/schedule/status | HR models/views | Separate module, current-user oriented | Employment ID + effective schedule; preserve old records | Eligibility/history/events |
| Leave | FK to Staff; manager/holidays/weekoff/status | HR models/services/views | Separate module/stubs | Employment ownership; preserve old requests | Entitlement/approval/history |
| Payroll | Payroll/Monthly_salary FK to Staff; bank/statutory/dates/status | Payroll models/views | Annual salary incorrectly in Employee | Payroll owns compensation; employment reference and protected inputs | Effective compensation/F&F/tax |
| Recruitment | Candidate conversion creates Staff/address/docs | Recruitment view/models | Client Candidate/Offer/Job orchestration | Atomic conversion/provenance; distinct from transfer | Idempotency/transaction |
| Account/Auth | optional one-to-one User, office email, active state, HR flags/companies | Account/HR models/views | Session roles/codes; no Employee account flow | Account separate from Employee lifecycle; close Company A access and create a new Company B Account | Authority/authorization/atomic coordination |
| Documents | StaffDocument FK; protected files | HR model/views/report | Separate EmployeeDocument resource plus embedded schema fields | Separate protected Company-scoped Employee resource | Ownership/security/versioning |

## Master ID migration

| Existing React field | Current type | Target ID | Source module | Required? | Migration issue |
|---|---|---|---|---|---|
| `company` | optional string | resolved Company ID/read-only | Company | Derived | Branch invariant; fixture mapping |
| `work_location` | required string | `branchId` plus separate display location if needed | Company Branch | Yes | Labels are not reliable IDs |
| `department` | required string | `departmentId` | Company | Yes | Duplicate labels; Company scope |
| `designation` | required string | `designationId` | Company | Yes | Optional Department relationship |
| `reporting_manager` | optional string | Employee/Employment ID | Employee | Optional | Tenant/team/cycle rules |
| `job_role` | optional string | `roleId` if Role survives | Administration/Account legacy; target owner open | Optional | No current Company Role master |
| `week_off` | optional string | `weekOffId` | Company | Optional legacy | Effective assignment/history |
| `holiday_master` | optional string | `holidayListId`/default resolution | Company | Optional legacy | Legacy master vs year-specific React list |
| Asset assignment | absent | `assetId`/assignment ID | Assets/Company | Separate | Not Employee scalar |

Never infer IDs from display labels. Migration requires an explicit mapping/reconciliation report; ambiguous or missing values are conflicts.

## Ownership model

- **Employee profile (Company-scoped):** names, personal contact, approved personal attributes, addresses and emergency contact stored for that Employee record. No shared Person resource is implied.
- **Protected identity:** Aadhaar name/number and PAN.
- **Employee employment data:** Company/Branch/Department/Designation/Role/manager, code, joining/end dates, five-value status, remote-clock authorization, Week Off/Holiday assignment.
- **Protected payment/statutory:** bank and UAN/PF/ESIC, with ownership/effective history still open.
- **Payroll:** compensation, Monthly salary, tax/Form16, payslips and Full & Final.
- **Documents:** separate protected resources owned by the Company-scoped Employee; cross-Company carry-forward remains a distinct decision.
- **Account/Security:** Company-specific User/Account, credentials, office email, active state and capabilities. No login or membership continuity is assumed across Companies.
- **Attendance/Leave/Assets:** owning-domain records referencing Employment/Employee.

## Transfer and history

**Identity architecture: RESOLVED.** The target model is `Company A -> Employee A` and, after a later joining, `Company B -> Employee B`. There is no shared Person entity or global Person ID. Close Employee A and create Employee B. Never reassign Employee A's Attendance, Leave, Payroll, tax, payslip, asset or document history to Employee B.

Employee A retains its code, Company, Branch, Department, Designation, Role/manager, scheduling assignments, status, joining/end dates and linked historical records. Its Company A Account/access is closed according to the still-open Account contract. Employee B receives a new Employee code, destination-valid masters, a new joining/status record, new schedule assignments and a new Account according to that contract. The records are not merged or moved. Bank/statutory/document carry-forward remains unresolved.

Employee A remains authorized Company A history. Company B access must not expose Company A records automatically. Whether an authorized administrative lookup may find both records for the same real-world individual remains a Product/Backend decision and must not create an authoritative Person relationship.

### Data carry-forward classification

| Classification | Data | Rule |
|---|---|---|
| SAFE TO PREFILL | name, personal email/phone, addresses and emergency-contact details | May appear only as an editable draft through an approved, authorized prefill flow; it is not identity evidence and is not an automatic record copy. |
| MUST BE RECONFIRMED | every prefilled value; DOB; Aadhaar name/number; PAN; optional personal attributes retained by CORE-01 | HR/user must explicitly verify for Employee B before submission; validation remains governed by CORE-02. |
| DO NOT AUTOMATICALLY COPY | Employee code; Company/Branch/Department/Designation/Role/manager; schedule; status/dates; Account, credentials and permissions; bank/statutory data; documents; Attendance, Leave, Payroll, tax, payslips, assets and all Company A history | Create or select destination-valid Employee B values under their owning contracts. Sensitive and document carry-forward requires a separate approved decision. |

## Conflicts and risks

- String master labels conflict with numeric Company IDs.
- Company is both an optional Employee string and derivable through Branch.
- React Employment Type has no legacy source; legacy Temp is a status.
- Required annual salary conflicts with Payroll ownership.
- Employee `is_active` conflates Employment and Account lifecycle.
- Holiday Master semantics differ from year-specific Holiday List.
- Shift has no Employee relationship.
- Direct create and Recruitment conversion produce different record breadth.
- Legacy assignments overwrite without effective history.
- CASCADE documents/records and no-op Employee deletion conflict with retention intent.
- Domain pages can form circular frontend imports if Employee consumes domain implementations directly; use service/query boundaries and IDs.

## Product decisions

1. CORE-12-Q1: Department/Designation compatibility and unscoped designation behavior.
2. CORE-12-Q2: Week Off/Holiday default, override and effective-history model.
3. CORE-12-Q3: bank/statutory carry-forward and ownership.
4. CORE-12-Q4: new-Company Account creation/activation under the separate-record model.
5. CORE-12-Q5: authorized historical cross-Company lookup without a global Person identity.
6. CORE-12-Q6: Asset return/reassignment behavior on closure/transfer.
7. CORE-12-Q7: linked Payroll/Attendance/Leave summary presence on Employee detail/list.

## Backend decisions

Company-scoped Employee identifier serialization; tenant scope; cross-Company duplicate detection; master validation/retirement; effective assignments; close-A/create-B orchestration; historical authorization; domain foreign-reference contracts; lifecycle events; bank/statutory/document ownership and carry-forward; new Account creation; Asset closure; Payroll/Attendance/Leave eligibility/history; migration conflict handling; and error/concurrency semantics.

## Protected-data and command boundaries

CORE-02-required Create inputs may be coordinated in one Create workflow, but ownership remains split across Company-scoped Employee profile/employment data, protected identity, protected bank/payment, protected statutory data and related addresses. Salary/compensation remains Payroll-owned and is not an Employee Create requirement. Documents, Account, Attendance, Leave, Assets and Recruitment provenance remain separate resources/domains.

Post-create mutations must use distinct Profile Edit, Protected Data, Organization, Lifecycle, Document, Account and Payroll actions. No generic all-field Employee PATCH is approved. Product actor scopes and bank/statutory history policy are resolved; exact capability identifiers, authoritative team relation, masks, sensitive export, backend authorization/projection/reveal/audit, bank activation/history persistence, statutory persistence and Payroll integration remain unresolved.

### Approved cross-module permission boundaries

- HR has full authorized Employee and Payroll/CTC access within Company scope, plus Employee document/Account administration and HR-only import/export/approved bulk operations.
- Manager has assigned-team, authorized-Company non-sensitive Employee profile view only. Manager may perform only owning-domain-approved team Attendance and Leave actions. Manager has no sensitive, Payroll, Document, Account, lifecycle, code or organization authority.
- Employee has read-only own Employee profile; masked own sensitive view with backend-authorized reveal; own document view/download; own Payroll summary/structure/payslips/tax/history; and own credential flows.
- Director cross-Company Employee/history view applies only to explicitly authorized Companies and grants no sensitive, Payroll, Document, Account, lifecycle or edit capability.
- Normal Company HR cannot search or open another Company's Employee records. No cross-Company view creates a shared Person identity.

## Lifecycle closure and domain history

The five Employee lifecycle values are Probation, Regular, Notice Period, Resigned and Temp. Legacy `is_active` and React Employment Type are not substitutes. Direct HR Create defaults Probation and permits Probation/Regular/Temp; Recruitment conversion forces Probation. Authorized HR may choose any of five through a dedicated lifecycle action. Notice/Resigned date requirements and closed-record correction policy are approved; exact backend operations/audit remain open.

Closing Employee A must retain its code, Company masters, joining/final lifecycle dates and all Company A history. Company A Account authorization closes through a separate coordinated Account action. Employee B starts with a new code, destination organization/schedule values, new joining/status data and a new Account. No Company A operational or protected record is reassigned.

| Domain | Employee A treatment | Employee B treatment | Remaining contract |
|---|---|---|---|
| Payroll/tax/payslips/F&F | Retain against Employee A | New Company B records only | Payroll + Backend close/finalization events |
| Attendance | Retain against Employee A | New Company B records only | Attendance + Backend eligibility events |
| Leave | Retain against Employee A | New Company B records only | Leave + Backend open-request/eligibility behavior |
| Assets | Retain Company A assignment/history | New Company B assignment only | Assets + Backend return/closure behavior |
| Documents | Retain against Employee A | No automatic copy | CORE-09 access/retention/carry-forward decisions |
| Bank/statutory | Retain Company A data/history | No automatic copy | Product/Payroll/Backend ownership/effective history |
| Account | Disable login; retain restricted F&F-pending Account, then authorized HR final closure | HR explicitly creates a new Account after Employee B exists | Backend states, email, atomicity and failure behavior |

## Approved Company/master integration

- Employee Create selects Company first, then a Branch belonging to it; invalid combinations are rejected.
- Company independently owns Branch, Department, Designation, Week Off and Holiday List masters. Department does not own Designation and Branch does not own Department.
- Masters are retained with Active/Inactive state, never normally hard-deleted. Existing assignments/history continue to resolve inactive masters; inactive masters cannot be selected for new assignments; reactivation restores selection. Company state is isolated.
- Employee selects one Company-owned Week Off and one Company-owned Holiday List. Employee cannot define custom rules. Multiple masters per Company are supported.
- Same-Company Branch change updates the same Employee, requires a Company-compatible Branch and audit, and never changes Employee code.
- Company change uses closure/new-Employee flow. Before Employee B creation, validate the full CORE-02 Create baseline. Employee B organization, Week Off and Holiday List are manually selected; nothing operational copies. Employee A exit/transfer date and Employee B joining date are independent.
- Shift is deferred from Employee Create/Edit. A future Company configuration flag may indicate Shift usage, but Shift module/assignment/mock data is not part of Employee now.
- Reporting Manager is Company-scoped; only HR assigns/changes it and changes require audit.

Backend dependencies: master IDs and Company compatibility, Active/Inactive persistence and historical resolution, transfer ordering/rollback, effective assignment/audit, code allocation, and Week Off/Holiday List consumption.
