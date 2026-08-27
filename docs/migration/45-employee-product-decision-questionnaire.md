# Employee Product Decision Questionnaire

## 1. Purpose

This questionnaire is the approval record needed to unblock Employee frontend implementation while preserving legacy-evidence limits, product ownership and backend authority. It is based only on `42-employee-open-decisions.md` and `44-employee-contract-decision-pack.md`.

Completing this questionnaire does not itself authorize implementation. The corresponding gate must be reviewed and explicitly approved.

## 2. Decision Rules

- Product decisions must be answered and explicitly approved by the designated product/HR owner.
- Backend decisions must be supplied and approved by the backend/security owner.
- Behavior unavailable from the legacy application remains `UNKNOWN` unless the legacy source is supplied or the product explicitly accepts proceeding without exact parity.
- No assumption, recommendation or current React behavior automatically becomes a requirement.
- Mock behavior may represent only approved frontend behavior and must not imply a final DTO, endpoint, permission code or backend rule.
- Answers belong in the decision table or an approved linked decision record. Do not silently infer an answer from discussion.

## 3. P0 Decisions

### Legacy evidence

| ID | Question | Owner | Answer |
|---|---|---|---|
| LEG-01 | Is the complete legacy Employee source available for audit? If yes, who will supply it and when? | Legacy source owner | |
| PROD-01 | If the legacy source remains unavailable, do we explicitly approve proceeding without exact legacy Employee parity, with all unavailable behavior recorded as `UNKNOWN`? | Product owner | |

### Employee domain

| ID | Question | Owner | Answer |
|---|---|---|---|
| PROD-02 | Which fields in the current Employee field matrix survive in the approved product model? | Product/HR | |
| PROD-03 | Which surviving fields are mandatory on Create and which are conditionally mandatory? | Product/HR | |
| PROD-04 | Which surviving fields may be edited after creation, and under which lifecycle conditions? | Product/HR | |
| PROD-05 | Which fields are always read-only, including Employee code and provenance fields? | Product/HR | |

### Company relationships

For each row, answer all five points: required or optional; single or multiple assignment; effective-dated or not; historical assignments preserved or not; and which actors may change it.

| ID | Relationship requiring a decision | Owner | Answer |
|---|---|---|---|
| PROD-06 | Employee ↔ Company | Product/HR | |
| PROD-07 | Employee ↔ Branch | Product/HR | |
| PROD-08 | Employee ↔ Department | Product/HR | |
| PROD-09 | Employee ↔ Designation | Product/HR | |
| PROD-10 | Employee ↔ Shift | Product/HR | |
| PROD-11 | Employee ↔ Week Off | Product/HR | |
| PROD-12 | Employee ↔ Holiday List | Product/HR | |

### Lifecycle

| ID | Question | Owner | Answer |
|---|---|---|---|
| PROD-13 | What Employee lifecycle statuses must exist in the product? | Product/HR | |
| PROD-14 | What does the verified legacy label `Resigned` mean operationally and historically? | Product/HR | |
| PROD-15 | What does the verified legacy label `Temp` mean, and is it a lifecycle status or employment classification? | Product/HR | |
| PROD-16 | What additional statuses, if any, are required? | Product/HR | |
| PROD-17 | Which actors may initiate or approve each lifecycle change? | Product/HR | |
| PROD-18 | Can an Employee ever be permanently deleted? | Product/Legal/HR | |
| PROD-19 | If not deleted, which deactivate, resign or terminate actions are required? | Product/HR | |
| PROD-20 | What must happen to Employee-linked attendance, leave, payroll, asset, document and audit history after a lifecycle change? | Product/Legal/HR | |

### Sensitive information

For each row specify: who can view full values; who can edit; whether values are masked and for whom; who can export; and whether unauthorized values must be omitted entirely from backend responses.

| ID | Sensitive data | Owner | Answer |
|---|---|---|---|
| PROD-21 | Aadhaar number and name-as-Aadhaar | Product/Security/HR | |
| PROD-22 | PAN | Product/Security/HR | |
| PROD-23 | Salary/compensation | Product/Security/Payroll | |
| PROD-24 | Bank account, holder and IFSC | Product/Security/Payroll | |
| PROD-25 | UAN | Product/Security/Payroll | |
| PROD-26 | PF number and joining date | Product/Security/Payroll | |
| PROD-27 | ESIC number and joining date | Product/Security/Payroll | |
| PROD-28 | Date of birth | Product/Security/HR | |
| PROD-29 | Residential addresses | Product/Security/HR | |
| PROD-30 | Phone, email and emergency contact | Product/Security/HR | |
| PROD-31 | Employee documents and document metadata | Product/Security/HR | |

