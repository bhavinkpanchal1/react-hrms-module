# Employee Contract and Decision Pack

## Classification vocabulary

Every contract statement uses one of these classifications:

- **KNOWN** — directly evidenced by current React source or approved audit documentation.
- **PROVISIONAL** — safe frontend direction for mock-first work, not a legacy/backend claim.
- **UNKNOWN** — unavailable because the legacy source or approved product evidence is missing.
- **BACKEND REQUIRED** — authoritative persistence, authorization, transaction or transport decision.
- **PRODUCT DECISION** — user-facing behavior or business semantics require approval.
- **DEFERRED** — owned by a later module/phase.

## 1. Executive summary

Employee implementation remains blocked. A frontend-safe mock boundary can be prepared around the existing list/create/edit concepts, deterministic tenant-scoped fixtures, Company-master option adapters and UI state behavior. It cannot safely establish the final Employee DTO, lifecycle statuses, permission codes, sensitive-data policy, master cardinality, account/team behavior, private-file contract or atomic Recruitment conversion.

The legacy application source is unavailable. This pack does not claim legacy parity and does not treat the current Django code as an approved backend contract. It turns Phase 3 findings into decision inputs, ownership and implementation gates.

## 2. Known facts

| Fact | Source | Classification |
|---|---|---|
| React has Employee list/create/edit routes, but no detail route | Router and Employee pages | KNOWN |
| Create is linear: Personal → Address → Employment → Account Details → Emergency → Review | Employee step configuration | KNOWN |
| Edit adds Documents and Permissions before Review, supports free navigation, section save and Update All | Employee edit page/step configuration | KNOWN |
| Employee uses strings for Company, Department, Designation, work location, Week Off and Holiday List concepts | Employee schema/mock/forms | KNOWN |
| Company masters expose numeric frontend IDs | Company types/services | KNOWN |
| Phase 1 owns `activeCompanyId` and provisional permissions | Phase 1 report | KNOWN |
| Legacy evidence confirms Employee status values `3 = Resigned` and `4 = Temp`; other status values/transitions are unavailable | Status normalization audit | KNOWN |
| Legacy evidence confirms 65 HR flags but does not enumerate their names | Permission audit | KNOWN |
| Candidate conversion is currently Employee create followed by a Candidate mutation | Employee Create page | KNOWN |
| Employee documents currently support list/upload/view/download/delete | Employee document page/hooks/service | KNOWN |

## 3. Unknown facts

- Complete legacy Employee fields, concrete routes, defaults, validators and editability: **UNKNOWN**.
- Full lifecycle status set, meanings and allowed transitions: **UNKNOWN**.
- Names and action mappings of the 65 legacy permission flags: **UNKNOWN**.
- Exact legacy detail/profile information architecture: **UNKNOWN**.
- Exact document taxonomy, replacement and ZIP behavior: **UNKNOWN**.
- Legacy list search/filter/sort/page/import/export/bulk behavior: **UNKNOWN**.
- Account provisioning timing and team hierarchy rules: **UNKNOWN**.
- Final backend DTOs, endpoints, error envelopes and ID types: **BACKEND REQUIRED**.

## 4. Provisional frontend decisions

These directions are safe only as frontend boundaries; they do not pass the implementation gates:

| Direction | Classification | Constraint |
|---|---|---|
| Keep Component → Hook → Employee Service Port → Mock/HTTP Adapter | PROVISIONAL | HTTP adapter remains backend-TBD. |
| Include active Company in Employee query inputs/keys for future scoped data | PROVISIONAL | Backend must enforce tenant scope. |
| Represent confirmed Company masters by their numeric frontend IDs inside a future frontend domain model | PROVISIONAL | Migration/cardinality approval required before changing stored Employee data. |
| Resolve labels at the UI/adapter boundary rather than storing duplicated labels | PROVISIONAL | Historic-label requirements remain undecided. |
| Use deterministic mock loading/empty/error/conflict/forbidden states | PROVISIONAL | Do not mirror an invented backend envelope. |
| Keep Employee Documents separate from Company Policies while reusing generic file/confirmation mechanics | PROVISIONAL | Private-file service contract remains backend-owned. |
| Simulate Candidate conversion atomically in mock mode | PROVISIONAL | Future backend must provide an atomic operation; no endpoint is proposed. |

## 5. Product decisions required

Product ownership is required for:

