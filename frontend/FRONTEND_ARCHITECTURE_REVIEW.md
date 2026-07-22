# React Frontend Architecture Review

Date: 22 July 2026  
Scope: `frontend/` application code, configuration, dependencies, build output, and its API boundary with the Django backend.

## Executive summary

The frontend has a promising feature-first foundation: domain code is grouped under `modules`, shared infrastructure is separated, page-level route splitting is in place, and React Hook Form, Zod, TanStack Query, Axios, Zustand, and TypeScript are used in appropriate roles. The current code also passes both the production build and ESLint.

The application is not yet production-ready. The highest-risk gaps are:

1. Routes described as protected have no authentication or authorization guard.
2. Navigation and router configuration have drifted apart; 48 navigation targets are declared, while only 20 router path entries exist, and unknown URLs silently redirect to recruitment jobs.
3. Important recruitment transitions are performed as multiple independent client mutations even though the backend already owns those transitions atomically. A partial failure can leave UI state and server state inconsistent.
4. List screens fetch only the first paginated response (currently capped at 100 records) and then search/filter in the browser.
5. There are no automated tests or CI quality gates.

The recommended direction is to keep the feature-first structure, make the server authoritative for business workflows, introduce a real auth/session boundary, derive navigation from route metadata, and add a thin, typed API layer with server-side pagination/filtering.

## Current architecture

```text
src/
├── app/                 application composition, routing, layouts, providers
├── modules/             feature domains: auth, dashboard, employee, recruitment
│   └── <feature>/       api, hooks, schemas, types, pages, components
├── shared/              cross-feature services, state, utilities, and UI
├── components/ui/       second UI component location (currently shadcn-style)
└── styles/              Tailwind theme and global component classes
```

The intended flow is generally sound:

```text
Page/component -> feature query hook -> feature API adapter -> shared Axios client -> Django API
                         |
                         +-> TanStack Query cache
```

## What is working well

- Feature code is mostly colocated under `src/modules/<domain>`, which is a good basis for ownership and future growth.
- Page-level lazy loading is implemented in `src/app/router/index.tsx`.
- Remote state and UI state have distinct tools: TanStack Query for server data and Zustand/local state for UI preferences.
- Forms use React Hook Form with Zod schemas rather than ad hoc validation.
- Query keys are centralized, and mutations generally invalidate relevant caches.
- Shared inputs forward refs, allowing straightforward React Hook Form integration.
- The theme uses tokens rather than scattering most raw color values through the feature code.
- TypeScript is configured with unused-local and unused-parameter checks.
- `npm run build` and `npm run lint` both complete successfully.

## Prioritized findings

