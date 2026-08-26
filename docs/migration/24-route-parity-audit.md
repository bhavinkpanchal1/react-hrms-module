# Route parity audit

## Baseline and limitation

`02-route-inventory.md` verifies 332 active legacy routes across seven route families, but provides family totals rather than all 332 concrete path/handler rows. This document therefore audits every documented family and every current React route. Exact one-to-one route mapping remains `UNKNOWN` where the approved evidence does not name the concrete legacy handler. Functional consolidation is preferred over copying Django URLs.

## Legacy route-family parity

| Legacy route family | Legacy purpose/count | React route(s) | React page/component | Status | Missing behavior | Permission/backend requirement | Notes |
|---|---|---|---|---|---|---|---|
| `/user/` | 13 account/password/company-context routes | `/login` | `LoginPage` placeholder | MISSING | Login, reset/change password, provisioning, company selection | Identity, session/token, tenant and authorization contracts | No protected-route guard exists |
| `/admin/` | 23 assets/petty-cash routes | None; nav points to `/admin/assets`, `/asset/request/list`, expense paths | None | MISSING | Inventory, requests, return/repair, petty/expense workflows | Admin/accounts roles and backend actions | React navigation is not router-backed |
| `/` HR | 141 core HR routes | `/hr/companies`, `/hr/companies/:id`, employee routes, `/attendance`, stubs `/dashboard`, `/leave` | Company, Employee, Attendance; stubs | PARTIAL | Shift, tenancy, leave, resignation, approvals, appraisal, announcements, many employee actions | Company scope, permissions, real APIs | Multiple legacy routes may consolidate into Company tabs and Employee wizard |
| `/payroll/` | 30 payroll/tax/Form16 routes | `/payroll` stub; nav-only payroll/tax/Form16 paths | Stub only | MISSING | Salary config/run/register/payslip/tax/Form16 | Backend calculation, files and payroll permissions | No operational route exists |
| `/recruitment/` | 26 candidate/interview/document/letter/conversion routes | `/recruitment/jobs`, candidates list/new/detail/edit, pipeline, interviews, offers | Recruitment pages | PARTIAL | Candidate documents, letters, exact statuses, emails; some schedule pages not routed | Recruitment permissions and real APIs | React adds Job/Offer concepts whose legacy mapping is undecided |
| `/report/` | 74 page/data/download routes | None; six nav-only report links | None | MISSING | 37 report pages, data handlers, filters, ZIP/PDF/XLS | Company scope, report permissions/export backend | No report route is registered |
| `/vendor/` | 25 vendor/visitor routes | None; nav-only vendor and gate scan paths | None | MISSING | Vendor/category/docs/performance and visitor/QR lifecycle | Vendor/gate roles, files, QR/email backend | No router-backed page |

## Current React router inventory

| React route | Current purpose | Functional state | Legacy family mapping | Status |
|---|---|---|---|---|
| `/login` | Login placeholder | Text only | `/user/` | MISSING |
| `/employees/list/` | Employee list | Implemented but source/type defects remain | HR Employee | PARTIAL |
| `/employees/list/new` | Employee create wizard | Broad mock-first form | HR Employee create | PARTIAL |
| `/employees/list/:id/edit` | Employee edit | Broad form | HR Employee edit/profile | PARTIAL |
| `/recruitment/jobs` | Job CRUD | Mock-first | Recruitment position/job decision | UNKNOWN |
| `/recruitment/candidates` | Candidate list | Mock-first | Recruitment candidates | PARTIAL |
| `/recruitment/candidates/new` | Candidate create | Multi-step form | Recruitment candidate create | PARTIAL |
| `/recruitment/candidates/:id` | Candidate detail | Implemented | Recruitment candidate view | PARTIAL |
| `/recruitment/candidates/:id/edit` | Candidate edit | Implemented | Recruitment candidate update | PARTIAL |
| `/recruitment/pipeline` | Candidate pipeline | Status UI | Recruitment workflow | PARTIAL |
| `/recruitment/interviews` | Interview list/actions | Implemented; schedule detail routes are not active | Recruitment interview routes | PARTIAL |
| `/recruitment/offers` | Offer list/actions | Implemented | Legacy letters/offers mapping undecided | UNKNOWN |
| `/hr/companies` | Company list | Mock-first CRUD | HR Company list | PARTIAL |
| `/hr/companies/:id` | Company detail tabs | Nine approved tabs, no Shift | HR Company detail/master actions | PARTIAL |
| `/dashboard` | Dashboard | Stub | HR dashboards | MISSING |
| `/attendance` | Today Attendance | Partial clock/timer view | HR Attendance | PARTIAL |
| `/leave` | Leave | Stub | HR Leave | MISSING |
| `/payroll` | Payroll | Stub | Payroll | MISSING |
| `/settings` | Settings | Stub | Account/settings unknown | UNKNOWN |
| `*` | Fallback to Recruitment Jobs | Implemented navigation fallback | None | REFACTOR_REQUIRED |

## Navigation paths without router entries

The sidebar advertises Salary, Notifications, Company Policy, Appraisal, Tax, Form16, Assets, approval queues, HR Dashboard, Annual Leave, payroll screens, Announcements, Vendor, Visitor, Expense, Petty Cash and Reports. None of those paths has a matching router entry. These are `MISSING`, not implemented route parity. The `/policy` link is employee-facing and distinct from Company Policy administration under `/hr/companies/:id`.

## Route risks

- The protected router branch has no authentication or permission guard.
- Root redirects to Recruitment Jobs rather than a role-aware dashboard.
- Sidebar roles are local state and do not authorize routes.
- Placeholder routes can mask missing capability during manual navigation.
- Mixed trailing-slash conventions already exist in Employee routes.
- Exact mapping of all 332 legacy handlers needs the concrete legacy URL table or source extraction before route-level sign-off.