- Surviving Employee fields, requiredness and create/edit visibility.
- Company/Branch/Department/Designation and schedule assignment cardinality.
- Lifecycle status meanings and allowed user actions.
- Employee detail sections/navigation.
- Sensitive-field masking/view/edit/export policy.
- Permission action categories and actor experience.
- Address “Same as above” semantics.
- Account provisioning timing.
- Team/reporting-manager rules.
- List controls, import/export and bulk scope.
- Document taxonomy, replacement and ZIP expectations.
- Section Save versus Update All behavior under cross-field validation.

## 6. Backend decisions required

Backend ownership is required for:

- Tenant-scoped Employee resource contract, identifiers and foreign keys.
- Employee code generation and uniqueness.
- Status values/transitions and lifecycle authorization.
- Search/filter/sort/pagination grammar and response envelope.
- Field/global error format and optimistic concurrency.
- Sensitive-field filtering/masking and every authorization decision.
- Account/team operations.
- Atomic Candidate conversion.
- Private upload/view/download/delete/replace/ZIP operations.
- Audit metadata and retention.
- Attendance schedule/location resolution and Payroll/Leave calculations.

No endpoint or DTO is proposed by this pack.

## 7. Legacy evidence blockers

The legacy source is absent from the workspace, Git history and available refs. The audit summaries prove broad capabilities but not complete field/action contracts. Items classified **UNKNOWN** cannot become legacy-parity requirements until the legacy repository or equivalent approved extraction is supplied. If the product elects to proceed without it, that must be an explicit scope decision rather than an inferred resolution.

## 8. Employee domain model

“Editable” and sensitivity below describe current React exposure, not an approved policy. `Yes*` means currently editable but requiring a decision.

### A. Identity and personal

| Field | Current React type/source | Status | Editable? | Sensitive? | Company scoped? | Dependency / unresolved decision |
|---|---|---|---|---|---|---|
| `id` | `number`, Employee response | KNOWN | No | Low | Not currently | BACKEND REQUIRED: ID/tenant contract. |
| `employee_id` | `string`, schema/response | KNOWN | Disabled | Medium | Conceptually yes | BACKEND REQUIRED: Branch/temp-sensitive generation. |
| `first_name` | `string`, schema | KNOWN | Yes | Medium | Yes | PRODUCT DECISION: exact legacy rule. |
| `middle_name` | optional `string`, schema | UNKNOWN | Yes | Medium | Yes | Legacy presence unavailable. |
| `last_name` | `string`, schema | KNOWN | Yes | Medium | Yes | PRODUCT DECISION: exact legacy rule. |
| `name_as_per_aadhar` | `string`, schema | PROVISIONAL | Yes* | High | Yes | PRODUCT DECISION: field survival/spelling; sensitive policy. |
| `email` | `string`, schema | KNOWN | Yes* | High | Yes | BACKEND REQUIRED: uniqueness/account linkage. |
| `phone` | `string`, schema | KNOWN | Yes* | High | Yes | PRODUCT DECISION: locale/visibility. |
| `dob` | `string`, schema | KNOWN | Yes* | High | Yes | PRODUCT DECISION: validation/visibility. |
| `gender` | optional Candidate-derived enum | PROVISIONAL | Yes | Medium | Yes | PRODUCT DECISION: Employee-owned choices. |
| `marital_status` | optional Candidate-derived enum | PROVISIONAL | Yes | High | Yes | PRODUCT DECISION: field/choices/visibility. |
| `aadhar_card_number` | `string`, schema | PROVISIONAL | Yes* | Critical | Yes | PRODUCT DECISION + BACKEND REQUIRED: storage, uniqueness, masking. |
| `pan_card_number` | `string`, schema | PROVISIONAL | Yes* | Critical | Yes | PRODUCT DECISION + BACKEND REQUIRED: tax/storage/masking. |

### B. Address