### Permission capabilities

For each capability define the allowed actors and ownership scope. Do not supply permission codes in this questionnaire.

| ID | Capability requiring a permission decision | Existing documented mapping | Owner | Answer |
|---|---|---|---|---|
| PROD-32 | Employee list | Provisional `employee.view` on navigation only | Product/Security | |
| PROD-33 | Employee detail/profile | No approved mapping | Product/Security | |
| PROD-34 | Create Employee | Provisional `employee.write` exists; no action mapping | Product/Security | |
| PROD-35 | Edit Employee | Provisional `employee.write` exists; no action mapping | Product/Security | |
| PROD-36 | Lifecycle/delete/deactivate actions | Unmapped | Product/Security | |
| PROD-37 | Document view/upload/replace/delete/download/ZIP | Unmapped | Product/Security | |
| PROD-38 | Salary/compensation | No Employee-field mapping; provisional Payroll capability exists | Product/Security/Payroll | |
| PROD-39 | Bank/statutory fields | Unmapped | Product/Security/Payroll | |
| PROD-40 | Sensitive identity fields | Unmapped | Product/Security | |
| PROD-41 | Import | Unmapped and legacy behavior unknown | Product/Security | |
| PROD-42 | Export | Unmapped | Product/Security | |
| PROD-43 | Bulk operations | Unmapped and legacy behavior unknown | Product/Security | |
| PROD-44 | Attendance within Employee profile | Provisional `attendance.read`; ownership scope unresolved | Product/Security | |
| PROD-45 | Own Employee profile | Unmapped | Product/Security | |
| PROD-46 | Account provisioning and credential actions | Unmapped | Product/Security/Identity | |

## 4. P1 Decisions

### Employee detail page

No tab requirement is implied. Select required sections and decide whether they are tabs, stacked sections or another approved presentation.

| ID | Proposed section | Evidence/classification | Include and presentation decision |
|---|---|---|---|
| PROD-47 | Identity/summary header and lifecycle actions | Provisional | |
| PROD-48 | Personal and address | Known current form data | |
| PROD-49 | Employment and Company/master assignments | Known current form data; relationships unresolved | |
| PROD-50 | Bank/statutory/compensation | Known current form data; sensitive | |
| PROD-51 | Emergency contact | Known current form data | |
| PROD-52 | Documents | Known partial behavior | |
| PROD-53 | Attendance | Provisional integration | |
| PROD-54 | Account, permissions and team | Product decision required | |
| PROD-55 | Audit/history | Unknown legacy behavior | |
| PROD-56 | Leave/Resignation and Payroll/Tax/Form16 | Deferred modules; decide whether future placeholders are prohibited or desired | |

### Employee list

| ID | Question | Evidence | Owner | Answer |
|---|---|---|---|---|
| PROD-57 | Is search required, and which approved fields are searchable? | Exact legacy control unknown | Product | |
| PROD-58 | Which filters are required? | Exact legacy controls unknown | Product | |
| PROD-59 | Is sorting required, and on which columns? | Exact legacy behavior unknown | Product | |
| PROD-60 | Is pagination required? | Current list is unpaged | Product | |
| PROD-61 | Which page-size choices are required? | No evidence | Product | |
| PROD-62 | Is bulk row selection required? | No React behavior; legacy unknown | Product | |
| PROD-63 | Which bulk actions, if any, are required? | Legacy behavior unknown | Product | |
| PROD-64 | Is Employee import required? If so, what product outcome is expected? | Legacy behavior unknown | Product | |
| PROD-65 | Is Employee export required? If so, which fields and formats are permitted? | Exact behavior unknown | Product/Security | |

### Account provisioning

| ID | Select one behavior or explicitly define another approved behavior | Owner | Answer |
|---|---|---|---|
| PROD-66 | A. Create Employee only; B. create Employee plus mandatory account; C. optional provisioning during Employee creation; D. provision account later through a separate authorized action. | Product/Identity | |

### Team and reporting manager

