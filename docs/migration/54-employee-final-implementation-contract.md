# Employee Final Implementation Contract

## Contract status and gate

This is the consolidated CORE-13 implementation contract for the mock-first React migration. It distinguishes approved behavior, legacy-confirmed parity, proposed frontend architecture and unresolved Product/Backend contracts.

**READY FOR EMPLOYEE IMPLEMENTATION: NO.** P0 blockers are listed in section 20. No source implementation is authorized by this document.

Evidence pack: documents 38–53, with authoritative legacy source at `D:\techoma\PeoplePulse2.0`.

### Approved identity/employment architecture

**CORE-01 / CORE-04 status: RESOLVED.** Each Employee is a Company-scoped record representing one Company employment at a time. The target has no authoritative shared Person entity or global Person ID and does not model `Person -> multiple Employments`. On exit from Company A, Employee A is closed/resigned under CORE-07, receives its end/exit date under the lifecycle contract, loses Company A Account/access, and retains its code and all Company A history. A later joining in Company B creates a separate Employee B with a new code, destination masters/schedule and a new Account under the Account contract. Employee A is not moved, merged or reassigned.

## 1. Domain model

The frontend domain must not be one flat Employee object.

| Boundary | Fields/resources | Type/requiredness | Source | Sensitive | Editability | Evidence/status |
|---|---|---|---|---|---|---|
| Employee profile (Company-scoped) | first/middle/last name; personal email/phone; DOB; optional gender/marital/blood; addresses; one primary emergency contact; display-only existing photo | CORE-02 required/optional; location IDs | Legacy Staff/Address | DOB/contact/emergency conditional | HR edits; Employee read-only; Manager scoped view | Social/photo mutation deferred; no shared Person resource |
| Protected identity | Aadhaar name/number, PAN | protected subresource inputs; required Create | Legacy Staff | Yes | Authorized HR full; Employee masked own with authorized reveal; Manager denied | Exact masks/export Backend/Security required |
| Employee employment data | Employee ID, code, Branch, derived Company, Department, Designation, optional Role/manager, joining/end dates, five-value status, remote clock, Week Off/Holiday | entity IDs/dates/status | Legacy Staff + Company masters | Remote authorization | HR/actions | Company-scoped model resolved; DTO/history Backend required |
| Bank | account, holder, bank, bank branch, IFSC | required Create protected subresource | Legacy BankAccount | Yes | Authorized HR full; Employee masked own with authorized reveal; Manager denied | Ownership/history/effective dates/Payroll relationship unresolved |
| Statutory | UAN, PF number/join/exit, ESIC number/join/exit | optional protected subresource; exit dates not Create baseline | Legacy Staff | Yes | Authorized HR full; Employee masked own with authorized reveal; Manager denied | Ownership/history/transfer Payroll/Backend required |
| Documents | ID, owner scope, category, name, description, file metadata/timestamps | separate resource | StaffDocument | Yes/category-dependent | HR manages | Type ownership/security Backend/Product |
| Account | User ID, office email, account state and capabilities | separate Company-specific resource | Legacy Account | Yes/security | Identity workflow | New Account creation Backend/Product required; no continuity assumed |
| Payroll | compensation, Payroll, monthly salary, tax, payslips, F&F | separate domain | Legacy Payroll | Yes | Payroll authority | Deferred from Employee core |
| Attendance/Leave/Assets | domain records referencing Employment/Employee | separate resources | Legacy domains | Domain-dependent | Owning domain | Cross-module Backend required |
| Provenance | Candidate/Offer/Job conversion event | immutable separate metadata recommended | Recruitment | Limited | System only | Product/Backend required |
| System metadata | IDs, created/updated and actors if supported | Backend-owned | Mixed | Audit | Read-only | Backend required |

No distinct legacy Employment Type exists. `annual_salary`, document form scalars, Candidate/Offer IDs and Account credentials must not be generic editable Employee-core fields.