| Priority | Finding | Impact | Primary evidence |
|---|---|---|---|
| P0 | No authentication/authorization boundary | Any visitor can render every HR/recruitment route; production API failures will appear only after page load | `src/modules/auth/pages/LoginPage.tsx:1`, `src/app/router/index.tsx:62`, `src/shared/hooks/use-permission-store.ts:19` |
| P0 | Client duplicates server-owned workflow transitions | Partial failures and race conditions can produce contradictory candidate, interview, offer, and employee state | `src/modules/recruitment/pages/Interview/scheduleInterviewPage.tsx:82`, `src/modules/recruitment/pages/offer/CreateOfferPage.tsx:38`, `src/modules/recruitment/pages/OffersPage.tsx:30`, `src/modules/employee/pages/EmployeeCreatePage.tsx:140` |
| P0 | Navigation targets and routes are not a single source of truth | Many menu clicks hit the wildcard and unexpectedly redirect to `/recruitment/jobs` | `src/app/config/nav-config.ts:31`, `src/app/router/index.tsx:55`, `src/app/router/index.tsx:124` |
| P1 | Pagination is discarded and filtering is client-only | Screens silently omit records after the first API page and will not scale | `src/modules/recruitment/api/recruitment.api.ts:463`, `src/modules/employee/api/employee.api.ts:12`, `src/modules/recruitment/pages/CandidatesPage.tsx:36` |
| P1 | No automated tests or test command | Build/lint cannot detect workflow, accessibility, routing, or cache regressions | `frontend/package.json:6` |
| P1 | API error/session handling loses useful information | Status codes and response details are discarded; there is no refresh-token or consistent 401 flow | `src/shared/services/http/client.ts:24` |
| P1 | Missing route and query error boundaries | Failed requests often look like empty data; render/chunk errors fall into React Router's default developer screen | `src/app/router/index.tsx:55`, list pages such as `src/modules/recruitment/pages/CandidatesPage.tsx:31` |
| P1 | Production asset paths are invalid | Built JavaScript retains `/src/assets/images/...`; self-hosted font declarations reference nonexistent `.woff2` files | `src/app/layouts/AuthLayout.tsx:8`, `src/shared/ui/sidebar/MainSideBarIcon.tsx:60`, `src/styles/globals.css:13` |
| P2 | Accessibility is incomplete in shared primitives | Labels are not programmatically associated with fields; modal focus is not trapped/restored; calendar buttons lack names | `src/shared/ui/input/Input.tsx:12`, `src/shared/ui/select/Select.tsx:14`, `src/shared/ui/modal/Modal.tsx:18`, `src/shared/ui/date-picker/DatePicker.tsx:147` |
| P2 | UI system and theme ownership are split | `shared/ui`, `components/ui`, global `.btn/.card`, Base UI, and shadcn patterns overlap and can drift | `src/shared/ui/index.ts:1`, `src/components/ui/card.tsx:1`, `src/styles/globals.css:111` |
| P2 | Large files mix concerns | Mock fixtures, transport code, DTO mapping, forms, and page orchestration are harder to test and change independently | `src/modules/recruitment/api/recruitment.api.ts` (723 lines), `src/modules/employee/pages/EmployeeCreatePage.tsx` (437 lines), `src/shared/ui/date-picker/DatePicker.tsx` (432 lines) |
| P2 | Repository/dependency hygiene needs cleanup | A tracked `src.zip`, unused/dead modules, redundant font files, and CLI packages in runtime dependencies add ambiguity and weight | `frontend/src.zip`, `src/App.tsx`, `src/shared/ui/sidebar/AppSidebar.tsx`, `frontend/package.json:15` |

## Detailed recommendations

### 1. Establish authentication and authorization as application infrastructure

Implement an `AuthProvider` (or a small external store) that owns the authenticated user, access-token lifecycle, initial session restoration, login, refresh, and logout. Add route guards at the layout boundary:

- `PublicOnlyRoute` for `/login`.
- `RequireAuth` around the dashboard layout.
- Permission metadata on routes for employee/recruitment write operations.
- A 403 page distinct from a 404 page.

The current permission store contains hard-coded admin-like permissions and is unused. Replace it with permissions returned for the authenticated user, and treat frontend checks as UX only; the API must remain the authorization authority.

Avoid turning every component into an auth consumer. The HTTP/session layer should handle token refresh and terminal session expiry centrally. If browser storage continues to hold bearer tokens, document the XSS tradeoff and keep access tokens short-lived. Prefer an HttpOnly, Secure refresh cookie when backend deployment constraints allow it.

### 2. Make routes and navigation one coherent model

The route table and `ALL_MODULES` should not be maintained independently. Recommended options:

- Define typed route descriptors containing `path`, lazy component, label, icon, roles/permissions, and visibility; generate both the router children and navigation from them.
- Alternatively, keep router definitions canonical and build navigation with imported route constants, backed by a test that asserts every visible navigation target matches a route.

Do not redirect every unknown URL to recruitment jobs. Add an explicit not-found page so broken links remain visible during development and understandable to users. Remove or hide unfinished menu entries until their route exists.

The sidebar's active module is derived from the URL but also stored as mutable Zustand state. Prefer deriving active state from `useLocation()` and store only user-controlled preferences such as collapsed/open state. This removes rehydration mutation and pathname substring matching from `sidebar.store.ts`.

### 3. Put business workflows behind atomic server operations

The backend serializers already update candidate state when interviews, offers, and employees are created or changed. The frontend then sends additional candidate mutations:

- Schedule interview, then patch candidate to `interview`.
- Create offer, then patch candidate to `offer`.
- Accept offer, then patch candidate to `onboarding`.
- Create employee, then patch candidate to `hired` and converted.

Remove those redundant writes. One user action should call one server command/endpoint, receive the authoritative updated resources, and update or invalidate all affected caches. If a workflow spans multiple records, keep its transaction in Django.

For example, an offer acceptance response can return `{ offer, candidate }`. The mutation can then update `offers`, `candidates`, candidate detail, and pipeline caches together. This is safer than firing two uncoordinated mutations and also simplifies loading/error UI.