| Field | Type/source | Status | Editable? | Sensitive? | Company scoped? | Dependency / unresolved decision |
|---|---|---|---|---|---|---|
| `corresponding_address_line1` | `string`, schema | KNOWN | Yes | High | Yes | PRODUCT DECISION: exact requiredness. |
| `corresponding_address_line2` | optional `string` | PROVISIONAL | Yes | High | Yes | Legacy field unavailable. |
| `corresponding_country/state/city` | numeric location values | PROVISIONAL | Yes | Medium | Yes | BACKEND REQUIRED: catalog IDs; PRODUCT DECISION: cascading behavior. |
| `corresponding_pincode` | `string` | PROVISIONAL | Yes | Medium | Yes | PRODUCT DECISION: locale validation. |
| `same_as_above` | optional `boolean` | KNOWN | Yes | Low | Yes | PRODUCT DECISION: copy/sync/link/no behavior. |
| `permanent_address_line1` | `string` | KNOWN | Yes | High | Yes | PRODUCT DECISION: conditional requiredness. |
| `permanent_address_line2` | optional `string` | PROVISIONAL | Yes | High | Yes | Legacy field unavailable. |
| `permanent_country/state/city` | numeric location values | PROVISIONAL | Yes | Medium | Yes | BACKEND REQUIRED: catalog IDs. |
| `permanent_pincode` | `string` | PROVISIONAL | Yes | Medium | Yes | PRODUCT DECISION: locale validation. |

### C–E. Employment and Company/master relationships

| Field | Type/source | Status | Editable? | Sensitive? | Company scoped? | Dependency / unresolved decision |
|---|---|---|---|---|---|---|
| `date_of_joining` | `string`, schema | KNOWN | Yes* | Medium | Yes | PRODUCT DECISION: future dates/editability; backend date contract. |
| `company` | optional `string`, schema | KNOWN current state | Yes* | Low | Yes | PROVISIONAL direction: Company ID; tenant-selection decision. |
| Branch | absent | KNOWN absence | — | Low | Yes | PRODUCT DECISION + BACKEND REQUIRED: assignment/cardinality/code. |
| `department` | `string`, schema | KNOWN current state | Yes | Low | Yes | PROVISIONAL direction: Department ID; migration/Branch dependency. |
| `designation` | `string`, schema | KNOWN current state | Yes | Low | Yes | PROVISIONAL direction: Designation ID; cardinality/historic labels. |
| `work_location` | `string`, static options | KNOWN current state | Yes | Low | Yes | PRODUCT DECISION: Branch/location relationship. |
| `reporting_manager` | optional `string` | KNOWN current state | Yes | Medium | Yes | PRODUCT DECISION + BACKEND REQUIRED: Employee FK/team graph. |
| `job_role` | optional `string`, schema/mock only | KNOWN current field | Not rendered | Low | Yes | PRODUCT DECISION: retain versus Designation overlap. |
| `employment_type` | four-value enum | KNOWN current field | Yes | Low | Yes | UNKNOWN legacy mapping; Temp status conflict. |
| `annual_salary` | number | KNOWN current field | Yes* | Critical | Yes | PRODUCT DECISION + BACKEND REQUIRED: effective date/access. |
| `week_off` | optional `string`, schema/mock only | KNOWN current field | Not rendered | Low | Yes | PROVISIONAL direction: Week Off ID; assignment/effective rules. |
| `holiday_master` | optional `string`, schema/mock only | KNOWN current field | Not rendered | Low | Yes | PROVISIONAL direction: Holiday List ID; assignment/year/timezone. |
| Shift | absent | KNOWN absence | — | Low | Yes | DEFERRED pending Company Shift contract. |

### F–G. Bank/statutory and emergency

| Field | Type/source | Status | Editable? | Sensitive? | Company scoped? | Dependency / unresolved decision |
|---|---|---|---|---|---|---|
| `ifsc_code` | `string` | KNOWN | Yes* | High | Yes | BACKEND REQUIRED: validation/storage; field policy. |
| `bank_name` | `string` | KNOWN | Yes* | High | Yes | PRODUCT DECISION: text/reference. |
| `branch_name` | `string` | KNOWN | Yes* | High | Yes | KNOWN: bank branch, not Company Branch. |
| `account_number` | `string` | KNOWN | Yes* | Critical | Yes | BACKEND REQUIRED: encryption/masking/access. |
| `account_holder_name` | `string` | KNOWN | Yes* | High | Yes | Sensitive-field policy. |
| `uan_number` | optional `string` | KNOWN | Yes* | Critical | Yes | BACKEND REQUIRED: statutory validation/storage. |
| `pf_number` | optional `string` | KNOWN | Yes* | Critical | Yes | BACKEND REQUIRED: statutory validation/storage. |
| `pf_joining_date` | optional `string` | KNOWN | Yes* | High | Yes | PRODUCT DECISION: effective-date semantics. |
| `esic_number` | optional `string` | KNOWN | Yes* | Critical | Yes | BACKEND REQUIRED: statutory validation/storage. |
| `esic_joining_date` | optional `string` | KNOWN | Yes* | High | Yes | PRODUCT DECISION: effective-date semantics. |
| `emergency_contact_name` | optional `string` | KNOWN | Yes | High | Yes | PRODUCT DECISION: requiredness/visibility. |
| `emergency_contact_number` | optional `string` | KNOWN | Yes | High | Yes | PRODUCT DECISION: validation/visibility. |
| `emergency_contact_relation` | optional `string` | KNOWN | Yes | Medium | Yes | PRODUCT DECISION: text/choices. |

