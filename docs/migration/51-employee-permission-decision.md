# Employee Permission and Access-Control Decision

## 1. Status and audit result

CORE-08 Product policy is **RESOLVED** for HR, Manager team-profile scope, Employee self-view/reveal, document access, Payroll visibility, Account administration, import/export/bulk authority, Director cross-Company view and Manager Attendance/Leave authority. Exact capabilities, masks, sensitive exports, backend enforcement and owning-domain actions remain unresolved.

Authoritative source: `D:\techoma\PeoplePulse2.0`. The source contains **13 `HRResponsibility` Boolean flags, not 65** (`apps/account/models.py:64-82`). Repository-wide model search found no 65-flag HR responsibility model. `StaffProfile.can_clock_in_remotely` is an Employee attendance setting, not an administrator permission flag.

## 2. Legacy permission inventory and Employee-related mapping

| Flag | Domain relation | Employee relevance | Observed use | Classification |
|---|---|---|---|---|
| `can_handle_employee` | Employee | List/profile/report navigation | Sidebar HR and Reports visibility; Payroll tax helper also accepts it | Direct/broad |
| `can_handle_company` | Company/organization | Company masters used by Employee | Permission screen/sidebar concept | Indirect |
| `can_handle_recruitment` | Recruitment | Candidate conversion provenance | Navigation | Indirect |
| `can_handle_leave` | Leave | Employee Leave views/approvals | Permission screen/navigation | Linked domain |
| `can_handle_regularization` | Attendance | Employee Attendance regularization | Permission screen/navigation | Linked domain |
| `can_generate_salary` | Payroll | Employee Payroll mutation/tax helper | Permission screen; some Payroll server checks | Linked domain |
| `can_handle_salary_slip` | Payroll | Employee payslips/tax helper | Permission screen; some Payroll server checks | Linked domain |
| `can_manage_salary_appraisal` | Payroll/Appraisal | Employee compensation/appraisal | Model/admin; Employee screen does not save it | Linked domain |
| `can_manage_assets` | Assets | Assigned Employee assets | Navigation/permission screen | Linked domain |
| `can_manage_announcements` | Announcements | None direct | Navigation/permission screen | Not Employee permission |
| `can_manage_vendors` | Vendor | None direct | Model/admin; not saved by Employee permission UI | Not Employee permission |
| `can_manage_visitiors` | Visitor | None direct | Model/admin; not saved by Employee permission UI | Not Employee permission |
| `can_manage_expense` | Expense | Possible Employee expense relation | Model/admin; not saved by Employee permission UI | Indirect/UNKNOWN |

The nine checkboxes rendered/saved from Employee detail are Company, Employee, Recruitment, Leave, Regularization, salary generation, salary slips, Assets and Announcements (`templates/hr/employee/view.html:1455-1525`; `apps/account/views.py:390-416`). Four model flags are omitted. No flag separately authorizes Employee create, personal edit, bank, identity, statutory, organization change, lifecycle, document CRUD, account administration, import/export or bulk actions.

## 3. Navigation versus endpoint authorization

| Capability | Legacy navigation check | Legacy action check | Server-side enforcement | Evidence |
|---|---|---|---|---|
| Employee/HR navigation | `can_handle_employee` | None granular | Not demonstrated on core Employee views | `templates/layout/sidebar.html:51,93`; `apps/hr/views.py` |
| Employee list/detail | Menu hidden by broad flag | None | Detail/list handlers do not check flag | `Employees`, `employee_details` |
| Create/edit personal/work/team | Reached through HR navigation | None | No `HRResponsibility` check; inconsistent Company scope | `employee_create`, `employee_edit`, `update_work_info`, `update_team_info` |
| Bank | Tab visible on detail | None | Dedicated update Company-scopes Employee; no permission flag | `update_bank_account` |
| Documents | Tab/buttons visible | None | Get/view/update/delete lookup document by ID; upload lookup Staff by ID; no flag/object-owner guard | document handlers |
| Account administration | Permission tab/buttons visible | None | Account handlers lookup Staff by ID; no HR flag/tenant check | `apps/account/views.py:create_user`, email/password/permission actions |
| Payroll | CTC tab visible | Mixed | Some Payroll helpers enforce related flags; Employee-detail embedding is not itself guarded | `apps/payroll/views.py`; detail template |
| Attendance/Leave | Embedded tabs/data | Mixed/UNKNOWN | Many queries Company-scope; exact action guards vary | `apps/hr/views.py` |

