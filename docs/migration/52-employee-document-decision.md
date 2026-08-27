# Employee Document Decision

## 1. Status

CORE-09 is **PARTIALLY RESOLVED**. Legacy model, categories/types, CRUD, inline view, ZIP, storage and validation are confirmed. Person-versus-employment category ownership, self/Manager access, retention/versioning, secure storage delivery and transfer behavior require Product/Backend decisions.

Authoritative source: `D:\techoma\PeoplePulse2.0`. Document management is a separate resource lifecycle and must not remain embedded Employee-core scalar data.

## 2. Legacy document model

`StaffDocument` is defined at `apps/hr/models.py:408-435` and inherits `TimeStampedModel`.

| Field | Legacy model | Required | Editable | Evidence | Target classification |
|---|---|---|---|---|---|
| ID | Implicit PK | System | No ordinary edit | Django model | Backend identifier |
| Staff/Employee | FK to `StaffProfile`, `CASCADE` | Yes | No update handler change | Model/upload | Resource owner; tenant enforcement required |
| Company | Not present | N/A | N/A | Model | Derived through owning employment only; backend decision |
| Category | 20-char choices, default `OTHER` | Model default; upload requires posted category | Yes | Model/upload/update | Product taxonomy required |
| Name/type label | `CharField(255)` | Model required; upload falls back to filename | Yes | Model/upload/update | Metadata |
| Description | Text, blank/default empty | Optional | Yes | Model/update | Metadata |
| File | `PrivateFileField` | Required by model flow | Replaceable | Model/update | Private file resource |
| Created/modified | Inherited timestamps | System | No | TimeStampedModel/report | Audit metadata |
| File path/URL | Storage-derived, not model scalar | Derived | Changes on replacement | `file.name`, `file.url` | Backend/storage metadata |
| MIME/size/original filename | Validated/derived from upload; not stored scalars | Derived | New upload replaces | PrivateFileField/UI | Response metadata decision |
| Status/expiry/uploaded-by/updated-by/version | Not present | N/A | N/A | Audited model | NOT PRESENT; Product decision if needed |

Deleting a StaffProfile cascades document database records. The legacy Employee delete route is a no-op, so ordinary resignation/closure does not trigger this cascade.

## 3. Categories and names

Persisted categories are exactly: `Resume`, `KYC`, `Educational`, `Employment`, `OTHER`.

Template name choices (`templates/hr/employee/view.html:3352-3356`; `profile.html:2264-2268`) are:

- Resume: Resume.
- KYC: Aadhar Card, PAN Card, Passport, Voter ID, Driving License, Photo, Chaque/Passbook, Bank Statement.
- Educational: 10th Marksheet, 12th Marksheet, Degree Certificate, Master Degree, Diploma Certificate, Other Certificate.
- Employment: Offer Letter, Experience Letter, Relieving Letter, Payslip.
- OTHER: Other, Declaration, Medical Certificate.

The model does not constrain `name` to those choices, so they are UI vocabulary rather than database-enforced types. All are optional as an Employee collection; no per-category requiredness is proved. HR visibility is demonstrated. Self profile loads every category without a category policy. Manager visibility, Company ownership and Person/employment classification are not demonstrated.

Recruitment uses a separate `CandidateDocument`; conversion copies Candidate documents into `StaffDocument` (`apps/recruitment/views.py`). Payroll-generated payslips are a separate Payroll concern despite “Payslip” appearing as an Employment document name.

## 4. Upload

Routes are verified in `apps/hr/urls.py:109-113`: get, upload, update and delete. Upload UI requires category, name and file; description is optional. Handler requires file, Staff ID and category, uses submitted name or original filename, and creates one record. No duplicate detection/replacement is applied.

`PrivateFileField` permits PDF, MS Word, ODT, JPEG and PNG and limits size to 10 MiB. The browser UI/JavaScript must not be treated as authoritative; model/storage validation is the stronger evidence. Handler returns generic JSON success, missing-field, invalid-request or framework validation/error behavior. No checksum, malware scan or filename normalization policy was found.

Files use `staff_documents/staff_<staff-id>/<filename>` (`apps/hr/models.py:179-180`). Settings use local `MEDIA_ROOT=<BASE_DIR>/media` and `MEDIA_URL=/media/` (`core/settings.py:160-161`); development URL configuration serves media. `PrivateFileField` signals intended private handling, but emitted `.url` values and direct media serving do not themselves establish secure authorization. No cloud backend is configured in the audited settings.