### H–L. Documents, access, attendance, recruitment and lifecycle

| Field/concept | Type/source | Status | Editable? | Sensitive? | Company scoped? | Dependency / unresolved decision |
|---|---|---|---|---|---|---|
| Document category/type/description | enums/string, document types | PROVISIONAL | Via upload | High | Yes | PRODUCT DECISION: taxonomy/replacement. |
| Document file/metadata | File plus response strings | PROVISIONAL | Upload/delete | Critical | Yes | BACKEND REQUIRED: private storage/access/audit. |
| `clockin_remotely` | boolean | KNOWN current field | Edit only | Medium | Yes | PRODUCT DECISION + BACKEND REQUIRED: exception semantics/enforcement. |
| Employee permission flags | none beyond remote clock | KNOWN absence | — | High | Yes | UNKNOWN legacy names; permission matrix required. |
| `source_candidate_id` | optional number | KNOWN current field | No direct UI | Medium | Yes | BACKEND REQUIRED: atomic conversion/provenance. |
| `source_offer_id` | optional number | KNOWN current field | No direct UI | Critical | Yes | UNKNOWN Job/Offer legacy mapping; backend validation. |
| `is_active` | boolean response | KNOWN current field | No UI | Medium | Yes | Insufficient; lifecycle contract required. |
| `created_at/updated_at` | timestamp strings | KNOWN current field | No | Low | Yes | BACKEND REQUIRED: audit semantics. |
| `created_by/updated_by` | optional numbers | PROVISIONAL | No | Medium | Yes | BACKEND REQUIRED: identity/audit contract. |

## 9. Company master relationships

| Master | Current Employee | Company master | Proposed frontend direction | Migration concern | Dependency / decision | Classification |
|---|---|---|---|---|---|---|
| Company | optional string/static option | numeric `Company.id` | Store/transport a frontend Company ID; derive active scope from auth | Existing labels and multi-membership behavior | Product selection rule; backend tenant FK | PROVISIONAL |
| Branch | absent; work-location string | numeric `Branch.id` | Add only if Branch assignment is approved; keep code server-owned | No existing value; work-location ambiguity | Product cardinality; backend FK/history | PRODUCT DECISION |
| Department | required string/static option | numeric `Department.id` | Future frontend `departmentId`; resolve label in UI | Map existing labels and duplicates | Branch relation and backend FK | PROVISIONAL |
| Designation | required string/static option | numeric `Designation.id` | Future frontend `designationId`; validate Department relation | Historic labels/null Department | Product cardinality and backend FK | PROVISIONAL |
| Week Off | optional hidden string | numeric `WeekOff.id` | Future ID only after assignment semantics approval | Effective dates/history | Product + backend schedule contract | PRODUCT DECISION |
| Holiday List | optional hidden string | numeric `HolidayList.id` | Future ID only after year/effective semantics approval | Existing strings/year changes | Product + backend timezone/history | PRODUCT DECISION |

Numeric Company IDs are authoritative only for the current frontend Company module, not a backend contract. No Employee rewrite is authorized by this direction.

## 10. Lifecycle/status

| Candidate status concept | Source | Known? | UI impact | Backend required | Classification |
|---|---|---|---|---|---|
| Current `is_active` boolean | React Employee response | Yes | No current badge/filter/action; insufficient for parity | Yes, if retained/mapped | KNOWN |
| `Resigned` represented by raw legacy value `3` | Status audit summary | Only raw value/label | Would affect badge, editing, attendance, assets and payroll | Yes: mapping/transitions | KNOWN |
| `Temp` represented by raw legacy value `4` | Status audit summary | Only raw value/label | May conflict with employment type and code rules | Yes: meaning/transitions | KNOWN |
| Other lifecycle values | Legacy source unavailable | No | Cannot design filters/actions | Yes | UNKNOWN |
| Allowed transitions/actors | Unavailable | No | Cannot design lifecycle buttons | Yes | BACKEND REQUIRED |
| Deactivate/delete/resign semantics | Audit gap | No | Retention and downstream behavior | Yes | PRODUCT DECISION |

