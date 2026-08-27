# Employee Lifecycle/Status Decision

## 1. Status and evidence rule

CORE-07 Product policy is **RESOLVED** for status inventory, Create selection/default, HR transition authority, Notice/Resigned dates, F&F Account direction, closed-record correction, list inclusion and Employee-code policy. Backend state/transaction/audit contracts and downstream Temp/closure behavior remain unresolved. Paths are relative to `D:\techoma\PeoplePulse2.0`.

## 2. Legacy status inventory

`StaffProfile.status` is an employment-level `CharField` with choices in `apps/hr/models.py:197-203,299`. It is distinct from `StaffProfile.is_active`, linked `User.is_active`, Payroll status, resignation-workflow status and leave-review status.

| Status | Legacy file | Meaning/evidence | Default? | Editable? | Actions allowed | Account behavior | Payroll behavior | Attendance behavior | Leave behavior |
|---|---|---|---|---|---|---|---|---|---|
| `0` Probation | `models.py:198`; create/view templates | Persisted Staff status and create choice | Model default | Yes in Work | No status-specific edit restriction found | Work save activates Staff/User | No general eligibility rule found | Not excluded by status | No status restriction found |
| `1` Regular | `models.py:199`; templates | Persisted Staff status; account creation also sets Regular | Not model default; selectable at create | Yes | No restriction found | Work save activates; account creation changes status to Regular | No general rule found | Not excluded | No restriction found |
| `2` Notice Period | `models.py:200`; Work edit only | Persisted label; no automatic transition from resignation request found | No; not direct-create option | Yes | Editing remains available | Work save activates Staff/User | No general rule found | Not excluded | No restriction found |
| `3` Resigned | `models.py:201`; Work edit and filters | Persisted terminal-looking label; direct Work selection triggers inactivity | No; not direct-create option | Yes | Detail remains addressable; many active lists exclude/reorder it | Work save deactivates Staff/User | Attendance summary caps at end date; Payroll history/query remains | Several lists exclude; existing records remain | Existing records remain queryable; no automatic cancellation found |
| `4` Temp | `models.py:202`; create/view templates | Persisted status, not a separate employment type | Direct-create option | Yes | No restriction found | Work save activates Staff/User | CTC JavaScript skips PF/ESIC/professional-tax calculations for displayed Temp; backend parity not established | Not excluded | No restriction found |

## 3. Creation status

The model default is **Probation (`0`)**, but the shipped direct-create form presents `Select`, Probation, Regular and Temp and posts the chosen value (`templates/hr/employee/create.html:879-890`). `employee_create` passes it to both Employee-code generation and `create_employee`; the service assigns `status=data.get("status")` (`apps/hr/views.py:1933-1979`; `apps/hr/services.py:127-215`). Therefore direct creation is **manually selected among Probation/Regular/Temp**, while Probation is only the model fallback when status is not explicitly supplied. Notice Period and Resigned are not create options.

Creation also sets Branch, joining date and generated code; Temp selects the `TEMP` code path (`apps/hr/views.py:98-141`). Direct Employee creation does not create a User or Payroll record. `is_active` defaults true. A later Account create action creates/links User and sets Employee status Regular; it is not Employee creation.

**Approved target:** direct HR Create defaults to Probation and authorized HR may select Probation, Regular or Temp. Notice Period and Resigned are excluded. Recruitment conversion always initializes Probation without an HR status selector. Employee Create never creates an Account automatically.

## 4. Confirmed transition matrix

Legacy has no transition validator. The Work form renders all five values and `update_work_info` directly overwrites the status. Consequently the evidence supports **any stored status → any rendered status**, not a business-approved transition graph.

| From | To | Trigger | Who | Side effects | Evidence |
|---|---|---|---|---|---|
| Any rendered status | `0`, `1`, `2` or `4` | Save Work Info | Route user; no granular guard proved | `StaffProfile.is_active=True`; linked `User.is_active=True` | `apps/hr/views.py:2397-2470` |
| Any rendered status | `3` | Save Work Info | Route user; no granular guard proved | `StaffProfile.is_active=False`; linked `User.is_active=False` | Same |
| Any/no prior status | `1` Regular | Create portal account | Route user; identity action | Creates User, links it, assigns office email/credentials, sets Regular | `apps/account/views.py:create_user` |
| Resignation request | Pending/Rejected/Approved/Full & Final workflow statuses | Resignation handlers/Payroll action | Supervisor/HR concepts appear, exact enforcement incomplete | Updates `ResignApplication`; no demonstrated automatic Staff status `2` or `3` transition | `apps/hr/models.py:825-844`; `apps/hr/views.py:3447-3856,6728-6819`; `apps/payroll/views.py:128-130` |

