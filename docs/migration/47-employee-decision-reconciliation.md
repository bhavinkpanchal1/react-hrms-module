# Employee Decision Reconciliation

## 1. Executive summary

Phase 3D removed the legacy-source evidence blocker. The Django implementation at `D:\techoma\PeoplePulse2.0` now establishes what the old Employee domain did, including its fields, routes, statuses, list controls, documents, account workflow, hierarchy, Candidate conversion, and downstream integrations. The detailed evidence and paths remain in `46-legacy-employee-source-audit.md`.

This reconciliation does not adopt legacy behavior as the target product and does not define a future API. It separates three layers:

1. **Legacy fact** — statically demonstrated by the old source.
2. **Product choice** — whether and how the new application retains or changes that behavior.
3. **Backend contract** — the authoritative future representation, validation, authorization, and transaction behavior.

Result: LEG-01–LEG-11 are answered by evidence, all PROD-02–PROD-90 remain Product decisions despite being legacy-informed, and all BE-01–BE-23 remain Backend-required. Only EMP-001 is resolved; Employee implementation is not ready.

## 2. Legacy evidence impact

The audit changes the evidence baseline as follows:

- Employee is `hr.models.StaffProfile`, with related generic addresses/banks and `StaffDocument` records (`apps/hr/models.py`).
- Legacy has five Staff statuses and a separate four-state resignation request; selecting Resigned deactivates Staff and linked User (`apps/hr/models.py`, `apps/hr/views.py:update_work_info`).
- Company is indirect through Branch; Department, Designation, Week Off, Holiday Master, and supervisor are foreign keys. Shift is not assigned to Staff (`apps/hr/models.py:StaffProfile`).
- Employee code is Company-scoped Branch-series or `TEMP` plus max+1, without a database uniqueness constraint (`apps/hr/views.py:generate_branch_emp_id`).
- The list uses Grid.js client search/sort/pagination; no list filters, import, or bulk mutation were found. A separate Employee report supports date/status filtering (`templates/hr/employee/list.html`, `apps/report/views.py:employee_report_data`).
- Detail/self-profile combine personal, work, bank, documents, team, account/permissions, attendance, leave, payroll, assets, and resignation (`apps/hr/views.py:employee_details`, `employee_profile`; corresponding templates).
- The actual `HRResponsibility` model has 13 flags, not 65. Only broad `can_handle_employee` navigation use was demonstrated; core endpoints do not show granular action enforcement (`apps/account/models.py`, `apps/account/templatetags/hr_permissions.py`, `templates/layout/sidebar.html`).
- Documents have five categories, five allowed MIME families, a 10 MiB limit, CRUD/replace, inline view, report, and synchronous ZIP. Private storage exists, but handler authorization is weak or commented out (`apps/hr/models.py:StaffDocument`, `apps/hr/views.py`, `apps/report/views.py:download_documents`).
- Login provisioning occurs later, uses office email and a fixed initial password, links User, changes Staff to Regular, and emails credentials; regeneration emails a random password (`apps/account/views.py:create_user`, `regenerate_password`).
- Candidate conversion is database-atomic and copies selected personal/address/document data, but does not require an accepted Offer in the conversion function or create an account (`apps/recruitment/views.py:create_employee`).

These facts replace legacy UNKNOWNs only. They do not pass a Product or Backend gate.

## 3. LEG-01–LEG-11 reconciliation