### 4. Redesign list queries around server-side parameters

Return the full pagination envelope rather than only `results`. Define typed parameters such as:

```ts
type CandidateListParams = {
  page: number;
  pageSize: number;
  search?: string;
  status?: CandidateStatus;
  ordering?: string;
};
```

Include normalized parameters in query keys and send them to the API. Add pagination controls and debounce free-text search. The same pattern should cover jobs, interviews, offers, and employees.

For the pipeline, use its dedicated `/recruitment/pipeline/` endpoint rather than fetching a candidate list and reconstructing all stages in the browser. This keeps counts and stages correct beyond the first page.

### 5. Strengthen the API boundary

Split the 723-line recruitment API module into focused files (`jobs.api.ts`, `candidates.api.ts`, and so on). Move mock fixtures into a development-only adapter or MSW handlers so production transport code does not carry a second in-memory database.

Introduce an application error type that preserves:

- HTTP status and stable error code.
- Field validation errors as a record rather than only the first field.
- A safe display message.
- The original cause for logging/telemetry.

The current interceptor creates a plain `Error`, discarding Axios response/status information. Centralize 401 refresh/logout behavior and do not retry authorization failures through the default query retry policy.

Generate DTO types from the backend OpenAPI schema, or at minimum add contract tests. Keep API DTOs separate from form/view models and map between them explicitly. This will reduce manual casts such as resolver and status assertions and catch nullability or read-only-field drift.

### 6. Standardize loading, empty, and error experiences

Create reusable page-level states:

- `PageLoading` or route-level pending UI.
- `QueryErrorState` with retry.
- `NotFoundState` for invalid resource IDs.
- `RouteErrorBoundary` for render and lazy-chunk failures.

Most list pages currently destructure `data` and `isLoading` only, so a failed query renders an empty table. Distinguish “zero records” from “request failed.” Mutations should use one consistent notification pattern and keep destructive-action errors visible.

Consider route loaders only where they materially improve navigation; TanStack Query can remain the data cache. The key is one documented ownership model rather than mixing patterns accidentally.

### 7. Consolidate the design system and fix accessibility at the primitive level

Choose one public component location and API. A practical migration is:

- `shared/ui` is the only import surface for product code.
- Internally, primitives may wrap Base UI/shadcn components.
- Replace global `.btn`, `.card`, and `.form-input` contracts gradually with typed variants.
- Keep design tokens in one Tailwind theme block; choose Geist, Poppins, or Inter intentionally instead of redefining `--font-sans` twice.

Fix shared primitives once so all forms benefit:

- Generate/accept field IDs and connect `<label htmlFor>`, input `id`, `aria-invalid`, and `aria-describedby`.
- Add `aria-live` for validation and mutation messages.
- Use an accessible dialog primitive with focus trap, initial focus, focus restoration, labelled description, and robust scroll locking.
- Add accessible names to calendar navigation/day controls and verify keyboard navigation.
- Give icon-only action buttons explicit labels or visible tooltips.
- Preserve the prior body overflow value when a modal closes.

### 8. Decompose by responsibility, not merely by file size

Suggested extractions:

- `EmployeeCreatePage`: a recruitment-to-employee mapper, form component, review component, and onboarding mutation hook.
- `CandidateDetailsPage`: typed section components plus shared formatters for money, dates, enums, and locations.
- `DatePicker`: calendar state hook and separate date/month/year/range panels, unless replacing it with an established accessible date-field library is cheaper.
- `recruitment.api.ts`: separate transport, DTO mapping, and development mocks.

Avoid storing derived values in state. In particular, sidebar `visibleModules` and `activeModule` can be derived from the role and current location.

### 9. Add a test pyramid and CI gates

Recommended baseline:

- Vitest + React Testing Library + `@testing-library/user-event` for components/hooks.
- MSW for API behavior at the network boundary.
- Playwright for a small number of critical workflows.
- `jest-axe` or Axe in Playwright for core-page accessibility checks.

Highest-value first tests:

1. Unauthenticated users cannot enter dashboard routes; expired sessions refresh or redirect.
2. Every visible navigation item resolves to a real route.
3. Candidate multi-step form validates each step and submits transformed values.
4. Interview scheduling and offer acceptance perform exactly one workflow request and reconcile all affected queries.
5. Employee onboarding cannot be submitted twice and handles an already-converted candidate.
6. Candidate/job list pagination and search use server parameters.
7. Modal focus/escape behavior and labelled form controls.