The last row is a **separate resignation workflow**, not a confirmed Employee-status transition.

## 5. Resigned behavior

- Selecting Employee status `3` in Work Info immediately deactivates Staff and linked User; selecting any other status reactivates both.
- `end_date` is independently optional/editable. The handler does not require it for Resigned and does not derive it from resignation dates.
- Employee list still queries all Company Staff and sorts Resigned last; the record remains viewable/addressable (`apps/hr/views.py:1868-1927`). Other dashboards, manager choices and regularization aggregates commonly exclude status `3` and/or require `is_active=True`.
- Historical Payroll, Attendance, Leave and documents are not deleted. Employee detail still queries them.
- Payroll attendance-summary calculation caps a resigned Employee’s calculation at `end_date` only when an end date exists (`apps/payroll/views.py:211-240`). No general proof that Payroll stops automatically exists.
- No evidence shows existing Attendance/Leave/Documents becoming inaccessible solely because status becomes Resigned.

## 6. Notice Period, Probation, Regular and Temp

- **Notice Period** is a real persisted Employee status and edit option. It is not a create option. No end-date requirement, account change, edit lock, organizational lock, Payroll stop, Attendance stop or Leave stop is implemented by status selection.
- **Probation** is persisted and the model default; it is also a selectable create/edit value.
- **Regular** is persisted and selectable; account creation forces it, coupling identity provisioning to employment lifecycle.
- **Temp** is persisted and selectable at create/edit. It drives TEMP-prefixed code generation during creation. Legacy CTC JavaScript treats it specially for PF/ESIC/professional-tax calculations, but this does not prove backend/legal rules.
- Legacy has **no separate Employment Type** field. React’s full-time/part-time/contract/intern enum must not be mapped to these statuses without a Product decision.

## 7. Account relationship

| Employee status | Staff active after Work save | Linked User active after Work save | Login possible |
|---|---|---|---|
| Probation | True | True if User exists | Inferred possible from `User.is_active`; authentication policy not audited |
| Regular | True | True if User exists | Same |
| Notice Period | True | True if User exists | Same |
| Resigned | False | False if User exists | Disabled by `User.is_active`; exact authentication handling not audited |
| Temp | True | True if User exists | Same |

Password regeneration and office-email update are separate Account actions and are not status-gated in the audited Employee page. The target must keep Employment status, Employment active/closed state and Account active state distinct even if a lifecycle action coordinates them.

## 8. Editability and Employee code

No legacy status disables the Personal, Bank, Work, Team, Document or Account UI/handlers. Resigned Employees remain addressable and can be changed back to another status, which reactivates Staff/User. This is evidence, not a recommended permission policy.

At creation, Branch plus status influences code: Temp uses the TEMP series; other statuses use the Branch series. The create-page JavaScript recalculates the proposed code when Branch or status changes. Later Work save directly accepts `emp_id`; status change itself has no server-side regeneration. Branch and code can be edited together, but no invariant or uniqueness check was found. Inter-company transfer does not exist in legacy.

## 9. Downstream dependencies

### Payroll

Payroll is separately created and has its own active/inactive status. Employee status is not a demonstrated general Payroll eligibility gate. Confirmed dependencies are the resigned/end-date attendance-summary cap, Temp-sensitive client CTC calculations, preservation of Monthly_salary/Payroll history, and a Full & Final resignation workflow state. Exact Payroll stop/finalization behavior is **UNKNOWN**.

### Attendance

Existing Attendance is preserved and displayed. Several dashboards/regularization queries exclude resigned Employees, and background absence processing selects `StaffProfile.is_active=True`. No evidence shows Probation/Regular/Notice/Temp changing Attendance eligibility. Clock-in authentication plus active-state interaction requires backend audit.

### Leave and resignation

