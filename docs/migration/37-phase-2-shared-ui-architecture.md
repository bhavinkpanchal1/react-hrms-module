# Phase 2 — Shared UI and Frontend Architecture Standardization

## 1. Phase objective

Phase 2 audited the React repository and established conservative rules for shared UI, data access, forms, CRUD, feedback, responsive styling, dark mode, accessibility, permissions and tenancy. It does not add backend contracts, change Company business behavior, migrate legacy domains, or begin Phase 3.

## 2. Existing architecture

The application is organized into `app`, domain `modules`, and `shared` infrastructure. Company is the strongest mock-first implementation. Employee, Recruitment and Attendance use the same broad Component → Hook → API direction but keep more mock and transport detail together. Phase 1 owns authentication, session, active Company and permissions.

The repository has two UI roots. `shared/ui` contains the established HRMS primitives. `components/ui` contains Base UI Card, Avatar and Accordion wrappers; Attendance currently consumes Card. These are intentionally retained because there is no safe behavior-preserving reason to move them in Phase 2.

## 3. Audit classification

| Classification | Findings and disposition |
|---|---|
| A — Must fix now | Repeated destructive confirmation markup and incomplete shared Modal keyboard/focus behavior. Consolidated and improved. |
| B — Safe reusable improvement | Central `getErrorMessage` helper; shared UI barrel exports for ConfirmationDialog and EmptyState. |
| C — Domain-specific, leave alone | Company tab layouts, status semantics, Policy file actions, Week Off grids, Recruitment pipelines, Attendance cards, table/card choice. |
| D — Backend-dependent, leave alone | Error DTOs, real endpoints, pagination envelopes, private files, tenant enforcement, canonical IDs/statuses and workflow transitions. |
| E — Out of scope | Missing Shift, Leave, Payroll, reports, assets inventory and other Phase 3+ features. |
| F — Defer | Generic Tabs/DataTable/SearchToolbar, Select/DatePicker decomposition, Employee/Recruitment adapter splits, cross-domain conversion boundary, UI-root migration and automated test framework. |

## 4. Canonical architecture

```text
Component → TanStack Query hook → typed API service → mock adapter / HTTP adapter
```

Components render UI and coordinate user events. Hooks own TanStack Query configuration. API services own typed operations and mock/real selection. Mock adapters own fixture behavior. Components must never import mocks, inspect environment switches, call `httpClient`/`fetch`, embed endpoints, or manipulate backend selection.

Mock-first behavior remains authoritative until backend contracts exist. Real Company and Auth operations may continue to fail explicitly with backend-TBD errors; Phase 2 invents no endpoint or DTO.

## 5. Shared UI rules and canonical primitives

Canonical established primitives are Button, Input, Textarea, Select, DatePicker, Checkbox, Radio, Modal, ConfirmationDialog, Badge, EmptyState, Spinner/PageSpinner, Skeleton/TableRowSkeleton, Pagination, StepNavigation/Stepper and ReviewSummary. Toast feedback remains `react-hot-toast` through the application provider. ConfirmationDialog composes the existing Modal and supports generic description, cancel/confirm labels, pending state and inline mutation error.

No generic Combobox, Tabs, DataTable, SearchToolbar or PageHeader was added: requirements do not yet demonstrate stable common semantics. Company tabs remain the accessibility reference. Domain status maps, forms, file behavior and workflow presentations remain domain-owned. Shared UI must accept generic props and must never import a domain module or type.

## 6. Page and list-state pattern

List pages should normally render a title/description/action header, optional toolbar, content, one query state, and Pagination. Detail pages may use header, identity summary, tabs and tab content. Domain needs may justify exceptions.

Query states are Loading → Error with message and Retry → Empty with optional action → Success. Mutation pending state belongs on the initiating control; mutation errors use inline form/dialog feedback or the existing toast convention. Do not show duplicate spinners for one operation.

## 7. CRUD, query and query-key pattern

