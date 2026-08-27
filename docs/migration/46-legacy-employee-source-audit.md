# Legacy Employee Source Audit and React Traceability

## 1. Audit status and boundaries

**Status: AUDIT COMPLETE. Implementation has not started.**

The authoritative legacy source was found at `D:\techoma\PeoplePulse2.0`. It was inspected read-only. The current React source was also inspected read-only. This document records observed behavior; it does not approve that behavior as a React requirement and does not resolve Product or Backend decisions.

The legacy application is a Django 5 server-rendered application. Employee functionality is primarily in the `hr` Django app, with identity in `account`, Company/assets in `administration`, Candidate conversion in `recruitment`, payroll in `payroll`, and exports in `report`. URLs are Django URL patterns, views are function-based Django views, persistence is through Django ORM models, pages are Django templates, and interactive tables/forms use template JavaScript and Grid.js.

## 2. Source inventory

Twenty-seven legacy files were directly inspected for this audit:

- Project/framework: `core/settings.py`, `core/urls.py`, `requirements.txt`, `package.json`, `webpack.mix.js`.
- Employee core: `apps/hr/models.py`, `apps/hr/urls.py`, `apps/hr/views.py`, `apps/hr/services.py`, `apps/hr/reports.py`, `apps/hr/utils.py`.
- Identity/permissions: `apps/account/models.py`, `apps/account/urls.py`, `apps/account/views.py`, `apps/account/decorators.py`, `apps/account/templatetags/hr_permissions.py`.
- Related domains: `apps/administration/models.py`, `apps/administration/urls.py`, `apps/payroll/models.py`, `apps/payroll/urls.py`, `apps/recruitment/models.py`, `apps/recruitment/urls.py`, `apps/recruitment/views.py`, `apps/report/urls.py`, `apps/report/views.py`.
- User interface: `templates/hr/employee/list.html`, `templates/hr/employee/create.html`, `templates/hr/employee/view.html`, `templates/hr/employee/profile.html`, and `templates/layout/sidebar.html`.

Important source references below are relative to `D:\techoma\PeoplePulse2.0`.

## 3. Legacy routes

Unless stated otherwise, these patterns are in `apps/hr/urls.py`. Most core Employee views have no view decorator or explicit permission check. Navigation is conditionally shown by `can_handle_employee` in `templates/layout/sidebar.html`, but hiding navigation is not endpoint authorization.

| Route | Purpose | View/source | Observed protection | Legacy evidence |
|---|---|---|---|---|
| `/`, `/dashboard/` | Employee dashboard | `employee_dash` | no route-local guard observed | LEGACY CONFIRMED |
| `/employees` | Company-scoped Employee list | `Employees` | Company queryset; no action guard | LEGACY CONFIRMED |
| `/employee/create` | Create form/submit | `employee_create` | Branch checked against `request.company` | LEGACY CONFIRMED |
| `/employee/get-next-emp-code/` | Preview generated code | `get_next_emp_code` | branch lookup; no company check in this view | LEGACY CONFIRMED |
| `/employees/details/<id>` | HR Employee detail/profile | `employee_details` | several related queries company-scoped; base Employee lookup is not | LEGACY CONFIRMED |
| `/employee/edit/<id>` | Edit personal/address data | `employee_edit` | no company/action guard observed | LEGACY CONFIRMED |
| `/employee/update_bank_account/<id>` | Bank section update | `update_bank_account` | Employee is company-scoped | LEGACY CONFIRMED |
| `/employee/update_work_info/<id>` | Work/statutory/status update | `update_work_info` | no company/action guard observed | LEGACY CONFIRMED |
| `/employee/update_team_info/<id>` | Reporting manager update | `update_team_info` | response team query company-scoped | LEGACY CONFIRMED |
| `/employee/delete/<id>` | Delete-named route | `employee_delete` | function only redirects; no deletion | NOT PRESENT |
| `/employee/document/get/<doc_id>/` | Document metadata | `get_document` | no owner/action guard observed | LEGACY CONFIRMED |
| `/employee/document/upload/` | Document upload | `upload_document` | no owner/action guard observed | LEGACY CONFIRMED |
| `/employee/document/update/<doc_id>/` | Replace/update document | `update_document` | no owner/action guard observed | LEGACY CONFIRMED |
| `/employee/document/delete/<doc_id>/` | Delete document | `delete_document` | no owner/action guard observed | LEGACY CONFIRMED |
| `/document/view/<id>` | Inline private-file response | `view_staff_document` | intended public/staff check is commented out | LEGACY CONFIRMED |
| `/employees/profile` | Signed-in Employee self profile | `employee_profile` | lookup by `request.user`; no decorator locally | LEGACY CONFIRMED |
| `/employee/team_resignation`, `/employee/resignation` | Team/HR resignation lists | resignation views | mixed; approval update views use `login_required` | LEGACY CONFIRMED |
| `/resignation/...` and `/employee/resignation/update/...` | Supervisor/HR approve/reject/update | resignation views | inconsistent route-local guarding | LEGACY CONFIRMED |
| `/employee/assets` | Own assigned assets | `employee_assets` | Employee relationship | LEGACY CONFIRMED |
| `/employee/salary` and salary/letter downloads | Salary and generated documents | multiple HR views | mixed | LEGACY CONFIRMED |
| `/user/employee/create-user/<id>` | Provision portal account later | `account.create_user` | no action guard observed | LEGACY CONFIRMED |
| `/user/staff/<id>/regenerate-password/` | Reset/email password | `account.regenerate_password` | POST required; no action guard observed | LEGACY CONFIRMED |
| `/recruitment/employee/create/<candidate_id>` | Candidate conversion | `recruitment.create_employee` | atomic; active Company Branch check | LEGACY CONFIRMED |
| `/report/hr/report/employee[/data]` | Employee report/data export source | report views | Company query scope; no route-local guard | LEGACY CONFIRMED |
| `/report/hr/report/documents[/data]` | Document report | report views | Company query scope | LEGACY CONFIRMED |
| `/report/hr/report/download_documents/<staff_id>` | All documents ZIP | `download_documents` | no company/action guard in function | LEGACY CONFIRMED |