## 5. Replacement

`update_document` can replace the file and edit category/name/description. If a file is supplied, name becomes the submitted name or new filename; without a file, name/category/description can still change. The same database row is saved and `modified` changes. No version record, prior-file reference, replacement reason, concurrency check or uploaded/updated actor is stored. Whether the storage backend physically removes the prior blob is **UNKNOWN** from this handler; no recovery UI exists. Failure is not transactional across an external version history because no version history exists.

## 6. Delete

`delete_document` accepts POST, fetches by document ID and calls `doc.delete()`: hard database deletion, no soft-delete/audit/tombstone/restore behavior. It does not check HR permission, active Company, owning Staff, current user or category. Physical blob deletion is **UNKNOWN** because no explicit `file.delete()` or signal was demonstrated; Django database deletion alone does not prove filesystem deletion.

## 7. View and download

`/document/view/<id>` uses `FileResponse(document.file.open(), as_attachment=False, filename=basename(...))`, providing inline response when supported. Its permission example is commented out. `get_document` returns category/name/description plus `file_url`. Templates also open/download stored URLs. No consistent actor, Company, Staff-owner or category authorization is enforced. Content-Disposition for inline view is explicit; MIME behavior is storage/framework-derived. A media URL must not be considered an authorization mechanism.

## 8. ZIP

`apps/report/urls.py:27` and `apps/report/views.py:1028-1061` confirm per-Staff ZIP. It includes all StaffDocument files readable at request time, writes entries as `<category>/<stored-basename>`, and downloads as `<first><last>_documents.zip`. Missing collection returns 404; individual file-read errors are printed and skipped. Staff is fetched by raw ID and documents by Staff; no permission, Company or self-owner check exists.

Classification: **LEGACY CONFIRMED FUNCTIONALITY + SECURITY GAP**.

## 9. Actor access

- **HR:** legacy combined detail supports list/view/download/upload/replace/delete and report ZIP. Product approves all six management actions, but backend authorization remains mandatory.
- **Employee:** `employee_profile` resolves Staff from `request.user` and loads all Staff documents. The self template contains the same document vocabulary and scripts, but reliable action-level restrictions are not established. Self view/download/upload/replace/delete must be decided separately; legacy full context does not approve them.
- **Manager:** legacy did not establish access; approved target denies Manager Employee-document access.

## 10. Tenant and ownership findings

| Operation | Legacy authorization | Tenant check | Ownership check | Risk | Target requirement |
|---|---|---|---|---|---|
| List on HR detail | None granular | Detail Employee fetched by raw ID | Staff relation only after fetch | Cross-tenant disclosure | Authorize Company + Employee |
| Self list | Current User→Staff | Downstream Company filters inconsistent | Strong self lookup | Over-broad fields/actions | Self projection/category policy |
| View | Commented example only | Missing | Missing | IDOR/file disclosure | Actor + tenant + document owner |
| Download URL | URL possession | Missing | Missing | Direct file disclosure | Short-lived authorized delivery |
| Upload | Missing | Missing | Raw Staff ID | Cross-tenant upload | HR/self category capability + tenant |
| Replace | Missing | Missing | Raw document ID | Cross-tenant overwrite | Resource ownership + concurrency/audit |
| Delete | Missing | Missing | Raw document ID | Irrecoverable cross-tenant deletion | Authorization + retention/audit |
| ZIP | Missing | Missing | Raw Staff ID | Bulk exfiltration | Strong export capability + audit |

## 11. Transfer and resignation

Legacy has no transfer workflow and `StaffDocument` points to one StaffProfile, so it supplies no evidence for carry-forward. Category-level decision matrix:

| Category | Person-level | Employment-level | Company-level | Transfer behavior | Legacy evidence | Product decision |
|---|---|---|---|---|---|---|
| Resume | Plausible, not proved | Plausible snapshot | Not explicit | UNKNOWN; no automatic copy | One Staff FK | Required |
| KYC | Plausible Person identity | Bank items may be payment/employment context | Not explicit | UNKNOWN; reference/copy policy needed | Mixed names under one category | Required |
| Educational | Plausible Person | Not proved | Not explicit | UNKNOWN | One Staff FK | Required |
| Employment | Some names clearly employment-related | Plausible/likely, not model-enforced | Company provenance plausible | Preserve old; new visibility/copy UNKNOWN | Label only | Required |
| OTHER | Cannot infer | Cannot infer | Cannot infer | UNKNOWN | Catch-all | Required |

