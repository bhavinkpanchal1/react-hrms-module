# Legacy → React traceability

`Legacy Evidence` references the approved migration documents. `—` means no React artifact was found after repository-wide search; it does not invent a future filename.

| Legacy Area | Legacy Capability | Legacy Evidence | React Route | React Page/Component | Hook | API Service | Mock | Permission | Validation | Workflow | Status | Missing/Gap | Backend Dependency |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Identity | Login | `01`, `02` | `/login` | `LoginPage` placeholder | — | — | No | None | None | None | MISSING | Entire authentication behavior | Identity/session |
| Identity | Password reset/change | `01`, `12` | — | — | — | — | No | None | None | None | MISSING | Entire capability | Identity/email |
| Tenancy | Select active Company | `01`, `07`, `09` | — | — | — | — | No | None | None | None | MISSING | Request/company context | Tenant contract |
| Company | List/create/search/filter/page | `03`, `04` | `/hr/companies` | `CompanyListPage`, `CompanyForm` | Company hooks | `companyApi` | Yes | None | Zod | CRUD | PARTIAL | Real API/permissions/legacy exact fields | Company endpoints |
| Company | View/update sections | `03`, `04` | `/hr/companies/:id` | `CompanyDetailPage`, `CompanyOverviewTab` | `useCompany/useUpdateCompany` | `companyApi` | Yes | None | Zod | CRUD | PARTIAL | Payroll settings and exact serializer | Company endpoint |
| Branch | CRUD and coordinates | `03`, `04`, `09` | Company detail tab | `BranchListTab/BranchForm` | Branch hooks | `companyApi` | Yes | None | Zod ranges | CRUD | PARTIAL | Uniqueness/date adapter/employee-code consumer | Branch endpoints/rules |
| Department | CRUD | `03`, `09` | Company detail tab | `DepartmentListTab/Form` | Department hooks | `companyApi` | Yes | None | Zod | CRUD/conflict | PARTIAL | Legacy Branch relation | Department contract |
| Designation | Dependent CRUD | `03`, `09`, `19` | Company detail tab | `DesignationListTab/Form` | Designation hooks | `companyApi` | Yes | None | Zod | CRUD/conflict | PARTIAL | Required relation/Employee consumer | Designation contract |
| Shift | Master/schedule | `01`, `10`, `13`, `19` | — | — | — | — | No | None | None | None | MISSING | Entire master | Shift contract |
| Week Off | Grid configuration | `01`, `13` | Company detail tab | `WeekOffListTab/Form` | Week Off hooks | `companyApi` | Yes | None | 35-cell Zod | CRUD | PARTIAL | Assignment/effective history | Schedule contract |
| Holiday List | Year calendar master | `01`, `10` | Company detail tab | `HolidayListTab/Form` | Holiday List hooks | `companyApi` | Yes | None | Zod | CRUD/conflict | PARTIAL | Assignment/lifecycle | Holiday endpoints |
| Holiday | Date CRUD | `01`, `13` | Company detail tab | `HolidayTab/Form` | Holiday hooks | `companyApi` | Yes | None | Zod | Nested CRUD | PARTIAL | Timezone/consumer calculations | Holiday contract |
| Employee | List/detail/create/edit | `01`, `03`, `04` | Employee routes | Employee pages/forms | Employee hooks | `employeeApi` | Yes | None | RHF/Zod | CRUD partial | PARTIAL | Compile defects, delete/profile/actions | Employee endpoints |
| Employee | Branch-driven code | `09`, `19` | Employee create | ID display only | Create hook | `employeeApi` | Length-based | None | None | Create | REFACTOR_REQUIRED | Branch series/temp rule absent | Backend generation |
| Employee | Company/Department/Designation | `04`, `13` | Employee forms | `EmployeeEmploymentStep` | — | Employee payload | Static strings | None | String schema | Create/edit | REFACTOR_REQUIRED | Must reference masters | FK/migration |
| Employee | Bank/PF/ESIC | `04`, `19` | Employee forms | Account Details step | Employee hooks | `employeeApi` | Yes | None | Zod | Create/edit | PARTIAL | Backend mapping/type mismatch | Employee contract |
| Employee | Team/supervisor | `01`, `13` | Employee forms | Free-text reporting manager | Employee hooks | `employeeApi` | String | None | Optional string | None | MISSING | Team/supervisor graph | Employee/team FK |
| Employee | Account/provision/password | `01`, `12`, `19` | — | — | — | — | No | None | None | None | MISSING | Entire workflow | Identity/email |
| Employee | 65 permission flags | `07`, `19` | — | Remote clock checkbox only | — | — | No | None | Boolean only | None | MISSING | Permission form/parity | Permission contract |
| Employee docs | Upload/list/delete | `01`, `11` | Employee wizard | `EmployeeDocumentStep` | Document hooks | `empDocumentApi` | Yes | None | Category/file form | CRUD partial | PARTIAL | Replace/view/download/privacy/cleanup | File contract |
| Employee docs | ZIP report download | `10`, `11`, `19` | — | — | — | — | No | None | None | Export | MISSING | ZIP/export state | Export/file service |
| Attendance | Clock in/out/geolocation | `03`, `09`, `19` | `/attendance` | Widget/Page | Attendance hooks | `attendanceApi` | Yes | None | Coordinate type | Partial day | PARTIAL | Authorization/geofence integration | Clock endpoint |
| Attendance | Geofence 100m | `09`, `19` | `/attendance` | Geofence helper only | — | — | Hardcoded | None | Distance helper | Not connected | REFACTOR_REQUIRED | Tenant/Branch assignment absent | Authorized locations |
| Attendance | Calendar/history | `03`, `09` | `/attendance` | Empty card; API only | Query hooks | `attendanceApi` | Minimal | None | Month/year args | None | PARTIAL | UI and precedence | Calendar endpoint/calculation |
| Attendance | Manual/bulk present | `03`, `19` | — | — | — | — | No | None | None | None | MISSING | Entire capability | Attendance actions |
| Regularization | Request | `05`, `12` | — | — | Mutation hook | `attendanceApi` | Minimal | None | Typed input | Request only | PARTIAL | UI/status/errors | Action endpoint |
| Regularization | Team/HR approval | `05`, `07` | Nav only | — | — | — | No | None | None | None | MISSING | Queues and authority | Approval endpoint |
| Leave | Apply/balance/approval | `03`, `05`, `09` | `/leave` stub/nav | Stub | — | — | No | None | None | None | MISSING | Entire domain | Calculation/workflow |
| Resignation | Apply → supervisor → HR → F&F | `05`, `09`, `19` | Nav only | — | — | — | No | None | None | None | MISSING | Entire staged workflow | Employee/payroll actions |
| Payroll | Salary config/month generation | `03`, `04`, `09` | `/payroll` stub/nav | Stub | — | — | No | None | None | None | MISSING | Entire domain | Backend calculation |
| Payroll | Payslip/register PDF/XLS | `10`, `11`, `19` | Nav only | — | — | — | No | None | None | None | MISSING | Files/exports/email | Payroll/export service |
| Tax | Regime/declarations/proof approval | `03`, `05`, `09` | Nav only | — | — | — | No | None | None | None | MISSING | Entire domain | Tax/files/workflow |
| Form16 | Part A/B/publish/download | `05`, `06`, `11` | Nav only | — | — | — | No | None | None | None | MISSING | Entire domain | Private files/generation |
| Candidate | CRUD and profile fields | `03`, `04`, `09` | Candidate routes | Candidate pages/forms | Candidate hooks | `recruitmentApi` | Yes | None | RHF/Zod | CRUD | PARTIAL | Uniqueness/legacy choices/permissions | Recruitment API |
| Candidate docs | CRUD/ZIP | `11` | — | Resume URL only | — | — | No | None | URL field | None | MISSING | Document entity and files | File service |
| Interview | Schedule/update/result | `03`, `04`, `05` | `/recruitment/interviews` | Interview forms/cards | Interview hooks | `recruitmentApi` | Yes | None | Zod | Partial transitions | PARTIAL | Conditional online link/status mapping/email | Recruitment API |
| Recruitment | Letters | `03`, `11`, `12`, `19` | Offers only | `OfferForm/Page` | Offer hooks | `recruitmentApi` | Offer rows | None | Zod | Offer status | MISSING | PDF/email and 4 letter families | File/email backend |
| Recruitment | Convert to Employee | `05`, `09`, `19` | Employee new with query params | `EmployeeCreatePage` | Cross-domain hooks | Two APIs | Yes | None | Employee schema | Sequential | PARTIAL | Atomicity/status/master IDs | Transactional action |
| Asset Type | CRUD | `03` | Company tab | `AssetTypeTab/Form` | Asset Type hooks | `companyApi` | Yes | None | Zod | CRUD | PARTIAL | Real endpoint/consumer | Asset Type endpoint |
| Assets | Inventory/allocation/request/return | `03`, `05`, `09` | Nav only | — | — | — | No | None | None | None | MISSING | Entire lifecycle | Assets backend |
| Policy | Admin upload/view/download/delete | `01`, `11` | Company tab | Policy components | Policy hooks | `companyApi` | Yes | None | RHF/Zod | CRUD partial | PARTIAL | Replace/authorization/real storage | File endpoint |
| Policy | Employee access | `01`, `20` | `/policy` nav only | — | — | — | No | None | None | None | MISSING | Publication/audience/access | Policy access API |
| Announcements | HR CRUD/list/report | `01`, `10` | Nav only | — | — | — | No | None | None | None | MISSING | Entire domain | Backend API |
| Notifications | Center/read behavior | `01`, `12` | Nav only | Toaster is transient feedback | — | — | No | None | None | None | MISSING | Persistent notification model | Notification API |
| Appraisal | Cycle/questions/three reviews/report | `01`, `05`, `10` | Nav only | — | — | — | No | None | None | None | MISSING | Entire workflow | Appraisal calculation/workflow |
| Vendors | Category/vendor CRUD | `01`, `04` | Nav only | — | — | — | No | None | None | None | MISSING | Entire domain | Vendor API |
| Vendor docs/performance | Files/scores/reports | `01`, `10`, `11` | — | — | — | — | No | None | None | None | MISSING | Entire domain | File/rating contract |
| Visitors | Visitor/QR/check-in/out | `04`, `05`, `09`, `11` | Nav only | — | — | — | No | None | None | None | MISSING | Entire lifecycle | QR/email/log backend |
| Petty Cash | Dual approval/payment | `03`, `05`, `06`, `09` | Nav only | — | — | — | No | None | None | None | MISSING | Entire workflow | Accounting action API |
| Expenses | Submit/approve/reject | `03`, `05`, `12` | Nav only | — | — | — | No | None | None | None | MISSING | Entire workflow | Approval/email API |
| Reports | 37 pages/filters/data | `10` | Nav only | — | — | — | No | None | None | None | MISSING | All reports | Reporting API |
| Exports | PDF/XLS/ZIP streams | `08`, `10`, `11` | Company Policy only | Policy Blob download | Policy hook | `companyApi` | Yes | None | Metadata | Download | PARTIAL | Operational exports | Export/file service |
| Email | Transactional messages | `12` | — | Toast only | — | — | No | None | None | None | MISSING | Delivery/events/templates | Email backend |
| Scheduler | Reminders/accrual/absence/auto-resign | `09`, `12`, `19` | — | — | — | — | No | None | None | None | BLOCKED | Backend scheduler and observability | Scheduler |
| Audit | Event/history | `01`, `20` | — | Timestamps only | — | — | No | None | None | None | UNKNOWN | Legacy general audit not verified | Audit event contract |

## Traceability gaps requiring source extraction

The approved route document aggregates 332 handlers and the form inventory aggregates legacy forms. Exact handler-by-handler and HTML-attribute parity cannot be completed from the summary documents alone. Before final migration sign-off, mechanically extract concrete legacy routes, choices and fields from the legacy repository and append stable evidence IDs to this matrix.