No Employee CSV/Excel import, bulk create/update/deactivate/delete route, restore/reactivate route, or termination/rejoin route was found.

## 4. Employee field inventory

Required means enforced by the Django model or creation service, not merely visually marked in a template. All model fields inherit `created` and `modified` from `administration.TimeStampedModel`; no creator/updater identity or version field was found.

| Field/group | Type, default and requiredness | Create/edit behavior | Validation/evidence | Legacy evidence |
|---|---|---|---|---|
| `id` | implicit integer PK | generated; not editable | Django ORM | LEGACY CONFIRMED |
| `user` | optional one-to-one User, `SET_NULL` | provisioned separately | `hr/models.py:231`; `account/views.py:create_user` | LEGACY CONFIRMED |
| `supervisor` | optional self tree FK, `PROTECT` | omitted on create; editable in Work/Team | MPTT `parent_attr`; no explicit self/cycle/company validation in views | LEGACY CONFIRMED |
| `image` | optional image, `staff-images/` | profile use | model storage constraints only | LEGACY CONFIRMED |
| `first_name`, `middle_name`, `last_name` | strings, max 51, model blank allowed | create and personal edit | no service length/business validation beyond model declaration | LEGACY CONFIRMED |
| `name` | optional string max 50 | create/edit; described as Aadhaar name | no Aadhaar-name cross-check | LEGACY CONFIRMED |
| `sex` | `0/1/2`, default `0` Not Known | create/edit | choices: Not Known/Male/Female | LEGACY CONFIRMED |
| `phone_number` | string max 10, blank allowed | create/edit | no digit/prefix validation in model/service | LEGACY CONFIRMED |
| `email`, `office_email` | optional EmailFields | personal email create/edit; office email during account provisioning | User email is unique; Staff emails are not | LEGACY CONFIRMED |
| `birthday` | optional date | create/edit | create/edit parse `DD-MM-YYYY`; no age rule | LEGACY CONFIRMED |
| `married_status` | `0/1`, default Unmarried | create/edit | choices only | LEGACY CONFIRMED |
| `blood_group` | choice string max 4 | create/edit | declared default `Other` is not one of the declared choices | LEGACY CONFIRMED |
| social profiles | optional URL fields max 250 | edit personal section | Django URL validation if full validation is invoked | LEGACY CONFIRMED |
| emergency contact | optional name max 50, decimal 10 digits, relation choice | create/edit | relation default `Not Update` is not a declared choice | LEGACY CONFIRMED |
| `status` | char choice, default `0` | create and work edit | five values detailed below | LEGACY CONFIRMED |
| `emp_id` | optional string max 15; no DB uniqueness | generated on create; editable in work edit | application generation only | LEGACY CONFIRMED |
| Department/Designation | optional many-to-one, `PROTECT` | service requires IDs on create; editable later | create masters fetched by ID; Company consistency not explicitly checked in service | LEGACY CONFIRMED |
| Company Branch | optional many-to-one, `PROTECT` | required and Company-validated by direct create view | owning Company is indirect through Branch | LEGACY CONFIRMED |
| Role | optional many-to-one, `SET_NULL` | optional create/edit | global selector; no Company scope | LEGACY CONFIRMED |
| PAN/Aadhaar | PAN max 10 and Aadhaar max 12, model non-blank | supplied on create/edit | lengths only; no regex/uniqueness/masking | LEGACY CONFIRMED |
| PF | optional number max 25; joining/exit dates | create partly; edit all | dates parsed `DD-MM-YYYY`; no ordering rule | LEGACY CONFIRMED |
| UAN | optional max 15 | create/edit | no format/uniqueness rule | LEGACY CONFIRMED |
| ESIC | optional max 20; joining/exit dates | create partly; edit all | dates parsed; no ordering rule | LEGACY CONFIRMED |
| Holiday Master/Week Off | optional many-to-one, `PROTECT` | optional create/edit | create choices Company-scoped; no effective history | LEGACY CONFIRMED |
| `doc_status` | boolean false | no complete Employee workflow found | model only | LEGACY PARTIAL |
| `can_clock_in_remotely` | boolean false | create/edit | checkbox input | LEGACY CONFIRMED |
| `is_active` | boolean true | set false only when status becomes Resigned; otherwise true | also toggles linked User | LEGACY CONFIRMED |
| leave/sick allowances | positive integers 21/10 | not in main Employee create/edit UI evidence | consumed by leave calculation | LEGACY PARTIAL |
| `start_date`, `end_date` | optional dates | create/edit | `DD-MM-YYYY`; no cross-date validation | LEGACY CONFIRMED |
| permanent/correspondence address | generic related records; country/state/city required; postcode max 6 | both created; both editable | IDs must exist; no same-address semantic persisted | LEGACY CONFIRMED |
| bank account | generic related record; all fields optional | always created by service; section editable | lengths: IFSC 11, account 21, names/branch 100; no format rule | LEGACY CONFIRMED |
| documents | many StaffDocument records | detail/profile CRUD | taxonomy and validation below | LEGACY CONFIRMED |