Leave records remain linked and Employee detail queries them. No Employee-status transition cancels or blocks Leave in the audited handlers. Resignation has its own Pending/Rejected/Approved/Full & Final state, resignation date, optional last date, approvals and withdrawal rules. Approval does not demonstrably set Employee Notice/Resigned or `end_date`; these models can diverge.

### Documents and assignments

No lifecycle status restricts document CRUD or prevents Branch/Department/Designation/manager changes. Status save and assignment changes occur in the same broad handler without history.

## 10. List and filter behavior

Legacy Employee list includes status text/badge coloring, client-side status filter and search/sort/page through Grid.js (`templates/hr/employee/list.html:112,223-239,331-340`). The server includes all Company Employees and orders Resigned last rather than removing them. Actions use the same detail and no-op delete routes regardless of status. Current React list shows employment type and `is_active` is neither a full lifecycle display nor filter.

## 11. React parity gap

| Capability | Legacy | Current React | Gap | Target classification |
|---|---|---|---|---|
| Five Employee statuses | Persisted/displayed/editable | Absent | Boolean cannot represent lifecycle | PARITY REQUIRED |
| Creation status | Manual Probation/Regular/Temp; model fallback Probation | Employment type required; no status | Concepts conflated/missing | PRODUCT DECISION |
| Notice/Resigned | Editable statuses | Absent | No lifecycle workflow | PRODUCT DECISION |
| End date | Optional independent field | Absent | Closure cannot be represented | PARITY REQUIRED |
| Staff active vs status | Separate but coupled by edit handler | `is_active` only | Lifecycle lost | BACKEND REQUIRED |
| Account active | Separate User state | Absent | No identity lifecycle | BACKEND REQUIRED |
| Status transition rules | Unrestricted overwrite | None | Target policy absent | PRODUCT DECISION |
| Status filtering | Client filter/badges | None | List parity gap | PARITY REQUIRED |
| Employee code interaction | Temp affects create code; later manual | Mock code | Allocation/invariance absent | BACKEND REQUIRED |
| Resignation workflow | Separate approval model | Absent | Mapping to employment closure absent | PRODUCT DECISION |
| Historical downstream data | Retained/queryable | No closed-Employee history view | Cannot present retained Company A history under the approved separate-record model | BACKEND REQUIRED |
| Separate employment type | NOT PRESENT | Required enum | No legacy authority | NOT PRESENT |

## 12. Approved lifecycle boundary

Keep the Company-scoped `Employee` and its separate `Account` conceptually distinct. Employee owns its status, Company/Branch assignments, Employee code, joining/end dates and closure history. Account owns User/credentials and active/login state. There is no shared Person entity, global Person ID or Account spanning Companies. Preserve exactly five lifecycle values and authorized HR any-to-any selection through dedicated lifecycle actions; do not equate status with Employment Type. This is not a database schema or endpoint decision.

Company change is not record transfer: close Employee A and create independent Employee B. Employee A keeps its Company A code, assignments, dates, Account history and all domain history. Employee B receives a new code, destination assignments, new joining/status data and a new Account under the still-open Account contract.

## 13. Product decisions and resolutions

