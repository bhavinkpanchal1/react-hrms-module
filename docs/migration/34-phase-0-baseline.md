# Phase 0 Baseline

Captured before Phase 0 source changes on 2026-08-19.

## Toolchain

| Tool | Version / state |
|---|---|
| Node.js | v24.14.0 |
| npm | 11.9.0 |
| pnpm | Declared as dependency (`^11.5.3`); no pnpm workflow is configured |
| TypeScript | 6.0.3 |
| Vite | 8.0.16 |
| Test framework | None configured |

The first npm invocation through PowerShell was blocked by the host execution policy. The baseline commands were rerun through `npm.cmd`/`npx.cmd`; this was an environment issue, not a repository failure.

## Baseline Results

| Check | Result |
|---|---|
| `npm run build` | FAIL: TypeScript errors prevented Vite from running |
| `npm run lint` | FAIL: 7 errors |
| `npx vite build` | FAIL: illegal reassignment of `mockEmployees` after transforming 2,383 modules |
| Existing tests | NOT CONFIGURED: no `test` script and no test/spec files |
| Git status | Only `docs/migration/` was untracked before Phase 0 source edits |

## Verified Blockers

- Attendance passed nullable clock timestamps to `Date`/formatters, had untyped component props, an unused prop, and synchronous state updates in effects.
- Employee mock address values disagreed with the form/domain location types.
- Employee creation used the nonexistent `employee_code` field and omitted required response metadata.
- `mockEmployees` was declared `const` but reassigned by create and update operations; this also blocked the direct Vite build.
- Employee create/edit form values disagreed with API mutation types, and the list read `employee_code` instead of `employee_id`.
- `EmployeeCreatePage copy.tsx` contained stale schema fields and generated many compile errors.
- Recruitment's Candidate form resolver input/output inference disagreed with React Hook Form's declared form type.
- Shared `Stepper` imported a missing Recruitment-owned `StepItem` type, reversing the intended dependency direction.
- The router mixed lazy component declarations with the exported router, violating the Fast Refresh lint rule.
- Employee attendance step destructured unused props.

## Baseline Warnings and Limitations

- Vite reported unresolved local Poppins/Inter font URLs that are left for runtime resolution.
- Vite reported a main chunk larger than 500 kB.
- No automated unit, component, integration, or E2E test foundation exists.
- The two existing UI primitive roots remain documented technical debt; Phase 0 did not migrate them.