## 2. Create contract

### Required legacy-parity inputs

First/last/Aadhaar name; personal email/phone/DOB; Aadhaar/PAN; both addresses with country/state/city/line 1/pincode; Branch/Department/Designation IDs; joining date; five bank fields; three emergency fields.

### Optional inputs

Middle name, gender, marital status, blood group, address line 2, Role, Week Off, Holiday List mapping, remote clock, UAN, PF number/joining date, ESIC number/joining date. Reporting Manager is a legacy UI requirement but the direct service does not persist it; target requiredness remains a Product decision. Candidate/Offer provenance is system/conditional, never user-entered core data.

### System/related behavior

Internal ID/timestamps and Employee code are system-generated. Company is derived through Branch. Create produces one Company-scoped Employee with profile/employment data, two addresses and a Bank subrecord in the parity flow. It does not create Account, documents, Payroll, salary or Shift. Direct HR Create defaults Probation and permits Probation/Regular/Temp; Recruitment conversion forces Probation.

Validation may use only confirmed rules recorded in document 48/CORE-02 or approved Product rules. Existing React regex/age/salary/type rules are not automatically approved. Master values use IDs and active-Company compatibility. Error states: validation, forbidden, conflict/duplicate, stale master, mutation failure and backend-TBD.

## 3. Edit contract

HR may edit approved Profile/address/emergency fields and protected identity, Bank and Statutory through separate section/protected workflows. Organization assignments are ID-based HR actions. Lifecycle/status/end-date/code correction and Company-change orchestration are explicit actions, not a generic partial profile patch. Documents and Account use separate resources/actions. Payroll compensation is not Employee edit. No generic Employee PATCH may contain every field, and validation failure in an unrelated protected resource must not block an ordinary profile-section update.

Employee edit authority is not approved. Closed employment is recommended read-only with audited privileged correction, pending Product approval. IDs, provenance and system metadata are read-only. Same-address is a copy operation: copy current Permanent values, validate Correspondence, and retain values after uncheck.

The required command boundaries are: **Create**, **Profile Edit**, **Protected Data Action**, **Organization Action**, **Lifecycle Action**, **Document Action**, **Account Action**, and **Payroll Action**. A Create workflow may coordinate CORE-02-required Employee/address/bank inputs without making those resources one flat persistence or edit payload.

## 4. Lifecycle contract

Persist the five values: Probation, Regular, Notice Period, Resigned, Temp. Direct HR Create defaults Probation and permits Probation/Regular/Temp. Recruitment conversion initializes Probation without HR status selection. Notice Period and Resigned are lifecycle actions, not Create choices. Do not replace lifecycle with `is_active` or Employment Type.

Authorized HR may choose any of the five statuses through an explicit lifecycle action; no restrictive Product graph applies. Notice Period requires end/last-working date and optional distinct notice start. Resigned requires resignation date and end/last-working date, disables login and retains Account in a restricted F&F-pending state for the approximate 30–45-day process. Authorized HR may finally close Account after F&F. Exact backend states/transactions remain open. Closed Employee is read-only by default with specific audited HR corrections through dedicated actions.

Company change is `close Employee A + create Employee B`, not transfer of an Employee record. Employee A keeps its code, assignments, joining/final dates and all Company A domain/Account history. Employee B receives a new code, new joining/status data, destination assignments/schedule and a new Account under the unresolved Account contract. No organizational, lifecycle, Account, protected-data, document or operational-history field is automatically copied.

Employee code uses the configured Company prefix plus a Company-controlled sequence, is unique within Company, and never reuses sequence values after closure. Branch changes never alter it. Employee A retains its code; Employee B receives Company B's code. Authorized HR code correction is a dedicated action requiring a new unique code, reason, permission and audit; allocation/concurrency/persistence remain backend-owned.

