# Phase 0 Stabilization Report

## 1. Objective

Stabilize the existing React repository without adding HRMS features, backend contracts, routes, permissions, or business rules.

## 2. Baseline State

The verified baseline is recorded in [34-phase-0-baseline.md](./34-phase-0-baseline.md). TypeScript, ESLint, and the production bundle were blocked. No test runner or test script existed.

## 3. Files Changed

Modified:

- `frontend/src/app/router/index.tsx`
- `frontend/src/modules/attendance/components/ClockInOutWidget.tsx`
- `frontend/src/modules/attendance/components/TodayAttendanceCard.tsx`
- `frontend/src/modules/attendance/hooks/useAttendanceTimer.ts`
- `frontend/src/modules/attendance/hooks/useCurrentPosition.ts`
- `frontend/src/modules/attendance/pages/AttendancePage.tsx`
- `frontend/src/modules/employee/api/employee.api.ts`
- `frontend/src/modules/employee/forms/EmployeeAttandenceStep.tsx`
- `frontend/src/modules/employee/hooks/useEmployees.ts`
- `frontend/src/modules/employee/pages/EmployeeCreatePage.tsx`
- `frontend/src/modules/employee/pages/EmployeeListPage.tsx`
- `frontend/src/modules/employee/types/employee.type.ts`
- `frontend/src/modules/recruitment/components/CandidateForm.tsx`
- `frontend/src/shared/ui/stepper/Stepper.tsx`

Deleted after import, router, and dynamic-reference searches confirmed it was unused:

- `frontend/src/modules/employee/pages/EmployeeCreatePage copy.tsx`

Created:

- `docs/migration/34-phase-0-baseline.md`
- `docs/migration/35-phase-0-stabilization-report.md`

## 4. Errors Found

The baseline failures covered Attendance nullability/effects, Employee form/domain/API mismatch and illegal mock reassignment, Recruitment resolver generics, shared Stepper ownership, router Fast Refresh, stale duplicate code, and unused bindings.

## 5. Errors Fixed

- Employee response data now uses the schema-backed form data shape plus explicit response metadata.
- Create and update mutation inputs are explicit and no longer reference nonexistent `employee_code`.
- Mock employee locations use numeric option values consistently; initial records include their existing response metadata requirements.
- The mutable in-memory Employee collection is explicitly owned by a `let`; identifiers start after seeded records and creation emits `employee_id`.
- Employee list/create/edit typing now agrees with the stabilized contract.
- Attendance safely accepts nullable timestamps and derives elapsed time without synchronous effect state resets.
- Attendance card props are explicit and unused timer plumbing was removed.
- Candidate resolver typing is aligned with the existing schema/form output type.
- Router lazy declarations were made non-component-named internals so the exported route configuration satisfies Fast Refresh without changing paths or lazy loading.

## 6. Architecture Fixes

- Shared `Stepper` now owns its small generic `StepItem` contract and has no Recruitment dependency.
- Repository search found no shared-to-domain imports after stabilization.
- Component searches found no direct `httpClient`, mock switch, environment switch, or API endpoint access. URL matches in components are only user-facing URL placeholders.
- Existing centralized query keys were preserved. No TanStack Query redesign was performed.
- Company source and its Component → Query Hook → API Service → Mock/Future Backend boundary were not changed.

## 7. Type-Safety Fixes

- No `any`, `as any`, `@ts-ignore`, or `@ts-expect-error` was introduced.
- Strict TypeScript settings were not weakened.
- Nullable Attendance timestamps are handled at their consumers.
- Employee mutation DTOs are separated from response metadata.

One pre-existing targeted ESLint dependency suppression remains in `EmployeeCreatePage.tsx`; Phase 0 did not add it. It should be revisited with the recruitment-prefill lifecycle rather than changed mechanically.

## 8. Dead-Code / Duplicate Cleanup

`EmployeeCreatePage copy.tsx` had no imports, router references, or dynamic references. It was a stale 437-line duplicate and was deleted. No other files were removed.

## 9. Test Foundation

No test framework, test script, or test files exist. Phase 0 did not install a large testing stack. The current minimum executable foundation is strict typecheck, ESLint, production build, mock-mode build, diff validation, and production-server route smoke checks. Selecting unit/component/E2E tooling remains a deliberate future decision.

## 10. Company Regression Results

- Company source files and behavior were not modified.
- Mock-mode production compilation includes the Company list and detail chunks.
- `/hr/companies` and `/hr/companies/1` both returned the production SPA shell with HTTP 200.
- Static boundary checks confirm Company components do not import mock data, access the mock switch, or call `httpClient`.
- Existing Company hooks/services, centralized keys, mutation invalidation, mock scenarios, master tabs, states, responsive classes, and dark-mode classes remain present.

Interactive list/detail/create/edit/delete/error/retry and visual responsive/dark-mode behavior could not be newly automated because the repository has no browser test harness. Their implementation was preserved; this limitation is not represented as an automated UI PASS.

## 11. Build Results

| Check | Final result |
|---|---|
| `npx tsc -b --pretty false` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS |
| `VITE_USE_MOCK_API=true npm run build` | PASS; 2,383 modules transformed |
| Existing tests | NOT CONFIGURED |
| Production route smoke | PASS for `/login`, `/dashboard`, `/hr/companies`, `/hr/companies/1`, `/employees/list/`, `/employees/list/new`, `/recruitment/jobs`, `/recruitment/candidates`, `/recruitment/interviews`, `/attendance`, `/leave`, and `/payroll` |
| `git diff --check` | PASS (line-ending notices only) |

The build still reports runtime-resolved local font URLs and a chunk-size warning; neither blocks output.

## 12. Remaining Errors

No remaining TypeScript, ESLint, production-build, or diff-check errors were found.

## 13. Open Decisions

Existing decisions in [30-react-open-decisions.md](./30-react-open-decisions.md) remain unresolved. Phase 0 did not decide Attendance timezone semantics, Employee/backend DTO details beyond the already implemented frontend form shape, test framework selection, or consolidation of the two UI primitive roots.

## 14. Backend Blockers

No backend endpoint or response shape was invented. Existing documented backend blockers remain unchanged, including authoritative contracts for real integrations, authentication/tenancy, permissions, and future modules.

## 15. Known Technical Debt

- Automated tests are absent.
- Interactive browser regression is manual until an E2E harness is selected.
- Font asset URLs warn during bundling.
- The main bundle exceeds Vite's default chunk warning threshold.
- Two UI primitive roots remain and should not be expanded before an ownership decision.
- Some existing source comments/text show character-encoding artifacts.
- Employee and older module API architecture remains less isolated than Company; a repository-wide rewrite is outside Phase 0.

## 16. Recommendation for Phase 1

Phase 0 exit criteria are met for technical stabilization. Phase 1 may be planned against the existing migration roadmap, while keeping unresolved business/backend decisions explicit and adding a deliberately selected test stack before relying on automated workflow regression. Phase 1 was not started.
