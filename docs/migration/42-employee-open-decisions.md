# Employee Open Decisions

Only unresolved decisions evidenced by the audit are listed. No row approves a backend shape, endpoint, permission code or workflow.

| ID | Decision | Why it matters | Current assumption | Required authority | Status |
|---|---|---|---|---|---|
| EMP-001 | Complete legacy Employee source/evidence | Source audit completed in `46-legacy-employee-source-audit.md` | Legacy Django source at `D:\techoma\PeoplePulse2.0` | Legacy repository/source owner | RESOLVED |
| EMP-002 | Company-scoped Employee DTO and ID serialization | The identity architecture is resolved: each Company employment is a separate Employee record, with no shared Person ID. Concrete backend ID/DTO serialization is still required | Numeric React ID; no Company scope | Backend | BLOCKED |
| EMP-003 | Company/Branch assignment cardinality | One Company employment per Employee record and no simultaneous cross-Company employments are resolved; Branch/master persistence remains backend-required | Optional Company string; no Branch | Backend | BLOCKED |
| EMP-004 | Company-master ID migration | Product resolves independent Company ownership for Branch/Department/Designation and no Department→Designation or Branch→Department ownership; Active/Inactive retention applies | Static labels | Backend + migration owner | BLOCKED |
| EMP-005 | Week Off/Holiday assignment backend contract | Product resolves multiple Company-owned masters, one selected per Employee, no custom Employee rules, inactive assignment retention; Shift deferred | Strings/absent | Backend + owning domains | BLOCKED |
| EMP-006 | Employee code backend contract | Product policy resolved: Company prefix plus Company-controlled unique non-reused sequence; Branch changes never change code; Employee B gets Company B code; authorized HR correction requires new code, reason, uniqueness, permission and audit | Backend owns allocation, validation, concurrency and audit persistence | Backend | BLOCKED |
| EMP-007 | Lifecycle backend contract | Product policy resolved: five statuses; approved Create/transition/date/closure rules; default list excludes Resigned while explicit filter includes it | Exact Account/F&F states, transactions, audit, concurrency and domain events remain | Backend + owning domains | BLOCKED |
| EMP-008 | Profile fields and create/edit editability | Boundaries and actor policy resolved: HR edits; Employee read-only own profile; Manager assigned-team non-sensitive view only. Protected/domain resources remain separate | Use Phase 3N/CORE-08; no flat payload or generic PATCH | Security + Backend | PARTIALLY RESOLVED |
| EMP-009 | Detail backend/history composition | Product resolves central read-first Detail, current values, per-field history modal, read-only Recruitment provenance and lightweight domain summaries/deep links | Edit page currently substitutes for detail | Backend + architecture | BLOCKED |
| EMP-010 | List/import/export/bulk backend contract | Product approves HR-only import, CSV/Excel/PDF/clipboard export and approved bulk operations; bulk delete is not inferred. Legacy list/search/filter/sort/page evidence remains | Sensitive export redaction, file schemas, execution, audit and backend list contract unresolved | Security + Backend | BLOCKED |
| EMP-011 | Account provisioning and lifecycle coordination | Product policy resolved: HR explicitly creates/administers Account after Employee creation; Resigned disables login and retains restricted F&F-pending Account; authorized HR closes after F&F; Employee B gets a new Account | Exact states, 30–45-day process enforcement, email, atomicity and failures remain backend-required | Identity/Backend | BLOCKED |
| EMP-012 | Team/reporting-manager model | Legacy has one optional MPTT supervisor and multi-level direct-report hierarchy used by approval concepts; target constraints remain unapproved | Free-text manager | Product + Backend | BLOCKED |
| EMP-013 | Employee permission backend contract | Product actor/capability matrix is resolved for HR, Manager team view, Employee self-view, Documents, Payroll, Account, import/export/bulk, Director and Manager Attendance/Leave. Exact capability names and enforcement remain unavailable | Use `51-employee-permission-decision.md`; React codes are not legacy/backend permission names | Security + Backend | BLOCKED |
| EMP-014 | Sensitive projection/reveal/export backend contract | HR full; Manager denied; Employee masked own with explicit backend-authorized full reveal. View/reveal not audited; sensitive edits audited. Exact masks and sensitive export policy remain open | Backend actor-specific projection/reveal; frontend masking is not security | Security + Backend | BLOCKED |
| EMP-015 | Remote clock meaning and authorization | Field currently presented as Employee permission | Boolean bypass description | Attendance/Product/Backend | BLOCKED |
| EMP-016 | Document backend lifecycle | Product resolves five employment-specific categories, actor access, metadata edit, versioned replacement, archive/restore, active-document visibility and allowed formats/10 MB | Separate protected Employee resource; no automatic Company-change copy | Security + Backend | BLOCKED |
| EMP-017 | Private file access and ZIP execution | CORE-09 confirms inline FileResponse, returned URLs and category-folder Staff ZIP, all with missing/inconsistent actor, tenant and owner enforcement. Physical blob cleanup is UNKNOWN | Authorized private delivery and audited tenant-scoped ZIP required; direct URL possession is not authorization | Security/Backend/Product | BLOCKED |
| EMP-018 | Recruitment conversion backend contract | Product resolves Candidate + accepted Offer prerequisite, Probation, new Employee, post-success Hired/Joined state, provenance, duplicate returns existing Employee, rollback, and no Account/Payroll | One atomic/idempotent backend conversion required; see `53-recruitment-employee-conversion-decision.md` | Recruitment + Backend | BLOCKED |
| EMP-019 | Partial section save semantics | Legacy independently saves Personal, Bank, Work, Team, Documents and Account actions. CORE-06 recommends section/protected/domain workflows, but this does not define endpoints, atomicity or concurrency | Combination editing model; backend resource/mutation contract required | Backend + Product | BLOCKED |
| EMP-020 | Address “Same as above” behavior | Approved direction: copy current Permanent values to Correspondence; unchecking retains them and enables independent edits; validate the resulting Correspondence fields | Copy operation, not permanent synchronization | Product | RESOLVED |
| EMP-021 | Bank/statutory backend persistence | Product resolves one active bank with retained history/Payroll-active use and one current statutory record without separate history; access and no-copy rules resolved | Exact schema, activation concurrency, Payroll consumption, masks and exports unresolved | Payroll/Security/Backend | BLOCKED |
| EMP-022 | Employee closure, correction and retention backend contract | Product policy resolved: Resigned requires resignation and end/last-working dates; Employee/history retained read-only; authorized HR specific corrections require reason/audit; Resignation workflow does not auto-synchronize | Exact correction allowlist, retention/legal rules and audit implementation | Legal + Backend | BLOCKED |