Employee creation never creates Account. Authorized HR explicitly creates, activates, deactivates, changes and finally closes Account through separate actions. Resigned disables former-Employee login but retains the Account in restricted F&F-pending administration until authorized HR closure after F&F. Exact states and transactions remain backend-owned.

## 5. Permission contract

| Capability | HR | Manager | Employee | Backend |
|---|---|---|---|---|
| List/view/create/edit | ALLOW in authorized Company | Assigned-team non-sensitive view only | Own view; no Employee edit | Enforce tenant/object/team/action |
| Organization/lifecycle/Company change | ALLOW via explicit action | DENY | DENY | Authorize/audit/coordinate close A/create B |
| Sensitive identity/bank/statutory | Full authorized | DENY | MASKED own; explicit backend-authorized reveal | Project/reveal server-side |
| Documents | Full management | DENY | Own view/download only | Category/action/file authorization |
| Account | Full authorized administration | DENY | Own credential security flows only | Identity enforcement |
| Payroll | Full authorized | DENY | Own summary/structure/payslips/tax/history | Payroll enforcement |
| Attendance/Leave | Conditional owning-domain authority | Assigned-team domain-supported management/approval | Own conditional | Domain enforcement |
| Export/import/bulk | ALLOW approved HR operations; no bulk delete inferred | DENY | DENY | Redaction/audit |
| Cross-Company Employee view | Explicit authorized Director scope only | DENY unless separately authorized | DENY | Company-scope enforcement; no implied sensitive/domain access |

React route/action gates are UX. The backend is the security boundary. Do not map React permission strings to the 13 legacy flags without approval.

Employee own protected data is masked by default and can be explicitly revealed in full only after backend own-object authorization. Example masks are not normative formats. View/reveal is not audited; sensitive edits require audit with safe previous/new references, actor/time and reason where required. Sensitive export policy remains SECURITY/BACKEND REQUIRED. Manager sensitive access is denied. Backend projection/omission/masking/reveal is mandatory.

## 6. Document contract

EmployeeDocument is a separate protected resource. Preserve five legacy category mappings and 22 UI-name migration values until taxonomy approval. Metadata includes only confirmed/Backend-provided fields; expiry/status/uploader/version are not assumed. HR actions: list/view/download/upload/replace/delete and optionally ZIP after approval. Server validates file content/type/size; legacy parity includes PDF/Word/ODT/JPEG/PNG up to 10 MiB, while Word/ODT target support is open.

Required backend properties: tenant/Employee/category authorization, private delivery, safe storage key, concurrency, audit, retention/recoverable delete decision, optional versions and audited ZIP. Cross-Company document carry-forward requires a separate decision. Never expose raw URL possession as authorization.

## 7. Recruitment conversion contract

Follow document 53. Target recommendation is one authorized idempotent backend command: validate/lock Candidate and tenant/prerequisites; complete CORE-02 data; resolve master IDs; create the Company-scoped Employee and code; apply approved document/provenance policy; update Candidate/Offer state; commit once. Failure rolls back all required state and returns a stable error/conflict. Account is separately provisioned unless approved; salary remains Payroll-owned.

Legacy Candidate→Staff mapping is migration evidence, including its partial-transaction/document defects. React must not orchestrate Employee create plus Candidate update as independent mutations. Recruitment conversion is distinct from inter-company transfer.

## 8. Employee list contract

Legacy-confirmed baseline remains Company-scoped list/search/filter/sort/page. Product approves HR-only Employee import, CSV/Excel/PDF/clipboard export and approved bulk operations; bulk delete is not approved. Sensitive export fields/redaction and backend execution remain Security/Backend decisions. See document 55.

## 9. Cross-module contract

Use Company numeric IDs for Branch, Department, Designation, Week Off and Holiday List; derive Company through Branch. Manager references an Employee/Employment identifier. Shift remains Attendance-deferred. Attendance, Leave, Payroll, Assets, Recruitment, Documents and Account own their records and reference stable employment-aware identifiers. Never reassign historical domain records during transfer. See document 56.