| ID | Question | Owner | Answer |
|---|---|---|---|
| PROD-67 | Is reporting manager required, optional or unavailable for some Employees? | Product/HR | |
| PROD-68 | May a reporting manager belong to another Company? | Product/HR/Security | |
| PROD-69 | May an Employee have multiple concurrent managers? | Product/HR | |
| PROD-70 | Is a multi-level hierarchy required? | Product/HR | |
| PROD-71 | Must Employee detail expose direct reports/team members? | Product/HR | |
| PROD-72 | Is the hierarchy authoritative for Leave, Attendance, Resignation or Appraisal approvals? | Product/HR | |

### Documents

| ID | Question | Owner | Answer |
|---|---|---|---|
| PROD-73 | What are the final Employee document categories? | Product/HR | |
| PROD-74 | What document types belong to each category? | Product/HR | |
| PROD-75 | What maximum file size is approved? | Product/Security | |
| PROD-76 | Which MIME types/extensions are allowed? | Product/Security | |
| PROD-77 | Is document replacement required, and does it preserve version/history? | Product/HR | |
| PROD-78 | Who may delete documents and are any categories non-deletable? | Product/Security/HR | |
| PROD-79 | Which actors may view and download each category? | Product/Security/HR | |
| PROD-80 | Is ZIP download required, and for which scopes/categories? | Product/Security/HR | |
| PROD-81 | Which document actions require distinct capability decisions? | Product/Security | |
| PROD-82 | Must all Employee files use private authorized access with no permanent public URL? | Product/Security | |

### Recruitment conversion

| ID | Question | Owner | Answer |
|---|---|---|---|
| PROD-83 | Which Candidate fields are approved to prefill or map into Employee? | Product/HR/Recruitment | |
| PROD-84 | Which Job fields map to Employee, and how must they resolve to Company masters? | Product/HR/Recruitment | |
| PROD-85 | Is an accepted Offer required before conversion? | Product/HR/Recruitment | |
| PROD-86 | What user-visible state and retry behavior are required if conversion fails? | Product/HR/Recruitment | |
| PROD-87 | Must Candidate status change and Employee creation be one atomic outcome? | Product/HR/Recruitment | |

## 5. UX Decisions

### Address

| ID | Select the intended “Same as above” behavior | Owner | Answer |
|---|---|---|---|
| PROD-88 | A. one-time copy; B. synchronized while checked; C. linked/persisted semantic address; D. no special behavior. | Product | |

Option B is the safest frontend recommendation in document 44: synchronize permanent values while checked, disable permanent controls, and retain the copied values when unchecked. This recommendation remains a `PRODUCT DECISION` and is not preselected.

### Save behavior

| ID | Question | Owner | Answer |
|---|---|---|---|
| PROD-89 | Should Employee Edit support Save Current Section, Update All, or both? | Product/HR | |
| PROD-90 | If another section is invalid, may a valid current section still be saved, and how should cross-section errors be presented? | Product/HR/Backend | |

## 6. Backend Questions

No answer may be inferred from the current Django or React implementation, and no endpoint is requested here.

| ID | Backend question | Owner | Answer |
|---|---|---|---|
| BE-01 | What is the authoritative Employee ID type and serialization? | Backend | |
| BE-02 | How is active-Company tenant scope supplied, validated and enforced? | Backend/Security | |
| BE-03 | What is the Employee → Company foreign-key/cardinality contract? | Backend | |
| BE-04 | What is the Employee → Branch foreign-key/cardinality/history contract? | Backend | |
| BE-05 | What is the Employee → Department foreign-key/cardinality contract? | Backend | |
| BE-06 | What is the Employee → Designation foreign-key/cardinality contract? | Backend | |
| BE-07 | What is the Employee → Shift foreign-key/effective-assignment contract? | Backend | |
| BE-08 | What is the Employee → Week Off foreign-key/effective-assignment contract? | Backend | |
| BE-09 | What is the Employee → Holiday List foreign-key/effective-assignment contract? | Backend | |
| BE-10 | How is Employee code generated, including Branch/Temp behavior and uniqueness? | Backend | |
| BE-11 | What are the raw lifecycle status values and response representations? | Backend | |
| BE-12 | What lifecycle transitions exist, who may perform them and how are invalid transitions reported? | Backend/Security | |
| BE-13 | What search, filter, sort, pagination and page-size request/response contract is supported? | Backend | |
| BE-14 | What is the global API error envelope? | Backend | |
| BE-15 | How are field validation, uniqueness and conflict errors represented? | Backend | |
| BE-16 | Are version/concurrency fields required, and how are stale writes rejected? | Backend | |
| BE-17 | How are sensitive fields authorized, masked or omitted at serialization time? | Backend/Security | |
| BE-18 | What is the private Employee document upload and metadata contract? | Backend/Security | |
| BE-19 | How are Employee document view/download operations authorized and delivered? | Backend/Security | |
| BE-20 | Is document ZIP synchronous or queued, and how are status/download failures represented? | Backend | |
| BE-21 | What account-provisioning operations, outcomes, retry rules and rollback guarantees are supported? | Backend/Identity | |
| BE-22 | What reporting-manager/team API prevents cross-tenant links, self-reference and cycles? | Backend | |
| BE-23 | What all-or-nothing transaction contract converts a Candidate to an Employee? | Backend/Recruitment | |

