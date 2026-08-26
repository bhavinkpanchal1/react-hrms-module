# Master React gap report

## A. Executive summary

The React migration has a sound modern foundation—TypeScript, React Router, TanStack Query, RHF/Zod, a typed HTTP client, shared UI, and mock-first domain APIs—but represents only a small portion of the verified legacy HRMS.

Company is the most complete mock-first domain. Employee, Recruitment and Attendance are partial. Authentication/tenancy/permissions and most operational domains are absent or placeholders. Current source does not build because of known Employee, Attendance, Recruitment and shared Stepper errors. No feature should be considered production-ready while route security, tenant scope and backend contracts remain unavailable.

## B. Implemented

- Central TanStack Query provider and query-key registry.
- Shared form/list primitives including Pagination, Modal, Select, DatePicker and feedback.
- Company mock-first architecture and CRUD for Company, Branch, Department, Designation, Week Off, Holiday List, Holiday, Asset Type and Policy.
- Company cross-company ownership checks and parent delete conflicts.
- Policy mock Blob upload/view/download/delete with URL cleanup.
- Recruitment candidate/job/interview/offer mock records and partial workflows.
- Employee multi-step form breadth and partial document handling.
- Attendance location acquisition, clock mutation and elapsed timer primitives.

These are implementation facts, not claims of full legacy parity.

## C. Partial

- Company and all implemented masters lack final legacy/backend/permission parity.
- Employee lacks complete profile/account/team/status/action behavior and has build/type defects.
- Employee Documents lack private-file lifecycle and ZIP/report parity.
- Attendance lacks integrated geofence, manual/bulk attendance, calendar UI and precedence.
- Regularization exposes only a request service/hook.
- Recruitment lacks uniqueness, documents, letters, email and authoritative legacy status mapping.
- Candidate conversion is sequential and copies string masters.
- Exports exist only for Company Policy Blob download.

## D. Missing

- Functional Authentication, password workflows and protected routes.
- Company tenancy/selection.
- Shift.
- Leave, resignation, Payroll, Tax and Form16.
- Assets inventory/allocation/request/return/repair.
- Employee-facing Policy access.
- Announcements and persistent Notifications.
- Appraisal.
- Vendors, Vendor Documents and Performance.
- Visitors and QR lifecycle.
- Petty Cash and Expenses.
- 37 Reports and operational exports.
- Transactional email UI integration and scheduled workflow visibility.

## E. Unknown

- Exact per-route parity for 332 routes because `02-route-inventory.md` summarizes families.
- Exact legacy HTML field attributes/options where the inventory says `UNVERIFIED`.
- React Job/Offer equivalence because legacy audit found no standalone models.
- General audit-event parity because legacy evidence found no complete audit log.
- SMS behavior and exact status color mappings.

## F. Blocked

- Real Company integration: endpoint TBD.
- Identity, tenancy and backend authorization.
- Canonical status/transition mapping.
- Attendance/Leave/Payroll/Tax calculations.
- Private storage, signed/download URLs and export jobs.
- Scheduled/background jobs and notifications.
- Historical migration, timezone and effective dating.

## G. Duplicate

- Company option constants exist in both Employee-local and shared constants.
- Department/Designation static arrays duplicate Company masters; Recruitment owns another Department array.
- `EmployeeCreatePage copy.tsx` duplicates an employee creation implementation.
- `shared/ui` and `components/ui` both contain primitives.
- Hand-built table/list/error/confirmation patterns repeat across modules.

## H. Refactor Required

- Stabilize Employee type/schema/API alignment and illegal `const` reassignment.
- Separate Recruitment/Employee/Attendance mock adapters from HTTP adapters behind stable services.
- Remove shared Stepper’s import from Recruitment.
- Replace Employee master strings with approved IDs/adapters.
- Move Candidate conversion orchestration behind an application/service boundary.
- Connect Attendance only to authorized geofence/schedule backend data.
- Normalize domain API response mapping and field errors without flattening legacy statuses.
- Align navigation with router-backed availability.

## I. Highest-risk legacy features

