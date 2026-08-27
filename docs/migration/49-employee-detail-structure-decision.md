# Employee Detail/Profile Structure Decision

## 1. Scope and status

CORE-06 is **PARTIALLY RESOLVED**. This is a documentation-only audit. Legacy proves a combined detail/edit surface and several linked-domain panels; it does not automatically make that exact tab set, its weak permissions, or its cross-domain mutations the React requirement.

Authoritative source: `D:\techoma\PeoplePulse2.0`. React evidence: `frontend/src/app/router/index.tsx` and `frontend/src/modules/employee`.

## 2. Legacy route inventory

| Capability | Route | Handler/file | Result |
|---|---|---|---|
| Detail | `/employees/details/<id>` | `apps/hr/urls.py:89`; `apps/hr/views.py:employee_details`; `templates/hr/employee/view.html` | One combined detail/edit page |
| Personal edit | `/employee/edit/<id>` | `apps/hr/urls.py:92`; `employee_edit` | Updates personal, identity, emergency, addresses and duplicate bank path |
| Bank edit | `/employee/update_bank_account/<id>` | `apps/hr/urls.py:101`; `update_bank_account` | Dedicated bank update |
| Work edit | `/employee/update_work_info/<id>` | `apps/hr/urls.py:102`; `update_work_info` | Organization, employment, statutory and remote-clock update |
| Team edit | `/employee/update_team_info/<id>` | `apps/hr/urls.py:103`; `update_team_info` | Supervisor/team update |
| Delete | `/employee/delete/<id>` | `apps/hr/urls.py:104`; `employee_delete` | Route exists; audited handler is effectively a no-op |
| Document CRUD | `/employee/document/...` | `apps/hr/urls.py:109-113`; document handlers | Get/upload/update/delete; template also downloads/ZIPs |
| Account | `/user/employee/create-user/<id>` and Staff account routes | `apps/account/urls.py`; `apps/account/views.py` | Create account, update office email, regenerate password |

No distinct legacy Employee-detail read route, transfer route, or previous-employment history route was found.

## 3. Legacy detail evidence and section inventory

| Legacy UI area | Legacy route/file | Fields/functions | User actions | Permission evidence | React equivalent | Status |
|---|---|---|---|---|---|---|
| Page shell/header | `templates/hr/employee/view.html:39-45` | “Employee Details” title | None | Route-level evidence only | No detail page | LEGACY PARTIAL |
| Personal tab | `view.html:56-65,139-623` | Image, personal/identity/contact/emergency/addresses/social | Enable and save section | No granular field guard proved | Personal/Address/Emergency edit steps | LEGACY CONFIRMED |
| Bank Account tab | `view.html:67-75,625-706` | Five bank fields | Enable/save | Dedicated handler Company-scopes Employee; duplicate path weaker | Account Details edit step | LEGACY CONFIRMED |
| Documents tab/modals | `view.html:77-84,708-812,2068-2135,3190-3360` | Categories, metadata, files | View/download/upload/replace/delete/ZIP | No complete action matrix proved | Document step on edit page | LEGACY CONFIRMED |
| Work tab | `view.html:86-93,815-1230` | Branch/code/dates/status/org/statutory/schedule/remote clock | Enable/save | No granular action guard proved | Employment/Permissions edit steps | LEGACY CONFIRMED |
| Team tab | `view.html:95-102,1238-1345` | Supervisor and report tables | Change supervisor/save | No Company/self/cycle enforcement proved | Reporting-manager scalar only | LEGACY CONFIRMED |
| Permission/Account tab | `view.html:104-110,1348-1530` | User email/state and HR responsibility flags | Create User, update email, reset password, save permissions | Broad flags displayed; endpoint enforcement is incomplete evidence | No account/permission workflow | LEGACY CONFIRMED |
| CTC Working tab | `view.html:112-118,1535-1780` | Payroll record/status and calculation form | Create/update/toggle Payroll | Payroll flags exist; exact enforcement must be audited separately | Salary scalar only | LEGACY CONFIRMED |
| Attendance tab | `view.html:120-127,1782-2059,2225-2530` | Daily records and filters | Add/edit attendance | Exact action authorization not proved | No detail attendance section | LEGACY CONFIRMED |
| Others tab | `view.html:129-136,1830-1995` | Resignation/leave/assets-related content | Resignation and linked actions | Mixed-domain permissions | None | LEGACY PARTIAL |
| Salary/attendance/leave data | `apps/hr/views.py:employee_details` | Queries Monthly_salary, Payroll, Attendance, Leave | Display/filter plus template actions | Company-filtered queries; not a complete permission contract | Separate modules exist | LEGACY CONFIRMED |
| Previous employments | Audited model/view/template | None | None | None | None | NOT PRESENT |
| General activity/audit timeline | Audited template | None | None | None | None | NOT PRESENT |

