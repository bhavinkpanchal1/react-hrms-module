# Permission parity audit

## Current React architecture

`use-permission-store.ts` defines nine mock permission strings and initializes an Admin-like set. No component or router consumes the store. `nav-config.ts` defines only `hr`, `manager`, and `employee`; the sidebar defaults to `hr` and allows local role switching. There is no authenticated identity, company context, route guard, action guard, field guard, or backend permission response.

## Role parity

| Legacy actor | Legacy responsibilities | React representation | Status | Gap |
|---|---|---|---|---|
| Authenticated user | General/self-service access | No auth state; protected layout is publicly reachable | MISSING | Session/token and route protection |
| Company-scoped user | Tenant-filtered data | No tenant context | MISSING | Company claims/selection and server scoping |
| Employee | Own profile, clock, leave, resignation, assets, tax/Form16 | Sidebar role only; partial Attendance/Employee pages | PARTIAL | Ownership guards and most self-service features |
| Supervisor | Team approvals/appraisal | `manager` sidebar role only | MISSING | Team scope, approval guards |
| HR | Company/Employee/Recruitment/approvals | `hr` sidebar visibility only | MISSING | Granular flags, route/action enforcement |
| Admin | Assets, petty cash, provisioning | No `admin` React role | MISSING | Role and features |
| Accounts | Petty payment/payroll/tax | No React role | MISSING | Role and features |
| Gate operator | Visitor scan/check-in/out | No React role | MISSING | Role and feature |

## Legacy 65-flag parity

The approved audit confirms 65 boolean HR flags but does not enumerate every flag name. Exact flag-to-route parity is therefore `UNKNOWN`. The React union (`employee.view`, `employee.write`, `payroll.view`, `payroll.run`, `leave.approve`, `settings.manage`, `recruitment.read`, `dashboard.view`, `attendance.read`) is provisional and cannot be claimed equivalent.

## Guard audit

| Boundary | Current behavior | Status |
|---|---|---|
| Authentication | None | MISSING |
| Tenant/company | None | MISSING |
| Router | No auth/role/permission guard | MISSING |
| Navigation | Filters by local role | PARTIAL |
| Page/component | No permission checks found | MISSING |
| Action buttons | No permission checks found | MISSING |
| Field-level | No permission policy found | MISSING |
| API authorization | Bearer token attached if present; no identity lifecycle | PARTIAL |
| Backend enforcement | Unknown future backend | BLOCKED |
| Private file access | Employee URLs/Policy mock URLs; no permission layer | BLOCKED |

## Security findings

- Hiding navigation would not secure routes or API calls.
- Company management actions are visible without permission checks.
- Policy view/download/upload/delete will require distinct authorization.
- Employee documents use direct mock URLs and assume API authorization in real mode.
- Tokens are read from `localStorage`; token acquisition, refresh, logout and expiry handling do not exist.
- Company isolation in Company mock data is useful test behavior, not a security boundary.

## Decisions required

- Authoritative identity payload and role set.
- Which legacy flags survive and their canonical codes.
- Tenant and branch scope claims.
- Route/page/action/field permission matrix.
- Delegated supervisor and approval authority.
- Private file permissions and audit requirements.
- Backend denial/error contract.