| ID | Question | Legacy evidence | Already decided | Unknown | Options | Recommended option | Impact |
|---|---|---|---|---|---|---|---|
| CORE-07-Q1 | What transitions among the five confirmed statuses are allowed? | Work save allows any-to-any | HR controls lifecycle edits | Business graph and reversibility | Preserve unrestricted; constrained graph; command-based transitions | **Recommendation:** explicit command-based transition graph preserving all five migration values | Validation/audit/UI actions |
| CORE-07-Q2 | Which status is default for direct creation? | UI manually selects Probation/Regular/Temp; model default Probation | Legacy-required fields preserved | Whether manual choice remains | Probation default; manual three-choice; derive | **Recommendation:** default Probation with explicit privileged override if business-required | Create behavior/reporting |
| CORE-07-Q3 | What dates are required for Notice and Resigned? | Start/end independent; resignation has separate dates | Employment closure/history required | Effective-date rules and source of truth | Optional; require end date; derive from approved last date | **Recommendation:** require an effective closure/end date for Resigned; reconcile approved last-working date explicitly | Payroll/Attendance/history |
| CORE-07-Q4 | How does resignation workflow drive Employee status? | Separate states can diverge; no automatic mapping proved | Old employment must close | Mapping/timing/cancellation | Manual only; approval→Notice; last day→Resigned; configurable | **Recommendation:** explicit approved workflow mapping, with effective transition on Product-selected event | Prevents inconsistent records |
| CORE-07-Q5 | Should non-Resigned status automatically reactivate Staff and Account? | Legacy does so on every Work save | Employment and Account are separate | Authorization/security conditions | Preserve coupling; decouple; explicit coordinated action | **Recommendation:** decouple generic status edit; use explicit audited account activation | Security |
| CORE-07-Q6 | What can be edited after closure? | Legacy permits all edits/reactivation | Historical employment must remain | Correction versus mutation policy | Fully editable; read-only; privileged corrections | **Recommendation:** read-only closed employment with audited privileged corrections | Historical integrity |
| CORE-07-Q7 | Does Temp remain a status, and what does it mean for code/Payroll? | Persisted status; TEMP code; client CTC differences | No separate legacy employment type | Target meaning and downstream rules | Preserve status; map after policy; retire | **Recommendation:** preserve for migration, decide semantics before code/Payroll rules | Code and Payroll |
| CORE-07-Q8 | Which statuses appear in active lists and selectable assignments? | Resigned sorted/excluded inconsistently; `is_active` also filtered | History remains accessible | Active definition/list defaults | Status-based; active-flag; effective employment dates | **Recommendation:** effective-current employment view with explicit all/history filter | Lists and references |

## 14. Backend decisions

Backend must define status serialization and legacy mapping; transition commands, authorization, effective dates and audit; atomic Employee/Account coordination; resignation integration; active/current queries; Employee-code behavior; downstream Payroll/Attendance/Leave events; historical immutability/correction; concurrency/errors; close-A/create-B orchestration; and authorized cross-Company lookup without a shared identity. No endpoint or database implementation is approved.

## 15. Legacy anomalies

- Model default and direct-create manual selection are different concepts.
- Service explicitly passes possibly empty status instead of relying safely on the model default.
- Account creation changes employment status to Regular.
- Any non-Resigned Work save reactivates both Staff and User.
- Resigned does not require `end_date`.
- Resignation approval and Employee status/end date are not demonstrably synchronized.
- Temp is used as status, code-series switch and client Payroll-calculation switch.
- List/filter code inconsistently uses `status='3'`, `is_active`, or both; one dashboard query compares the choice field with `'Active'`.
- Status/Branch/code/assignments/statutory data are overwritten in one handler without history.

## 16. Phase 3O lifecycle and Company-change decision table

**Status: PRODUCT DECISIONS RESOLVED; BACKEND/DOMAIN CONTRACTS PARTIAL.** Architecture, status selection, any-to-any authorized HR lifecycle actions, required dates, historical preservation, correction policy, Account/F&F direction and Employee-code Product policy are resolved.