UI hiding is not a security boundary. For audited Employee core actions, `can_handle_employee` is primarily navigation evidence, not reliable endpoint authorization.

## 4. Employee list access

Legacy `can_handle_employee` exposes HR navigation, but the Employee list endpoint has no demonstrated flag check. The list contains all active/resigned Company Employees, client search/filter/sort/page, and detail/edit plus a no-op delete route. No Employee import, bulk update or bulk delete was found. A separate status/date report exists; no general Employee export was proved. Manager access to the full list is UNKNOWN. Self-service uses a separate current-user profile route, not the list.

## 5. Profile and sensitive-data evidence

| Data | HR | Manager | Employee | Other | Legacy evidence |
|---|---|---|---|---|---|
| Personal/contact/address/emergency | Full view/edit via combined detail | UNKNOWN | Self-profile renders same broad template/data; edit exposure requires template/action audit | Route user may access ID-based handlers | No granular permission or masking |
| Aadhaar/PAN | Full values/edit | UNKNOWN | Full-value data is supplied; masking not found | Route user risk | Personal/Work templates and handlers |
| Bank/IFSC | Full values/edit | UNKNOWN | Self-profile queries BankAccount; masking not found | Route user risk | `employee_profile`, bank tab/handler |
| UAN/PF/ESIC | Full values/edit | UNKNOWN | Self-profile supplies Work data; masking not found | Route user risk | Work tab/handler |
| Salary/Payroll | Embedded full working/history | UNKNOWN | Self-profile queries Payroll/monthly salary | Route user/domain policy inconsistent | detail/profile views/templates |
| Organization/status/code/manager | Full view/edit | UNKNOWN | Self-profile supplies values | Route user risk | Work/Team |
| Documents | Full CRUD visible on HR detail | UNKNOWN | Self-profile queries documents; exact buttons/access UNKNOWN | ID endpoints unscoped | Document lifecycle |
| Account | Full administration actions on HR detail | UNKNOWN | Own password flows exist elsewhere; Employee-detail actions are not self-service proof | ID endpoints unguarded | Account handlers |

Legacy displays/provides full Aadhaar, PAN, bank, IFSC, UAN, PF, ESIC and salary values without field masking or a granular sensitive-data permission. Export/report exposure is inconsistent and not fully established. This is a security gap; it does not override approved HR full access and Employee masked self-view.

## 6. Document, account, organization and lifecycle actions

- Document view/download/upload/replace/delete have no demonstrated `can_handle_employee` check. Several handlers use document or Staff IDs without Company/owner scoping. HR management is approved; Manager and Employee access remain Product decisions.
- Create User, update office email, regenerate password and save HR responsibility flags have no demonstrated permission or `request.company` enforcement and lookup Staff by ID. Account activation/deactivation also occurs indirectly during status edits. Target Account administration needs a separate capability and backend enforcement.
- Branch, Department, Designation, manager, Role, Week Off, Holiday Master, Employee code, joining/end date and status share broad Work/Team handlers without separate authorization. CORE-03 assigns these changes to HR; backend must enforce Company-compatible objects and action-specific lifecycle/transfer rules.
- All five lifecycle values are selectable in Work Info without transition permission. Resignation approval has supervisor/HR concepts, but this does not prove general Manager Employee-edit access.

## 7. Manager findings

Legacy identifies a team leader through `is_team_leader` and provides manager navigation/team resignation/appraisal/approval concepts. It does not establish arbitrary access. Approved target scope is authoritative assigned-team, authorized-Company, non-sensitive profile view only plus owning-domain Attendance/Leave actions; backend relationship mapping/enforcement remains required.

## 8. Employee self-service findings