Legacy layout is a horizontally scrollable nine-tab bar above one card. The page is both view and edit surface; section fieldsets and JavaScript toggle edit/save states. Document and Attendance operations use modals. Account, Payroll, Attendance, Leave, resignation and asset concerns are embedded or linked despite belonging to other domains.

## 4. Legacy action inventory and target placement

| Action | Legacy evidence/location | Evidence-based executor | Recommended placement | Data affected | Status |
|---|---|---|---|---|---|
| Edit personal/address/emergency/identity | Personal tab → `employee_edit` | Route user; no granular guard proved | Profile section action | Person/protected identity | Required |
| Update bank | Bank tab → `update_bank_account` | Route user; partial Company scope | Bank section action/separate protected workflow | Payment subrecord | Required |
| Update work/org/statutory/status | Work tab → `update_work_info` | Route user; no granular guard proved | Split organization, lifecycle and statutory actions | Current employment/protected data | Required |
| Update supervisor/team | Team tab → `update_team_info` | Route user | Organization section action | Current assignment/team | Required |
| Document view/download | Documents tab | Route user | Document row action | Document | Required |
| Upload/replace/delete document | Document modal/actions | Route user | Document modal/row actions | Document resource | Required; HR-only per CORE-03 |
| Create account | Permission tab → Account route | Route user | Separate Account workflow | User/account | Optional |
| Update office email/reset password | Permission tab → Account routes | Route user | Separate Account actions | User/account | Optional |
| Save HR responsibility flags | Permission tab → Account action | Route user | Separate authorization administration | Account permissions | Separate module |
| Create/update Payroll | CTC tab → Payroll handlers | Permission evidence incomplete | Payroll module/deep link | Payroll | Separate module |
| Add/edit Attendance | Attendance tab/modal | Permission evidence incomplete | Attendance module/deep link | Attendance | Separate module |
| Resign/change lifecycle | Others/Work | Route user | Explicit lifecycle workflow | Employment/account effects | Product decision |
| Delete Employee | List action/route; handler no-op | UNKNOWN | Do not expose until retention decision | Employment | Deferred |
| Inter-company transfer | No legacy action | None | Explicit separate workflow if approved contract exists | Close old/create new employment | Product/Backend decision; not parity |

## 5. Editing model

Use a **combination**: read-first detail sections; section-based HR editing for ordinary Company-scoped Employee profile data; dedicated protected workflows for bank/statutory/documents; explicit organization/lifecycle/Company-change workflows; and separate account/domain workflows. Legacy’s independent handlers support non-atomic section boundaries, but do not prove React endpoint shapes or authorize its duplicate bank update path. A single large PATCH would incorrectly combine unrelated authorization, history and validation concerns.

## 6. Read-only, editable and sensitive matrix

| Section | Field/group | HR can edit | Employee can edit | Employee can view | Masked | Separate action |
|---|---|---|---|---|---|---|
| Profile | Names/contact/personal attributes/addresses/emergency | Yes | No approved edit | Yes | Sensitive subset format UNKNOWN | Section edit |
| Protected identity | Aadhaar name/number, PAN, DOB | Yes | No | Yes | Yes; exact format UNKNOWN | Protected section edit recommended |
| Employment | Code/dates/status | HR; code/lifecycle policy open | No | Yes | No | Lifecycle/code correction separate |
| Organization | Company/Branch/Department/Designation/Role/Manager | Yes | No | Yes | No | Assignment/transfer action |
| Bank | Five bank fields | Yes | No | Yes | Yes | Protected Bank action |
| Statutory | UAN/PF/ESIC | Yes | No | Yes | Yes | Protected Statutory action |
| Documents | Metadata/files | HR manages | No | UNKNOWN | Access rather than text mask | Document actions |
| Account | Office email/User state | Identity action | No approved edit | UNKNOWN | Credential values never shown | Account workflow |
| History | Previous employment/assignments | No ordinary edit | No | Product decision | Sensitive subrecords governed separately | Lifecycle correction only |
| Payroll/Attendance/Leave | Domain records | Not Employee edit | No | Domain policy | Domain policy | Separate module |