Add CI commands for clean install, type/build, lint, unit tests with coverage, and a production smoke test. Type-aware ESLint rules should be enabled after the current codebase is clean under them.

### 10. Fix deployment and repository hygiene

- Import images through TypeScript (`import logoUrl from ...`) or place stable public assets under `public/`; `/src/...` paths should never survive into production bundles.
- Remove or correct nonexistent `.woff2` declarations. Prefer the existing Geist package or a minimal subset of self-hosted fonts, not both full Inter and Poppins families.
- Remove the tracked `frontend/src.zip`; Git already provides source history and the archive can become stale.
- Delete confirmed dead code such as the unused starter `App.tsx`, old sidebar/header implementations, empty job hook files, and unused constants—or mark an owner and migration issue if they are intentionally retained.
- Move `pnpm` and shadcn CLI tooling out of runtime dependencies; choose and document one package manager. Add a `packageManager` field if pnpm is selected.
- Replace the template frontend README with project-specific setup, architecture, environment, testing, and deployment guidance.

## Recommended target shape

```text
src/
├── app/
│   ├── providers/             query, auth, theme, error reporting
│   ├── router/                typed route descriptors and guards
│   └── layouts/
├── modules/
│   ├── recruitment/
│   │   ├── api/               jobs, candidates, interviews, offers, pipeline
│   │   ├── model/             generated DTOs, domain mappings, query keys
│   │   ├── components/
│   │   └── pages/
│   └── employee/
├── shared/
│   ├── api/                   HTTP client, AppError, session handling
│   ├── auth/                  session model and permission helpers
│   ├── lib/                   formatting and pure utilities
│   └── ui/                    single public design-system surface
└── test/                      render helpers, MSW server, fixtures
```

This is an evolution of the current structure, not a rewrite.

## Phased improvement plan

### Phase 1: correctness and production blockers

1. Implement auth/session state, route guards, and 401 handling.
2. Remove duplicated client-side workflow transitions and let backend transactions own them.
3. Hide/fix broken navigation targets and add explicit 403/404/error pages.
4. Fix production image/font asset references.
5. Add smoke tests for auth, navigation, and the recruitment-to-employee workflow.

### Phase 2: scale and reliability

1. Add typed server pagination/search/filter params and parameterized query keys.
2. Consume the pipeline endpoint.
3. Preserve structured API errors and render consistent query error states.
4. Add unit/integration tests and CI gates.
5. Generate or validate client types against OpenAPI.

### Phase 3: maintainability and experience

1. Consolidate UI primitives and theme/font ownership.
2. Complete accessibility remediation.
3. Split large mixed-responsibility files and isolate development mocks.
4. Remove dead files, the source archive, and runtime dependency clutter.
5. Add observability, bundle budgets, and route-level performance monitoring.

## Suggested quality gates

- Build, typecheck, and lint must pass with no suppressed hook dependency warnings.
- Unit/integration coverage should prioritize critical domain branches; use a practical initial threshold (for example 70%) and raise it as legacy gaps close.
- Every visible route must have a route-match test.
- Every list query must preserve pagination metadata and encode all request parameters in its query key.
- Every multi-record workflow must be one atomic API operation from the browser's perspective.
- Core pages and dialogs should pass automated Axe checks and manual keyboard navigation.
- Production output must contain no `/src/` URLs, missing asset warnings, or unexpected large initial chunks.

## Verification performed for this review

- `npm run build`: passed; emitted seven unresolved `.woff2` warnings.
- `npm run lint`: passed.
- Production bundle inspection: found `/src/assets/images/logo.png` and `/src/assets/images/peoplepulse.png` retained in JavaScript.
- Test inventory: no frontend test/spec files or test script found.
- Route/navigation inventory: 48 declared navigation targets versus 20 router `path` entries (counts include dynamic/stub paths; the mismatch still demonstrates configuration drift).
- Repository inventory: `frontend/src.zip` is tracked; `frontend/src` is approximately 7.1 MB, largely due to bundled font families, and the archive is approximately 3.2 MB.

## Bottom line

Keep the existing feature-first direction, but address correctness before expanding modules. Auth guards, server-owned workflow transitions, route/navigation alignment, paginated queries, and a small critical-path test suite will provide the largest risk reduction. After those are in place, consolidating the UI layer and decomposing the largest files will make subsequent HRMS modules faster and safer to build.