`ShiftMaster` exists but `StaffProfile` has no Shift foreign key. Company is represented only through `company_branch.company`. No separate employment-type field, work-location/geofence field, annual salary field, termination date, archive flag, rejoin history, or effective-dated assignment history exists on StaffProfile.

## 5. Validation and code generation

- Direct create requires a Branch and verifies `branch.company == request.company` (`hr/views.py:employee_create`). The service additionally requires Branch, Department, Designation, both Country/State/City triples, and creates both addresses and one bank record inside `transaction.atomic()` (`hr/services.py:create_employee`).
- Birthday, start date, PF joining date, and ESIC joining date accept `DD-MM-YYYY`. Invalid format becomes a field-named ValueError; no age, future-date, joining/exit ordering, or cross-field rule was found.
- Employee code uses `TEMP` for status `4`; otherwise Branch `emp_id_series`. It scans Company-wide matching codes and returns `<series>-<max+1>` (`hr/views.py:generate_branch_emp_id`). There is no DB uniqueness constraint or lock around the scan, so concurrent duplicates remain possible.
- PAN, Aadhaar, phone, UAN, PF, ESIC, bank account, and IFSC have maximum lengths but no demonstrated regex, checksum, masking, or uniqueness validation in this flow.
- Master retrieval proves existence, but create does not consistently prove Department/Designation/Week Off/Holiday Master belong to the selected Company. Reporting manager edit does not demonstrate self-reference, cycle, or cross-company validation.

## 6. Lifecycle

StaffProfile states are `0 Probation`, `1 Regular`, `2 Notice Period`, `3 Resigned`, and `4 Temp`; default is Probation (`hr/models.py:StaffProfile.EMPLOYEE_STATUS`). Resignation requests separately use `1 Pending`, `2 Rejected`, `3 Approved`, `4 Full & Final` (`hr/models.py:ResignApplication`).