## 7. Legacy Questions

These questions require the legacy source or an approved equivalent extraction.

| ID | Legacy-only question | Owner | Answer |
|---|---|---|---|
| LEG-02 | What is the complete legacy Employee field inventory, including types, defaults, requiredness and editability? | Legacy source owner | |
| LEG-03 | What are all legacy Employee routes and user-facing actions? | Legacy source owner | |
| LEG-04 | What are all legacy Employee status values, labels and transitions? | Legacy source owner | |
| LEG-05 | What are the names and meanings of the 65 legacy permission flags relevant to Employee? | Legacy source owner | |
| LEG-06 | What is the legacy Employee detail/profile layout and section/tab behavior? | Legacy source owner | |
| LEG-07 | What is the legacy Employee document taxonomy, validation and lifecycle? | Legacy source owner | |
| LEG-08 | What Employee import/export behavior, fields and formats exist? | Legacy source owner | |
| LEG-09 | What Employee bulk-selection and bulk-action behavior exists? | Legacy source owner | |
| LEG-10 | What is the legacy Employee account provisioning/password/email workflow? | Legacy source owner | |
| LEG-11 | What is the legacy team/reporting-manager hierarchy and approval workflow? | Legacy source owner | |

## 8. Decision Table

Answers remain blank. A range is one review packet whose individual questions are listed above.

| ID | Question | Owner | Priority | Blocks | Answer | Status |
|---|---|---|---|---|---|---|
| LEG-01–LEG-11 | Legacy availability and legacy-only evidence questions | Legacy source owner | P0 | GATE 1 and parity sign-off | | LEGACY REQUIRED |
| PROD-01 | Approve or reject proceeding without exact legacy parity | Product | P0 | GATE 1 | | UNANSWERED |
| PROD-02–PROD-05 | Employee field/domain survival, requiredness and editability | Product/HR | P0 | GATE 1 | | UNANSWERED |
| PROD-06–PROD-12 | Company/master assignment semantics | Product/HR | P0 | GATE 2 | | UNANSWERED |
| PROD-13–PROD-20 | Lifecycle, retention and deletion semantics | Product/HR/Legal | P0 | GATE 3 | | UNANSWERED |
| PROD-21–PROD-31 | Sensitive-data view/edit/mask/export policy | Product/Security | P0 | GATE 4 | | UNANSWERED |
| PROD-32–PROD-46 | Capability-level permission categories | Product/Security | P0 | GATE 5 | | UNANSWERED |
| PROD-47–PROD-56 | Employee detail sections and presentation | Product | P1 | GATE 6 | | UNANSWERED |
| PROD-57–PROD-65 | Employee list controls/import/export | Product | P1 | GATE 1, GATE 9 | | UNANSWERED |
| PROD-66 | Account-provisioning timing | Product/Identity | P1 | GATE 1, GATE 5, GATE 9 | | UNANSWERED |
| PROD-67–PROD-72 | Team/reporting-manager behavior | Product/HR | P1 | GATE 1, GATE 5, GATE 9 | | UNANSWERED |
| PROD-73–PROD-82 | Employee document behavior and permissions | Product/Security | P0 | GATE 8 | | UNANSWERED |
| PROD-83–PROD-87 | Recruitment mapping and conversion outcome | Product/Recruitment | P0 | GATE 7 | | UNANSWERED |
| PROD-88 | Address copy/synchronization behavior | Product | P1 | GATE 1 | | UNANSWERED |
| PROD-89–PROD-90 | Edit save behavior and cross-section validity | Product/Backend | P1 | GATE 1, GATE 9 | | UNANSWERED |
| BE-01–BE-16 | Employee resource, masters, status, list, errors and concurrency | Backend | P0 | GATE 1, GATE 2, GATE 3, GATE 9 | | BACKEND REQUIRED |
| BE-17 | Sensitive-field authorization and serialization | Backend/Security | P0 | GATE 4, GATE 9 | | BACKEND REQUIRED |
| BE-18–BE-20 | Private document and ZIP contracts | Backend/Security | P0 | GATE 8, GATE 9 | | BACKEND REQUIRED |
| BE-21–BE-22 | Account and team contracts | Backend/Identity | P1 | GATE 1, GATE 5, GATE 9 | | BACKEND REQUIRED |
| BE-23 | Atomic Candidate conversion | Backend/Recruitment | P0 | GATE 7, GATE 9 | | BACKEND REQUIRED |
| Leave/Attendance/Payroll operational workflows | Later owning modules | Later | — | Later phases | | DEFERRED |