## 10. Mock-first architecture

`Component → TanStack Query hook → Employee domain service → mock adapter | backend-TBD adapter`.

Components never import mocks, inspect environment variables, call `httpClient` or contain URLs. Query keys are centralized. Mocks are deterministic, session-only is acceptable, nested results are defensively copied, and deterministic conflict/forbidden/not-found/validation failures are supported. Real mode may throw a clear backend-TBD error rather than inventing a contract. Domain service interfaces may model approved frontend concepts but transport DTO mapping remains isolated/TBD.

## 11. UI architecture

Use existing shared Button, Input, Select, Modal, ConfirmationDialog, empty/loading/error patterns and form primitives. Build Employee pages/components/hooks/api/types/schema/lib only where domain-owned. Detail is read-first with adaptive sections; edit combines section forms and explicit protected/lifecycle/account workflows. Do not duplicate tables/modals/pagination/filter primitives. Desktop navigation may be tabs/sidebar, tablet collapsible navigation, mobile stacked content/action menu without horizontal overflow; final navigation is Product-required.

## 12. Validation

React Hook Form + Zod. Separate create schemas from section/action schemas so unrelated protected/domain fields do not block partial actions. Rules originate in CORE-02 evidence or approved Product decisions. UI validation mirrors but never replaces backend validation. Normalize empty optional values deliberately and map server field/general/conflict errors to stable UI states.

## 13. Sensitive data

Aadhaar, PAN, Bank, UAN/PF/ESIC and salary receive separate projections/resources. HR receives full values when authorized; Manager receives none; Employee receives masked own values and backend-authorized explicit reveal. React never fetches unrelated full values merely to mask them visually. Exact masks, caching/logging and sensitive export remain Security/Backend-required.

## 14. Error states

Every page/resource/action defines loading; empty; invalid ID; forbidden; not found; validation; conflict/duplicate/stale write; mutation failure; retry; and backend-TBD. Conversion/transfer additionally expose idempotent existing-result and reconciliation-required states. Do not collapse forbidden into not found unless backend policy requires it.

## 15. Query-key hierarchy

Proposed centralized shape, not a transport endpoint:

`employee.all(companyId)`; `lists(companyId)`; `list(companyId, normalizedParams)`; `details(companyId)`; `detail(companyId, employeeId)`; nested `profile`, `employment`, `organization`, `bank`, `statutory`, `documents`, `document`, `account`, `history`, and authorized domain-summary keys. Candidate conversion uses Recruitment-scoped Candidate/Offer keys plus invalidation of Employee list/result keys. Mutations invalidate only changed resources and dependent summaries. Current non-tenant Employee keys must be revised before implementation.

## 16. Implementation phases

| Phase | Likely files | Dependencies/blockers | Tests | Acceptance criteria |
|---|---|---|---|---|
| A Domain/types/schema/API boundary | employee types/schema/api adapters/query keys | P0 field/ID/lifecycle/mask decisions | Type/schema/adapter/mock tests | No mock/http leakage; contract classifications explicit |
| B List/detail shell | list/detail pages/components/hooks | List params, detail navigation/header decisions | Loading/empty/error/filter/sort/page/a11y | Confirmed list/detail data only |
| C Create | create schemas/forms/service | CORE-02, master IDs, create status, backend-TBD policy | Requiredness/mapping/error tests | Legacy-parity fields and related boundaries |
| D Edit | section forms/actions | Self-edit, closed-edit, mutation semantics | Dirty/reset/section/error tests | No cross-section blocking |
| E Organization integration | option hooks/adapters | Company IDs/compatibility/history | Scope/filter/retired-master tests | No label-as-ID storage |
| F Lifecycle | actions/status UI | CORE-07 transition/date/account decisions | Transition/conflict/history tests | Five statuses preserved |
| G Documents | resource UI/hooks/adapter | CORE-09 access/version/delete/type decisions | Upload/replace/delete/security-state tests | Separate protected lifecycle |
| H Recruitment conversion | Recruitment action/service boundary | CORE-10 prerequisite/state/provenance/idempotency | Success/rollback/retry/duplicate tests | One conceptual conversion mutation |
| I Account/team | account/team views/actions | Manager/account membership decisions | Authorization/team tests | Separate account/team boundaries |
| J Cross-module integration | summary adapters/deep links | Domain contracts | Integration/invalidation tests | No ownership leakage/circular imports |
| K Parity/regression | tests/docs/checklists | All gates | E2E responsive/dark/a11y/security-state | Traceability complete |