| Current state | Action | Next state | Actor evidenced | Source |
|---|---|---|---|---|
| any | edit status in Work section | selected StaffProfile status | detail-page actor; no action authorization proved | `hr/views.py:update_work_info` |
| any | select Resigned | Staff status `3`, Staff/User inactive | detail-page actor | `update_work_info` |
| Resigned | select any non-3 status | selected status, Staff/User active | detail-page actor | `update_work_info` |
| Employee/no request | submit resignation | Pending request | Employee/self route | `save_resignation`, `apply_resignation` |
| Pending | supervisor approval | approval marker; status handling varies by handler | signed-in supervisor-shaped user | resignation views |
| Pending/approved | HR update | Approved/Rejected/Full & Final as posted | signed-in HR-shaped user | `hr_update_resignation` |

Permanent Employee delete is **NOT PRESENT**: `employee_delete` only redirects. Termination, archive, restore, rejoin, lifecycle history, and transition-level concurrency are **NOT PRESENT**. Meaning/retention policy remains a Product decision even though labels are now known.

## 7. List, create, edit, and profile behavior

The legacy list is Company-scoped and ordered with resigned Employees last, then `emp_id`. It exposes employee code, photo, name, email, phone, status, Department, Designation, joining date, and Payroll status, with detail/edit/delete URLs. Grid.js supplies client search, sorting, and pagination through the template. No Company/Branch/Department/Designation/manager/date filter, column chooser, bulk selection/action, Employee import, or dedicated Employee list export was found. A separate Employee report accepts date range and status and returns broad field data.

Create is a single server-rendered multi-section form. One final POST creates Employee, both addresses, and bank data atomically, then returns JSON success/error. It does not create a User or upload documents. There is no draft behavior. Employee ID is generated from active Branch/status. The creation service defaults bank account holder from the Employee name if omitted.

Edit/detail is section-oriented rather than a single all-fields update. Personal/address, bank, work/statutory, and team data have separate POST handlers. This permits partial section success. No optimistic version/concurrency field or immutable audit event was found. Employee ID is editable in Work Info despite being generated on create.

The HR detail template and self-profile template combine personal/address, work/statutory, bank, documents, reporting manager/team, account/HR responsibilities, monthly salary/payroll, attendance/regularization, leave, assigned assets, and resignation data. The self profile resolves Employee by linked User; HR detail resolves by URL ID. Exact presentation is evidence, not an approved React tab design.

## 8. Relationships and downstream dependencies

| Relationship/dependency | Legacy contract | Source/effect |
|---|---|---|
| Company | indirect single Company via optional Branch | Branch is `PROTECT`; create requires Branch and checks active Company context |
| Branch | optional model FK but required by direct create | code series and tenant/report scoping |
| Department/Designation | optional `PROTECT` FKs; service requires on create | display, reports, payroll/detail context |
| Shift | master exists; no StaffProfile relationship | NOT PRESENT for Employee |
| Week Off/Holiday Master | optional `PROTECT` FKs, Company-filtered choices | attendance/calendar and leave calculations |
| Reporting manager | optional self TreeForeignKey, single parent, MPTT hierarchy | direct reports via `children`; Leave/regularization/resignation/appraisal approval context |
| User | optional one-to-one, `SET_NULL` | login, self-profile, active-state synchronization |
| Attendance | FK `employee`, `PROTECT` | identity, remote clock, week-off/holiday and regularization approver |
| Leave | FK `staff`; AnnualLeave unique by year/staff/type | identity, start date accrual, balance, supervisor/reviewer relationships |
| Payroll | Employee FK in Payroll/Monthly salary/tax/Form16 models | salary/status/statutory/report outputs |
| Assets | allocation/request relationships to StaffProfile | detail/self profile and lifecycle retention concern |
| Recruitment | Candidate converts to StaffProfile | mapped personal/address/document fields and Candidate status |

Assignments are not effective-dated and no assignment history is retained. Model deletion policies protect several masters but cascade documents, leave applications, resignation requests, and appraisal answers if StaffProfile were deleted through another code path.

## 9. Permissions and sensitive data

The actual `HRResponsibility` model has 13 flags, not the previously reported 65: `can_handle_company`, `can_handle_employee`, `can_handle_recruitment`, `can_handle_leave`, `can_handle_regularization`, `can_generate_salary`, `can_handle_salary_slip`, `can_manage_assets`, `can_manage_announcements`, `can_manage_vendors`, `can_manage_visitiors`, `can_manage_expense`, and `can_manage_salary_appraisal`. It also has a many-to-many Company scope. The Employee-facing permission is:

