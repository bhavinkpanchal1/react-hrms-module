# React open decisions

All rows remain unresolved. Recommendations describe safe mock behavior, not final product/backend answers.

| ID | Decision | Why it matters / affected modules | Current React assumption | Safe mock behavior | Backend required | Product required | Status |
|---|---|---|---|---|---|---|---|
| DEC-001 | Identity/session contract | All routes, files, actions | Optional bearer token from localStorage | Fixed mock personas only | YES | YES | BLOCKED |
| DEC-002 | Company tenancy and selection | Every operational domain | No tenant context; Company admin IDs are numeric | Multiple isolated companies and explicit IDs | YES | YES | BLOCKED |
| DEC-003 | Role and permission matrix | Legacy 65 flags; all actions | Nine unused permission strings; three sidebar roles | Typed personas with denied actions | YES | YES | BLOCKED |
| DEC-004 | Company/nested ID types | Company masters and foreign keys | `number` | Keep centralized `CompanyEntityId` | YES | NO | BLOCKED |
| DEC-005 | Shift scope/model | Company, Employee, Attendance, Payroll | No Shift implementation | Do not invent Shift data | YES | YES | BLOCKED |
| DEC-006 | Department branch relationship | Company/Employee/Recruitment | Department is Company-scoped only | Preserve current scope; label provisional | YES | YES | BLOCKED |
| DEC-007 | Designation cardinality | Company/Employee/Recruitment | Nullable one-Department link | Exercise null and linked states | YES | YES | BLOCKED |
| DEC-008 | Employee master migration | Employee/Company/Recruitment | Display strings | Dual fixtures with stable IDs and labels, no mock imports | YES | YES | BLOCKED |
| DEC-009 | Employee code backend contract | Employee/history/Company | Product policy: Company prefix + Company-scoped unique non-reused sequence; dedicated audited HR correction | Deterministic demonstrative code only; backend allocation/concurrency blocked | YES | NO | BLOCKED |
| DEC-010 | Employee lifecycle backend contract | Employee/Attendance/Payroll/Assets | Product status/Create/transition/date/closure/list policy resolved | Preserve approved five statuses; backend commands/domain events blocked | YES | NO | BLOCKED |
| DEC-011 | Reporting manager/team model | Employee/approvals/appraisal | Free-text string | Stable Employee IDs only after contract | YES | YES | BLOCKED |
| DEC-012 | Attendance geofence authorization | Branch/Employee/Attendance | Hardcoded location helper, not used | Simulate authorized location response | YES | YES | BLOCKED |
| DEC-013 | Attendance precedence/timezone | Attendance/Leave/Payroll | No calculation | Display precomputed fixture results | YES | YES | BLOCKED |
| DEC-014 | Week Off assignment/effective dates | Employee/Attendance/Leave/Payroll | Named 5x7 Company policies | Company-owned grids without assignments | YES | YES | BLOCKED |
| DEC-015 | Holiday List assignment/timezone | Employee/Attendance/Leave/Payroll | Company/year list | Parent-owned dates only | YES | YES | BLOCKED |
| DEC-016 | Leave balance/calculation ownership | Leave/Attendance/Payroll | No module | Mock server-result fixtures, not production formulas | YES | YES | BLOCKED |
| DEC-017 | Resignation/F&F backend states | Employee/Payroll/Account | Product requires login disabled, restricted F&F-pending Account, approximate 30–45-day process and HR final closure | Exact backend states/transaction remain TBD | YES | NO | BLOCKED |
| DEC-018 | Payroll/statutory calculation | Payroll/Tax | No module | Demonstrative results clearly marked | YES | YES | BLOCKED |
| DEC-019 | Canonical statuses and aliases | All workflows | Domain-specific new strings | Retain raw + mapped display values | YES | YES | BLOCKED |
| DEC-020 | Recruitment Job/Offer mapping | Recruitment/Employee | Standalone React models | Do not claim legacy equivalence | YES | YES | BLOCKED |
| DEC-021 | Candidate uniqueness | Recruitment | Client validation only | Deterministic conflict errors | YES | YES | BLOCKED |
| DEC-022 | Atomic Candidate conversion | Recruitment/Employee | Sequential create then status mutation | Simulate rollback/failure states | YES | YES | BLOCKED |
| DEC-023 | Private file contract | Employee/Candidate/Vendor/Tax/Form16/Policy | Mixed object/fake paths and multipart | Blob metadata/object URLs with cleanup | YES | YES | BLOCKED |
| DEC-024 | Policy publication/access | Company Policy/Employee | Admin-only Company tab; `/policy` unresolved | No employee feed until approved | YES | YES | BLOCKED |
| DEC-025 | Asset lifecycle/statuses | Assets/Employee | Asset Type only | Explicit invalid transitions when implemented | YES | YES | BLOCKED |
| DEC-026 | Petty Cash/Expense authority | Admin/Accounts | No module | Typed approval personas and state machine | YES | YES | BLOCKED |
| DEC-027 | Visitor QR and expiry | Visitors/files/email | No module | Deterministic tokens/clock in tests | YES | YES | BLOCKED |
| DEC-028 | Notification delivery | All workflows | Toast only | In-app fixture events; no fake delivery claims | YES | YES | BLOCKED |
| DEC-029 | Scheduled jobs visibility | Attendance/Leave/Resignation | No module | Fixture job history/status only | YES | YES | BLOCKED |
| DEC-030 | Report/export execution | 37 reports/files | No routes | Static preview fixtures; Blob export where safe | YES | YES | BLOCKED |
| DEC-031 | API envelope/filter grammar | All services | Arrays, DRF results and custom pages coexist | Domain ports normalize fixture results | YES | NO | BLOCKED |
| DEC-032 | Error/validation contract | All forms/actions | Single Error message mapping | Typed field/global conflict fixtures | YES | NO | BLOCKED |
| DEC-033 | Optimistic concurrency/audit metadata | Mutable domains | None beyond timestamps | Reject stale mock version only if contract approved | YES | YES | BLOCKED |
| DEC-034 | Data migration/history retention | All legacy records/files | No migration layer | Preserve source IDs/status snapshots in fixtures | YES | YES | BLOCKED |
| DEC-035 | Accessibility/browser targets | Shared UI/all modules | Responsive/dark classes, no test matrix | Keyboard-first checks in each phase | NO | YES | BLOCKED |
| DEC-036 | Synchronous vs queued exports | Reports/payroll/documents | No implementation | Small Blob fixtures only | YES | YES | BLOCKED |
| DEC-037 | Shared primitive ownership | `shared/ui`, `components/ui`, future modules | `shared/ui` is canonical for established HRMS primitives; three Base UI wrappers remain in `components/ui` | Do not add a duplicate responsibility; migrate only with proven consumers and regression coverage | NO | NO | OPEN |
| DEC-038 | Automated frontend test stack | Shared UI, auth and all domains | No unit, component or browser test runner is configured | Continue executable service/build/static smoke checks without claiming browser coverage | NO | YES | BLOCKED |

## Prohibited automatic resolutions

- Do not invent endpoint URLs, permission codes, payroll/leave formulas, storage providers or workflow transitions.
- Do not normalize contradictory legacy statuses without a mapping decision.
- Do not infer employee-facing Policy access from the `/policy` navigation label.
- Do not treat React Jobs/Offers as confirmed legacy entities.
- Do not replace Company master IDs with Employee strings or vice versa without a data-migration contract.
