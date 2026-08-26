# React implementation plan

## Mandatory rules for every phase

1. Frontend-first/mock-first development is intentional.
2. Mock and HTTP adapters implement the same typed domain service contract.
3. Components never import mocks, call `httpClient`, contain endpoints, or inspect `USE_MOCK`.
4. TanStack Query owns server state and query keys remain centralized.
5. RHF/Zod handles forms where appropriate; explicit types are mandatory and `any` is prohibited.
6. Search for an existing component/hook/helper/constant before creating one.
7. Domain logic stays in the domain; shared UI contains interaction primitives only.
8. Attendance/Leave/Payroll/Tax/statutory calculations remain backend-owned.
9. React visibility is not security; backend authorizes every action/file.
10. Do not invent endpoints, permissions, transitions, fields or calculations.
11. Preserve raw legacy values through explicit mapping; do not silently remove behavior.
12. Every capability must link to legacy evidence and React route/component/hook/service/test.
13. Every pageable/mutable feature includes loading, empty, error, retry and mutation-error coverage.
14. Every phase includes responsive, dark-mode, keyboard and accessibility review.
15. Documentation and open decisions are updated whenever an approved contract changes.
16. Refactoring requires behavior coverage and must not silently change business rules.

## Phase 0 — repository stabilization and test foundation (P0)

- **Goal:** Establish a trustworthy build/test baseline without feature changes.
- **Modules:** Employee, Attendance, Recruitment, shared Stepper/router.
- **Dependencies:** None; preserve current behavior.
- **Legacy coverage:** Enables reliable parity work, no new capability.
- **Expected React files:** Existing faulty types/schemas/APIs/pages; test/config files only as approved.
- **Shared components:** Fix ownership of shared Step type; no redesign.
- **API/mock:** Preserve signatures and fixtures.
- **Permissions/workflow:** None added.
- **Validation:** Align form input/output/domain types.
- **Tests:** Typecheck, lint, build, current smoke tests, route smoke tests.
- **Exit:** Clean baseline or documented quarantined legacy debt; no source duplication.
- **Blockers:** Product approval for removing duplicate dead files if needed.

## Phase 1 — identity, tenancy and permission foundation (P0)

- **Goal:** Secure route and company scope boundaries.
- **Modules:** Auth, app, account/user, permissions.
- **Dependencies:** Identity/tenant/role contracts.
- **Legacy coverage:** Login/reset/change password, Company selection, user roles/flags.
- **Expected React files:** Auth module, providers/stores, router guards, typed identity service, permission policy.
- **Shared components:** Guard/loading/forbidden/session-expired states.
- **API/mock:** Persona/tenant adapter with denied/expired scenarios.
- **Permissions:** Map approved surviving flags; server denial mandatory.
- **Workflow:** Login → Company select → authorized app; logout/expiry.
- **Validation:** Credentials/reset/company selection.
- **Tests:** Cross-company access, role routes/actions, token expiry, forbidden files.
- **Exit:** No protected route accessible anonymously; active tenant explicit.
- **Blockers:** DEC-001–003 and identity backend.

## Phase 2 — Company parity reconciliation and Shift (P0)

- **Goal:** Reconcile current Company module with legacy masters without regressing mock behavior.
- **Modules:** Company, Shift.
- **Dependencies:** IDs, exact Company/Branch/Department/Designation/Shift contracts.
- **Legacy coverage:** Company payroll settings decision, Branch rules, dependent masters, Shift.
- **Expected React files:** Company domain types/schema/API/hooks/tabs only after decisions.
- **Shared components:** Reuse current master-list/modal/pagination.
- **API/mock:** Add Shift and confirmed rules; retain isolation/error scenarios.
- **Permissions:** Company/master actions.
- **Workflow:** CRUD/conflict/lifecycle.
- **Validation:** Legacy uniqueness/date/coordinate mappings.
- **Tests:** Cross-company relationships, deletion conflicts, Shift schedules.
- **Exit:** All authoritative masters traceable; no duplicated Employee options.
- **Blockers:** DEC-004–007 and Shift contract.

## Phase 3 — Employee system of record and private documents (P0)

- **Goal:** Complete Employee profile/account/team/work/bank/document parity.
- **Modules:** Employee, Employee Documents, Users.
- **Dependencies:** Phases 1–2, master FK/data-migration contract.
- **Legacy coverage:** Create/edit/profile, code generation, statuses, account, team, 65 flags, document CRUD/view/ZIP.
- **Expected React files:** Employee DTOs/adapters/hooks/pages/forms; file service boundary.
- **Shared components:** Existing wizard/form controls; authorized file controls.
- **API/mock:** Multi-company employee graph, lifecycle statuses, conflicts/private files.
- **Permissions:** Own/manager/HR actions and sensitive fields.
- **Workflow:** Create/provision/update/deactivate/resign handoff.
- **Validation:** Exact legacy/backend fields and dependent options.
- **Tests:** Branch code, master cascading, private file denial, replace/delete/ZIP.
- **Exit:** Employee stores IDs, not duplicated master strings; account/team/docs traceable.
- **Blockers:** DEC-008–011, DEC-023, data migration.