- List/detail: component → `useQuery` hook → API service.
- Create/update/delete: form or confirmation → `useMutation` hook → API service → targeted invalidation.
- Query keys remain exclusively centralized in `shared/constants/query-keys.ts` and follow domain/family/collection-or-detail hierarchy.
- Tenant-dependent future keys must contain `activeCompanyId`; existing explicit Company administration IDs are not rewritten.
- Do not clear the full QueryClient for ordinary mutations. Full clearing remains appropriate at logout to prevent session data leakage.

## 8. Form pattern

Forms use React Hook Form with a Zod resolver, schema-inferred types, `register`/`control`, `formState.errors`, `handleSubmit` and `reset`. `Controller` is reserved for controlled primitives. Create/edit share a form when fields and semantics match. Domain validation stays in the domain schema. Forms do not call transport clients, mocks, endpoints, global cache operations or unrelated page layout.

Modal forms reset on entity/mode changes where appropriate, prevent close or duplicate submission while pending, disable relevant controls, and show deterministic feedback. Existing Company effects that reset RHF state synchronize modal input identity and were retained.

## 9. Modal and confirmation pattern

Modal is the single overlay primitive. It locks document scrolling, closes on backdrop/Escape when permitted, labels the dialog, moves focus inside, traps Tab navigation, restores prior focus, and supports disabled closing during a pending destructive mutation. ConfirmationDialog is the canonical destructive-action composition; domains provide wording and mutation callbacks.

## 10. Pagination pattern

The shared one-based Pagination receives `page`, `pageSize`, `total`, `onPageChange` and an optional disabled state. API adapters—not the primitive—must translate any future backend paging convention. Domain-specific pagination components are prohibited without a genuinely distinct interaction.

## 11. API errors and toasts

`getErrorMessage(unknown, fallback)` is the small frontend-safe normalization boundary used in touched Company code. It does not define or assume a backend error DTO. Success toasts should be concise sentences describing the completed entity action; failures use a clear “Unable to …” fallback and may preserve a deterministic service message.

## 12. Permission and active Company patterns

`useAuth`, `usePermission` and `PermissionGate` remain the only identity/permission consumption boundary. Components do not read permission or session storage. Navigation filtering and hidden actions are UX only; backend authorization remains mandatory.

`activeCompanyId` comes from the Phase 1 auth/session foundation. Future tenant-scoped hooks and services must receive it explicitly and include it in query keys. Phase 2 does not force tenancy into older Employee, Attendance or Recruitment behavior.

## 13. Responsive, dark-mode and visual rules

The existing slate/navy Tailwind language is canonical: compact typography, rounded cards/modals, slate borders, primary/error semantic colors, responsive grids, wrapping action rows and horizontal table overflow. Shared components must define light/dark backgrounds, borders, text, hover, focus and disabled states. Do not introduce another CSS system or palette. Tables and cards remain domain presentation choices.

## 14. Accessibility rules

Inputs require associated labels or accessible names. Buttons set the correct type, icon-only controls need labels, disabled/pending states must be native where possible, and errors should be perceivable (`role="alert"` where appropriate). Dialogs require an accessible name, focus entry/trap/restoration, Escape behavior and protected pending state. Company tabs remain the keyboard reference. Full WCAG and browser/assistive-technology verification is deferred until test tooling is selected.

## 15. TypeScript, readability and effects

Strict types remain enabled. Do not add `any`, suppressions or unsafe casts to silence errors; prefer `unknown`, generics and explicit unions/interfaces. Extract only repeated responsibilities with matching semantics. Effects are reserved for external synchronization, imperative browser APIs, store/session restoration or RHF reset based on changing external inputs. Derived data stays in render/memoized derivation and user actions stay in handlers.

## 16. Naming and folders

- Components: `PascalCase.tsx`; hooks: `useSomething.ts`; APIs: `something.api.ts`; mocks: `something.mock.ts`.
- Schemas: `something.schema.ts`; types: `something.types.ts` where already established; constants: `something.constants.ts`; utilities: descriptive kebab-case/current local convention.
- Domain code remains under `modules/<domain>/{api,components,hooks,pages,schema,types,...}`.
- Generic code belongs under `shared/{ui,hooks,lib,stores,constants,types,utils}`.
- Do not move files solely for naming cosmetics; older singular `type` filenames may migrate only when touched for substantive work.