Active/Inactive is not accepted as a complete model.

## 11. Permissions

| Capability category | Existing React mapping | Classification | Decision needed |
|---|---|---|---|
| List/detail/profile | Navigation uses provisional `employee.view` | PROVISIONAL | Confirm route/record/ownership scope. |
| Create/edit | HR mock has provisional `employee.write`; actions are unguarded | PROVISIONAL | Decide separate or combined capabilities. |
| Delete/deactivate/lifecycle | None | PRODUCT DECISION | Actor/action/transition matrix. |
| Documents view/write/delete/export | None | PRODUCT DECISION | Separate file actions and ownership. |
| Salary | `payroll.view` exists provisionally, no Employee-field mapping | PRODUCT DECISION | Salary field versus Payroll screen scope. |
| Bank/statutory | None | PRODUCT DECISION | View/edit/masking/export actors. |
| Identity-sensitive fields | None | PRODUCT DECISION | Aadhaar/PAN/contact field policy. |
| Import/export/bulk | None | UNKNOWN | Determine whether capabilities survive. |
| Attendance/profile data | `attendance.read` exists provisionally | PROVISIONAL | Own/team/HR scope and Employee-detail access. |
| Account provisioning | None | PRODUCT DECISION | Provision/regenerate/email actions. |

No legacy permission name is mapped. Unlisted mappings are **UNMAPPED / DECISION REQUIRED**. Backend authorization is **BACKEND REQUIRED** for every action.

## 12. Sensitive fields

The following levels are frontend risk classifications, not legal determinations. Masking and permission requirements remain decisions.

| Data | Sensitivity | Masking | View permission | Edit permission | Export permission | Backend enforcement | Classification |
|---|---|---|---|---|---|---|---|
| Aadhaar/name as Aadhaar | Critical | Required decision; recommend masked number by default | Required | Required | Separate decision | Required | PRODUCT DECISION |
| PAN | Critical | Required decision; recommend masked by default | Required | Required | Separate decision | Required | PRODUCT DECISION |
| Bank account/holder/IFSC | Critical/High | Recommend account masking by default | Required | Required | Separate decision | Required | PRODUCT DECISION |
| Annual salary | Critical | Recommend omit unless authorized | Required | Required | Separate decision | Required | PRODUCT DECISION |
| PF number | Critical | Recommend masked by default | Required | Required | Separate decision | Required | PRODUCT DECISION |
| UAN | Critical | Recommend masked by default | Required | Required | Separate decision | Required | PRODUCT DECISION |
| ESIC | Critical | Recommend masked by default | Required | Required | Separate decision | Required | PRODUCT DECISION |
| Email/phone/DOB/address/emergency contact | High | Context-dependent decision | Required by actor/scope | Required | Separate decision | Required | PRODUCT DECISION |
| Employee documents | Critical | Metadata/preview policy required | Required per file | Upload/replace required | Separate decision | Required | PRODUCT DECISION |

The frontend may implement a generic masking presentation only after the policy identifies which values and actors receive masked, full or absent data. The backend must never send unauthorized full values.

## 13. Detail page

No tab architecture is approved. The following is a section inventory for product selection:

| Proposed section | Evidence | Classification | Decision |
|---|---|---|---|
| Identity/summary header | List/edit fields and legacy profile capability | PROVISIONAL | Status/actions/visible identifiers. |
| Personal and address | Existing React form/review | KNOWN | Sensitive display and grouping. |
| Employment/master assignments | Existing React form/review | KNOWN | Branch/Shift/schedule fields pending. |
| Bank/statutory/compensation | Existing React form/review | KNOWN | Strong authorization/masking required. |
| Emergency contact | Existing React form/review | KNOWN | Visibility decision. |
| Documents | Existing edit-only step and legacy file evidence | KNOWN | Section/tab and actor actions. |
| Attendance | Documented relationship; separate current module | PROVISIONAL | Owning query, actor scope and presentation. |
| Leave/Resignation | Legacy relationship; modules absent | DEFERRED | Later phase. |
| Payroll/Tax/Form16 | Legacy relationship; modules absent | DEFERRED | Later phase. |
| Account/permissions/team | Legacy capability; React incomplete | PRODUCT DECISION | Section existence and action policy. |
| Audit/history | Exact legacy experience unavailable | UNKNOWN | Retention/event requirements. |