## Phase 4 — Attendance and Regularization (P0)

- **Goal:** Complete day, geofence, manual/bulk, calendar and correction parity.
- **Modules:** Attendance, Regularization.
- **Dependencies:** Employee assignments, Branch/Shift/Week Off/Holiday contracts.
- **Legacy coverage:** Clock, timer, geofence, history/calendar, manual/bulk attendance, precedence, approval queues.
- **Expected React files:** Attendance service adapters, workflow/state components/pages.
- **Shared components:** Calendar/table/filter primitives only if existing equivalents do not fit.
- **API/mock:** Authorized locations, clock states, edge dates, invalid transitions.
- **Permissions:** Employee clock; HR manual/bulk; supervisor/HR regularization.
- **Workflow:** No record → working → completed; request → approve/reject.
- **Validation:** Coordinates/date/time/reasons.
- **Tests:** Geofence boundary, remote policy, precedence, idempotency, timezone.
- **Exit:** No hardcoded tenant geofence; backend owns authorization/precedence.
- **Blockers:** DEC-012–015 and Attendance contracts.

## Phase 5 — Leave and Resignation (P0)

- **Goal:** Implement balances, requests, team/HR approvals and F&F handoff.
- **Modules:** Leave, Resignation.
- **Dependencies:** Identity/team, Employee, schedule resolution, Attendance.
- **Legacy coverage:** Leave apply/balance/queues; staged resignation.
- **Expected React files:** New domain modules/services/hooks/routes/pages after approval.
- **Shared components:** Approval queue and timeline primitives if reusable.
- **API/mock:** Explicit state transitions, denial, stale action and balance result fixtures.
- **Permissions:** Employee/supervisor/HR.
- **Workflow:** Legacy transitions preserved through adapters.
- **Validation:** Dates/duration/reason/authority.
- **Tests:** Balance edge cases, double actions, cross-team/company denial.
- **Exit:** Workflow and notifications traceable; calculations server-owned.
- **Blockers:** DEC-016–017 and rejected status value.

## Phase 6 — Payroll, Tax and Form16 (P0/P1)

- **Goal:** Implement configuration, generation, registers, payslips, tax and Form16.
- **Modules:** Payroll, Tax, Form16.
- **Dependencies:** Employee/Attendance/Leave/Resignation; backend calculators/files.
- **Legacy coverage:** Active payroll, monthly run, joining/resignation bounds, exports, regimes/proofs, publication.
- **Expected React files:** New modules with separate operational and report/file services.
- **Shared components:** Money/status/file/export UI only.
- **API/mock:** Precomputed result fixtures; no production formula duplication.
- **Permissions:** Payroll admin/accounts/employee own files.
- **Workflow:** Run/status/publish/approval state machines.
- **Validation:** Month/FY/amount/proof inputs.
- **Tests:** Authorization, frozen regime, F&F coupling, export states.
- **Exit:** All calculations and private files backend-owned.
- **Blockers:** DEC-018–019, DEC-023, calculation contracts.

## Phase 7 — Recruitment parity and conversion (P1)

- **Goal:** Reconcile existing Recruitment with legacy candidates/documents/interviews/letters/conversion.
- **Modules:** Recruitment, Candidate Documents, Letters.
- **Dependencies:** Company masters and Employee create contract.
- **Legacy coverage:** Uniqueness, interview conditions, four letters, private documents/ZIP, conversion.
- **Expected React files:** Existing Recruitment adapters/forms/pages plus document/letter services.
- **Shared components:** File controls and workflow timeline.
- **API/mock:** Conflict/error/transition/file/email scenarios.
- **Permissions:** Recruiter/interviewer/HR.
- **Workflow:** Candidate → interview → result → letters → atomic Employee conversion.
- **Validation:** Exact choices, online-link condition, server uniqueness.
- **Tests:** Invalid transitions, duplicates, conversion rollback/idempotency.
- **Exit:** Job/Offer product mapping approved; no string-master copy.
- **Blockers:** DEC-020–023.

## Phase 8 — Assets, Petty Cash and Expenses (P1)

