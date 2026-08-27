# Employee Legacy → React Parity Audit

## 1. Executive summary

The React Employee module provides a mock-first list, linear create wizard, section-oriented edit wizard, and partial employee-document management. It is not legacy-parity complete. It lacks a profile/detail page, delete/deactivate lifecycle, account provisioning, team/supervisor relationships, authoritative statuses, Company-master IDs, list controls, bulk/import/export operations, granular permissions, and private-file behavior.

The complete legacy repository is not present in this workspace, its Git history, or available refs. Documents `23`–`33` summarize verified legacy evidence but do not enumerate every legacy Employee URL, model field, form control, or permission flag. Consequently, no current backend/React artifact is treated as legacy proof, and unconfirmed behavior is `UNKNOWN` rather than invented.

## 2. Legacy source locations

Unavailable in the current repository. Searches covered all files, Git history, `main`, and `origin/main`. The only legacy evidence available is:

- `23-react-parity-audit.md`: capability and form breadth.
- `24-route-parity-audit.md`: aggregated legacy route families/current routes.
- `25-status-normalization.md`: legacy Employee values include `3 Resigned` and `4 Temp`; other values unverified.
- `26-permission-parity-audit.md`: 65 legacy HR boolean flags exist, but names are not enumerated.
- `27-react-data-dependency-audit.md`: Company/master and operational dependencies.
- `31-legacy-react-traceability.md`: Employee/account/team/document/action traceability.
- `32-master-react-gap-report.md` and `33-react-implementation-plan.md`: verified gaps and sequencing.

The current `backend/apps/employees` implementation is a small contemporary DRF model/viewset, not confirmed legacy source and not an approved backend contract.

## 3. React source locations

- Routes: `frontend/src/app/router/index.tsx`.
- Navigation/permissions: `frontend/src/app/config/nav-config.ts`, auth hooks/types.
- Pages: Employee list/create/edit.
- Forms: Personal, Address, Employment, Account Details, Emergency, Documents, Permissions, Review; unused `EmployeeAttandenceStep`.
- Data: `employee.api.ts`, `employee-document.api.ts`, Employee hooks, centralized query keys.
- Contracts: Employee schema/types/constants.
- Integrations: Recruitment offers/candidates/jobs and Attendance `employee_id` records.

## 4. Route parity

| Capability | Legacy evidence | React route | Status | Finding |
|---|---|---|---|---|
| Employee list | Verified under 141 HR handlers | `/employees/list/` | PARTIAL | List only; no search/filter/page/sort/error/retry/bulk actions. |
| Create | Verified | `/employees/list/new` | PARTIAL | Broad wizard, but no authoritative masters/account/team/status contract. |
| Edit | Verified | `/employees/list/:id/edit` | PARTIAL | Section save/update-all exists; lifecycle and authoritative DTO absent. |
| Profile/detail | Verified capability | None | MISSING | List offers Edit only. |
| Documents | Legacy CRUD/view/ZIP | Edit-only Documents step | PARTIAL | List/upload/view/download/delete only. |
| Account/provisioning | Verified | None | MISSING | “Account Details” means bank/PF/ESIC, not user account. |
| Team/supervisor | Verified | None | MISSING | Free-text reporting manager only. |
| Attendance/profile subview | Verified relationship | None | MISSING | Attendance is a separate current-user page. |
| Resignation/actions | Verified | Nav-only paths | MISSING | Later Leave/Resignation phase. |
| Salary/tax/Form16 | Verified | Nav-only paths | MISSING | Later Payroll phase. |
| Import/export/bulk | Summary evidence incomplete | None | UNKNOWN | Concrete legacy handlers/options unavailable. |

Mixed trailing-slash conventions are retained evidence, not an authorization to rename routes.

## 5. Feature parity

