# Employee Flow Specification

## Specification status

This defines only behavior safely supported by current evidence. Items dependent on unresolved decisions are explicit gates, not approved invented behavior.

## 1. Create flow

1. Authenticated authorized user opens Employee Create, directly or from an approved Recruitment handoff.
2. Active Company comes from Phase 1 session; the flow must not offer companies outside membership.
3. Steps remain Personal → Address → Employment → Account/Statutory → Emergency → Review unless legacy extraction/product approval changes them.
4. Next validates only the current step. Back preserves values. Direct forward jumps remain blocked; completed/backward steps may be revisited.
5. Employment options load through Employee-facing hooks/services backed by Company master APIs, not constants or mock imports.
6. Review displays labels resolved from IDs and highlights invalid sections without exposing masked sensitive values to unauthorized actors.
7. Final submit performs one Employee create operation. Candidate conversion, if approved, must be one atomic backend/application operation; the UI must not independently mark the candidate hired after a failed create.
8. Pending state disables duplicate submission. Global/field errors remain visible. Success navigates to the approved detail or list destination.
9. Documents, account provisioning and permissions are not silently performed unless their contracts and authority are approved.

Safe mock behavior: scoped deterministic records, IDs/labels through domain adapters, duplicate/conflict failures, loading/error/empty states and atomic conversion simulation. Backend gates: final DTO, code generation, uniqueness, tenant enforcement and transactions.

## 2. Edit flow

1. Load Employee by tenant-scoped ID; distinguish not found, forbidden and load failure once the error contract exists.
2. Preserve direct step navigation for an existing record if approved.
3. Form sections may support Save Section only if backend partial-update semantics and cross-field validation are approved. Otherwise use one Update All action.
4. Documents remain independently persisted; they are not included in Employee form payloads.
5. Permissions/remote-clock exceptions require approved action permissions and server validation.
6. Employee code and immutable provenance fields are read-only. Field editability by lifecycle state is blocked pending status rules.
7. Save pending state prevents duplicate operations; targeted list/detail invalidation follows success.

## 3. Detail flow

Required future structure, subject to product approval:

- Header: back navigation, Employee identity/code, mapped lifecycle status and permitted actions.
- Summary: Company/Branch/Department/Designation and reporting manager.
- Sections/tabs: Profile, Employment, Documents, Attendance, Leave, Payroll/Tax, Permissions/Account, History—only sections confirmed and authorized may render.
- Sensitive fields are masked/omitted according to backend-authorized capabilities.
- Related operational data uses its owning domain hook/service; Employee detail must not calculate Attendance, Leave or Payroll.

No exact tab set is approved because the legacy detail source is unavailable.

## 4. Review flow

- Review is the final Create step and final Edit summary.
- It displays normalized labels, not raw foreign keys.
- Edit links return to the correct section.
- Validation errors identify affected sections.
- Aadhaar, PAN, account number and salary visibility must follow the approved sensitive-field policy.
- Review does not perform mutations itself; the parent flow owns submission.

## 5. Documents flow

1. Fetch documents by tenant-authorized Employee ID.
2. Show Loading, Error/Retry, Empty and Success states.
3. Upload collects approved category, type, optional description and file; client checks complement server validation.
4. View/download requests an authorized short-lived access response rather than trusting stored public URLs.
5. Replacement/update is a distinct operation only if legacy/product rules require it.
6. Delete uses shared ConfirmationDialog, remains open on failure and closes after success.
7. ZIP export is implemented only after synchronous/queued export behavior is approved.
8. Object URLs created in mock mode are revoked on replacement, deletion and adapter reset.

## 6. Permission and account flow

- Employee page/action checks use Phase 1 `usePermission`/`PermissionGate`; no new codes are invented.
- Required capabilities include list, view, create, edit, lifecycle/delete, documents view/write/delete/export, attendance, salary/statutory/sensitive fields, account provisioning, permissions, import/export and bulk actions.
- Backend authorization is mandatory for every record, field and file.
- Remote clock is an attendance exception, not a general Employee permission flag.
- Identity account creation, email and password regeneration are separate server-owned actions with explicit outcomes; the Bank/PF step must not be called user-account provisioning.

## 7. Current versus future step behavior

| Behavior | Current React | Approved direction |
|---|---|---|
| Create order | 6 steps, linear | Preserve provisionally; confirm against legacy source. |
| Edit order | 8 steps, free navigation | Preserve provisionally; confirm permissions/account placement. |
| Documents on Create | Absent | Keep absent unless pre-create upload/token contract exists. |
| Documents on Edit | Independent step | Retain domain independence; replace storage contract. |
| Permissions on Create | Absent | Do not add without actor/code matrix. |
| Permissions on Edit | Remote clock only | Rename/reframe after attendance policy decision. |
| Save Section | Partial PATCH | Gate on backend cross-field/partial validation contract. |
| Update All | Full form PATCH | Retain only with authoritative DTO and sensitive-field permissions. |
| Same-address checkbox | Boolean only | Must copy/synchronize or be removed after product decision. |
| Recruitment onboarding | Sequential mutations | Replace with one atomic application/backend operation. |