No reveal action or exact mask is approved. Aadhaar/PAN/bank/statutory values are sensitive; DOB, emergency phone, personal contact, documents and account data require explicit display policy. Hidden-versus-masked, export behavior and reveal/audit remain unresolved.

## 7. Proposed React detail structure

| Area | Classification | Rationale |
|---|---|---|
| Employee Profile | Required | Legacy Personal tab plus Person continuity |
| Employment | Required | Current employment lifecycle/code/dates |
| Organization | Required | Separates reference assignments from ordinary profile text |
| Bank | Required protected section/resource | Legacy dedicated tab/handler and CORE-04 boundary |
| Statutory | Required protected section/resource | Legacy Work content, but distinct sensitive boundary |
| Documents | Required protected resource | Legacy lifecycle and HR ownership |
| Account | Optional/separate workflow | Legacy area exists; account is not Employee profile |
| History | Product decision | Required conceptually for approved transfers, but legacy UI is absent |
| Payroll | Separate module with optional summary/deep link | Legacy embeds it, but Payroll owns data |
| Attendance | Separate module with optional summary/deep link | Legacy embeds daily management; Attendance owns data |
| Leave | Separate module with optional summary/deep link | Legacy view queries Leave; Leave owns data |
| Permissions | Separate authorization administration | Legacy tab exists but permissions are account/security data |
| Shift | Deferred | No legacy Staff assignment and CORE-05 defers it |

This is a structural proposal, not approval to implement every row as a visible tab. Product must choose navigation and whether domain summaries appear.

## 8. Employee header specification

Confirmed legacy page context supports Employee name within section headings and profile image in Personal. Employee code, Branch, Department, Designation, status and joining date are present in Work content, not proved as a legacy header. Proposed minimum header: name and Employee code; optional profile image. Company/Branch, Department/Designation, status and joining date may be compact read-only context only after Product approval. Do not invent statistics, badges, transfer buttons or quick actions. Header actions should expose only authorized workflows, with overflow on narrow screens.

## 9. Employment history treatment

Legacy has **no previous-employment history UI** and overwrites current Staff assignments. React history is therefore not legacy parity. CORE-03 nevertheless requires old employment and its Payroll/Attendance/Leave history to remain. A read-only Current Employment plus Previous Employments concept is recommended, with selection/drill-down to the preserved record; exact timeline/table/navigation is a Product decision. Historical correction requires an audited exceptional workflow, not ordinary edit.

## 10. React routing gaps

Current routes are `/employees/list/`, `/employees/list/new`, and `/employees/list/:id/edit` (`frontend/src/app/router/index.tsx:80-82`). React has list, create and edit, but no dedicated `/:id` detail route, self-profile route, history route, transfer route or account route. Documents are nested inside edit UI and use API resource paths, not a page route. Recommended route concepts—not implementations—are detail as the read-first destination, edit/section actions from detail, and explicit transfer/account workflows only after contracts. Existing path naming should be normalized by a separate routing decision.

## 11. Query and data boundaries

Retain `component → TanStack Query hook → Employee service → mock/backend`. Supported conceptual resources are Company-scoped Employee detail, current organization references, protected bank, protected statutory, documents and account summary. Payroll, Attendance and Leave remain their module resources; Employee detail may compose permission-controlled summaries or links rather than absorb their DTOs. Do not infer endpoints from these boundaries. Query keys include Employee ID and authorized Company context; mutations invalidate only affected detail/resource/list keys.

## 12. Responsive structure