Recommendation: a combination of Person-scoped and Employment-scoped protected documents using an explicit category/type ownership map; never infer ownership solely from current category labels. Preserve old-employment documents and do not automatically duplicate files during transfer.

Notice Period, Resigned, end date and User deactivation do not update/delete StaffDocument or add access restrictions. Documents remain linked and addressable. Historical retention is demonstrated by absence of lifecycle deletion, but who may access after resignation and for how long remains a Product/Legal/Backend decision.

## 12. Current React comparison

| Capability | Legacy | React | Gap | Classification |
|---|---|---|---|---|
| Separate resource | StaffDocument | EmployeeDocument API/hooks/query | Correct direction | MATCH |
| Categories | Same five labels/case differs | Five lower-case values | Mapping needed | PARTIAL |
| Types/names | 22 UI choices plus free model name | 22-value enum | Spelling/value mapping; legacy not enforced | PARTIAL |
| Metadata | ID/Staff/name/description/category/file/timestamps | Adds filename/URL/size/type/uploader | Backend shape unapproved | BACKEND REQUIRED |
| File validation | PDF/Word/ODT/JPEG/PNG, 10 MiB model | PDF/JPEG/PNG, 10 MiB client | Word/ODT mismatch; server enforcement unknown | INTENTIONALLY DIFFERENT / PRODUCT DECISION |
| List/view/download | Confirmed | Implemented by URL/open/link | Private authorization absent | BACKEND REQUIRED |
| Upload | Confirmed | Implemented, mock/backend branch | Permission/backend validation absent | PARTIAL |
| Replace | Confirmed | No React replace API/UI | Missing parity | MISSING |
| Delete | Confirmed hard DB delete | Implemented with `window.confirm` | Retention/authorization unresolved | PARTIAL |
| ZIP | Confirmed | Absent | Product/secure-export decision | PRODUCT DECISION |
| Versioning/expiry | Absent | Absent | Decide before adding | PRODUCT DECISION |
| Permissions | Weak/missing | No document capability gates | Security boundary missing | BACKEND REQUIRED |
| Mock object URL | N/A | `URL.createObjectURL` retained in mock | No revoke/cleanup lifecycle | MISSING |

The current React mock labels `uploaded_by` as Employee even though HR ownership is approved; this is mock evidence, not Product authorization. Documents also remain represented as optional fields in the Employee form schema despite their separate resource lifecycle.

## 13. Proposed document boundary

Use a **separate protected document resource**, never embedded Employee-core scalars. Product recommendation is a combination: Person-scoped documents for approved identity/qualification categories and Employment-scoped documents for approved Company/employment records. Payroll and Recruitment retain their own source resources/provenance. Backend representation remains open.

## 14. Product decisions

