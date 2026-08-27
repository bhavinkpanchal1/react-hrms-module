# Employee List Decision

## Status

CORE-11 is **PARTIALLY RESOLVED**. Legacy list behavior is confirmed. Product approves HR-only import, CSV/Excel/PDF/clipboard export and approved bulk operations, but not bulk delete. Data volume, server/client execution, schemas, sensitive redaction, audit and page size remain Backend/Security decisions.

## Legacy route and query

`apps/hr/urls.py` routes the Employee list to `apps/hr/views.py:Employees` (`views.py:1866-1927`). The query selects all StaffProfile rows whose Branch belongs to `request.company`, annotates Payroll status, sorts Resigned last then by Employee code, and emits one JSON array to `templates/hr/employee/list.html`. Resigned records remain present.

**Approved target:** the default list includes Probation, Regular, Notice Period and Temp. Resigned is available through explicit multi-select status filtering. Legacy behavior below remains evidence only.

## Legacy columns

| Column | Source | Evidence |
|---|---|---|
| Counter | Loop index | `Employees` data + Grid config |
| Employee ID | `emp_id` | Same |
| Employee Name | `get_name()` with detail link | Same |
| Department | FK name | Same |
| Designation | FK name | Same |
| DOJ | `start_date` | Same |
| Status | `get_status_display()` badge | Same |
| Payroll | annotated Payroll status | Same |
| Action | Detail/edit link | Template Grid config |

Avatar is supplied but hidden. Email and phone are supplied and used in export configuration but their visible columns are commented out.

## Search, filter, sort and pagination

| Area | Legacy behavior | Evidence |
|---|---|---|
| Search | Text input updates Grid.js `search.keyword`; searches client dataset | `list.html:321-328` |
| Status filter | Exact display-value filter: Regular(default), All, Probation, Temp, Resigned, Notice Period | `list.html:112-120,331-342` |
| Sort | Grid global sorting enabled; counter/department/designation/status/payroll/action disabled; Employee ID/name/DOJ sortable | Grid config |
| Default server order | Resigned last, then `emp_id` | `views.py:1873-1882` |
| Pagination | Grid.js client pagination enabled; no explicit page size found | `pagination: true` |
| Company filter | Server query via Branch Company | `views.py:1871-1874` |
| Branch/Department/Designation/manager/date filters | Not present on main list | Audited template/view |

## Actions and permissions

Name and Edit both open the combined detail route. Delete UI/formatter is commented out; a confirmation modal remains and the server delete handler is a no-op. Add Employee is available from the page. `can_handle_employee` controls navigation, but the list/action endpoint has no matching demonstrated server check.

No row selection, bulk status, bulk delete, bulk assignment, bulk document operation or Employee import was found: **NOT PRESENT**.

## Export

Legacy client-side export supports CSV, Excel, PDF and clipboard using the full loaded `tableData` but an explicit export column set of ID, Employee Name, Email and Phone. Filenames are `employee_list` for CSV/Excel and date-based for PDF. Export is not limited by the current status/search filter because it receives original `tableData`. No server authorization, redaction, large-export handling or audit is demonstrated. A separate Employee report supports date/status filtering and exports a much broader sensitive dataset; it is not the main list contract.

## Current React comparison

| Capability | Legacy | React | Gap | Classification |
|---|---|---|---|---|
| Company-scoped list | Server Company query | Whole mock/API array; Company scope unproved | Tenant boundary | BACKEND REQUIRED |
| Columns | Code/name/org/DOJ/status/payroll | Name/code/email/org/type/DOJ/source | Lifecycle/payroll missing; unapproved type/source | PARTIAL |
| Search/filter/sort/page | Client Grid.js | None | Missing parity | MISSING |
| Detail | Name/detail | No detail route; Edit only | Read-first detail missing | MISSING |
| Add/Edit | Confirmed | Present | Authorization missing | PARTIAL |
| Loading/empty | Grid/render; no explicit error | Skeleton and empty | Error/retry missing | PARTIAL |
| Status | Five values/filter/badges | `is_active` not shown | Lifecycle lost | MISSING |
| Export | Four client exports | None | HR-only CSV/Excel/PDF/clipboard approved; sensitive fields/redaction backend/security TBD | PRODUCT RESOLVED; BACKEND/SECURITY REQUIRED |
| Import/bulk | Not present | Not present | HR-only import and approved bulk operations are new Product requirements; no bulk delete | PRODUCT RESOLVED; BACKEND REQUIRED |
| Permission | Navigation only | Nav uses `employee.view`; routes/actions unguarded | Backend/action enforcement | BACKEND REQUIRED |