| Capability | Status | Evidence/finding |
|---|---|---|
| Typed list/detail/create/update service methods | IMPLEMENTED | Components → hooks → API service; detail is consumed only by Edit. |
| Mock create/update | IMPLEMENTED | In-memory records and deterministic generated ID. |
| Delete/deactivate/reactivate | MISSING | No method, hook, action, or status control. |
| Employee profile | MISSING | No route/page. |
| Personal/address/work/bank/PF/ESIC/emergency entry | PARTIAL | Broad fields; legacy exactness and DTO unknown. |
| User-account provisioning/password/email | MISSING | No identity workflow. |
| Team/reporting hierarchy | MISSING | Reporting manager is unvalidated text. |
| Employee lifecycle statuses | MISSING | `is_active` boolean cannot represent Resigned/Temp. |
| Company/master integration | REFACTOR REQUIRED | Static display strings instead of scoped IDs. |
| Recruitment conversion | REFACTOR REQUIRED | Cross-domain hooks and sequential create/status mutations. |
| Documents | PARTIAL | Upload/list/view/download/delete; missing replace/update/ZIP/privacy/cleanup. |
| Permissions | PARTIAL | Page navigation uses provisional `employee.view`; actions/forms are unguarded; one remote-clock field. |
| Search/filter/sort/page | MISSING | API and list return whole arrays. |
| Import/export/bulk | UNKNOWN | No React support; exact legacy scope unavailable. |
| Audit/history | UNKNOWN | Response has timestamps but no audit experience. |
| Unused Attendance step | DUPLICATE/DEPRECATED CANDIDATE | Not present in either create/edit ordering; behavior duplicates joining date. Confirm before deletion. |
| Static employee list for interviewers | REFACTOR REQUIRED | Recruitment imports Employee constant instead of an Employee option service. |

## 6. Form parity

Create order is Personal → Address → Employment → Account Details → Emergency → Review. It is linear and validation-gated, with one final create.

Edit adds Documents and Permissions before Review, permits direct navigation, supports section save for form sections, and Update All on Review. Documents mutate independently. Create and Edit intentionally differ.

Findings:

- `job_role`, `week_off`, and `holiday_master` exist in the schema/mock but are absent from step validation lists and rendered forms.
- Document schema fields exist in the main Employee schema although document upload has a separate local-state flow.
- `same_as_above` records a boolean but does not copy, synchronize, disable, or validate address behavior.
- Correspondence controlled selects omit current `value`; edit display/selection behavior is therefore suspect.
- Create defaults omit many required strings until the user enters them; this is acceptable only because step validation gates navigation.
- Date of joining disallows future values; legacy and backend semantics are unconfirmed.
- Salary is required and visible to every user able to reach create/edit; authorization is absent.
- The shared Employee step type imports Recruitment’s `FormStepProps`, reversing domain ownership.
- Recruitment-prefill uses an intentionally suppressed effect dependency and copies labels rather than master IDs.

## 7. Detail-page parity

React has no Employee detail/profile page. Missing presentation includes identity/status header, profile sections, documents, team, attendance, leave, salary/payroll, permissions, history and lifecycle actions. Which sections are tabs, which actors may see them, and which legacy actions survive are product/backend decisions.

## 8. Document parity

Current categories are Resume, KYC, Educational, Employment and Other, with 22 React document types. Exact legacy category/type equivalence is `UNKNOWN`.

Current support: employee-scoped list, PDF/JPEG/PNG upload up to 10 MB, description, view, anchor download and delete.

Gaps: replacement/update, authoritative metadata, duplicate/category rules, server MIME/size validation, private access URLs, ownership/actor permissions, object-URL revocation on deletion/session end, download error handling, ZIP export and audit. `window.confirm` diverges from the shared confirmation pattern. Upload uses local state rather than RHF/Zod. Policy files are not an Employee-document contract.

## 9. Permission parity

Legacy evidence confirms 65 HR flags but does not name them. List/view/create/edit/delete/documents/attendance/salary/sensitive/export/import/bulk permissions therefore require a backend/product matrix.

Phase 1 provides provisional `employee.view` and `employee.write`. Navigation uses `employee.view`; Employee routes and action buttons do not use action-level gates. Manager has `employee.view`, HR has view/write, and Employee has neither in current mock personas. These values are not claimed as legacy mappings.

## 10. Status parity