`employee_profile` resolves `StaffProfile` from `request.user`, which is strong self-object evidence. It loads personal/address, bank, documents, Payroll/monthly salary, Attendance, Leave, organization, assets and resignation data. The reused/broad context has no masking. Self attendance, leave, resignation and password capabilities exist in linked workflows. Evidence does not safely approve Employee edits to personal/address/bank/documents, office email, or account administration. The new target must return masked/omitted sensitive self data from the backend, not only mask it in React.

## 9. Tenant-scoping findings

Scoping is inconsistent:

- Employee list/create and many downstream queries filter by `request.company`; create validates Branch Company.
- Dedicated bank update Company-scopes Employee.
- `employee_details`, `employee_edit`, `update_work_info`, `update_team_info`, manager lookups and several Attendance actions initially fetch Employee by raw ID.
- Department/Designation/Branch assignment lookups in Work update do not prove Company compatibility.
- Document handlers fetch documents/Staff by raw IDs without consistent Company/owner checks.
- Account create/email/password/permission handlers fetch Staff by raw ID without Company/permission checks.
- HRResponsibility has a `companies` M2M, but core Employee handlers do not consistently enforce it.

These are legacy findings, not accepted target behavior. Backend must enforce active-Company membership and object/action scope on every request.

## 10. Current React comparison

| Capability | Legacy | React | Gap | Classification |
|---|---|---|---|---|
| Permission vocabulary | 13 broad HR flags | Nine typed codes including `employee.view`/`employee.write` | No approved mapping | INTENTIONALLY DIFFERENT |
| Employee navigation | Broad flag hides sidebar | `employee.view` filters nav | Comparable UI filtering only | PARTIAL |
| Route guard | Core endpoints inconsistently guarded | Authenticated + active Company only | Employee routes ignore permission code | MISSING |
| Action guard | No granular core checks | Employee pages/buttons do not use PermissionGate | Write distinction unused | MISSING |
| Backend enforcement | Inconsistent | Mock/API contract not proved | UI permissions cannot secure data | BACKEND REQUIRED |
| Self profile | Current-user legacy route | No self-profile route | Masked self-view absent | MISSING |
| Sensitive masking | None | None | Approved direction unimplemented | BACKEND REQUIRED |
| Tenant scope | Inconsistent Company filtering | Active Company session exists | Employee resource scope not proved | BACKEND REQUIRED |
| Manager team scope | Partial team concepts | Manager mock has `employee.view` | Assigned-team, authorized-Company, non-sensitive view-only scope approved; authoritative relationship/backend enforcement missing | BACKEND REQUIRED |
| Documents/account/lifecycle permissions | No granular flags | No dedicated codes/guards | HR lifecycle and Account administration approved; capability vocabulary/enforcement missing | BACKEND REQUIRED |

React `PermissionGate` and `usePermission` exist, and navigation is filtered, but Employee routes are guarded only by authentication/active Company. Frontend permissions are **not** a security boundary.

## 11. Proposed Product permission matrix

`ALLOW` below reflects approved Product direction only. `DENY` means no approved actor capability; it does not invent a backend code. `CONDITIONAL` requires domain/action context.

| Capability | HR | Manager | Employee | System/Backend |
|---|---|---|---|---|
| list/view/create | ALLOW | Assigned-team profile view only; no create | Own view only | Enforce tenant/object/team scope |
| edit personal/address | ALLOW | DENY | DENY | Validate/audit |
| edit organization/bank/statutory/status | ALLOW | DENY | DENY | Enforce protected/action rules |
| delete | DENY pending retention decision | DENY | DENY | Preserve history |
| deactivate/transfer | ALLOW as explicit workflow | DENY | DENY | Atomic lifecycle enforcement |
| Account create/activate/deactivate/change/final close | ALLOW through explicit authorized HR action | DENY | DENY | Enforce separate Account/F&F states and audit |
| documents view/download | ALLOW | DENY | Own only | Category/object access |
| documents upload/replace/delete/ZIP | ALLOW management; ZIP policy separate | DENY | DENY | Protected file enforcement |
| account management | ALLOW authorized HR | DENY | Own credentials only | Identity authorization |
| sensitive profile/bank/statutory | Full authorized | DENY | MASKED own with explicit authorized reveal | Project/reveal server-side |
| salary/payroll view | Full authorized | DENY | Own summary/structure/payslips/tax/history | Payroll authorization |
| salary edit/payroll run | CONDITIONAL by Payroll policy | DENY | DENY | Payroll enforcement |
| attendance/leave view/actions | CONDITIONAL by domain policy | Assigned team: approved domain-supported view/approval/regularization actions | Own CONDITIONAL | Domain enforcement |
| export/import/bulk | ALLOW authorized HR; no bulk delete implied | DENY | DENY | Tenant scope/redaction/audit |