| Legacy permission | Employee capability | Where used | Source |
|---|---|---|---|
| `can_handle_employee` | show Employee and HR report navigation | sidebar conditions | `account/models.py`, `templates/layout/sidebar.html` |
| superuser | passes all template HR permission checks | template filter | `account/templatetags/hr_permissions.py:has_hr_perm` |
| team-leader derivation | show/enable team-leader behavior | MPTT child existence | `account/templatetags/hr_permissions.py:is_team_leader` |

The permission flag is not demonstrated as a guard on core Employee views. There are no distinct legacy flags for list, detail, create, edit, lifecycle, documents, salary, bank/statutory, identity fields, import, export, bulk, or account provisioning. Product/Backend must still approve and enforce the new capability model.

Legacy templates and report JSON expose full Aadhaar, PAN, DOB, addresses, phone/email, salary, bank/statutory values and document URLs where rendered. No masking, field-level authorization, serializer omission, or change audit was found. Some queries are Company-scoped, but several ID-based endpoints are not. These are security findings, not patterns approved for React.

## 10. Documents

`StaffDocument` categories are Resume, KYC, Educational, Employment, and OTHER. Records have Employee, name, description, category, private file, public flag, created, and modified. `PrivateFileField` allows PDF, MS Word, OpenDocument text, JPEG, and PNG, with a 10 MiB maximum (`hr/models.py:StaffDocument`). Multiple records are permitted and no uniqueness, verification, or expiry field exists.

Upload, metadata fetch, inline view, update/replace, and delete are implemented. Updating with a file replaces the model field; no version/history record is created. The Employee document report recognizes photo/Aadhaar/PAN by category/name heuristics. ZIP download groups files by category and streams synchronously in memory (`report/views.py:download_documents`). The `public` flag defaults false, but the view’s permission logic is commented out, and CRUD/ZIP functions demonstrate no Employee ownership or capability check.

## 11. Account, team, and Candidate conversion

Employee create does **not** create a login. A later action requires office email, rejects an already-linked User or duplicate User email, creates a User with fixed password `Test@123`, links it, stores office email, changes Employee status to Regular, activates the account, and sends credentials to the personal email (`account/views.py:create_user`). Password regeneration creates a random eight-character password and emails it. Email failure can occur after persistence because no transaction wraps the whole identity/email workflow; no invitation token or rollback is demonstrated.

The organization hierarchy is a single optional supervisor per Employee and multi-level MPTT descendants. The detail flow derives peers/direct reports. This hierarchy is consumed by Leave, attendance regularization, resignation, and appraisal approval concepts. Explicit Company-boundary, self-reference, and cycle validation is not shown in the update view.

Candidate conversion is `@transaction.atomic`. It requires an active Branch belonging to `request.company`, generates an Employee ID, copies first/last name, email, phone, gender, DOB, marital status, permanent address, and every Candidate document, then sets Candidate status to `IsEmployee` (`recruitment/views.py:create_employee`). It does not require an accepted Offer in this function, create a User, copy Department/Designation, or capture bank/statutory data. An exception rolls back database writes; returning early before writes is harmless. File-object reuse/storage rollback semantics remain LEGACY PARTIAL because database atomicity cannot prove external file rollback.

## 12. Import, export, bulk, and audit

| Capability | Finding | Evidence classification |
|---|---|---|
| Employee CSV/Excel import | no route/view/template behavior found | NOT PRESENT |
| bulk create/update/status/delete | no selection or handler found | NOT PRESENT |
| Employee report | date/status-filtered JSON backing a report table | LEGACY CONFIRMED |
| document report/ZIP | category/date report and per-Employee synchronous ZIP | LEGACY CONFIRMED |
| printable/generated letters | offer, appointment, relieving and confirmation letter download routes | LEGACY CONFIRMED |
| created/modified timestamps | inherited on Employee-related models | LEGACY CONFIRMED |
| created/updated actor | no field found | NOT PRESENT |
| field/status/document history | no event/version model found | NOT PRESENT |
| optimistic concurrency | no version/If-Match behavior found | NOT PRESENT |
| User login timestamps | `User.last_login` exists | LEGACY CONFIRMED |

## 13. Legacy-to-React parity

This comparison contains thirty capabilities: 3 MATCHED, 11 PARTIAL, 10 MISSING, 4 DIFFERENT, and 2 UNKNOWN.

