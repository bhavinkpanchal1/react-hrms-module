# Attendance Final Implementation Contract

## Status and boundary

Attendance is **APPROVED IMPLEMENTED** for the deterministic mock-first React scope. The module owns daily Attendance presentation, clocking simulations, regularization, HR corrections, monthly and bulk operations, Attendance audit views, filters and CSV export. It does not own Employee identity, Company masters, Leave calculation, Payroll calculation, authentication, or production authorization.

This document freezes the Phase 13 implementation. It does not claim production readiness: no real Attendance API or backend exists.

## Domain model

The implemented model distinguishes `DayType` (`WORKING_DAY`, `HOLIDAY`, `WEEK_OFF`) from `AttendanceResult` (`PRESENT`, `HALF_DAY`, `ABSENT`, `NO_RESULT`). An Attendance record is Company- and Employee-scoped and contains its Branch, applied timezone, punches, worked minutes, method, result, day type, attributes, optional Leave/regularization references and version. Attributes independently record late arrival, early departure, remote work, regularization, work on a non-working day and manual correction.

Clock methods are `OFFICE_GPS` and `REMOTE_GPS`; HR-created records use `HR_MANUAL`. Employees are also classified as `PUNCH_REQUIRED` or `PUNCH_OPTIONAL` in the mock contract.

## Clocking, remote, geofence and timezone rules

**APPROVED IMPLEMENTED:** Employee clock-in and clock-out use deterministic timestamps. Office clocking validates the submitted location against the Employee's Branch configuration. Remote clocking requires both remote-clock approval and the WFH condition. Branch-specific latitude, longitude and radius are used when configured. An accuracy check is included in the mock geofence result. HR can record a reasoned geofence override for an eligible record, producing audit evidence.

The Attendance business date is derived in the Branch timezone. Clock-out must occur on the same Branch-timezone business date as clock-in; overnight Attendance is rejected. Calendar midnight therefore follows the Branch timezone, not the browser timezone.

**BACKEND/PRODUCTION RESPONSIBILITY:** Production must obtain trusted timestamps and coordinates, authorize remote work, resolve authoritative Branch configuration, validate geofences, resist spoofing and enforce the midnight/overnight policy server-side. Mock coordinates and deterministic time are demonstration fixtures only.

## Day classification, late/early and half day

**APPROVED IMPLEMENTED:** Effective-dated Holiday and Week Off fixtures resolve day type, with Holiday taking precedence over Week Off. Branch late/early policy is optional and contains expected start/end, grace minutes and configurable half-day triggers. The mock derives late and early attributes and can resolve `HALF_DAY` from configured late, early or minimum-hours rules. Work on a Holiday or Week Off is retained as a separate attribute.

The Half-Day plus Leave relationship is an explicit boundary: Attendance may retain a Leave reference or a pre-resolved result, but it does not calculate or mutate Leave. Production precedence, effective schedule data and concurrent changes require backend contracts.

## Regularization

**APPROVED IMPLEMENTED:** Employees can submit a reasoned request for a date and optional corrected punches, view their requests, and cancel their own pending request. Duplicate pending requests are rejected. Authorized Managers can decide requests for their mock team; HR can decide Company-scoped requests. Approval applies a correction and creates an audit record. Rejected and cancelled states do not alter Attendance.

**BACKEND/PRODUCTION RESPONSIBILITY:** Authoritative team membership, permissions, workflow concurrency, notification, durable state transitions and transactionality remain backend-owned.

## HR manual, monthly and bulk operations

**APPROVED IMPLEMENTED:** HR-only manual correction supports Employee, date, punches, result, day type, mandatory reason and optional external approval source, reference, approver and approval date. Metadata is stored in mock audit history. Individual monthly Attendance renders the complete month grid and permits reasoned changes. Bulk Attendance uses an inclusive date range, selected Employees, mandatory reason, preview confirmation and per-Employee/date outcomes. Resigned and Closed Employees are skipped/restricted by the mock lifecycle rules.

These controls are mock administrative workflows, not proof of production authorization or persistence.

## Roles, Company isolation and permissions

| Role | APPROVED IMPLEMENTED mock scope |
|---|---|
| Employee | Own Today view, clocking, history and regularization submission/cancellation |
| Manager | Authorized mock-team list/detail and regularization decisions |
| HR | Active-Company list/detail, regularization decisions, manual correction, geofence override, monthly, bulk and export |

Every service query filters by active Company and role-derived Employee scope. Query keys include Company context. Mock actors and team maps are deterministic fixtures and are **not production authentication or authorization**. Production authorization, tenant membership, field projection and denial enforcement remain backend responsibilities.

## History and audit

**APPROVED IMPLEMENTED:** Clock-in, clock-out, manual correction, regularization, geofence override, monthly edit and bulk operations create legacy-style mock audit records. Records include Company, Employee, actor/role, before/after punches and result, reason, timestamp and applicable source or external-approval/geofence evidence.

**BACKEND/PRODUCTION RESPONSIBILITY:** Durable, immutable, tamper-evident audit persistence, retention, actor identity and compliance access remain backend-owned. The in-memory mock audit is reset with the mock repository lifecycle.

## CSV export

**APPROVED IMPLEMENTED:** CSV export is initiated through a React Query mutation and applies active Company, role scope and Attendance filters. The mock returns escaped CSV content and a deterministic filename. **DEFERRED:** Excel and PDF export.

## Leave and Payroll boundaries

Leave implementation remains outside Attendance. Attendance does not approve Leave, calculate balances or define cross-domain production precedence. Payroll implementation remains outside Attendance. Attendance may become a Payroll input, but it does not calculate wages, deductions, payable days or payroll finalization. Both integrations require explicit backend contracts.

## Mock service architecture

The implemented direction is UI/page -> TanStack Query hook -> Attendance service -> in-memory mock repository. The mock repository is deterministic. It provides scoped fixtures, validation-like failures, simulated latency, mutable in-memory records and audit entries. There is no real API/backend. It must not be described as durable or secure production behavior.

## Routes

- `/attendance` — role-specific Employee or operations view
- `/attendance/detail/:id` — authorized Attendance detail and history
- `/attendance/monthly` — HR-only individual monthly workflow

## React Query structure

Queries cover Today, history/calendar, list, detail, audits, regularizations, scoped Employees and monthly Attendance. Mutations cover clock-in/out, regularization create/cancel/decision, manual correction, geofence override, monthly save, bulk Attendance and CSV export. State-changing mutations invalidate the Attendance query family; export is read-only and does not invalidate it.

## Deferred functionality

**DEFERRED:** Shift, advanced scheduling/rosters, overnight shifts, Excel/PDF export, real-time devices/biometrics, production notifications and any unapproved reporting beyond current CSV. Shift and advanced scheduling must not be inferred from the current Branch and effective-date fixtures.

## Production/backend responsibilities

Production requires authoritative authentication and authorization; tenant and team scope; trusted clock and location evidence; geofence enforcement; Branch timezone and effective schedule resolution; Leave precedence; concurrency/idempotency; transactional regularization and bulk changes; durable audit storage; lifecycle enforcement; stable DTO/error contracts; reporting/export security; and Payroll integration. No endpoint, database schema or production behavior is established by the mock.

## Known repository blockers and validation limits

- `frontend/src/modules/recruitment/components/CandidateForm.tsx` has an existing `StepDefinition<FieldValues>` generic incompatibility. It is unrelated to Attendance.
- No automated test script or framework is configured.
- No browser automation harness is available.
- The production bundle reports existing unresolved font-path warnings for Inter and Poppins assets.

These are not Attendance implementation failures and are not changed by this freeze.