### Employee list feature decisions

| Feature | Legacy evidence | Current React | Required? | Decision/classification |
|---|---|---|---|---|
| Basic list | Employee list capability verified | Whole-array table | Yes for current product | KNOWN |
| Search | Broad legacy route/report evidence; exact Employee control unavailable | None | Undecided | UNKNOWN |
| Filters | Department/status dependencies documented; exact controls unavailable | None | Undecided | PRODUCT DECISION |
| Sorting | Exact legacy behavior unavailable | None | Undecided | PRODUCT DECISION |
| Pagination/page size | Current architecture requires consistency; legacy values unavailable | None | Needed if dataset is paged | BACKEND REQUIRED |
| Error/retry | Shared Phase 2 list-state rule | No query error UI | Yes for any implementation | KNOWN |
| Bulk selection/actions | Legacy exact behavior unavailable | None | Undecided | UNKNOWN |
| Import | Legacy exact behavior unavailable | None | Undecided | UNKNOWN |
| Export | Employee/document report evidence exists, exact list export unavailable | None | Undecided | PRODUCT DECISION |
| Saved filters | No evidence | None | No basis to require | UNKNOWN |

### Team and reporting-manager contract

| Concern | Current state | Required decision | Classification |
|---|---|---|---|
| Reporting manager | Free-text string | Employee reference, optionality, effective dates and actor editability | PRODUCT DECISION |
| Team members | Absent | Derived direct reports versus separately managed team membership | PRODUCT DECISION |
| Hierarchy depth | Absent | Whether multi-level reporting is needed | UNKNOWN |
| Circular references | Not validated | Backend must reject self-reference and cycles if hierarchy exists | BACKEND REQUIRED |
| Company scope | Not enforced | Manager and reports must obey approved tenant/cross-company rules | BACKEND REQUIRED |
| Approval scope | Nav roles only | Team scope used by Leave/Attendance/Appraisal approvals | DEFERRED |

### Account provisioning options

| Option | Meaning | Evidence | Classification |
|---|---|---|---|
| Employee only | Create the HR Employee record without a user account | Current React behavior | KNOWN |
| Employee + mandatory account | Provision identity during Employee creation | Legacy account capability exists; timing unknown | PRODUCT DECISION |
| Optional provisioning | Create Employee and provision based on an explicit choice | No approval | PRODUCT DECISION |
| Provision later | Separate authorized action after Employee creation | Legacy provisioning/password actions suggest separation, exact flow unavailable | PRODUCT DECISION |

No option is selected. Any account operation, invitation/email, password generation, retry and rollback behavior is **BACKEND REQUIRED** and must integrate with the Phase 1 identity boundary.

## 14. Create/edit flow

### Create — preserved behavior

| Item | Current/decision | Classification |
|---|---|---|
| Step order | Personal → Address → Employment → Account Details → Emergency → Review | KNOWN |
| Navigation | Linear; current step validates before Next; Back preserves values | KNOWN |
| Review placement | Final step | KNOWN |
| Save | One final Employee create | KNOWN |
| Documents/Permissions | Excluded from Create | KNOWN |
| Recruitment prefill | Candidate/Job/Offer values copied before final submission | KNOWN |

### Edit — preserved behavior

| Item | Current/decision | Classification |
|---|---|---|
| Step order | Personal → Address → Employment → Account Details → Emergency → Documents → Permissions → Review | KNOWN |
| Navigation | Direct section navigation plus Back/Next | KNOWN |
| Edit-only steps | Documents and Permissions | KNOWN |
| Section save | Validates/saves the current form section | KNOWN |
| Update All | Review action updates the full form | KNOWN |
| Documents save | Independent document mutations | KNOWN |

Issue-driven decisions only:

- Remove document fields from the Employee form contract: **PROVISIONAL**, because documents already have a separate lifecycle.
- Decide whether hidden `job_role`, `week_off`, `holiday_master` survive: **PRODUCT DECISION**.
- Decide partial-update cross-field semantics before preserving section save against a backend: **BACKEND REQUIRED**.
- Decide future joining-date validation and sensitive-field exposure: **PRODUCT DECISION**.

