# Company Module — Codex Instructions

## Role
Act as a senior frontend engineer working inside the existing HRMS React + TypeScript codebase.

The Company documentation is the source of truth.

## Before Coding
1. Read all files in `docs/company/`.
2. Inspect the actual repository.
3. Inspect Employee, Recruitment, Attendance, shared UI, API client, query keys and routing.
4. Identify documentation/repository conflicts.
5. Do not silently choose between conflicting patterns.
6. Report ambiguity before implementation.

## Architecture Rules
Use:
`types → schema → api → hooks → components/pages`

Use TanStack Query for server state.

Use React Hook Form + Zod for forms.

Reuse existing shared UI.

Never call httpClient directly from components.

Never hardcode API URLs in components/hooks.

Use centralized query keys.

Use targeted query invalidation.

Support `VITE_USE_MOCK_API` consistently.

Do not use `any` to bypass type errors.

Do not duplicate domain types/constants.

Keep pages thin.

Do not create a monolithic CompanyDetailPage.

## Business Rules
Do not invent business rules, permissions, API behavior or file-storage behavior.

If a requirement is missing or ambiguous, stop and report it.

Branch geofence configuration must eventually replace hardcoded Attendance work-location configuration; do not copy attendance constants into Company.

## Phase Rule
Implement only one phase from `10-build-plan.md` at a time unless explicitly asked to continue.

After every phase:
1. Run typecheck.
2. Run build.
3. Fix errors.
4. Review changed files.
5. Check duplication.
6. Check loading/error/empty states.
7. Check responsive/dark mode.
8. Check query invalidation.
9. Update documentation if an implementation decision changed.
10. Report completion and unresolved backend questions.

## Documentation Update Rule
If implementation discovers a new field, relationship, API behavior, validation rule, permission or architectural decision:
- update the relevant Company document
- explain the change
- keep code and documentation synchronized

Never silently change code-only.

## Completion Report
After each phase report:
- files created
- files modified
- implementation summary
- mock behavior
- API assumptions
- hooks/query keys
- validation
- typecheck/build result
- unresolved backend questions
- documentation updated
