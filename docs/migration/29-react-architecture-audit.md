# React architecture audit

## Target comparison

| Boundary | Target from legacy architecture audit | Current React | Status |
|---|---|---|---|
| App | Router/providers/session/tenant/permissions | Router, Query provider, toast, layout; no session/tenant/guard | PARTIAL |
| Domain modules | Cohesive module ownership | Company/Employee/Attendance/Recruitment exist | PARTIAL |
| Shared UI | Accessible primitives without domain logic | Broad primitive set; Stepper imports Recruitment type | PARTIAL |
| API/service | Typed service per domain | Present for four operational domains | PARTIAL |
| Query | TanStack Query and centralized keys | Centralized keys/hooks | IMPLEMENTED |
| Schema | RHF/Zod form boundary | Company/Employee/Recruitment schemas | PARTIAL |
| Mock | Adapter compatible with future HTTP | Company separates mock; others embed mock DB in API files | PARTIAL |
| Permission | Policy boundary and backend enforcement | Disconnected mock Zustand store | MISSING |
| File service | Private upload/download/progress abstraction | Domain-specific Employee/Policy handling | MISSING |
| Workflow | Explicit transition modules | Transitions embedded in Recruitment pages/API; others absent | MISSING |
| Reports | Separate query/export boundary | Absent | MISSING |

## Data-flow audit

### Company

```text
Component → TanStack Query hook → companyApi → companyMockApi / backend-TBD
```

This is the best-aligned module. Components do not import mock data, inspect environment variables, call `httpClient`, or contain endpoints. Query keys are scoped and targeted.

### Employee, Recruitment and Attendance

They generally follow Component → Hook → API, but mock collections and real HTTP branches share large API files. This is workable but less replaceable/testable than Company. Employee Documents are a separate service, which is directionally correct.

## Violations and risks

| Priority | Finding | Exact evidence | Classification | Recommendation |
|---|---|---|---|---|
| P0 | No auth/tenant/route permission boundary | `app/router/index.tsx`, `LoginPage.tsx` | MISSING | Establish identity/tenant before P0 domains |
| P0 | Employee uses static string masters | `EmployeeEmploymentStep.tsx`, shared constants | REFACTOR_REQUIRED | DTO/UI option adapters with Company IDs |
| P0 | Geofence config disconnected from clock flow | Attendance constants/lib/widget | REFACTOR_REQUIRED | Authorized backend work-location contract |
| P0 | Employee source does not typecheck | Employee API/pages/schema | REFACTOR_REQUIRED | Stabilize before migration expansion without changing behavior |
| P1 | Recruitment/Employee mocks embedded in transport services | `recruitment.api.ts`, `employee.api.ts` | REFACTOR_REQUIRED | Split adapters behind stable port |
| P1 | Cross-domain Employee page directly consumes Recruitment hooks | `EmployeeCreatePage.tsx` | REFACTOR_REQUIRED | Conversion application boundary/typed handoff |
| P1 | Shared Stepper imports Recruitment type | `shared/ui/stepper/Stepper.tsx` | REFACTOR_REQUIRED | Own generic Step type in shared boundary |
| P1 | File behavior lacks shared authorized service contract | Employee Documents and Policy APIs | BLOCKED | Define private file port; preserve domain metadata |
| P1 | API responses are inconsistent | raw arrays, `{results}`, Company `PagedResult` | REFACTOR_REQUIRED | Domain mappers and shared transport error conventions |
| P1 | Hardcoded fallback API base URL | `shared/services/http/client.ts` | REFACTOR_REQUIRED | Require validated environment config for production |
| P1 | Navigation and router drift | `nav-config.ts` vs router | REFACTOR_REQUIRED | Route registry/availability audit per phase |
| P2 | Oversized files | Company mock 1561 lines; Recruitment API 723; DatePicker 432 | REFACTOR_REQUIRED | Split by entity/adapter only when behavior is covered |
| P2 | Two UI primitive roots | `shared/ui` and `components/ui` | DUPLICATE | Decide ownership and migrate gradually |

## Query and cache findings

- Query keys are centralized in `shared/constants/query-keys.ts`.
- Company parameterized keys do not collide and mutations invalidate targeted families.
- Employee create invalidates the whole Employee family, broader than necessary but domain-contained.
- Recruitment list keys are unparameterized because current services return whole arrays.
- No consumer query strategy exists for shared Company master options.
- Global defaults retry queries twice, making Company’s three-failure list scenario require an explicit manual retry as designed.

## Error and pagination findings

- HTTP client converts a limited set of `detail`, `message`, and flat field errors into a single `Error`; nested validation is unsupported.
- Company returns stable `PagedResult<T>`; Recruitment/Employee return arrays; Attendance return types are partially inferred.
- Components handle errors inconsistently outside Company.
- Exact backend pagination/filter/error envelopes remain blocked.

## Code-quality findings

- No explicit TypeScript `any` was found in application implementation; comments and HTML `step="any"` are not type escapes.
- Unsafe casts exist in Select, forms, Employee Documents and Recruitment scheduling.
- `EmployeeCreatePage copy.tsx` duplicates an older create flow.
- Company/Department/Designation static options duplicate Company master responsibility.
- Recruitment `JobForm` owns another Department list.
- Mock Employee collection is declared `const` but reassigned, blocking compilation/build.
- Several domain components are large and combine rendering, mutation orchestration and state.
- No automated unit/component/E2E test framework is configured.

## Architecture decision

Use gradual migration: stable domain ports, separate mock/HTTP adapters, DTO mapping, centralized query keys, RHF/Zod at forms, domain-owned workflows and server-owned authorization/calculation. Do not perform a repository-wide rewrite.