| Area | Legacy confirmed behavior | Approved Product behavior | Remaining unknown | Decision authority | Status |
|---|---|---|---|---|---|
| Lifecycle status | Probation, Regular, Notice Period, Resigned, Temp | Preserve five lifecycle values; never replace with Employment Type or `is_active` | Target meanings/mapping details | Product + Backend | RESOLVED for inventory; PARTIALLY RESOLVED overall |
| Create status | Model fallback Probation; UI permits Probation/Regular/Temp | Notice Period/Resigned are not normal Create choices; no new default invented | Target default versus privileged three-choice selection | Product | PRODUCT DECISION REQUIRED |
| Transition rules | Work edit permits any rendered status to any other | HR controls lifecycle actions; legacy overwrite is not automatically target policy | Allowed graph, reversibility and commands | Product + Backend | PRODUCT + BACKEND REQUIRED |
| Joining date | Required at legacy Create | Employee B receives a new joining date; Employee A's date is retained | Correction/effective-date rules | Product + Backend | PARTIALLY RESOLVED |
| End date | Optional and independent; Resigned does not require/populate it | Separate from status and joining date; Employee A retains final value | Mandatory-on-close, derivation, correction actor/timing | Product + Backend | PRODUCT + BACKEND REQUIRED |
| Resignation | Resigned deactivates Staff/User; separate resignation workflow is not synchronized | Do not delete; retain Employee/history; coordinate access closure explicitly | Workflow-to-status/end-date mapping | Product + Backend | PARTIALLY RESOLVED |
| Closure | Record and history remain; delete is not mechanism | Employee A is closed/resigned and retained | Exact close command/currentness semantics | Product + Backend | PARTIALLY RESOLVED |
| Account closure | Linked User becomes inactive on legacy Resigned Work save | Company A authorization must close; Account remains separate | Atomicity, failure handling and authority | Identity + Product + Backend | PARTIALLY RESOLVED |
| Employee code | Branch/Temp-sensitive generation; later editable; uniqueness not proven | Employee A keeps old code; Employee B gets a new code | Scope, algorithm, immutability, correction, concurrency | Product + Backend | PARTIALLY RESOLVED |
| Closed Employee editing | Legacy allows broad edit/reactivation | No ordinary edit assumed; HR-readable retained history | Read-only versus audited privileged corrections and exact fields | Product + Backend | PRODUCT + BACKEND REQUIRED |
| Company change | No legacy transfer flow | Close Employee A plus create Employee B; never move/merge records | Orchestration/retry/reconciliation UX | Product + Backend | RESOLVED architecture; BACKEND DECISION REQUIRED |
| New Company Employee | No legacy evidence | New Employee B, code, joining/status, destination assignments and schedule | Create status/schedule defaults and transaction details | Product + Backend | PARTIALLY RESOLVED |
| History preservation | Payroll/Attendance/Leave/Documents remain linked | Every Company A record stays with Employee A | Retention/authorized presentation by domain | Domain + Backend | RESOLVED architecture; PARTIALLY RESOLVED details |
| Payroll | History retained; general stop rule not proved | Company A Payroll/tax/payslips/F&F stay with Employee A; B starts its own records | Stop/finalization/events | Payroll + Backend | DOMAIN + BACKEND REQUIRED |
| Attendance | Existing records retained; some active queries exclude Resigned | Company A Attendance stays with Employee A | Eligibility/close events | Attendance + Backend | DOMAIN + BACKEND REQUIRED |
| Leave | Existing records retained; no automatic cancellation proved | Company A Leave stays with Employee A | Eligibility/open-request closure | Leave + Backend | DOMAIN + BACKEND REQUIRED |
| Assets | Exact lifecycle handling not established | Company A asset history stays with Employee A; no reassignment implied | Return/closure/new assignment workflow | Assets + Backend | DOMAIN + BACKEND REQUIRED |
| Documents | Existing documents retained; status does not restrict CRUD | Company A documents remain with Employee A; no automatic copy | Retention/access/carry-forward policy under CORE-09 | Product + Security + Backend | PARTIALLY RESOLVED |
| Bank/payment | Mutable related legacy record; no lifecycle history | Company A data/history stays with Employee A; no automatic copy | Closure/effective history/Payroll relationship | Product + Payroll + Backend | PRODUCT + BACKEND REQUIRED |
| Statutory | Staff scalars/dates; no transfer model | Company A statutory history stays with Employee A; no automatic copy | Closure/effective history/ownership | Product + Payroll + Backend | PRODUCT + BACKEND REQUIRED |
| Account | Separate optional User; provisioning forces Regular | Employee B gets a new Account; no User/login/credential/permission reuse | Creation/activation authority, email and failure rules | Identity + Product + Backend | PRODUCT + BACKEND REQUIRED |
| Historical cross-Company lookup | No shared/multiple-employment model | No global Person history or automatic Company A disclosure | Whether an explicit authorized lookup exists | Product + Security + Backend | PRODUCT + BACKEND REQUIRED |

### Transition decision matrix

No row below approves a target transition. Every potential transition requires Product rules and backend enforcement.