| Capability | Legacy | Current React | Parity | Decision needed |
|---|---|---|---|---|
| List route/basic rows | list with broad columns | list/table exists | PARTIAL | Product/list contract |
| Create route | direct create form | create wizard | MATCHED | field survival still Product |
| Edit route | section updates | section-oriented edit | PARTIAL | save semantics/backend |
| HR detail/profile | combined detail | no detail route | MISSING | Product presentation |
| self profile | User-linked self view | none | MISSING | Product/security |
| personal fields | broad StaffProfile fields | broad schema | PARTIAL | exact field/edit policy |
| two addresses | two related addresses | two address groups | MATCHED | same-address UX |
| employment masters | ID FKs | mostly strings/static labels | DIFFERENT | Product/backend IDs |
| Shift assignment | absent | absent | MATCHED | Product may still require it |
| generated Employee code | Branch/TEMP series | optional/mock sequential | DIFFERENT | Backend/Product |
| five lifecycle statuses | model and work update | active boolean/type | MISSING | Product/backend mapping |
| resignation workflow | request/approvals/F&F | absent | MISSING | deferred Product module |
| permanent delete | no-op named handler | absent | UNKNOWN | Product retention decision |
| list search/sort/page | Grid.js client controls | absent | MISSING | Product/backend |
| list filters | no dedicated list filters | absent | UNKNOWN | Product |
| Employee report/export | date/status report | absent | MISSING | Product/security |
| bulk/import | not present | absent | DIFFERENT | absence is evidence, not prohibition |
| bank/statutory | stored/editable | form fields | PARTIAL | security/backend |
| annual salary | Payroll-linked, not Staff field | Employee form field | DIFFERENT | Product/domain ownership |
| documents list/upload/view/delete | implemented | implemented partially/mock-first | PARTIAL | private backend contract |
| document replace | implemented | absent | MISSING | Product |
| document ZIP | implemented | absent | MISSING | Product/backend |
| document category set/10 MiB | five categories/10 MiB | five categories/10 MiB, more types | PARTIAL | taxonomy/MIME approval |
| private-file authorization | field private, handlers weak | public/mock URL assumptions | PARTIAL | Security/backend |
| account provisioning | separate create/email action | absent | MISSING | Product/identity |
| password regeneration | random password/email | absent | MISSING | Product/identity/security |
| supervisor hierarchy | Staff FK/MPTT | free-text manager | PARTIAL | Product/backend |
| Candidate conversion | atomic DB transaction | sequential mutations | PARTIAL | Product/backend |
| Attendance/Leave/Payroll profile data | combined profile consumers | separate/absent integrations | PARTIAL | later modules |
| permissions | one broad Employee navigation flag | provisional view/write navigation | PARTIAL | Product/backend |

## 14. Legacy evidence classifications

Across the thirty audited capabilities above and their supporting sections, legacy evidence is: **24 LEGACY CONFIRMED, 2 LEGACY PARTIAL, 0 LEGACY UNKNOWN, and 4 NOT PRESENT**. `LEGACY PARTIAL` applies to external-file rollback during Candidate conversion and the unused/incomplete `doc_status` concept. `NOT PRESENT` applies to functional Employee deletion, Employee import, bulk mutations, and change/version history. Product and Backend unknowns remain separately unresolved.

## 15. Decisions resolved and decisions still open

Legacy source availability resolves EMP-001 and questionnaire LEG-01. Evidence in this document resolves legacy-only questions LEG-02 through LEG-11 as evidence questions. It also replaces the false “65 unnamed HR flags” premise with the 13 actual `HRResponsibility` fields and their observed use.

Legacy evidence informs but does not resolve EMP-002 through EMP-018 where Product or Backend approval is required. In particular, field survival/editability, master cardinality/history, lifecycle semantics, retention, sensitive-data policy, granular capabilities, detail presentation, list requirements, account timing, reporting hierarchy rules, document policy, Candidate mapping/Offer preconditions, atomic API/file guarantees, and every authoritative React API contract remain open.

## 16. Evidence limitations

- Runtime behavior and production data were not modified or exercised; conclusions are static-source evidence.
- Middleware may provide authentication and `request.company`, but route-local authorization remains as described; no claim is made that deployment has no outer protection.
- Template JavaScript was inspected for controls, but browser behavior was not executed.
- Database atomicity does not prove storage/email transactionality.
- No source establishes that every legacy behavior should survive migration.

## 17. Conclusion

The legacy Employee implementation is now source-audited and traceable. Exact legacy parity is no longer blocked by source absence, but React implementation remains blocked by the Product and Backend gates already documented. No React, backend, router, shared UI, configuration, package, or test source was changed during this phase.