Legacy evidence confirms at least `3 = Resigned` and `4 = Temp`; remaining raw values, labels and transitions are unavailable. React stores `is_active: boolean` and a separate employment type. This loses resignation, temporary and Full & Final semantics. No status badge, filter, transition UI or edit restrictions exist. Status mapping is `BLOCKED`; do not normalize it silently.

## 11. Search/filter/pagination parity

React has none. Employee API returns an unpaged array; list displays every row. No query parameters, search input, status/Company/Branch/Department/designation/type filter, sorting, page size, saved filter or bulk selection exists. The current DRF viewset advertises search/order/filter fields, but it is not an approved legacy/backend contract.

## 12. Integration parity

- Company/Branch/Department/Designation/Week Off/Holiday List: React stores labels/strings; Company exposes numeric frontend IDs and scoped queries. `REFACTOR REQUIRED`, pending ID/tenant contracts.
- Asset Type: legacy Employee relation is not confirmed; operational Asset allocation belongs to a later phase. `UNKNOWN/DEFERRED`.
- Recruitment: prefill/conversion is partial and non-atomic.
- Attendance: only numeric `employee_id`; no authorized branch/location/shift/week-off assignment.
- Leave/Resignation: absent; require Employee/team/schedule/status inputs later.
- Payroll/Tax/Form16: Employee captures bank/PF/ESIC/salary, but calculation/files/access are absent and backend-owned.

## 13. Architecture findings

The UI generally follows Component → Hook → API Service. Components do not access the mock switch or HTTP client. Violations/debt:

- Employee mock and HTTP implementations coexist in `employee.api.ts`; documents repeat this structure.
- EmployeeCreatePage directly imports Recruitment hooks and orchestrates a cross-domain transaction.
- Employee step props import a Recruitment type.
- Recruitment imports an Employee static list for interviewers.
- Employee services inspect environment variables and call `httpClient`, which is correct at the service boundary but needs separate adapters for replaceability.
- Query keys are centralized; update invalidation is targeted, while create invalidates the whole Employee family.
- No explicit `any` or TypeScript suppression exists; one ESLint dependency suppression remains.
- Create/Edit and Document components are oversized and combine orchestration with presentation.

## 14. UI findings

Employee reuses cards, Button, Input, Select, DatePicker, StepNavigation, ReviewSummary, EmptyState and Skeleton. Responsive grids and dark classes broadly match Company.

Unnecessary divergences include no list toolbar/error/retry/pagination, no page-level detail pattern, non-shared document confirmation, locally built success banners instead of toast convention, inconsistent imports bypassing the shared barrel, weaker list mobile/action behavior, and no mutation-error retry affordance. No browser visual/accessibility test is available.

## 15. Missing features

Detail/profile, authoritative Company/master relations, Branch/Shift assignment, account provisioning, team graph, lifecycle status/actions, delete/deactivate, list controls, bulk/import/export, comprehensive permissions, document replacement/ZIP/private access, attendance/leave/payroll profile views, and audit history.

## 16. Partial features

Create/edit forms, recruitment onboarding, document CRUD, permissions, salary/statutory fields, responsive/dark UI and API separation.

## 17. Unknown features

Complete legacy field list, exact Employee routes, import/export/bulk semantics, exact document taxonomy, all status values/transitions, all 65 flag names, detail tabs, uniqueness rules, editability rules and notification behavior.

## 18. Backend blockers

Tenant-scoped Employee DTO, ID types/FKs, list envelope/filter grammar, lifecycle/status transitions, employee-code generation, uniqueness, account/team APIs, atomic recruitment conversion, field/global error contract, private-file operations, authorization, audit metadata, and payroll/attendance/leave inputs.

## 19. Product decisions

Required decisions are maintained in `42-employee-open-decisions.md`: surviving profile fields/actions, master cardinality, sensitive-field visibility, create/edit workflow, status model, document taxonomy/permissions, account provisioning, team model, import/export/bulk scope and profile information architecture.

## 20. Recommended implementation order

Resolve evidence/blockers → define frontend domain port/adapters → implement scoped list/detail → integrate confirmed Company master IDs → reconcile create/edit schemas and workflows → implement private documents → add approved permission gates → add contract/regression tests. The detailed sequence is in `43-employee-phase-plan.md`.