| ID | Original question | Legacy evidence | Status | Source |
|---|---|---|---|---|
| LEG-01 | Is complete legacy Employee source available; who supplies it and when? | Available and audited at `D:\techoma\PeoplePulse2.0`. | ANSWERED | `46`, sections 1–2 |
| LEG-02 | Complete field inventory, types, defaults, requiredness and editability? | StaffProfile plus AddressDetails, BankAccount, StaffDocument and section handlers are inventoried. Requiredness differs between nullable model fields and create-service lookups. | ANSWERED | `46`, sections 4–5; `apps/hr/models.py`; `apps/hr/services.py:create_employee` |
| LEG-03 | All Employee routes and user-facing actions? | List/create/edit/detail/self-profile, work/bank/team/documents, resignation, assets, salary/letters, account, Candidate conversion and reports traced. | ANSWERED | `46`, section 3; app URL files |
| LEG-04 | Status values, labels and transitions? | Staff: Probation, Regular, Notice Period, Resigned, Temp. Resignation request: Pending, Rejected, Approved, Full & Final. Observed activation coupling is documented; a formal transition graph is absent. | ANSWERED | `46`, section 6; `apps/hr/models.py`, `apps/hr/views.py:update_work_info` |
| LEG-05 | Names/meanings of the reported 65 permission flags relevant to Employee? | Premise corrected: actual HRResponsibility has 13 flags; only `can_handle_employee` is directly Employee-facing and observed on navigation. No granular Employee action flags exist. | ANSWERED | `46`, section 9; `apps/account/models.py` |
| LEG-06 | Detail/profile layout and section/tab behavior? | HR detail and self-profile content, related queries and actions are traced. | ANSWERED | `46`, section 7; `apps/hr/views.py:employee_details`, `employee_profile`; templates |
| LEG-07 | Document taxonomy, validation and lifecycle? | Five categories, MIME allowlist, 10 MiB, multiple files, CRUD/replace/view/ZIP, timestamps, no verification/expiry/version history. | ANSWERED | `46`, section 10; `apps/hr/models.py:StaffDocument` |
| LEG-08 | Import/export behavior, fields and formats? | No Employee import found. Separate Employee JSON report, document report/ZIP, and generated letter/PDF downloads exist. | ANSWERED | `46`, sections 7 and 12; `apps/report/views.py` |
| LEG-09 | Bulk selection/actions? | No Employee bulk selection or mutation route/template behavior found. | NOT PRESENT | `46`, sections 3 and 12 |
| LEG-10 | Account provisioning/password/email workflow? | Separate later provisioning and password-regeneration workflows are traced, including persistence/email limitations. | ANSWERED | `46`, section 11; `apps/account/views.py` |
| LEG-11 | Team/reporting hierarchy and approvals? | Optional single supervisor, MPTT multi-level hierarchy/direct reports, with Leave/attendance/resignation/appraisal use; cross-company/self/cycle checks not shown. | ANSWERED | `46`, sections 8 and 11; `apps/hr/models.py:StaffProfile` |

Counts: 10 ANSWERED, 0 PARTIAL, 0 UNKNOWN, 1 NOT PRESENT.

## 4. PROD-02–PROD-90 reconciliation

Every row remains a Product decision. “Confirmed” means the factual legacy side is known, not that retention is approved. Evidence references are to `46-legacy-employee-source-audit.md` unless an exact legacy symbol is named.

### Employee model and master relationships

| ID | Legacy evidence | Product decision required? | Recommended status | Evidence |
|---|---|---|---|---|
| PROD-02 | Complete legacy field set is known. | Yes—select target fields. | STILL PRODUCT DECISION | §4 |
| PROD-03 | Model/service/template requiredness is known and inconsistent in places. | Yes—approve target requiredness. | STILL PRODUCT DECISION | §§4–5 |
| PROD-04 | Legacy section handlers show editable fields and no broad state restrictions. | Yes—approve target editability. | STILL PRODUCT DECISION | §§4, 7 |
| PROD-05 | ID is generated but later editable; provenance/version fields are absent. | Yes—approve immutable fields. | STILL PRODUCT DECISION | §§4–5, 7 |
| PROD-06 | One indirect Company through Branch; no assignment history. | Yes. | STILL PRODUCT DECISION | §8 |
| PROD-07 | Single Branch FK; create requires it; no history. | Yes. | STILL PRODUCT DECISION | §§4, 8 |
| PROD-08 | Single optional Department FK; create service requires it. | Yes. | STILL PRODUCT DECISION | §§4, 8 |
| PROD-09 | Single optional Designation FK; create service requires it. | Yes. | STILL PRODUCT DECISION | §§4, 8 |
| PROD-10 | Shift master exists but no Employee FK. | Yes—absence is not a target decision. | STILL PRODUCT DECISION | §§4, 8 |
| PROD-11 | Single optional Week Off FK, not effective-dated. | Yes. | STILL PRODUCT DECISION | §§4, 8 |
| PROD-12 | Single optional Holiday Master FK, not effective-dated. | Yes. | STILL PRODUCT DECISION | §§4, 8 |

### Lifecycle

| ID | Legacy evidence | Product decision required? | Recommended status | Evidence |
|---|---|---|---|---|
| PROD-13 | Five Staff statuses and four resignation-request statuses are known. | Yes—approve target lifecycle. | STILL PRODUCT DECISION | §6 |
| PROD-14 | Resigned sets Staff/User inactive; history semantics are absent. | Yes—define target meaning/retention. | STILL PRODUCT DECISION | §6; `update_work_info` |
| PROD-15 | Temp is Staff status `4` and changes code prefix to TEMP. | Yes—decide lifecycle versus classification. | STILL PRODUCT DECISION | §§5–6 |
| PROD-16 | No other Staff statuses found. | Yes—decide additions. | STILL PRODUCT DECISION | §6 |
| PROD-17 | Status edit and resignation approvals exist, with inconsistent guarding. | Yes—approve actors. | STILL PRODUCT DECISION | §§3, 6, 9 |
| PROD-18 | Delete-named handler does not delete. | Yes—approve retention/deletion. | STILL PRODUCT DECISION | §§3, 6 |
| PROD-19 | Resign/deactivate exists; terminate does not. | Yes—approve target actions. | STILL PRODUCT DECISION | §6 |
| PROD-20 | Many records depend on Staff; no lifecycle retention policy/history exists. | Yes. | STILL PRODUCT DECISION | §§6, 8, 12 |