### Address decision

| Option | Meaning | Risk | Classification |
|---|---|---|---|
| A. One-time copy | Copy correspondence values when checked; later edits diverge | Checkbox may misleadingly remain checked | PRODUCT DECISION |
| B. Synchronized values | While checked, correspondence changes update permanent values | Clear and predictable; needs uncheck behavior | PRODUCT DECISION |
| C. Linked values | Persist one semantic address reference | Requires DTO/backend semantics | BACKEND REQUIRED |
| D. No special behavior | Checkbox stores no behavior | Current state is misleading | PRODUCT DECISION |

Safest frontend recommendation: **B, synchronized values while checked**, with permanent controls disabled and values retained when unchecked. This is a recommendation only and remains **PRODUCT DECISION**.

## 15. Documents

| Concern | Frontend contract proposal | Classification |
|---|---|---|
| Category/type | Domain-owned IDs/values and labels; exact taxonomy unchanged until approved | PRODUCT DECISION |
| File input | `File` at UI boundary with approved client checks | PROVISIONAL |
| Metadata | Domain record with opaque document ID, owner ID, name/type/size/uploaded-at/by | PROVISIONAL |
| Upload | Hook → document service; pending/error states; targeted invalidation | PROVISIONAL |
| View/download | Request authorized access/download result; never assume stored public URL | BACKEND REQUIRED |
| Delete | Shared ConfirmationDialog; close after success; error retained | PROVISIONAL |
| Replacement | Separate action only if approved; do not model as silent upload overwrite | PRODUCT DECISION |
| Permissions | View/upload/replace/delete/download/ZIP categories; no codes proposed | PRODUCT DECISION |
| ZIP | Synchronous versus queued behavior | BACKEND REQUIRED |
| Mock cleanup | Revoke object URLs on replace/delete/reset | PROVISIONAL |
| Errors | Deterministic mock global/file failures; final error mapping unknown | PROVISIONAL |

Generic file metadata, Blob download mechanics and shared confirmation may be reused from Policy architecture. Employee ownership, taxonomy, permissions and publication semantics remain separate.

## 16. Recruitment conversion

### Current flow

`Candidate + Job + accepted Offer → prefilled Employee form → create Employee → mark Candidate hired`

The two mutations can partially succeed. Job Department/title/location are labels and bypass Company masters.

### Frontend command proposal

This is a conceptual frontend command, not a backend DTO or endpoint:

- Source references: Candidate ID and optional/approved Offer ID.
- Employee form values: only approved Employee fields after Company-master ID resolution.
- Provenance: retained internally if approved.
- Preconditions: candidate exists, offer relationship/status is accepted when required, form validates, selected masters belong to active Company.
- Success: exactly one committed Employee result; Candidate UI becomes converted/hired based on the same committed result.
- Failure: no Employee and no Candidate status change; show deterministic error and preserve form values.
- Mock rollback: stage both in-memory changes, validate all preconditions, commit together; on simulated failure commit neither.
- Future real behavior: **BACKEND REQUIRED** atomic operation/transaction and authoritative status transition.

Exact command field names, endpoint and response shape are deliberately unspecified.

## 17. Attendance dependencies

Employee must eventually provide or reference:

| Dependency | Employee responsibility | Owning authority | Classification |
|---|---|---|---|
| Employee identity/Company | Stable scoped reference | Employee/Auth/Backend | BACKEND REQUIRED |
| Branch/work location | Approved assignment reference | Employee/Company/Product | PRODUCT DECISION |
| Geofence | No client-authored rule; reference authorized work location | Attendance/Backend | BACKEND REQUIRED |
| Shift | Effective assignment reference only | Company/Attendance | DEFERRED |
| Week Off/Holiday List | Effective assignment references only | Company/Attendance | PRODUCT DECISION |
| Remote clock | Approved exception input, not authorization | Attendance/Backend | BACKEND REQUIRED |
| Attendance results | Employee detail consumes owning-domain query only | Attendance | DEFERRED |

Employee must not calculate attendance or decide geofence validity.

## 18. Leave dependencies

Frontend-known inputs are Employee identity, active Company and the documented need for manager/team and schedule relationships. Balance, accrual, eligibility, approval, effective calendars and resignation coupling are **BACKEND REQUIRED**. Leave UI/workflows are **DEFERRED** to the Leave/Resignation phase.