Allowed statuses are `UNANSWERED`, `ANSWERED`, `BACKEND REQUIRED`, `LEGACY REQUIRED` and `DEFERRED`. A row may become `ANSWERED` only after its owner records and approves every included answer.

## 9. Gate Mapping

| Gate | Questions that must be answered/approved | Current status |
|---|---|---|
| GATE 1 — Employee domain model | LEG-01–LEG-03, PROD-01–PROD-05, PROD-57–PROD-72, PROD-88–PROD-90, BE-01, BE-10, BE-14–BE-16, BE-21–BE-22 | UNANSWERED / BACKEND REQUIRED / LEGACY REQUIRED |
| GATE 2 — Company master relationships | PROD-06–PROD-12, BE-02–BE-09 | UNANSWERED / BACKEND REQUIRED |
| GATE 3 — Lifecycle statuses | LEG-04, PROD-13–PROD-20, BE-11–BE-12 | UNANSWERED / BACKEND REQUIRED / LEGACY REQUIRED |
| GATE 4 — Sensitive-field policy | PROD-21–PROD-31, BE-17 | UNANSWERED / BACKEND REQUIRED |
| GATE 5 — Permission categories | LEG-05, PROD-32–PROD-46, relevant PROD-66–PROD-72, BE-17, BE-21–BE-22 | UNANSWERED / BACKEND REQUIRED / LEGACY REQUIRED |
| GATE 6 — Detail structure | LEG-06, PROD-47–PROD-56 | UNANSWERED / LEGACY REQUIRED |
| GATE 7 — Recruitment conversion | PROD-83–PROD-87, BE-23 | UNANSWERED / BACKEND REQUIRED |
| GATE 8 — Document behavior | LEG-07, PROD-73–PROD-82, BE-18–BE-20 | UNANSWERED / BACKEND REQUIRED / LEGACY REQUIRED |
| GATE 9 — Backend DTO/API contract | BE-01–BE-23 plus approved product inputs | BACKEND REQUIRED |

## 10. Implementation Readiness

- [ ] GATE 1 — Employee domain model approved
- [ ] GATE 2 — Company master relationships approved
- [ ] GATE 3 — Employee lifecycle statuses approved
- [ ] GATE 4 — Sensitive-field policy approved
- [ ] GATE 5 — Permission categories approved
- [ ] GATE 6 — Employee detail structure approved
- [ ] GATE 7 — Recruitment conversion behavior approved
- [ ] GATE 8 — Document behavior approved
- [ ] GATE 9 — Backend DTO/API contract available

No gate is passed.

## 11. Recommended Decision Order

1. Decide whether legacy evidence will be supplied or explicitly approve proceeding without exact parity.
2. Approve the Employee field/domain model.
3. Approve Company/master relationships.
4. Approve lifecycle semantics.
5. Approve sensitive-data policy.
6. Approve capability-level permission categories.
7. Approve Employee detail structure.
8. Approve Employee document behavior.
9. Approve Recruitment conversion behavior.
10. Backend supplies the authoritative resource/action/security contracts.
11. Resolve list, account and team decisions before their implementation subphases.

Employee implementation remains blocked until the applicable gates are passed. Do not start Phase 4.