### Sensitive information and permissions

| ID | Legacy evidence | Product decision required? | Recommended status | Evidence |
|---|---|---|---|---|
| PROD-21 | Aadhaar/name fields are stored and displayed unmasked. | Yes. | STILL PRODUCT DECISION | §§4, 9 |
| PROD-22 | PAN stored/displayed unmasked. | Yes. | STILL PRODUCT DECISION | §§4, 9 |
| PROD-23 | Salary/payroll data appears in detail/report contexts without field policy. | Yes. | STILL PRODUCT DECISION | §§7–9 |
| PROD-24 | Bank fields stored/displayed without masking policy. | Yes. | STILL PRODUCT DECISION | §§4, 9 |
| PROD-25 | UAN stored/displayed without masking policy. | Yes. | STILL PRODUCT DECISION | §§4, 9 |
| PROD-26 | PF number/dates stored/displayed without field policy. | Yes. | STILL PRODUCT DECISION | §§4, 9 |
| PROD-27 | ESIC number/dates stored/displayed without field policy. | Yes. | STILL PRODUCT DECISION | §§4, 9 |
| PROD-28 | DOB stored/displayed unmasked. | Yes. | STILL PRODUCT DECISION | §§4, 9 |
| PROD-29 | Two addresses stored/displayed unmasked. | Yes. | STILL PRODUCT DECISION | §§4, 9 |
| PROD-30 | Contact/emergency data stored/displayed unmasked. | Yes. | STILL PRODUCT DECISION | §§4, 9 |
| PROD-31 | Document metadata/files exposed by weakly guarded handlers. | Yes. | STILL PRODUCT DECISION | §§9–10 |
| PROD-32 | Broad Employee navigation flag exists; no list action guard proved. | Yes. | STILL PRODUCT DECISION | §9 |
| PROD-33 | HR detail/self-profile exist without a granular capability model. | Yes. | STILL PRODUCT DECISION | §§3, 9 |
| PROD-34 | Create exists; no distinct permission flag/guard proved. | Yes. | STILL PRODUCT DECISION | §§3, 9 |
| PROD-35 | Edit handlers exist; no distinct permission flag/guard proved. | Yes. | STILL PRODUCT DECISION | §§3, 9 |
| PROD-36 | Status/resignation actions exist; delete is a no-op; granular authorization absent. | Yes. | STILL PRODUCT DECISION | §§3, 6, 9 |
| PROD-37 | All document actions including ZIP exist; distinct authorization absent. | Yes. | STILL PRODUCT DECISION | §§9–10 |
| PROD-38 | Payroll flags exist, but Employee salary-field policy is not granular. | Yes. | RESOLVED: HR full authorized; Employee own Payroll; Manager none; backend capability contract required | §§8–9; approved permission reconciliation |
| PROD-39 | No bank/statutory-specific permission found. | Yes. | STILL PRODUCT DECISION | §9 |
| PROD-40 | No identity-field-specific permission found. | Yes. | STILL PRODUCT DECISION | §9 |
| PROD-41 | Employee import is not present. | Yes—decide whether target needs it. | STILL PRODUCT DECISION | §12 |
| PROD-42 | Employee/document reports and ZIP exist without an export capability matrix. | Yes. | STILL PRODUCT DECISION | §§9, 12 |
| PROD-43 | Bulk operations are not present. | Yes—decide target need. | STILL PRODUCT DECISION | §12 |
| PROD-44 | Attendance appears in Employee profiles; authorization is not granular. | Yes. | STILL PRODUCT DECISION | §§7–9 |
| PROD-45 | User-linked self-profile exists. | Yes—approve target scope. | STILL PRODUCT DECISION | §§3, 7 |
| PROD-46 | Later account creation/regeneration exists without a distinct demonstrated flag. | Yes. | STILL PRODUCT DECISION | §§9, 11 |

### Detail/profile and list

