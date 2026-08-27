# Employee Implementation Phase Plan

## Entry gate

Do not begin implementation until EMP-001 is either satisfied or explicitly accepted as an evidence limitation, and the particular subphase’s blocking product/backend decisions are resolved. Frontend-first work may use safe mock ports without inventing final endpoints or DTOs.

## Phase 3A — Domain model and adapter boundary

Scope: define the approved frontend Employee domain model, tenant-scoped query parameters, DTO mapper boundaries, separate mock/HTTP adapters, deterministic errors and central keys.

Prerequisites: EMP-002–008 and relevant global ID/status decisions. Preserve current behavior through adapters. Do not migrate labels to IDs without an approved data strategy.

Exit: components → hooks → stable Employee port → mock/HTTP adapters; active Company is explicit; no component transport/mock access; type/lint/build pass.

## Phase 3B — Employee list and detail

Scope: standardized header, approved toolbar/search/filters/sort/page, loading/error/retry/empty states, detail route/page, status/identity summary and authorized actions.

Prerequisites: EMP-007, EMP-009–010, EMP-013–014 and list envelope. Do not invent detail tabs.

Exit: list/detail mock contracts cover empty/error/forbidden/cross-tenant cases and preserve approved route compatibility.

## Phase 3C — Company-master integration

Scope: active Company, Branch, Department, Designation and approved assignment option hooks using Company services; ID/label display adapters; historic label handling.

Prerequisites: EMP-003–005 and Company Department/Designation cardinality decisions.

Exit: no static Company/Department/Designation/work-location sources in Employee; stored values use approved IDs; invalid cross-company relationships are rejected by mocks/services.

## Phase 3D — Create/edit/profile forms

Scope: reconcile exact fields/schema/defaults; Personal, Address, Employment, Account/Statutory, Emergency and Review; approved create/edit differences; address-copy behavior; sensitive-field policy; section-save decision.

Prerequisites: EMP-006–008, EMP-014, EMP-019–021.

Exit: one coherent RHF/Zod contract, no dead schema fields, labels resolved from IDs, create/update errors mapped, duplicate submissions prevented, create/edit regression matrix passes.

## Phase 3E — Recruitment onboarding boundary

Scope: typed handoff/application operation, accepted-offer validation, master mapping, provenance and deterministic atomic mock success/failure/rollback.

Prerequisites: EMP-018 and recruitment Job/Offer mapping decisions.

Exit: Employee UI does not import Recruitment query hooks to implement a transaction; Candidate is never marked hired without a committed Employee.

## Phase 3F — Employee documents

Scope: separate document schema/form, list/upload/authorized view/download/delete, approved replacement, metadata, URL cleanup, shared confirmation, permission states and optional ZIP.

Prerequisites: EMP-013, EMP-016–017 and private-file/export contracts.

Exit: no public-path assumption, no `window.confirm`, object URLs are revoked, actor/tenant boundaries are testable, and Employee documents remain distinct from Policy files.

## Phase 3G — Account, team, lifecycle and permissions

Scope: only approved account provisioning actions, manager/team relationships, status transitions/deactivation/resignation handoff, remote-clock policy and action/field gates.

Prerequisites: EMP-007, EMP-011–015, EMP-022 and backend authorization endpoints/actions. Resignation workflow implementation remains in its later phase unless explicitly brought into scope.

Exit: frontend uses Phase 1 permissions without new codes, backend remains authoritative, sensitive fields are protected and invalid mock transitions are deterministic.

## Phase 3H — Regression and parity validation

Required checks:

- Field/route/action traceability against newly supplied legacy source.
- Tenant and cross-company isolation.
- List/detail/create/edit and partial/full update behavior.
- Company master dependency and historic-label behavior.
- Recruitment conversion atomicity.
- Document access, replacement/delete/ZIP and URL cleanup.
- Permission/sensitive-field matrix and lifecycle transitions.
- TypeScript, ESLint, normal/mock builds, diff scans and route smoke.
- Responsive, dark-mode, keyboard and browser interaction once DEC-038 is resolved.

Exit: every approved Employee capability is IMPLEMENTED or has an approved deviation; all UNKNOWN legacy behavior is resolved or explicitly accepted; no later Leave/Payroll/Attendance business implementation is pulled into Employee.

## Deferred to owning phases

- Attendance/geofence/regularization calculations and screens.
- Leave balances/requests/approvals and Resignation/F&F workflow.
- Payroll/tax/Form16 calculations, files and employee self-service.
- Assets inventory/allocation/request lifecycle.
- Appraisal, reports, notifications and scheduled jobs.