## 19. Payroll dependencies

| Item | Frontend-known | Backend required | Future dependency | Classification |
|---|---|---|---|---|
| Salary | Current Employee form captures annual number | Effective-dated compensation, authorization, calculation | Payroll | BACKEND REQUIRED |
| Bank | Current form captures account data | Secure storage/masking/payment eligibility | Payroll | BACKEND REQUIRED |
| PF/UAN/ESIC | Current form captures optional values/dates | Statutory validation/effective rules | Payroll | BACKEND REQUIRED |
| PAN | Current form captures value | Secure storage/tax mapping | Tax | BACKEND REQUIRED |
| Joining/status dates | Joining exists; resignation lifecycle absent | Payroll eligibility bounds | Payroll/Resignation | BACKEND REQUIRED |
| Payslip/Tax/Form16 | Navigation evidence only | Private files/calculations/access | Payroll/Tax/Form16 | DEFERRED |

Employee owns only approved inputs; Payroll owns calculations and outputs.

## 20. Mock contract

### Safe to mock

- Tenant-parameterized list/detail fixtures and targeted query keys: **PROVISIONAL**.
- Existing approved form fields/defaults and current create/edit navigation: **PROVISIONAL**.
- Numeric frontend master option references after relationship approval: **PROVISIONAL**.
- Deterministic loading, empty, error, retry, duplicate/conflict and forbidden scenarios: **PROVISIONAL**.
- Atomic Candidate conversion simulation with all-or-nothing in-memory commit: **PROVISIONAL**.
- Employee-scoped document metadata/Blob fixtures, upload/delete errors and URL cleanup: **PROVISIONAL**.
- UI masking mechanics after a masking policy is approved: **PROVISIONAL**.

### Not safe to invent

| Area | Classification |
|---|---|
| Final Employee DTO/endpoints/envelopes | BACKEND REQUIRED |
| Status names beyond verified raw evidence and all transitions | UNKNOWN |
| Legacy permission codes and 65-flag mappings | UNKNOWN |
| Master cardinality/effective assignments | PRODUCT DECISION |
| Employee code generation | BACKEND REQUIRED |
| Account/team operations | PRODUCT DECISION |
| Sensitive-field access | PRODUCT DECISION |
| Private file access/ZIP | BACKEND REQUIRED |
| Attendance/Leave/Payroll calculations | DEFERRED |
| Missing legacy fields/actions/routes | UNKNOWN |

## 21. Implementation gates

| Gate | Evidence required | Current state | Classification |
|---|---|---|---|
| GATE 1 — Employee domain model approved | Surviving fields, types, requiredness, editability | Current React only; legacy exactness absent | UNKNOWN |
| GATE 2 — Company master relationships approved | Cardinality, IDs, migration/history | Direction proposed; decisions open | PRODUCT DECISION |
| GATE 3 — Lifecycle statuses approved | Values, meanings, transitions, actors | Only Resigned/Temp raw evidence | BACKEND REQUIRED |
| GATE 4 — Sensitive-field policy approved | Mask/view/edit/export by actor | No policy | PRODUCT DECISION |
| GATE 5 — Permission categories approved | Action/field/file matrix and mapping | Categories prepared; codes unmapped | PRODUCT DECISION |
| GATE 6 — Detail structure approved | Sections/actions/navigation | Inventory only | PRODUCT DECISION |
| GATE 7 — Recruitment conversion approved | Mapping, preconditions, atomic outcome | Conceptual command only | BACKEND REQUIRED |
| GATE 8 — Document behavior approved | Taxonomy/actions/access/ZIP/permissions | Partial React behavior only | PRODUCT DECISION |
| GATE 9 — Backend DTO/API contract available | Resources/actions/errors/auth/tenant | Not available | BACKEND REQUIRED |

No implementation gate has passed.

## 22. Recommended next action

Hold a decision review using `42-employee-open-decisions.md` and this pack. Product should first decide GATE 1, GATE 2, GATE 4, GATE 5, GATE 6 and GATE 8 topics. Backend should then provide contracts for GATE 3, GATE 7 and GATE 9, including tenant enforcement and sensitive/file authorization. Obtain the legacy source or explicitly approve proceeding without parity evidence. Only then authorize the applicable Phase 3 implementation subphase. Do not start Phase 4.
