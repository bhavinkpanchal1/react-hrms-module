# Company Module — Build Plan

## Source of Truth
Implement from the approved Company documentation. The existing reference design specifies the layered architecture, nine areas, shared UI reuse, TanStack Query, mock/real API support and a dependency-aware build order.

## Phase 0 — Audit
Do not modify code.
Inspect:
- current Company files
- shared UI
- API client
- endpoint constants
- query keys
- Employee patterns
- Recruitment patterns
- Attendance patterns
- routing
- permissions
- duplicate/conflicting patterns

Report conflicts first.

## Phase 1 — Foundation
Implement/review:
- company.types.ts
- company.schema.ts
- company.api.ts
- useCompany.ts
- api-endpoints merge
- query-keys merge

Validate typecheck/build.

## Phase 2 — Shared Company UI
Implement/review:
- SimpleMasterList
- LogoUpload

Validate reuse, dark mode and responsive behavior.

## Phase 3 — List + Detail Shell
- CompanyListPage
- CompanyDetailPage
- routing
- navigation

Company List: loading, empty, error, pagination, create modal, create and redirect.
Company Detail: fetch company and render tabs; keep shell thin.

## Phase 4 — Overview
- CompanyOverviewTab
- sections
- validation
- update mutation
- cascading locations
- logo behavior only if backend upload contract exists

## Phase 5 — Branch
- BranchListTab
- BranchFormModal
- record Attendance integration follow-up

## Phase 6 — Department / Designation / Asset Type
Use SimpleMasterList. Avoid duplicate CRUD implementations.

## Phase 7 — Week Off
- WeekOffTab
- WeekOffGridModal
- 5 × 7 grid
- three supported states

## Phase 8 — Holiday List
Implement yearly holiday master:
- name
- year
- remarks

## Phase 9 — Holiday
Only after Holiday List works:
- selector
- holiday list
- add/remove

## Phase 10 — Policy
- PolicyTab
- upload/list/view/download/delete only where backend contract supports it
- reuse Employee document interaction pattern

## Phase 11 — Integration Review
Review Company → Employee, Attendance, Leave, Payroll and Assets.
Do not implement cross-module business logic unless separately specified.

## Phase 12 — QA
Run typecheck, build, lint if configured, route verification, mock-mode verification, responsive/dark-mode review, mutation invalidation review and regression checks.

## Definition of Done
A feature is not complete merely because UI renders. Require:
- types
- validation
- API layer
- query hook
- loading/error/empty states
- mutation feedback
- query invalidation
- mock behavior
- responsive/dark mode
- shared UI reuse
- no direct API calls from components
- no hardcoded endpoints
- no duplicated domain constants
- no TypeScript errors
- no console errors