## 12. Security architecture

`UI permission filtering → React route/action guard → API service → backend authorization`.

The backend must independently enforce authentication, active Company membership, Employee/object scope, actor/self/team scope, sensitive-data projection, document access, account actions, organization/lifecycle transitions, linked-domain permissions and audit. React must consume capabilities for usability, but hidden navigation/buttons never authorize an operation.

## 13. Product decisions

| ID | Question | Legacy evidence | Already decided | Unknown | Options | Recommended option | Impact |
|---|---|---|---|---|---|---|---|
| CORE-08-Q1 | What can Managers view for assigned Employees? | Team leader/team queries exist; no safe detail authorization | Manager is not HR | Basic/org vs Attendance/Leave/sensitive scope | None; basic; selected domain; broad | **Recommendation:** assigned-team basic profile/organization only initially | Manager experience/security |
| CORE-08-Q2 | May Employees edit profile/contact/address? | Self profile exists; safe edit authority not proved | Own view; sensitive masked | Editable fields and approval | None; selected direct; approval workflow | **Recommendation:** read-only initially; decide field allowlist later | Self-service/audit |
| CORE-08-Q3 | What masked bank/statutory fields may Employees see? | Full values supplied in legacy | Masked sensitive self-view | Field allowlist/mask/hide | Hide; last digits; field-specific | **Recommendation:** field-specific backend projection; default hide where no purpose | Privacy |
| CORE-08-Q4 | Which document categories may Employees/Managers access or upload? | Undivided legacy lifecycle | HR manages documents | Category actor matrix | None; view selected; upload selected; all | **Recommendation:** explicit category/action allowlist; Manager none initially | File security |
| CORE-08-Q5 | What salary/Payroll data may Employee/Manager view? | Legacy self and HR pages query Payroll | Payroll owns data | Payslip/CTC/history scope | None; payslips; summary; full | **Recommendation:** Employee own published payslips; Manager none absent purpose | Compensation privacy |
| CORE-08-Q6 | Who may manage accounts? | ID-based HR-page actions lack guards | Authorized HR manages create/activate/deactivate/change/final close; Employee and Manager do not administer | Backend capability names/enforcement and F&F states | Approved HR boundary | **APPROVED Product direction; BACKEND REQUIRED** | Account security |
| CORE-08-Q7 | Are Employee export/import/bulk actions required and for whom? | Status/date report; no general import/bulk found | None | Scope/fields/audit | None; HR selected; domain-specific | **Recommendation:** defer; separately approve redacted export | Data exfiltration |
| CORE-08-Q8 | Is sensitive reveal allowed? | Legacy full display | Employee masked | Reveal actor/purpose/audit | Never; HR only; audited exceptional | **Recommendation:** HR full under approved authority; no Employee reveal initially | Privacy/audit |
| CORE-08-Q9 | Can authorized users view previous employment across Companies? | No multi-employment history | History preservation approved | Tenant/legal scope | Current Company only; Person-authorized history; central HR | **Recommendation:** current Company sees its employment; broader history only explicit central authority | Cross-tenant isolation |
| CORE-08-Q10 | What Attendance/Leave actions can Managers perform? | Team approval concepts exist | Assigned-team view and owning-domain-supported approval/regularization/approve/reject actions approved | Exact owning-domain actions/backend enforcement | Domain-supported only | **APPROVED boundary; DOMAIN/BACKEND REQUIRED** | Domain authorization |

## 14. Backend decisions

Define canonical capability vocabulary/mapping; actor and self/team scope; tenant membership; field projection/masks; document category/action authorization; Account administration; lifecycle/transfer authorization; linked Payroll/Attendance/Leave checks; export redaction/audit; historical cross-Company access; denials/error shapes; and authorization tests. No endpoint or permission code is approved by this document.