| ID | Legacy evidence | Product decision required? | Recommended status | Evidence |
|---|---|---|---|---|
| PROD-47 | Legacy detail has identity/status/actions. | Yes—approve inclusion/presentation. | STILL PRODUCT DECISION | §7 |
| PROD-48 | Personal/two-address sections exist. | Yes. | STILL PRODUCT DECISION | §7 |
| PROD-49 | Work/master section exists. | Yes. | STILL PRODUCT DECISION | §7 |
| PROD-50 | Bank/statutory/payroll content exists. | Yes. | STILL PRODUCT DECISION | §7 |
| PROD-51 | Emergency fields exist in personal/profile data. | Yes. | STILL PRODUCT DECISION | §§4, 7 |
| PROD-52 | Categorized document section/actions exist. | Yes. | STILL PRODUCT DECISION | §§7, 10 |
| PROD-53 | Attendance/regularization section exists. | Yes. | STILL PRODUCT DECISION | §7 |
| PROD-54 | Account, HR responsibilities and team content exist. | Yes. | STILL PRODUCT DECISION | §§7, 9, 11 |
| PROD-55 | Timestamps exist; a change-history UI/model does not. | Yes. | STILL PRODUCT DECISION | §12 |
| PROD-56 | Leave/resignation/payroll data exists in combined profiles. | Yes—future presentation remains deferred. | STILL PRODUCT DECISION | §§7–8 |
| PROD-57 | Grid.js provides client search over rendered data. | Yes—approve target fields/scope. | STILL PRODUCT DECISION | §7 |
| PROD-58 | No dedicated legacy list filters; report has date/status filters. | Yes. | STILL PRODUCT DECISION | §§7, 12 |
| PROD-59 | Grid.js client sorting exists. | Yes—approve columns/server behavior. | STILL PRODUCT DECISION | §7 |
| PROD-60 | Grid.js client pagination exists. | Yes—approve target paging. | STILL PRODUCT DECISION | §7 |
| PROD-61 | Legacy template controls page sizing through Grid.js configuration; no future value approved. | Yes. | STILL PRODUCT DECISION | `templates/hr/employee/list.html`; §7 |
| PROD-62 | Bulk row selection is not present. | Yes. | STILL PRODUCT DECISION | §12 |
| PROD-63 | Bulk actions are not present. | Yes. | STILL PRODUCT DECISION | §12 |
| PROD-64 | Employee import is not present. | Yes. | STILL PRODUCT DECISION | §12 |
| PROD-65 | Separate Employee report exists; list export contract is not established. | Yes. | STILL PRODUCT DECISION | §§7, 12 |

### Account, team, documents, recruitment, and UX

| ID | Legacy evidence | Product decision required? | Recommended status | Evidence |
|---|---|---|---|---|
| PROD-66 | Legacy uses separate later provisioning (option D), not create-time provisioning. | Yes—choose target option. | STILL PRODUCT DECISION | §11 |
| PROD-67 | Supervisor is optional in model/update flow. | Yes. | STILL PRODUCT DECISION | §§4, 11 |
| PROD-68 | No cross-Company manager validation is demonstrated. | Yes. | RESOLVED: assigned-team plus authorized-Company scope; backend relationship enforcement required | §§5, 11; approved permission reconciliation |
| PROD-69 | One concurrent supervisor FK exists. | Yes. | STILL PRODUCT DECISION | §§4, 11 |
| PROD-70 | MPTT supports multi-level hierarchy. | Yes—approve target need. | STILL PRODUCT DECISION | §11 |
| PROD-71 | Legacy detail derives team/direct-report data. | Yes. | STILL PRODUCT DECISION | §§7, 11 |
| PROD-72 | Hierarchy is consumed by Leave, regularization, resignation and appraisal concepts. | Yes—approve target authority. | STILL PRODUCT DECISION | §§8, 11 |
| PROD-73 | Categories are Resume, KYC, Educational, Employment, OTHER. | Yes—approve final taxonomy. | STILL PRODUCT DECISION | §10 |
| PROD-74 | Types are free-form names; report infers photo/Aadhaar/PAN by names. | Yes. | STILL PRODUCT DECISION | §10 |
| PROD-75 | Legacy maximum is 10 MiB. | Yes—approve target limit. | STILL PRODUCT DECISION | §10 |
| PROD-76 | PDF, MS Word, ODT, JPEG and PNG allowed. | Yes—approve target allowlist. | STILL PRODUCT DECISION | §10 |
| PROD-77 | Replacement exists without version/history. | Yes. | STILL PRODUCT DECISION | §10 |
| PROD-78 | Delete exists without category restriction or demonstrated action guard. | Yes. | STILL PRODUCT DECISION | §§9–10 |
| PROD-79 | View/download exist without adequate actor/category policy. | Yes. | STILL PRODUCT DECISION | §§9–10 |
| PROD-80 | Per-Employee synchronous ZIP exists. | Yes. | STILL PRODUCT DECISION | §10 |
| PROD-81 | Legacy has distinct CRUD/view/ZIP actions but not distinct flags. | Yes. | STILL PRODUCT DECISION | §§9–10 |
| PROD-82 | PrivateFileField exists, yet handlers do not enforce consistent private authorization. | Yes. | STILL PRODUCT DECISION | §10 |
| PROD-83 | Candidate personal/address/document mappings are exactly known. | Yes—approve target mapping. | STILL PRODUCT DECISION | §11 |
| PROD-84 | Conversion maps no Job fields or Company masters beyond selected Branch. | Yes. | STILL PRODUCT DECISION | §11 |
| PROD-85 | Conversion function does not require accepted Offer. | Yes—approve target prerequisite. | RESOLVED: accepted Offer required for Recruitment conversion; direct Create remains separate | §11; CORE-10 reconciliation |
| PROD-86 | Legacy returns JSON success/failure and database rollback; detailed retry UX absent. | Yes. | STILL PRODUCT DECISION | §11 |
| PROD-87 | Candidate status and Employee DB writes are atomic; external file semantics are partial. | Yes—approve target outcome. | STILL PRODUCT DECISION | §11 |
| PROD-88 | Legacy stores two independent addresses; no persisted same-address semantic found. | Yes. | STILL PRODUCT DECISION | §§4, 7 |
| PROD-89 | Legacy edits separate sections; no single Update All workflow. | Yes—approve target save model. | STILL PRODUCT DECISION | §7 |
| PROD-90 | Separate handlers permit section-level success; no cross-section error contract exists. | Yes. | STILL PRODUCT DECISION | §§5, 7 |