No phase should create backend endpoints. Phase A is the first phase only after P0 blockers are resolved.

## 17. Traceability matrix

| Legacy feature | Migration evidence | Final destination | Phase |
|---|---|---|---|
| Broad fields/create related records | 46, 48 | Sections 1–2 | A/C |
| Section edits and detail tabs | 48, 49 | Sections 3/11 | B/D |
| Organization/code/team | 48, 56 | Sections 3/9 | E/I |
| Five statuses/resignation/account coupling | 50 | Section 4 | F |
| Broad flags/self-profile/sensitive gap | 51 | Sections 5/13 | A/B/D |
| Document CRUD/view/ZIP | 52 | Section 6 | G |
| Candidate conversion/address/documents | 53 | Section 7 | H |
| List/search/status/sort/page/export | 55 | Section 8 | B |
| Attendance/Leave/Payroll/Assets/Account dependencies | 49/50/56 | Section 9 | J |
| Account provisioning/email/password | 48/49/51 | Sections 3/5/9 | I |
| Transfer/history | 47/48/49/50/56 | Sections 4/9 | F/J |

Every confirmed feature is either assigned a phase, a separate owning domain or an explicit Product/Backend decision; none is silently removed.

## 18. Consolidated open decisions

### Remaining Product/domain decisions

| Priority | Blocking | Decisions | Phases |
|---|---|---|---|
| P0 | Yes for owning domains | Exact Temp Payroll/Attendance/CTC/duration behavior | F/J |
| P0 | Yes for sensitive export | Which sensitive fields HR exports and required redaction | B |
| P1 | Yes for Company change | Authorized ordinary-profile prefill, historical cross-Company lookup and Asset closure workflow | I/J |
| P1 | Yes for document ZIP | ZIP authorization policy | G |
| P1 | No | Exact lightweight domain-summary contents | B/J |
| P1 | No | Joining-date list filter (explicitly deferred) | Future |
| P2 | No | Future profile-photo mutation and social fields (deferred) | Future |

### Backend

P0 blockers: Company-scoped Employee ID serialization; tenant-scoped DTOs and master validation; create/edit resource boundaries; transition/close-A-create-B transaction; authorization/field projection; code allocation; history; conversion idempotency/rollback; query/error/concurrency contracts. P1: documents/private storage/version/retention/ZIP; Account creation; domain-summary references; list params/export. No backend contracts are invented.

### Legacy unknown

Exact endpoint permission intent; production private-storage/media configuration; physical old/deleted file cleanup; intended reporting-manager create persistence; formal lifecycle graph; business meaning of Temp Payroll calculations; intended synchronization of resignation/Employee status; document type ownership; expected large-list/page size; and whether omitted HR flags/routes reflect incomplete code or intended policy.

## 19. Parity checklist