## 16. Approved permission reconciliation

This section supersedes unresolved Product recommendations in sections 11 and 13. Capability names below are conceptual candidates, not legacy or backend-approved strings.

- **HR:** within authorized Company scope may view/create/edit Employees; manage organization, lifecycle, code, protected data, documents and Accounts; import/export; and perform approved bulk/lifecycle operations. HR has full authorized sensitive and Payroll/CTC access.
- **Manager:** may view normal non-sensitive profiles only for Employees in an authoritative assigned-team relationship within an authorized Company. Manager cannot create/edit Employees or access organization actions, lifecycle, code change, Accounts, documents, protected data or Payroll/CTC.
- **Manager Attendance/Leave:** may view assigned-team domain history/summaries and perform only Attendance/Leave actions approved by those domain contracts, including applicable approval/regularization and Leave approve/reject. This grants no Employee-module capability.
- **Employee:** may view only own profile; cannot edit Employee data, organization, lifecycle or code, or administratively manage Account. Employee may use own credential security flows.
- **Sensitive self-view:** Employee receives masked own protected values by default and may explicitly reveal the full own value after backend authorization. Exact masks are unresolved; documented PAN/Aadhaar/bank strings are examples only. View/reveal is not audited. Sensitive edits are audited, with minimum Employee, field/section, previous/new value or safe reference, actor, timestamp and reason where required; plaintext secrets must not be unnecessarily logged.
- **Documents:** HR manages. Employee may view/download own documents only. Employee cannot upload/replace/delete/ZIP; Manager has no document access. ZIP authorization remains separate.
- **Payroll:** separate domain. Employee may view own salary/CTC summary, exposed structure, payslips, tax/payroll information and history. Manager has none. Director cross-Company view does not grant Payroll access.
- **Import/export/bulk:** authorized HR only, including CSV/Excel/PDF/clipboard export and approved bulk operations. No bulk delete is inferred. Sensitive export fields/redaction remain Security/Backend decisions.
- **Director:** may view Employee records/history only across explicitly authorized Companies. This grants no edit, sensitive, Payroll, document, Account or lifecycle permission. Role name alone never grants capability.
- **Security boundary:** frontend route/navigation/gates are UX only. Backend must enforce authentication, Company scope, Employee object/self/team scope, action permission, sensitive projection/reveal, Payroll/Documents/Account, Director scope, import/export and bulk authorization.

Conceptual capability areas include Employee view/write/lifecycle/organization/code, sensitive view/edit, document view/manage, Payroll view, Account manage, import/export/bulk, team view, Attendance/Leave manage and cross-Company view. Exact identifiers remain BACKEND REQUIRED.

### Field and summary visibility refinements

- Employee profile editing is denied for names, Aadhaar name, optional personal attributes, contact, addresses, emergency contact, DOB, Aadhaar/PAN, bank/statutory, organization, manager, code and status.
- Emergency contact: HR view/edit; Employee own view; Manager assigned-team view only when included in the authorized non-sensitive profile.
- Reporting Manager: HR assigns/changes; Manager sees assigned-team relationship; Employee sees own manager; changes require audit.
- Employee Code: HR views and corrects through the dedicated audited action; Manager assigned-team view; Employee own view; no Manager/Employee edit.
- Status: HR views/changes through lifecycle action; Manager assigned-team view; Employee own view; no Manager/Employee change.
- Employee owns view access to assigned Assets but no asset management. Manager has no Employee asset management.

## 15. Legacy anomalies

- The claimed 65 HR flags are not present in the authoritative source; 13 exist.
- Four model flags are omitted from the Employee permission form/save handler.
- Broad Employee permission mainly hides navigation while core endpoints lack the corresponding check.
- Full sensitive data is rendered without masks.
- HR, Manager, Employee and arbitrary authenticated-user boundaries are inconsistent.
- Object and Company scoping varies between adjacent handlers.
- Document and Account ID actions lack consistent tenant/actor enforcement.
- Permission administration itself lacks demonstrated authorization.
- Account creation forces Regular status; status editing controls account activation.