Counts: 89 legacy-informed; 89 still requiring Product approval.

## 5. BE-01–BE-23 reconciliation

The legacy evidence column describes Django persistence/view behavior only. Every future backend contract remains required.

| ID | Legacy evidence | Still unknown / Backend confirmation required | Status |
|---|---|---|---|
| BE-01 | Integer StaffProfile PK. | Future ID type and serialization. | BACKEND REQUIRED |
| BE-02 | `request.company` plus mixed Company-scoped queries. | Tenant source and uniform enforcement. | BACKEND REQUIRED |
| BE-03 | Company indirect through Branch. | Future direct/indirect FK and cardinality. | BACKEND REQUIRED |
| BE-04 | Single optional Branch FK; create requires it; no history. | Future requiredness/history and DTO. | BACKEND REQUIRED |
| BE-05 | Single optional Department FK; service requires it. | Future FK, scope and nullability. | BACKEND REQUIRED |
| BE-06 | Single optional Designation FK; service requires it. | Future FK, scope and nullability. | BACKEND REQUIRED |
| BE-07 | No Staff Shift FK. | Whether/how effective Shift assignment is represented. | BACKEND REQUIRED |
| BE-08 | Optional Week Off FK, no effective history. | Future assignment/effective-date contract. | BACKEND REQUIRED |
| BE-09 | Optional Holiday Master FK, no effective history. | Future assignment/effective-date contract. | BACKEND REQUIRED |
| BE-10 | Branch/TEMP max+1 code, no DB uniqueness/locking. | Authoritative generation and concurrency guarantee. | BACKEND REQUIRED |
| BE-11 | Five raw Staff statuses; separate resignation statuses. | Approved response representation. | BACKEND REQUIRED |
| BE-12 | Free status edit and resignation handlers; inconsistent guarding/errors. | Valid transitions, actors and error response. | BACKEND REQUIRED |
| BE-13 | Grid.js client search/sort/page; report date/status filters. | Server query grammar and envelope. | BACKEND REQUIRED |
| BE-14 | Ad hoc legacy JSON error shapes. | Global API error envelope. | BACKEND REQUIRED |
| BE-15 | Length/choice/date checks plus exceptions; no standard conflict shape. | Field/uniqueness/conflict representation. | BACKEND REQUIRED |
| BE-16 | No version/concurrency field. | Whether/how stale writes are rejected. | BACKEND REQUIRED |
| BE-17 | Full sensitive values exposed; no granular masking/omission. | Server authorization and serialization policy. | BACKEND REQUIRED |
| BE-18 | PrivateFileField metadata, MIME allowlist, 10 MiB, five categories. | Future upload/metadata resource contract. | BACKEND REQUIRED |
| BE-19 | Inline FileResponse/direct URLs with weak guards. | Authorized delivery mechanism. | BACKEND REQUIRED |
| BE-20 | Synchronous in-memory per-Employee ZIP. | Future sync/queue behavior and errors. | BACKEND REQUIRED |
| BE-21 | Separate account create/regenerate/email flows without full rollback. | Operations, outcomes, retries and transaction guarantees. | BACKEND REQUIRED |
| BE-22 | Optional self MPTT FK; no explicit scope/self/cycle checks in view. | Safe manager/team API invariants. | BACKEND REQUIRED |
| BE-23 | Database-atomic Candidate conversion; file storage semantics partial. | Future all-or-nothing application/API contract. | BACKEND REQUIRED |

Counts: 23 legacy-informed; 23 still requiring Backend.