1. Authentication, tenant selection and server scope.
2. 65 permission flags and actor-specific approval authority.
3. Employee code generation and lifecycle statuses.
4. Private documents and ZIP downloads.
5. Attendance geofence/timer/manual/bulk/precedence.
6. Leave/regularization queues and balances.
7. Resignation → Full & Final coupling.
8. Payroll/statutory calculations/registers/payslips.
9. Tax proof/Form16 publication.
10. Recruitment uniqueness/letters/conversion.
11. Asset, petty cash, visitor and appraisal state machines.
12. Scheduled reminders/accrual/absence/auto-resign.

## J. Architecture violations

- No identity/tenant/permission boundary around the router.
- Static role drives navigation.
- Shared Stepper depends on Recruitment.
- Cross-domain Employee page consumes Recruitment hooks.
- Mock/HTTP concerns are mixed outside Company.
- No private file/report/workflow boundary.

## K. UI/UX inconsistencies

- Navigation exposes unimplemented destinations.
- Tables, loading/error/empty states and confirmations vary.
- Modal accessibility and complex Select/DatePicker behavior lack automated coverage.
- Duplicate UI roots create ownership ambiguity.
- Company is substantially more consistent than older modules.

## L. Permission gaps

- No route/action/field guards.
- No authenticated role source.
- No tenant or branch scope.
- No Admin/Accounts/Gate roles.
- No mapping to 65 legacy flags.
- No private-file enforcement contract.

## M. Data dependency gaps

- Employee string masters conflict with numeric Company IDs.
- Shift is absent.
- Recruitment is not Company-scoped.
- Branch geofence and schedule masters do not feed Attendance.
- Leave/Payroll consumers are absent.
- Asset Type and Policy have no operational/employee consumers.

## N. API/service gaps

- Company real endpoints deliberately unavailable.
- No consistent response/error/pagination contract across domains.
- No auth refresh/session or CSRF replacement decision.
- No workflow action/idempotency/concurrency contracts.
- No report/export/file service.

## O. Mock gaps

- Company has realistic isolation/errors/relationships.
- Recruitment/Employee mocks lack full error/empty/invalid-transition controls.
- Attendance has one mutable record and no realistic calendar/precedence.
- Missing domains have no mocks.
- Employee Documents fabricate `/mock/...` paths and do not revoke URLs on deletion.

## P. Backend decisions required

Identity, tenant propagation, IDs/FKs, endpoints, envelopes, errors, filters, permissions, concurrency, calculations, statuses, effective dates/timezone, files, export jobs, scheduler, notifications and audit events.

## Q. Product decisions required

Mandatory/deprecated legacy scope; Jobs/Offers mapping; Shift model; Company master relationships; geofence policy; actor matrix; workflow transitions; responsive/accessibility targets; report/export priority; Policy audience; lifecycle retention.

## R. Recommended implementation order

| Priority | Phase | Rationale |
|---|---|---|
| P0 | Stabilization and contract foundation | Current build/type defects undermine all migration work |
| P0 | Identity, tenancy, permissions | Security/scope prerequisite |
| P0 | Shift and Company contract reconciliation | Completes authoritative masters |
| P0 | Employee system of record/documents | Central dependency for operations |
| P0 | Attendance and Regularization | Time/location and payroll input |
| P0 | Leave and Resignation | Approval/balance/F&F input |
| P0/P1 | Payroll, Tax, Form16 | Backend-owned calculations/files |
| P1 | Recruitment parity and conversion | Prevent additional string/data drift |
| P1 | Assets and Expenses | Operational workflows |
| P2 | Vendors and Visitors | Separate operational graph |
| P1/P2 | Appraisal, Announcements, Notifications | Engagement/workflow layer |
| P1 | Reports and exports | Build after source contracts stabilize |
| Final | Full parity QA/data migration | Traceability, security and historical sign-off |

## Audit classification totals

The module matrix in `23-react-parity-audit.md` contains **56 assessed domain rows**: **0 IMPLEMENTED, 18 PARTIAL, 34 MISSING, 2 UNKNOWN, 1 BLOCKED, 0 DUPLICATE, and 1 REFACTOR_REQUIRED** at whole-domain parity level. Individual capabilities inside partial domains include implemented behavior, as recorded separately.
