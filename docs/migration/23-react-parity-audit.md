# React parity audit

## Scope and method

This audit compares the approved legacy evidence in `00-master-audit.md` through `21-react-implementation-roadmap.md` with the React source in `frontend/src`. Legacy documents are evidence, not implementation instructions. A React navigation label or placeholder is not treated as implemented behavior. Statuses are limited to `IMPLEMENTED`, `PARTIAL`, `MISSING`, `UNKNOWN`, `BLOCKED`, `DUPLICATE`, and `REFACTOR_REQUIRED`.

The current React repository contains six module directories: `auth`, `dashboard`, `company`, `employee`, `attendance`, and `recruitment`. Company is mock-first and comprehensive for its approved React scope, but its legacy parity is still partial. Shift is not represented.

## Module parity matrix

| Legacy domain | Legacy evidence/capability | Current React evidence | Status | Principal gap |
|---|---|---|---|---|
| Authentication | Login, password change/reset (`01`, `02`) | `/login`; `LoginPage.tsx` renders text only | MISSING | No session, credentials, reset, token lifecycle, or route protection |
| Company tenancy/selection | Active company selection and request scope (`01`, `07`, `09`) | No tenant store/provider/selector; Company admin route is not tenant context | MISSING | Identity-to-company scope and server enforcement |
| Dashboard | HR and employee summaries (`01`) | `/dashboard` stub; dashboard page is placeholder | MISSING | Metrics, role views, data and routes |
| Company | View/update Company (`03`, `04`) | List/detail, create/edit/delete, Overview, schemas/hooks/mock | PARTIAL | Legacy exact fields, payroll settings, tenant role, permissions, real API |
| Branch | CRUD, dates, address, coordinates (`03`, `04`, `09`) | Full mock CRUD with geofence fields | PARTIAL | Legacy date format mapping, uniqueness contract, employee-code integration, real API |
| Department | Company/branch-dependent CRUD (`03`, `09`) | Company-scoped CRUD | PARTIAL | Legacy branch dependency and backend uniqueness/lifecycle |
| Designation | Dependent master (`03`, `09`) | Company-scoped CRUD; nullable Department ID | PARTIAL | Required/cardinality decision and Employee/Recruitment integration |
| Shift | Company master/schedule (`01`, `10`, `13`, `14`, `19`) | No type, route, tab, service, hook, schema, or mock | MISSING | Entire legacy Shift master and assignment contract |
| Week Off | Schedule master (`01`, `13`) | Named 5x7 grid CRUD | PARTIAL | Legacy payload/effective assignment/history and consumer integration |
| Holiday List | Calendar master (`01`, `10`) | Company/year-scoped CRUD | PARTIAL | Legacy exact model/lifecycle and Employee assignment |
| Holiday | Holiday dates (`01`, `13`) | Holiday List-owned CRUD | PARTIAL | Backend date/timezone/duplicate rules and Attendance/Leave consumption |
| Employee | Create/edit/profile and system of record (`01`, `03`, `04`) | List/create/edit wizard, hooks/API/mock | PARTIAL | Profile breadth, type/build defects, statuses, tenant IDs, deletion, legacy actions |
| Employee Documents | Upload/get/update/delete/view/ZIP (`01`, `11`) | List/upload/delete hooks and mock object URLs | PARTIAL | Update/replace, view/download, ZIP, privacy/authorization, URL cleanup |
| Employee Account | Account creation/email/password regeneration (`01`, `12`, `19`) | No account workflow; form step is bank/PF data despite name | MISSING | Provisioning, credentials, password/email actions |
| Employee Team | Team/supervisor relationships (`01`, `13`) | `reporting_manager` free text only | MISSING | Team membership, supervisor IDs, team actions |
| Employee bank/work data | Bank, PF/ESIC, Company/work fields (`04`, `19`) | Form fields and schema exist | PARTIAL | Type inconsistencies, Company master IDs, branch-code behavior, backend contract |
| Employee Permissions | 65 legacy flags and employee permission form (`07`, `19`) | Small disconnected Zustand permission union; remote clock checkbox | MISSING | No parity matrix, guards, persistence, or server enforcement |
| Resignation | Apply/update/delete, supervisor/HR approval, F&F (`03`, `05`) | Navigation labels only | MISSING | Entire workflow and payroll coupling |
| Attendance | Clock/manual/calendar/bulk/geofence (`01`, `03`) | Today query, clock in/out, timer, location hook, history/calendar API methods | PARTIAL | Geofence unused, manual/bulk UI absent, precedence absent, build defects |
| Leave | Request/balance/team/HR approval (`01`, `03`, `05`) | `/leave` stub and navigation labels | MISSING | Entire domain |
| Regularization | Request and approvals (`05`, `12`) | API/hook input exists; no screen/queue/transition UI | PARTIAL | Request UI, approval roles, states, attendance correction |
| Payroll | Salary config/generation/payslip/registers (`01`, `03`, `09`) | `/payroll` stub and navigation labels | MISSING | Entire domain and calculations |
| Tax | Regime/declarations/proofs/approval (`01`, `03`, `05`) | Navigation labels only | MISSING | Entire domain, frozen regime, proof workflow |
| Form 16 | Upload/generate/publish/download (`05`, `11`) | Navigation labels only | MISSING | Entire workflow and private files |
| Recruitment Jobs | Legacy has no standalone Job model (`01`); positions drive recruitment | Job CRUD/list/mock | UNKNOWN | Product mapping from React Job to legacy position/designation is unapproved |
| Candidates | Candidate CRUD, uniqueness, status (`03`, `04`, `09`) | Multi-step create/edit/detail/list/pipeline | PARTIAL | Uniqueness checks, exact legacy status mapping, permissions, real contract |
| Candidate Documents | CRUD/private files/ZIP (`11`) | Resume URL field only | MISSING | Document entity, operations, ZIP, privacy |
| Interviews | Schedule/update/result and conditional online link (`03`, `04`) | List, schedule/response components/hooks/mock | PARTIAL | Route exposure, interviewer model, legacy status/date mapping, emails |
| Recruitment Letters | Offer/appointment/confirmation/relieving PDF/email (`03`, `11`, `12`) | Offer records only | MISSING | Document generation, appointment/confirmation/relieving, email |
| Candidate to Employee | Conversion with `IsEmployee` (`05`, `09`) | Offer/candidate query parameters prefill Employee; sets `hired` | PARTIAL | Atomicity, legacy status mapping, ID/master migration, backend transaction |
| Asset Types | Company master (`03`, `13`) | Company-scoped mock CRUD | PARTIAL | Assets consumer, legacy contract and permissions |
| Assets inventory | CRUD and active inventory (`03`, `04`) | Navigation labels only | MISSING | Entire domain |
| Asset Allocation | Allocate to employee (`03`, `13`) | No implementation | MISSING | Entire domain |
| Asset Request | Request/approve/reject (`05`, `06`) | Navigation label only | MISSING | Entire workflow |
| Asset Return/Repair | Return/repair/close (`05`, `09`) | No implementation | MISSING | Entire lifecycle |
| Company Policies | Admin CRUD/view (`01`, `11`) | Company tab supports upload/list/view/download/delete | PARTIAL | Update/replace, employee publication/access, permissions, real files |
| Announcements | HR announcements (`01`, `10`) | Navigation label only | MISSING | Entire domain |
| Notifications center | Employee notification list (`01`, `12`) | Navigation label; toast provider only | MISSING | Persistent notifications, read state, backend delivery |
| Appraisal | Cycles/questions/three-stage reviews/reports (`01`, `05`) | Navigation labels only | MISSING | Entire workflow |
| Vendors | Categories/vendor CRUD (`01`, `04`) | Navigation labels only | MISSING | Entire domain |
| Vendor Documents | CRUD (`11`) | No implementation | MISSING | Entire file domain |
| Vendor Performance | Scoring (`01`, `19`) | No implementation | MISSING | Entire domain and score rules |
| Visitors | Visitor lifecycle (`01`, `04`, `05`) | Navigation label only | MISSING | Entire domain |
| Visitor QR/check-in/out | QR expiry/manual/scan/logs (`05`, `09`, `11`) | No implementation | MISSING | Entire workflow/files |
| Petty Cash | Dual approval/payment (`03`, `05`, `09`) | Navigation label only | MISSING | Entire workflow |
| Expenses | Submit/approve/reject (`03`, `05`) | Navigation label only | MISSING | Entire workflow |
| Reports | 37 reports and 74 handlers (`10`) | Navigation labels for six reports; no routes/pages | MISSING | All datasets, filters, pages, scope |
| Exports/downloads | PDF/XLS/ZIP/private streams (`08`, `10`, `11`) | Policy Blob download only | PARTIAL | Report/payroll/document exports and async contracts |
| Email/notifications | Transactional email families (`12`) | Toast UI only | MISSING | Backend email events, templates, retry/deduplication |
| Scheduled/background workflows | Attendance/leave/resignation commands (`09`, `12`) | No representation | BLOCKED | Scheduler/backend ownership and observable status |
| Audit/event history | Visitor log plus partial timestamps; general audit unknown (`01`) | Entity timestamps only; no audit UI/service | UNKNOWN | Legacy completeness and backend event contract |
| Users/roles | User provisioning and roles (`01`, `07`) | Static sidebar role defaults to `hr` | MISSING | Authenticated identity, role source, user management |
| Payroll settings under Company | Legacy Company detail capability (`03`) | No Company payroll settings tab/model | MISSING | Exact settings and payroll ownership |
| Salary slip | PDF/email/self-service (`03`, `11`, `12`) | Navigation label only | MISSING | Generation, authorization, download/email |
| Attendance reports | Team/monthly/employee reporting (`10`) | Navigation labels only | MISSING | Routes, datasets, filters, exports |
| Employee code generation | Branch-driven/temp-sensitive (`09`, `19`) | Employee ID assigned from mock length; Branch series unused | REFACTOR_REQUIRED | Must be backend-owned and branch-aware |