## 6. EMP-001–EMP-022 reconciliation

| ID | Legacy evidence | Current React | Product decision | Backend decision | Status |
|---|---|---|---|---|---|
| EMP-001 | Complete source audited. | Prior audit assumed unavailable. | None for evidence availability. | None. | LEGACY CONFIRMED |
| EMP-002 | Integer Staff PK; mixed tenant scoping. | Numeric ID; no Company scope. | — | DTO/ID/tenant contract. | BACKEND REQUIRED |
| EMP-003 | Company indirect through required-on-create Branch. | Company string; no Branch. | Cardinality/history. | Scoped FK contract. | PARTIAL |
| EMP-004 | Department/Designation FKs. | Strings/static labels. | Mapping/migration behavior. | FK/scope contract. | PARTIAL |
| EMP-005 | Week Off/Holiday FKs; no Staff Shift FK/history. | Strings/absent. | Assignment semantics. | Effective assignment contract. | PARTIAL |
| EMP-006 | Branch/TEMP max+1 generation. | Mock sequential code. | Retain/change scheme. | Unique/concurrent generation. | PARTIAL |
| EMP-007 | Five statuses plus resignation workflow. | Boolean/type cannot represent them. | Target lifecycle. | Representation/transitions. | PARTIAL |
| EMP-008 | Legacy fields/requiredness/edit handlers known. | Current Zod field set. | Surviving fields/rules. | DTO/validation. | PRODUCT REQUIRED |
| EMP-009 | Combined HR detail and self-profile known. | No detail route. | Target structure/actions. | Related resources/security. | PRODUCT REQUIRED |
| EMP-010 | Client search/sort/page; report; no import/bulk. | Whole-array list. | Target controls/exports. | Query/export contract. | PARTIAL |
| EMP-011 | Separate later provisioning/regeneration/email. | No identity workflow. | Timing/outcomes. | Identity operations/rollback. | PARTIAL |
| EMP-012 | Optional single MPTT supervisor and direct reports. | Free-text manager. | Target hierarchy/authority. | Safe scoped graph API. | PARTIAL |
| EMP-013 | 13 flags; broad Employee navigation flag only. | Provisional view/write. | Capability matrix. | Enforcement/mapping. | PARTIAL |
| EMP-014 | Full sensitive values exposed without masking policy. | Broadly visible form/review. | View/edit/mask/export. | Omit/mask authorization. | PRODUCT REQUIRED |
| EMP-015 | Remote-clock boolean exists. | Boolean presented as permission. | Meaning/actors. | Attendance enforcement. | PARTIAL |
| EMP-016 | Exact categories/MIME/size/replace behavior known. | Five categories/22 types/10 MiB. | Final taxonomy/lifecycle. | Metadata/upload contract. | PARTIAL |
| EMP-017 | Private field but weak handlers; synchronous ZIP. | Direct/mock URLs; no ZIP. | Access/export policy. | Authorized delivery/ZIP. | BACKEND REQUIRED |
| EMP-018 | DB-atomic Candidate conversion with known mapping. | Sequential mutations. | Mapping/preconditions/outcome. | Atomic API/storage guarantee. | PARTIAL |
| EMP-019 | Separate legacy section handlers. | Section PATCH plus Update All. | Target save behavior. | Partial/cross-field/concurrency rules. | PARTIAL |
| EMP-020 | Two independent addresses; no same-address semantic. | Non-functional checkbox. | Copy/sync/remove behavior. | Only if persisted linkage chosen. | PRODUCT REQUIRED |
| EMP-021 | Legacy bank fields optional; statutory dates optional. | Bank fields mandatory; statutory optional. | Target requiredness/effective rules. | Secure validation/storage. | PARTIAL |
| EMP-022 | Delete handler is no-op; resignation/deactivation exists. | No lifecycle action. | Retention/action policy. | Enforced transition/delete contract. | PRODUCT REQUIRED |

Counts: 1 resolved by evidence; 21 still blocked by Product and/or Backend approval.

## 7. PRODUCT CHOICES STILL REQUIRED

### Employee model

- Surviving fields, create requiredness, editability, immutability, employment type, compensation ownership, and address behavior (PROD-02–05, PROD-88–90).

### Master relationships

- Company, Branch, Department, Designation, Shift, Week Off, and Holiday List cardinality, requiredness, history/effective dating, and change authority (PROD-06–12).

### Lifecycle

- Target statuses, meaning of Resigned/Temp, transitions/actors, deletion/termination, and dependent-record retention (PROD-13–20).

### Permissions

- Capability and ownership matrix for list/detail/create/edit/lifecycle/files/payroll/sensitive fields/import/export/bulk/attendance/self-profile/identity (PROD-32–46).

### Sensitive information

- Full/masked/omitted view, edit, and export policy for every sensitive category (PROD-21–31).