- **Goal:** Implement operational inventory and dual-approval workflows.
- **Modules:** Assets, Allocation, Requests, Petty Cash, Expenses.
- **Dependencies:** Employee lifecycle/permissions, Asset Type.
- **Legacy coverage:** Inventory/allocation/request/return/repair/close; admin/accounts approvals/payment.
- **Expected React files:** New domain modules/routes/services/hooks/pages.
- **Shared components:** Approval timeline, attachments, tables.
- **API/mock:** Full state machines and inventory consistency.
- **Permissions:** Employee/admin/accounts.
- **Validation:** Codes, serials, warranty, amount/proof/reasons.
- **Tests:** Resigned-employee exclusion, double return/payment, cross-company denial.
- **Exit:** Lifecycle transitions enforced by service/backend.
- **Blockers:** DEC-025–026.

## Phase 9 — Vendors and Visitors (P2)

- **Goal:** Implement vendor records/files/performance and visitor QR lifecycle.
- **Modules:** Vendor, Visitor.
- **Dependencies:** Identity, Employee hosts, file/email services.
- **Legacy coverage:** Categories, documents, scores, phone lookup, QR/manual scan, logs, emails.
- **Expected React files:** New modules/routes/services/hooks/pages.
- **Shared components:** QR display/scanner boundary only if approved.
- **API/mock:** Deterministic QR expiry and idempotent checkout.
- **Permissions:** Vendor admin/gate/host.
- **Validation:** GST/PAN/contracts/scores/visitor identity/schedule.
- **Tests:** Expiry, duplicate checkout, file denial, email event creation.
- **Exit:** Visit log immutable and authorized.
- **Blockers:** DEC-023, DEC-027–028.

## Phase 10 — Appraisal, Announcements and Notifications (P1/P2)

- **Goal:** Implement engagement workflows and persistent notification center.
- **Modules:** Appraisal, Announcements, Notifications.
- **Dependencies:** Employee/team/permissions and scheduler/event contracts.
- **Legacy coverage:** Cycles/questions/self/supervisor/HR/report; announcements; notification list.
- **Expected React files:** New modules and event/query services.
- **Shared components:** Timeline/questionnaire/notification states.
- **API/mock:** Role stages, reminders, read/unread fixtures.
- **Permissions:** Employee/supervisor/HR.
- **Validation:** Cycle dates/questions/ratings/comments.
- **Tests:** Stage authority, deadline, read state and retry.
- **Exit:** Toast remains transient feedback; notification center is persistent data.
- **Blockers:** DEC-028–029.

## Phase 11 — Reports and exports (P1)

- **Goal:** Deliver 37-report functional parity after source domains stabilize.
- **Modules:** Reports plus payroll/document exports.
- **Dependencies:** All reporting domains, tenancy/permissions/file jobs.
- **Legacy coverage:** Filters/data/pagination/sorting/PDF/XLS/ZIP.
- **Expected React files:** Report routes/pages/query/export service and schemas.
- **Shared components:** Filter bar/data table/export status where justified.
- **API/mock:** Representative datasets, empty/error/queued export states.
- **Permissions:** Company/branch/team/report-specific scope.
- **Validation:** Date/month/year/filter grammar.
- **Tests:** Columns/calculations from legacy source, scope, large export handling.
- **Exit:** Every report and export traceable; synchronous/queued behavior explicit.
- **Blockers:** DEC-030–032, DEC-036.

## Phase 12 — scheduler/audit observability and data migration (P0/P1)

- **Goal:** Expose relevant background status/audit history and execute legacy data migration safely.
- **Modules:** Cross-domain infrastructure.
- **Dependencies:** Stable contracts and workflows.
- **Legacy coverage:** Reminders/accrual/absence/auto-resign, event history, historical records/files.
- **Expected React files:** Read-only job/event UI only if product-approved; migration tooling is backend-owned.
- **API/mock:** Job/event fixtures and failed/retried states.
- **Permissions:** Admin/auditor and subject access.
- **Validation:** Filters/retention/export rules.
- **Tests:** Idempotency, timezone, checksums, missing files, historical status mapping.
- **Exit:** Migration reconciliation signed off with immutable evidence.
- **Blockers:** DEC-029, DEC-033–034.

## Phase 13 — full parity QA and release gate

- **Goal:** Prove—not assume—legacy capability parity and approved deviations.
- **Dependencies:** All approved phases.
- **Tests:** Route/field/status/permission/workflow/notification/file/report traceability; unit, contract, component and E2E; responsive/dark/accessibility; security/tenant isolation; performance.
- **Exit:** Every required legacy capability is IMPLEMENTED or has an approved documented deviation; no UNKNOWN production behavior; source builds cleanly; backend contracts and authorization tests pass.