## Feature/action parity highlights

| Capability family | Current support | Status |
|---|---|---|
| Company master create/edit/delete/search/pagination/error/retry | Implemented in mock mode through components → hooks → service | IMPLEMENTED |
| Company real transport | Every operation throws `Company backend endpoint TBD` | BLOCKED |
| Employee CRUD | Create/update/list/detail only; delete absent and source has compile defects | PARTIAL |
| Recruitment CRUD/pipeline | Jobs/candidates/interviews/offers mocks and mutations | PARTIAL |
| Approve/reject workflows | Candidate/offer status actions only; legacy authority queues absent | PARTIAL |
| Clock in/out | Coordinate payload, mock state and timer | PARTIAL |
| Upload/download | Employee upload/delete and Policy upload/view/download/delete | PARTIAL |
| Generate/publish/export/ZIP | No implementation except Policy Blob download | MISSING |

## Form-field parity summary

| Legacy form | React coverage | Status | Notable gaps/conflicts |
|---|---|---|---|
| Company/Branch | Company and Branch RHF/Zod forms | PARTIAL | Exact legacy Company fields/payroll settings; DD-MM-YYYY transport mapping; uniqueness backend rule |
| Employee | Broad personal/address/work/bank/PF/ESIC/emergency/document wizard | PARTIAL | Blood/status/team/role details; static string masters; schema/domain mismatches; account behavior |
| Candidate | Broad multi-step RHF/Zod form | PARTIAL | Server uniqueness, private documents, exact legacy choices/statuses |
| Interview | Candidate/round/mode/date/time/interviewer/response | PARTIAL | Conditional online link absent; legacy numeric statuses differ |
| Asset | None | MISSING | All fields and dependencies |
| Leave/regularization | Regularization input type/API only | MISSING | Forms, validation and approval UI |
| Salary/payroll | None | MISSING | All salary components and month lifecycle |
| Tax declaration | None | MISSING | All fields/proof/approval |
| Vendor/visitor | None | MISSING | All fields and lifecycle conditions |
| Petty cash/expense | None | MISSING | All fields and approval restrictions |
| Appraisal | None | MISSING | All cycle/question/review fields |

## Workflow parity

| Legacy workflow | React representation | Status |
|---|---|---|
| Attendance day | Clock-in/out mock with elapsed timer; no complete day/calendar precedence | PARTIAL |
| Regularization | Typed request/API mutation only | PARTIAL |
| Leave | None | MISSING |
| Resignation | None | MISSING |
| Recruitment | Candidate pipeline, interviews, offers, conversion prefill | PARTIAL |
| Asset request | None | MISSING |
| Petty cash | None | MISSING |
| Expense | None | MISSING |
| Tax declaration | None | MISSING |
| Form 16 | None | MISSING |
| Visitor | None | MISSING |
| Appraisal | None | MISSING |

## Critical interpretation notes

- React Jobs/Offers are not automatically legacy parity because the legacy audit explicitly found no standalone Jobs/Offers models.
- Candidate `current_company` and Employee bank `branch_name` are text, not foreign keys to Company/Branch masters.
- Navigation-only entries are classified as missing behavior, not implemented routes.
- Company mock behavior is implementation evidence, but it does not prove backend or permission parity.
- Exact parity for fields marked `UNVERIFIED` in the legacy audit remains `UNKNOWN`, not guessed.