### Detail/profile

- Included sections, actions, presentation, self-profile differences, and audit/history treatment (PROD-47–56).

### List

- Search fields, filters, sorting, pagination/page sizes, bulk, import, and export scope (PROD-57–65).

### Documents

- Final taxonomy, allowlist/size, replacement/versioning, delete/view/download/ZIP actors, distinct capabilities, and mandatory private access (PROD-73–82).

### Recruitment

- Candidate/Job mapping, Offer prerequisite, failure/retry UX, and atomic product outcome (PROD-83–87).

### Account

- Provisioning timing and credential/invitation outcomes (PROD-66).

### Team

- Manager optionality, Company boundary, cardinality, hierarchy depth, detail visibility, and approval authority (PROD-67–72).

### Attendance

- Profile inclusion, ownership scope, remote-clock meaning, and schedule relationships (PROD-44, PROD-53, relevant PROD-06–12 and PROD-72).

### Leave

- Profile presentation, hierarchy authority, lifecycle effects, and retention; operational flow remains deferred (PROD-20, PROD-56, PROD-72).

### Payroll

- Compensation/bank/statutory ownership and security, lifecycle effects, and profile presentation; calculations remain deferred (PROD-20, PROD-23–27, PROD-38–39, PROD-50, PROD-56).

## 8. BACKEND CONTRACT STILL REQUIRED

### Identity / tenancy

- Active-Company context and uniform server enforcement (BE-02).

### Employee identifiers

- ID serialization and concurrency-safe Employee-code generation (BE-01, BE-10).

## Approved lifecycle decision reconciliation

The following Product decisions supersede earlier open recommendations without changing legacy evidence:

- Direct HR Create defaults Probation and permits Probation/Regular/Temp; Recruitment conversion initializes Probation automatically.
- Authorized HR may change any of the five statuses to any of the five through a dedicated lifecycle action. No restrictive Product graph and no generic profile PATCH.
- Notice Period requires end/last-working date; notice start is optional. Resigned requires resignation date and end/last-working date. Resignation workflow does not auto-synchronize them.
- Resigned disables login, retains Employee/history, and retains Account in restricted F&F-pending administration for the approximate 30–45-day process. Authorized HR may finally close it after F&F; backend states remain open.
- Closed Employee is read-only by default with specific authorized HR corrections and required audit/reason.
- Temp remains the contract/temporary lifecycle status; exact owning-domain behavior remains open.
- The default list includes Probation, Regular, Notice Period and Temp; Resigned is explicitly filterable.
- Employee code uses Company prefix plus Company-controlled unique non-reused sequence. Branch change never changes an existing code. Employee B gets Company B code. HR code correction is a dedicated reasoned, authorized, audited action.
- Employee creation does not create Account. HR explicitly creates/administers it later. Employee and Manager have no Account administration authority.

Backend transaction/state/audit/concurrency contracts and Temp Payroll/Attendance rules remain unresolved. Manager Product scope is resolved; authoritative team mapping and backend enforcement remain open.

## Approved permission decision reconciliation

- HR has authorized-Company Employee view/create/edit, organization/lifecycle/code, protected-data, document, Account, import/export and approved bulk authority, plus full authorized Payroll/CTC access.
- Manager has authoritative assigned-team, authorized-Company, non-sensitive profile view only and no Employee mutation/protected/Payroll/Document/Account authority. Manager team Attendance/Leave actions are limited to their owning-domain contracts.
- Employee has read-only own profile, masked sensitive defaults with explicit backend-authorized full reveal, own document view/download, own Payroll information and own credential security flows.
- Sensitive view/reveal is not audited; sensitive edits are audited without unnecessary plaintext. Exact masks and sensitive export remain Security/Backend-required.
- Director cross-Company Employee/history view is explicitly scoped and grants no other capability.
- HR-only import and CSV/Excel/PDF/clipboard export plus approved bulk operations are Product-approved; bulk delete and unrestricted sensitive export are not.

Exact capability names, team relationship source, backend authorization/projection/reveal, audit implementation, sensitive export and owning-domain action contracts remain unresolved. Manager permission Product decisions are no longer open.

### Master foreign keys

- Company/Branch/Department/Designation/Shift/Week Off/Holiday List resource and effective-assignment contracts (BE-03–09).

### Status

- Status representation, valid transitions, authorization, and invalid-transition errors (BE-11–12).

### List/query

- Search/filter/sort/page request grammar and response envelope (BE-13).

### Validation/errors

- Global, field, uniqueness, conflict, and stale-write behavior (BE-14–16).

### Permissions

- Record/action/field authorization, sensitive serialization, and ownership enforcement (BE-02, BE-12, BE-17–19, BE-21–22).

### Documents