| Current status | Potential target statuses | Actor | Required date | Account consequence | Audit consequence | Status |
|---|---|---|---|---|---|---|
| Probation | Probation, Regular, Notice Period, Resigned, Temp | Authorized HR only; exact capability TBD | Effective/end-date rules TBD | No implicit activation; Resigned must coordinate closure | Actor/time/from/to/reason/effective date required | PRODUCT + BACKEND REQUIRED |
| Regular | Probation, Regular, Notice Period, Resigned, Temp | Authorized HR only; exact capability TBD | Effective/end-date rules TBD | No implicit activation; Resigned must coordinate closure | Same | PRODUCT + BACKEND REQUIRED |
| Notice Period | Probation, Regular, Notice Period, Resigned, Temp | Authorized HR only; exact capability TBD | Notice/last/end-date rules TBD | No implicit change until approved command | Same | PRODUCT + BACKEND REQUIRED |
| Resigned | Probation, Regular, Notice Period, Resigned, Temp | Privileged correction/reactivation authority TBD | Correction/effective dates TBD | Never reactivate Account through generic status edit | Same plus correction reason | PRODUCT + BACKEND REQUIRED |
| Temp | Probation, Regular, Notice Period, Resigned, Temp | Authorized HR only; exact capability TBD | Effective/end-date rules TBD | No implicit activation; Resigned must coordinate closure | Same | PRODUCT + BACKEND REQUIRED |

### Do not automatically copy to Employee B

Employee code, Company, Branch, Department, Designation, Role, Reporting Manager, Week Off, Holiday List, Shift, lifecycle status, joining/end dates, Account, credentials, permissions, bank, statutory, documents, Payroll, Attendance, Leave, Assets, tax, payslips and Company A history. An authorized ordinary-profile draft may be offered later, but it is not identity proof and every value must be reconfirmed.

## 17. Approved lifecycle reconciliation

This section is authoritative and supersedes unresolved Product recommendations in sections 13 and 16. Legacy observations remain evidence, not target rules.

### Approved lifecycle rules

- Direct HR Create defaults to **Probation**; authorized HR may select **Probation, Regular or Temp**. Notice Period and Resigned are excluded.
- Recruitment conversion initializes **Probation** automatically; HR does not select initial status during conversion.
- Authorized HR may change status from any of the five values to any of the five values through a dedicated lifecycle action. No restrictive Product transition graph applies, and status is never an ordinary profile PATCH.
- Notice Period requires `end_date`/last-working date; `notice_start_date` is optional and distinct.
- Resigned requires `resignation_date` and `end_date`/last-working date. The separate Resignation workflow does not synchronize these automatically under the current contract.
- Resigned retains Employee and history permanently, disables former-Employee login, and retains the Account in a restricted F&F-pending administrative state. The expected F&F window is approximately 30–45 days; authorized HR may permanently close the Account after F&F. Exact backend states and transactions remain unresolved.
- A closed Employee is read-only by default. Authorized HR may perform specific corrections through dedicated actions with audit. Minimum audit information: Employee, changed by, changed at, field/section, previous value, new value and required reason. Exact schema remains backend-owned.
- Temp means contract/temporary workforce. Its Payroll, Attendance, CTC and duration rules remain with those domains. Do not add Employment Type to represent Temp.
- The default Employee list includes Probation, Regular, Notice Period and Temp. Resigned is available through explicit status filtering.

### Approved Employee-code policy

- Company owns a configurable Employee Code Prefix and Company-scoped sequence.
- Code is `Company prefix + Company-controlled sequence`, unique within Company, and sequence values are never reused after resignation/closure.
- Branch does not determine or regenerate an existing code. Branch changes never change the code.
- Employee A retains its code permanently. Employee B receives a new Company B prefix/sequence code.
- Authorized HR has a dedicated **Change Employee Code** capability, separate from profile edit. New code and reason are required; Company uniqueness, permission and audit are required. Audit minimum: Employee, old code, new code, reason, changed by and changed at.
- Concrete allocation, formatting beyond prefix/sequence, concurrency and persistence remain backend decisions.

### Approved Account administration

Employee creation never creates an Account automatically. Account is a separate explicit authorized HR action after Employee creation. HR controls create, activate, deactivate, authorized changes and final closure after F&F. Employee and Manager do not administer Accounts; Manager authority remains unresolved generally but is not approved here. Employee B requires a newly created Account with no User, credential, permission or membership reuse.

## 18. Exit-date self-service reconciliation

Notice Period retains Employee login, own active-document view/download, own Payroll/payslip access and normal approved self-service through the configured Exit/End/Last Working Date. At that date, login and Employee document, Payroll/payslip and other self-service access are disabled. During the approximate 30–45-day F&F period the Account remains available only to authorized HR; the former Employee has no login. Authorized HR may close it after F&F. Exact scheduling, Account states and atomic enforcement remain backend-owned.