## 17. Reuse and anti-patterns

Share only domain-independent responsibilities with stable semantics and meaningful reuse. Search both UI roots first. Prohibited patterns include direct component mock/environment/HTTP/endpoint access, raw scattered query keys, global invalidation for local CRUD, storage-backed permission checks, role hardcoding, domain imports from shared UI, per-domain delete modals/pagination, form-field `useState` duplication, invented backend behavior and speculative abstractions.

## 18. Files changed

Created: `shared/lib/get-error-message.ts`, `shared/ui/confirmation-dialog/ConfirmationDialog.tsx`, and this report. Modified: shared Modal/UI exports; all nine Company destructive-action consumers; and the open-decisions register. No files were deleted.

## 19. Deferred items and decisions

DEC-037 records ownership of the two UI roots. DEC-038 records selection of an automated frontend test stack. Existing backend, tenant, permission, status, ID, file and workflow decisions remain blocked. Tabs/DataTable/toolbars are deferred until multiple consumers share requirements. Select/DatePicker and large domain API files require focused tests before decomposition.

## 20. Validation results

| Check | Result |
|---|---|
| `npx tsc -b --pretty false` | PASS |
| `npm run lint` | PASS |
| Production build | PASS; 2,392 modules transformed |
| Mock-mode production build | PASS; 2,392 modules transformed |
| Production route-shell smoke | PASS (HTTP 200 and root shell) for Login, Dashboard, Company list/detail, Employee list/create, Recruitment Jobs and Attendance |
| Company regression | Compilation and list/detail route-shell smoke PASS; nine tab chunks compile. Interactive mock CRUD was not browser-tested. |
| Phase 1 regression | Authenticated route shell, auth/session/permission source boundaries and full compilation PASS. Interactive login/restore/switch/logout was not browser-tested in Phase 2. |
| Architecture scans | PASS: no component mock imports, mock switch, HTTP client, endpoint constant or direct fetch; no shared-to-domain imports; no raw query-key array declarations; one query-key registry; no TypeScript escapes or permission storage duplication. The scan pattern `fetch(` also matched TanStack `refetch()` names and those false positives were reviewed. |
| `git diff --check` | PASS; Git emitted line-ending conversion notices only |

Automated browser test framework is not configured. No DOM interaction, responsive visual, dark-mode visual, focus-trap browser behavior or assistive-technology test is claimed. Builds retain the pre-existing unresolved local `.woff2` warnings and the main chunk-size warning.

## Rules for Future Codex Implementation

1. Never invent backend endpoints.
2. Frontend remains mock-first until backend contracts exist.
3. Components never access mock data directly.
4. Components never inspect `USE_MOCK`/`VITE_USE_MOCK_API`.
5. Components never call `httpClient` directly.
6. Components never contain API URLs.
7. Shared UI never imports domain types.
8. TanStack Query manages server state.
9. Zustand manages application/client state where appropriate.
10. Query keys remain centralized.
11. Mutations use targeted invalidation.
12. Forms use React Hook Form + Zod.
13. Create/Edit should reuse forms when semantics are the same.
14. Destructive actions use the shared confirmation pattern.
15. Permission checks use `usePermission`/`PermissionGate`.
16. Frontend permission checks do not replace backend authorization.
17. Active Company must come from the auth/session foundation.
18. Do not duplicate shared UI.
19. Do not create abstractions without meaningful reuse.
20. Do not introduce `any` or TypeScript suppressions.
21. Do not modify unrelated domains during a phase.
22. Do not silently resolve documented backend/business ambiguity.
23. Document unresolved decisions instead of inventing behavior.
24. Every phase must finish with TypeScript, ESLint, build and diff checks.
25. Every phase must report exactly what was changed.