| ID | Question | Legacy evidence | Already decided | Unknown | Options | Recommended option | Impact |
|---|---|---|---|---|---|---|---|
| CORE-09-Q1 | Approve/modernize categories and names? | Five categories, 22 UI names, free model name | HR manages documents | Current purpose/vocabulary | Preserve; normalize; configurable taxonomy | **Recommendation:** preserve migration mapping, approve normalized controlled taxonomy | Migration/validation |
| CORE-09-Q2 | Which types are Person versus Employment documents? | One Staff FK; labels only | Person/employment split exists conceptually | Category/type ownership | All Person; all employment; explicit map | **Recommendation:** explicit type-level map | Transfer/tenant access |
| CORE-09-Q3 | What may Employees view/download? | Self profile loads all; no safe category policy | Own profile exists | Category and sensitive access | None; selected; all | **Recommendation:** selected allowlist; sensitive KYC default restricted/masked metadata | Self-service/privacy |
| CORE-09-Q4 | May Employees upload/replace/delete? | Self template scripts exist; authorization unclear | HR actions approved | Employee action scope | None; upload selected; manage own | **Recommendation:** upload selected types only; HR approves/manages replacement/deletion | Integrity |
| CORE-09-Q5 | Does Manager receive any document access? | None demonstrated | Manager access denied | Backend enforcement | None | **APPROVED:** none | Privacy |
| CORE-09-Q6 | Replacement overwrite or version? | Same row overwritten; no history | Replacement capability approved for HR | Version retention | Overwrite; version all; version selected | **Recommendation:** version replacements with actor/time | Audit/storage |
| CORE-09-Q7 | Delete policy? | Hard DB delete; blob deletion UNKNOWN | HR can delete | Soft-delete/retention/legal hold | Hard; soft; archive/retention | **Recommendation:** recoverable archive/soft delete subject to retention policy | Compliance/recovery |
| CORE-09-Q8 | Is ZIP retained and who may use it? | All documents, category folders, weak security | HR download approved | Bulk authorization/redaction | Remove; HR only; selected categories | **Recommendation:** explicit HR export capability, audited and tenant-scoped | Exfiltration risk |
| CORE-09-Q9 | Transfer behavior? | No workflow | Old employment/history preserved | Reference/copy by type | Keep old only; reference Person; copy | **Recommendation:** preserve old; reference Person docs; never auto-copy employment docs | History/storage |
| CORE-09-Q10 | Post-resignation retention/access? | No lifecycle change | History preserved | Duration/actors | Employment policy; legal retention; delete | **Recommendation:** retain per approved policy; revoke Employee access with account unless alternate access approved | Retention |
| CORE-09-Q11 | Add expiry/status/review metadata? | NOT PRESENT | Nothing | Operational need | None; selected types; all | **Recommendation:** add only for explicitly approved types/workflows | Avoid invented fields |
| CORE-09-Q12 | Preserve Word/ODT support? | Model accepts them | React accepts only PDF/images | Security/business need | Preserve; convert; drop | **Recommendation:** Product/Security decide; do not silently remove parity | Validation |

## Approved actor access reconciliation

- Authorized HR may view, download, upload, replace and delete Employee documents within Company scope.
- Employee may view and download only their own documents.
- Employee may not upload, replace, delete, ZIP/export or access another Employee's documents.
- Manager has no Employee document access.
- Director cross-Company Employee visibility does not grant document access.
- ZIP authorization remains a separate unresolved Security/Backend contract.

### Approved document lifecycle

- Categories are Resume, KYC, Educational, Employment and Other. All documents are employment-specific.
- HR may view/download/upload, edit metadata, replace file, archive, restore and perform the approved delete/archive workflow; ZIP is allowed only where separately authorized.
- Employee may view/download own active documents during active employment and Notice Period only. Employee cannot upload, replace, edit metadata, archive, restore, delete or ZIP.
- Manager has no access. Archived documents are never exposed to Employee.
- Category, Name and Description are independently editable metadata. File replacement is a separate versioned operation and document version history is retained.
- Allowed uploads: PDF, DOC, DOCX, ODT, JPG, JPEG and PNG, maximum 10 MB. Backend enforcement is mandatory.
- At Exit/End/Last Working Date, Employee document self-service ends; HR access/history remains through F&F and closure.

Storage/version schema, archive/delete semantics, private delivery, ZIP enforcement, audit and concurrency remain Backend/Security decisions.

## 15. Backend decisions

Define identifiers/DTO metadata; Company/Person/Employment ownership; actor/category/action authorization; private signed/streamed delivery; server-side MIME/content/size validation; safe filenames/storage keys; upload atomicity; replacement/version concurrency; recoverable deletion/retention; ZIP limits/redaction/audit; lifecycle/transfer linkage; access logging; malware scanning decision; storage cleanup; and consistent errors. No endpoint URL or storage redesign is approved.

## 16. Legacy anomalies

- “Private” field coexists with returned file URLs and development media serving.
- View permission logic is commented out.
- All mutation and ZIP handlers use raw IDs without consistent tenant/owner checks.
- UI type names are not model-enforced.
- Replacement has no versions and old-blob disposition is unknown.
- Database delete does not prove physical file deletion.
- KYC mixes identity, photo and banking artifacts.
- Payslip appears in Employee document vocabulary while Payroll also owns generated payslips.
- Self profile loads all categories without sensitive-document policy.
- Report ZIP skips unreadable files silently except server printing.