| Area | Status |
|---|---|
| Fields/create requiredness | CONFIRMED |
| Forms/validation | PARTIAL |
| Routes/detail | MISSING |
| List/search/filter/sort/pagination | PARTIAL |
| Create/edit | PARTIAL |
| Lifecycle | PRODUCT DECISION |
| Permissions/sensitive data | BACKEND REQUIRED |
| Documents | PARTIAL |
| Recruitment conversion | BACKEND REQUIRED |
| Account/team | PRODUCT DECISION |
| Attendance/Leave/Payroll/Assets | BACKEND REQUIRED |
| Import/export/approved bulk | PRODUCT RESOLVED; BACKEND/SECURITY REQUIRED |
| Export | PRODUCT DECISION |
| History/transfer | BACKEND REQUIRED |
| Error states/retry | MISSING |
| Responsive UI/dark mode | PARTIAL |
| Accessibility | PARTIAL |
| Unit/integration/E2E tests | MISSING |

## 20. Final implementation gate

**READY FOR EMPLOYEE IMPLEMENTATION: NO.** Exact blocking decisions:

1. Target field survival/optional personal attributes, bank/statutory ownership and exact create DTO boundary remain open; the Company-scoped Employee identity architecture itself is resolved.
2. Lifecycle Product policy is approved, but backend commands, Account/F&F states, audit, concurrency and downstream domain events are unavailable.
3. Tenant/master ID validation, assignment history and close-A/create-B orchestration are backend-required.
4. Actor Product permissions are approved; exact backend capabilities, team/Director scope enforcement, sensitive projection/reveal and sensitive export are unavailable.
5. Document ownership/access/version/delete/retention/private delivery decisions block Phase G.
6. Recruitment conversion prerequisite/state/provenance/idempotency/rollback contract is unresolved.
7. HR Account administration is approved, but new-Company Account states, commands, authorization enforcement and failure behavior are unresolved backend contracts.
8. Backend-TBD adapter behavior and stable error/conflict shapes must be approved before real-mode interfaces are frozen.

After these P0 items are approved, first implementation phase is **Phase A — Employee domain types/schema/API boundary**, limited to frontend domain types, classified schemas, tenant-aware query keys, deterministic mock adapter interfaces and explicit backend-TBD adapter errors. It must not implement pages or invent transport endpoints.

### Identity-model decisions still open

Only these identity-model consequences remain: cross-Company duplicate detection; authorized new-Company prefill; sensitive-data carry-forward; document carry-forward; new Account creation; Employee-code generation; and authorized historical cross-Company lookup. Their backend behavior is UNKNOWN until the named Product/Security/Identity/Backend authorities define it.

## Approved CORE-05/09/10/11/12 reconciliation

- Profile: Middle Name, Gender, Marital Status and Blood Group are optional; social fields are deferred. One primary emergency contact is required. Employee profile is read-only outside HR administration. Recruitment provenance is conditional and read-only.
- Bank/statutory: one active bank account with retained prior bank history and Payroll using active only; one current statutory record with no separate prior history. No Company-change copy.
- Documents: five employment-specific categories; HR lifecycle management; Employee own active view/download through Notice Period; metadata edit separate from versioned file replacement; archive/restore; allowed PDF/DOC/DOCX/ODT/JPG/JPEG/PNG up to 10 MB.
- Recruitment: Candidate plus accepted Offer required; Probation; atomic new Employee creation; Candidate changes only after success; duplicate returns existing Employee; no automatic Account/Payroll.
- List: active-status default excluding Resigned; multi-select OR-within/AND-across filters; approved fields/columns/sorts; backend pagination default 20; fresh visits; table on all breakpoints; bulk mode and approved operations; two export scopes.
- Masters: Create selects Company then compatible Branch. Company independently owns Branch, Department, Designation, Week Off and Holiday List masters. Masters use Active/Inactive retention. Branch can change within Company without code change. Shift is deferred behind a future Company configuration flag.
- Detail: current values with per-field history modal where approved, distinct from raw backend audit; lightweight owning-domain summaries/deep links.

All operations retain the Component -> Query Hook -> domain API service -> mock/backend-TBD adapter boundary. Components do not access mocks, environment, HTTP client or URLs directly.