## Proposed target list contract

Preserve confirmed list concepts. Product additionally approves HR-only import/export and approved bulk operations. Do not add bulk delete, sensitive export fields, or concrete file/schema behavior without the remaining Security/Backend contracts.

Required UI states: loading, empty, error with retry, invalid/forbidden navigation results, and deterministic mock behavior. Execution may remain client-side for a deterministic mock adapter; backend pagination/filter/sort parameters are **BACKEND REQUIRED** and must not be invented now.

## Product decisions

1. CORE-11-Q1: CSV/Excel/PDF/clipboard export is retained for authorized HR; which sensitive/redacted columns remain Security/Backend-required.
2. CORE-11-Q2: keep Payroll status on Employee list or move to Payroll-only views?
3. CORE-11-Q3: target default status filter and whether closed employment is included by default?
4. CORE-11-Q4: explicit page size and client-versus-server threshold?
5. CORE-11-Q5: approve any additional Branch/Department/Designation/manager/date filters?

Recommendations: redacted HR-only export if retained; Payroll status only through Payroll-authorized summary; current employments by default with explicit All/history; page-size decision deferred; add filters only from demonstrated need.

## Backend decisions

Tenant-scoped list DTO; stable ID/status serialization; search/filter/sort/page contract; total counts; allowed sort fields; sensitive projection; Payroll summary composition; export authorization; permission/errors; and query performance. No endpoint is defined.

## Approved target list contract

- Default statuses: Probation, Regular, Notice Period and Temp. Resigned appears only when explicitly filtered.
- Search: code, first/last/full name, personal email, phone, Department, Designation and Branch.
- Multi-select Status, Branch, Department and Designation filters. Values within one filter use OR; different filters use AND. Company filter is Director-only where cross-Company scope permits. Joining-date filter is deferred/P1.
- Default sort is Employee Name A–Z. Sortable: name, code, joining date, Department, Designation, Branch, status and last updated.
- Backend pagination defaults 20; options may include 10/20/50/100. Page-size change resets page 1. Clear filters clears search/filter criteria, preserves sort/page size and resets page 1. Filters do not persist across visits.
- Fixed columns: photo, code, name, Department, Designation, Branch, joining date, status, personal email and actions. Phone and protected/Payroll fields are excluded.
- Use table presentation at all breakpoints with controlled horizontal scrolling; reuse shared table/loading/error/empty primitives.
- Name opens Detail. Active rows expose approved actions. Resigned rows allow View and dedicated lifecycle/correction actions, not normal Edit.
- Empty filtered result: “No employees found” plus “Clear Search & Filters”. Empty Company: “No employees yet” plus Add Employee where authorized. API errors use Error + Retry, never empty state.
- Successful mutations invalidate/refetch relevant query keys; no reload or duplicated local cache.
- Bulk mode is hidden until HR selects Bulk Actions. Select All is current page only. Approved: Status Update, explicitly supported Organization Assignment and Export. Denied: delete, Account actions, sensitive changes, Documents and Company transfer. Confirm selection count/action/new value/consequence. Clear selection on page/search/filter/sort changes.
- Export Current Results and Export All Authorized Employees in CSV/Excel/PDF/Clipboard; always authorized scope. Sensitive export remains Security/Backend-controlled.

Exact query/DTO grammar, total counts, file generation, schemas, sensitive redaction, bulk validation/atomicity and shared-table implementation remain Backend/architecture work.