- Upload/metadata, authorized delivery, replacement/deletion, and synchronous/queued ZIP behavior (BE-18–20).

### Account

- Provision/regenerate/invite operations, outcomes, retries, email failure, and rollback (BE-21).

### Team

- Tenant-safe references plus self/cycle prevention and hierarchy queries (BE-22).

### Recruitment conversion

- Atomic Employee/Candidate/file outcome and authoritative result (BE-23).

### Attendance

- Employee scope, schedule assignment consumption, geofence/remote-clock enforcement, and profile query belong to Attendance contracts.

### Leave

- Balance/accrual, eligibility, hierarchy approval, resignation effects, and profile query belong to Leave contracts.

### Payroll

- Effective compensation, statutory validation, lifecycle eligibility, calculations, files, and authorized profile query belong to Payroll contracts.

## 9. Legacy unknowns

No requested legacy-only question remains UNKNOWN after static source inspection. Residual evidence limitations are runtime middleware/deployment enforcement, production-data conventions, external file-storage rollback, and email-delivery rollback. These limitations must not be mistaken for future Backend contracts.

## 10. Safe mock scope

Safe means mock-only behavior that does not encode an unresolved final DTO, permission matrix, or business choice.

| Feature | Legacy evidence | Safe to Mock? | Dependency |
|---|---|---|---|
| Existing basic Employee list records/states | Legacy list and current React list exist. | Yes | Keep current provisional fields; no invented filters/status mapping. |
| Loading/empty/error/retry states | Architecture-approved UI states; independent of DTO details. | Yes | Generic error only until BE-14. |
| Current create/edit navigation | Both systems have create and section-oriented edit. | Yes | Do not change field survival/requiredness. |
| Deterministic failure scenarios | Legacy has ad hoc validation/errors. | Yes | Do not claim final error envelope. |
| Employee-scoped document fixtures | Both sides have scoped document records. | Yes | Existing categories only; Blob cleanup and no public-access claim. |
| Document loading/error/delete-confirmation presentation | UI behavior is architecture-level. | Yes | No new permissions or ZIP/replace requirements. |
| Candidate conversion rollback simulation | Legacy DB operation is atomic. | Yes | Simulation only; no endpoint/Offer rule invented. |
| Generic masked-value component behavior | Security direction requires not exposing unauthorized values. | Conditionally | Only after Product supplies which fields/actors/masks; not safe to assign policy. |

Safe mock feature count: 8. This section authorizes no implementation.

## 11. P0/P1/P2/P3 priorities

### P0 — must resolve before Employee implementation

- Employee target model and fields: PROD-02–05; BE-01, BE-10, BE-14–16.
- Tenant/master relationships: PROD-06–12; BE-02–09.
- Lifecycle/retention: PROD-13–20; BE-11–12.
- Sensitive-data and capability policy: PROD-21–46; BE-17.
- Private documents: PROD-73–82; BE-18–20.
- Recruitment conversion: PROD-83–87; BE-23.

### P1 — needed during Employee implementation

- Detail/profile structure: PROD-47–55.
- List controls: PROD-57–65; BE-13.
- Account and team behavior: PROD-66–72; BE-21–22.
- Address and save UX: PROD-88–90.

### P2 — can be deferred

- Audit/history experience beyond timestamps: PROD-55.
- Generated letters, dedicated reports, import, bulk operations, and document ZIP if Product excludes them from the initial Employee release.
- Account provisioning and team-management UI if explicitly split into approved later subphases.

### P3 — future integration

- Attendance, Leave/Resignation, Payroll/Tax/Form16, Assets, and Appraisal operational workflows and calculations (including PROD-56 and relevant downstream portions of PROD-20, PROD-44, PROD-53, PROD-72).

## 12. Implementation readiness

| Gate | Evidence state | Approval/contract state | Ready? |
|---|---|---|---|
| GATE 1 — Employee domain | Legacy known | Product/Backend unresolved | No |
| GATE 2 — master relationships | Legacy known | Product/Backend unresolved | No |
| GATE 3 — lifecycle | Legacy known | Product/Backend unresolved | No |
| GATE 4 — sensitive data | Legacy exposure known | Product/Security/Backend unresolved | No |
| GATE 5 — permissions | Actual legacy flags/use known | Target capability matrix unresolved | No |
| GATE 6 — detail structure | Legacy content known | Product presentation unresolved | No |
| GATE 7 — recruitment conversion | Legacy transaction/mapping known | Product/API contract unresolved | No |
| GATE 8 — documents | Legacy behavior known | Product/security/backend unresolved | No |
| GATE 9 — Backend API | Legacy views/models known | Future API unavailable | No |

Phase 3E reconciliation is complete. Employee implementation remains **NOT STARTED** and blocked on the P0 approvals/contracts above.