Related global decisions remain DEC-001–004, DEC-008–011, DEC-012–015, DEC-019, DEC-022–023, DEC-031–035 and DEC-038 in `30-react-open-decisions.md`.

## Phase 3B ownership, priority and gate map

This table clarifies triage only. It does not resolve any decision.

| Decisions | Primary owner | Priority | Blocks gate(s) | Blocking state |
|---|---|---|---|---|
| EMP-001 | Legacy source owner / Product | P0 | GATE 1 and parity sign-off | RESOLVED |
| EMP-002, EMP-006 | Backend | P0 | GATE 1, GATE 9 | BLOCKED |
| EMP-003–005 | Product + Backend | P0 | GATE 2 | BLOCKED |
| EMP-007, EMP-022 | Product + Backend | P0 | GATE 3 | BLOCKED |
| EMP-008, EMP-019–021 | Product + Backend | P0 | GATE 1 and form implementation | BLOCKED/OPEN |
| EMP-009 | Product | P1 | GATE 6 | OPEN |
| EMP-010 | Product + Backend | P1 | List implementation/GATE 9 | BLOCKED |
| EMP-011–012 | Product + Identity/Backend | P1 | Account/team subphase | BLOCKED |
| EMP-013–015 | Product + Security + Backend | P0 | GATE 4, GATE 5 | BLOCKED |
| EMP-016–017 | Product + Security + Backend | P0 | GATE 8, GATE 9 | BLOCKED |
| EMP-018 | Recruitment/Product/Backend | P0 | GATE 7, GATE 9 | BLOCKED |