Desktop may use a compact sidebar or tabs plus a single content column and contextual actions. Tablet should collapse navigation to a scroll-safe selector. Mobile should stack sections, use an accessible section selector/action menu, keep destructive/protected actions explicit, and avoid horizontal tables/overflow. The legacy scrolling nine-tab strip is evidence of section breadth, not a required responsive pattern. Reuse current shared cards, buttons, form controls, modals and confirmation dialog; no new design system is proposed.

## 13. Product decisions

| ID | Question | Legacy evidence | Already decided | Unknown | Options | Recommended option | Impact |
|---|---|---|---|---|---|---|---|
| CORE-06-Q1 | What is the primary detail navigation? | Nine horizontal tabs | Preserve functions, not exact UI | Tabs vs sidebar/sections | Tabs; sidebar; anchored sections; adaptive | **Recommendation:** adaptive section navigation | Responsive information architecture |
| CORE-06-Q2 | Which domain summaries appear in Employee detail? | Payroll, Attendance and Leave are queried/embedded | Domains remain separate | Summary depth and permission | None; links; summaries; embedded management | **Recommendation:** permission-controlled summaries/deep links; no embedded mutation | Coupling and data exposure |
| CORE-06-Q3 | How is employment history presented? | LEGACY NOT PRESENT | Old/new employment and history preservation approved | Table/timeline/detail switching | List; timeline; selector; separate page | **Recommendation:** read-only previous-employment list with drill-down | Transfer usability and historical truth |
| CORE-06-Q4 | What belongs in the header? | Name/image and work fields exist, but not all in header | No invented stats/actions | Context density and actions | Minimal; assignment-rich; configurable | **Recommendation:** name, code, optional image, concise current-employment context | Scanning and mobile layout |
| CORE-06-Q5 | Are sensitive fields masked, hidden or revealable? | Legacy shows full values | HR full; Employee masked | Exact masks, hide rules, reveal/export/audit | Mask only; hide; audited reveal | **Recommendation:** default mask; reveal only if Security/Product approves audited purpose | Privacy and backend enforcement |
| CORE-06-Q6 | Can Employees view documents/account details? | No reliable self-view authorization proved | HR manages documents; Account separate | Employee category visibility and account summary | None; selected; all permitted | **Recommendation:** explicit document-category and account-field allowlist | Access control |
| CORE-06-Q7 | Which actions are page-level? | Section saves and modal actions | HR edits; transfer is separate lifecycle | Action hierarchy | Global menu; section-only; hybrid | **Recommendation:** hybrid—section actions locally, lifecycle/transfer/account globally | Discoverability and safety |

## 14. Backend decisions

Backend must define detail aggregation versus resource calls; Person/current/previous employment identifiers; authorization per section/action; sensitive omission/masking/reveal audit; document access; account summary; lifecycle/transfer transaction; history DTO and ordering; module-summary contracts; mutation concurrency and errors. No endpoints or database relations are approved here.

## 15. Explicit legacy-versus-new distinctions

- Confirmed parity evidence: combined detail content for Personal, Bank, Documents, Work, Team, Account/permissions, Payroll and Attendance; separate section handlers; document/attendance modals.
- Proposed modernization: read-first detail, separated Profile/Employment/Organization/Statutory boundaries, protected workflows and responsive adaptive navigation.
- New Product requirement, not parity: previous-employment history UI and inter-company transfer action.
- Separate-domain recommendation: Payroll, Attendance, Leave and permission administration are linked/composed, not Employee-owned.
- Not authorized: copying legacy weak permission behavior, its no-op delete, direct overwrites, duplicate bank path, or exact nine-tab layout.
## Approved detail and history presentation

Employee Detail is the central overview and displays current values. It does not show a permanent history timeline. Fields with approved history may show a small history/change affordance opening a modal with current value, previous values, changed by, changed date/time and reason where applicable. Candidate fields include Company, Branch, Department, Designation, Reporting Manager, status, code and bank. User-facing Change History is distinct from the backend audit log; raw audit data is never exposed directly.

Recruitment-created Employees may show read-only Recruitment Source, Candidate ID and Offer ID. Directly created Employees omit that section. Detail may show lightweight summaries/deep links for Payroll/CTC, Attendance, Leave and Assets without duplicating owning-domain logic. Profile photo is display-only initially, with avatar/initials fallback.

Employee A and Employee B remain separate records. Any authorized Company-history presentation must not create a global Person identity.