Gate definitions and decision-ready options are documented in `44-employee-contract-decision-pack.md`.

The row-by-row legacy/Product/Backend reconciliation is maintained in `47-employee-decision-reconciliation.md`. Legacy evidence resolves only EMP-001; it informs but does not approve the remaining decisions.

## CORE-11 through CORE-13 consolidation

- Employee list evidence and remaining list/export decisions: `55-employee-list-decision.md`.
- Cross-module ownership, ID migration, transfer and history dependencies: `56-employee-cross-module-dependency.md`.
- Consolidated implementation contract, phased plan, traceability, checklist and exact P0 gate: `54-employee-final-implementation-contract.md`.

The final gate is **NOT READY FOR EMPLOYEE IMPLEMENTATION**. Existing `BLOCKED` rows remain blocking; the consolidated contract groups them by implementation phase without approving Product choices or backend contracts.

## Phase 3M identity/employment model resolution

**CORE-01 / CORE-04 identity architecture status: RESOLVED.** The approved Product model is one Company-scoped Employee record for one Company employment at a time. There is no authoritative shared Person entity, global Person ID, or `Person -> multiple Employments` relationship. Leaving Company A closes Employee A and its Account/access while retaining Company A history and code. Joining Company B creates Employee B with a new code, destination assignments and a new Account under the still-open Account contract. Records are never merged, moved or reassigned between Companies.

This resolves only the identity/employment architecture. It does not resolve concrete backend DTO/ID serialization, duplicate detection, prefill/carry-forward policy, Account provisioning, Employee-code generation or authorized cross-Company historical lookup.

## Phase 3N protected-data and mutation-boundary resolution

**Status: PARTIALLY RESOLVED.** Resource boundaries and actor Product policy are resolved. Employee profile remains read-only; own sensitive data is masked with explicit backend-authorized reveal. Manager has assigned-team non-sensitive view only plus owning-domain Attendance/Leave actions. Backend projection, capabilities and enforcement remain unresolved.

Create, Profile Edit, Protected Data, Organization, Lifecycle, Document, Account and Payroll are separate command boundaries. No one-size Employee PATCH is approved. Backend actor-specific projection/omission/masking, authorization and audit are required. Exact mask formats, reveal/export policy, bank/statutory ownership/history/effective dates and Manager/Employee protected-data capabilities remain Product/Security/Payroll/Backend decisions.

## Permission Product resolution

CORE-08 Product policy is resolved. HR manages Employees, protected data, documents, Accounts, import/export and approved bulk operations within authorized Company scope. Manager has assigned-team, authorized-Company, non-sensitive profile view only plus owning-domain Attendance/Leave management; no Employee edit, sensitive, Payroll, document, Account, lifecycle, code or organization authority. Employee has read-only own profile, masked sensitive data with explicit backend-authorized reveal, own document view/download, own Payroll visibility and own credential flows. Director cross-Company Employee view is separately scoped and grants no other capability.

Exact capability identifiers, team relationship source, masks, sensitive exports, backend authorization/projection/reveal/audit and domain action contracts remain blocked.

## Phase 3O lifecycle and Company-change resolution

**Status: PRODUCT DECISIONS RESOLVED; BACKEND/DOMAIN CONTRACTS BLOCKED.** Create status/default, HR any-to-any lifecycle authority through explicit actions, Notice/Resigned dates, F&F Account direction, closed-record correction, all-status list behavior, Company-scoped code policy and explicit HR Account administration are approved. Employment Type and `is_active` do not replace lifecycle status.

Still blocked: lifecycle/Account/F&F backend states and transactions; audit persistence; code allocation/concurrency; downstream Temp and closure events; and authorized historical cross-Company lookup. See `50-employee-lifecycle-decision.md`.
