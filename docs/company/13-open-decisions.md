# Company Module — Open Decisions

## Purpose

This document converts the unresolved Company Module requirements into a decision checklist for the frontend and backend teams.

Recommendations below are architecture guidance only. They are not approved business rules or API contracts. Every item remains unresolved until its **Final decision** is updated from `TBD`.

## 1. Backend API Contract

### API-001 — Company ID Type

**Question:** What type is the Company primary key?

**Why it matters:** The ID type affects TypeScript models, route parsing, endpoint builders, query keys, form relationships, and mock data.

**Options:**
- number
- UUID
- string identifier using another backend-defined format

**Recommended:** Use the same primary-key type exposed by the existing Django APIs; do not convert it in the frontend.

**Backend confirmation required:** YES

**Final decision:** TBD

### API-002 — Nested Resource ID Types

**Question:** What ID type is used by Branch, Department, Designation, Week Off, Holiday List, Holiday, Asset Type, and Policy?

**Why it matters:** Every nested endpoint builder, relationship field, mutation input, and query key depends on these types.

**Options:**
- All resources use the Company ID type
- Resources use numeric IDs while Company uses another type
- Each resource has a backend-defined ID type

**Recommended:** Use a consistent backend ID strategy across Company resources where possible, while representing the API exactly in frontend types.

**Backend confirmation required:** YES

**Final decision:** TBD

### API-003 — Exact Endpoint URLs

**Question:** What are the exact list, detail, create, update, and delete URLs for every Company resource?

**Why it matters:** The documentation contains conceptual paths only and explicitly prohibits inventing endpoint URLs.

**Options:**
- Company-nested resource URLs
- Top-level resource URLs filtered by `company_id`
- A mixed structure defined by the Django router

**Recommended:** Publish the authoritative Django URL map and centralize those paths in `shared/constants/api-endpoints.ts`.

**Backend confirmation required:** YES

**Final decision:** TBD

### API-004 — List Response Envelope

**Question:** What response shape do Company list endpoints return?

**Why it matters:** The repository currently uses both raw arrays and DRF-style `{ results: [...] }` payloads, while its shared pagination type uses `result` singular.

**Options:**
- Raw array
- DRF paginated `{ count, next, previous, results }`
- Custom response envelope

**Recommended:** Standardize on the Django REST Framework paginated envelope for pageable lists and document any intentionally unpaginated endpoints.

**Backend confirmation required:** YES

**Final decision:** TBD

### API-005 — Detail and Mutation Response Shapes

**Question:** What do detail, create, update, and delete operations return?

**Why it matters:** Mutation hooks need accurate return types for navigation, cache updates, notifications, and error handling.

**Options:**
- Resource object for create/update and HTTP 204 for delete
- Generic `{ data, message, success }` envelope
- Backend-specific response per operation

**Recommended:** Return the created/updated resource and use HTTP 204 for successful deletion unless the existing backend convention requires otherwise.

**Backend confirmation required:** YES

**Final decision:** TBD

### API-006 — Update Method and Partial Payload Rules

**Question:** Are updates performed with `PATCH`, `PUT`, or resource-specific actions, and may omitted fields remain unchanged?

**Why it matters:** It determines schema design, mutation types, dirty-field submission, and whether section-level Overview saves are possible.

**Options:**
- `PATCH` with partial payloads
- `PUT` with complete payloads
- Separate endpoints per Company section

**Recommended:** Use `PATCH` for partial updates, consistent with existing Employee and Recruitment API patterns.

**Backend confirmation required:** YES

**Final decision:** TBD

### API-007 — Delete and Referential-Integrity Behavior

**Question:** Which resources can be deleted, and what happens when a resource is already referenced?

**Why it matters:** The UI must know when to show Delete, how to explain failures, and whether inactive/archived records replace hard deletion.

**Options:**
- Hard delete when unreferenced; reject when referenced
- Soft delete/archive
- No delete for selected resources

**Recommended:** Prefer status/archive behavior for referenced master data and return a clear backend validation error when deletion is prohibited.

**Backend confirmation required:** YES

**Final decision:** TBD

### API-008 — Error Response Contract

**Question:** What validation and non-validation error shape will the backend return?

**Why it matters:** The existing HTTP client understands `detail`, `message`, and simple field errors, but nested or structured errors may require additional mapping.

**Options:**
- DRF field-error object plus `detail`
- Standard `{ message, errors }` envelope
- Existing project-specific format

**Recommended:** Use one documented error structure across Company endpoints that preserves field-level errors.

**Backend confirmation required:** YES

**Final decision:** TBD

### API-009 — Company/Tenant Scoping

**Question:** How does the backend determine which Companies and nested records a user may access?

**Why it matters:** It affects endpoint parameters, cache isolation, navigation visibility, and security expectations.

**Options:**
- Scope entirely from the authenticated user/token
- Explicit Company ID in nested paths
- Tenant header plus Company ID

**Recommended:** Enforce scope on the backend from authenticated tenant membership, while retaining explicit Company IDs where resource selection requires them.

**Backend confirmation required:** YES

**Final decision:** TBD

### API-010 — Status and Timestamp Conventions

**Question:** Which common fields are returned for Company resources, such as `status`, `created_at`, `updated_at`, and audit-user fields?

**Why it matters:** Shared types, tables, badges, sorting, and audit displays must use exact backend names and nullability.

**Options:**
- Common fields on all resources
- Resource-specific fields
- No audit fields in frontend responses

**Recommended:** Define a consistent backend convention, but include fields in frontend domain types only when actually returned.

**Backend confirmation required:** YES

**Final decision:** TBD

## 2. Company Fields

### COM-001 — Minimum Create Payload

**Question:** Are `company_name`, `industry_type`, and `company_start_date` the complete minimum create payload, and what defaults are assigned by the backend?

**Why it matters:** Company creation must succeed before redirecting to the detail page.

**Options:**
- Exactly the three documented fields
- The three fields plus status
- A different backend-required minimum set

**Recommended:** Keep initial creation minimal and let users complete optional sections after redirect, provided the backend supports it.

**Backend confirmation required:** YES

**Final decision:** TBD

### COM-002 — Complete Company Field Map

**Question:** What are the exact field names, types, required rules, and nullability for all six Overview sections?

**Why it matters:** Company types, schemas, default values, form layout, and update payloads cannot be finalized without this map.

**Options:**
- One flat Company payload
- Nested objects by section
- Separate related resources or endpoints per section

**Recommended:** Match the backend serializer shape exactly and document each field by section.

**Backend confirmation required:** YES

**Final decision:** TBD

### COM-003 — Industry Source

**Question:** Is `industry_type` a backend enum, a managed master, or free text?

**Why it matters:** This determines whether the UI uses Select or Input and how Zod validates the value.

**Options:**
- Backend enum/choices
- API-provided master list
- Free text

**Recommended:** Use backend-defined choices or an API-provided master rather than duplicating industry constants in the frontend.

**Backend confirmation required:** YES

**Final decision:** TBD

### COM-004 — Company Status Values

**Question:** What statuses can a Company have, what is the default, and which transitions are allowed?

**Why it matters:** Status affects types, badges, form options, filtering, permissions, and whether nested configuration remains editable.

**Options:**
- Active/inactive
- Draft/active/inactive/archived
- Backend-defined workflow

**Recommended:** Use a backend enum and expose only permitted transitions.

**Backend confirmation required:** YES

**Final decision:** TBD

### COM-005 — Address Representation

**Question:** How are Registered Office and Corporate Office addresses represented, and can Corporate Office copy Registered Office?

**Why it matters:** It affects nested types, location cascading, checkbox behavior, validation, and serialization.

**Options:**
- Flat address fields with separate prefixes
- Nested address objects
- Separate address resources

**Recommended:** Prefer nested address objects in the API when supported, and provide an explicit same-as control without silently coupling stored records.

**Backend confirmation required:** YES

**Final decision:** TBD

### COM-006 — Country/State/City Data

**Question:** Are country, state, and city stored as IDs, codes, or text, and which service supplies cascading options?

**Why it matters:** The repository has static location constants and a shared location hook/service, but the Company contract is not defined.

**Options:**
- Backend location IDs and endpoints
- Standard codes
- Static frontend datasets
- Free text

**Recommended:** Reuse the existing shared location layer only if its values match the backend contract; otherwise use authoritative backend location endpoints.

**Backend confirmation required:** YES

**Final decision:** TBD

### COM-007 — Email/SMTP Configuration

**Question:** Which SMTP fields are supported, which are sensitive, and how are stored secrets represented on read/update?

**Why it matters:** Passwords must not be exposed or accidentally cleared, and the form may require specialized update behavior.

**Options:**
- SMTP configuration embedded in Company
- Separate secured endpoint/resource
- Email configuration excluded from the current scope

**Recommended:** Use a separate secured contract that never returns stored secrets and treats an omitted password as unchanged.

**Backend confirmation required:** YES

**Final decision:** TBD

### COM-008 — Bank Information Rules

**Question:** Which bank fields are stored, required, validated, masked, and visible by permission?

**Why it matters:** Bank information is sensitive and requires exact validation and access rules.

**Options:**
- Standard account name/number, bank, branch, and IFSC fields
- Expanded backend-defined banking model
- Bank information deferred from the first release

**Recommended:** Implement only backend-approved fields and mask sensitive values where the API and permission model require it.

**Backend confirmation required:** YES

**Final decision:** TBD

### COM-009 — Company Logo Contract

**Question:** How is a Company logo uploaded, returned, replaced, and removed?

**Why it matters:** `LogoUpload`, preview behavior, form encoding, validation, and cache invalidation depend on the storage contract.

**Options:**
- Multipart field on Company create/update
- Dedicated logo endpoint
- Pre-signed upload workflow
- Logo deferred

**Recommended:** Use a dedicated upload/removal contract if file lifecycle differs from normal Company field updates.

**Backend confirmation required:** YES

**Final decision:** TBD

### COM-010 — Company Name Uniqueness

**Question:** Must Company name be unique globally, per tenant, or not enforced?

**Why it matters:** It affects backend validation, duplicate-error messaging, and mock behavior.

**Options:**
- Globally unique
- Unique per tenant
- Duplicates allowed

**Recommended:** Enforce the business rule on the backend and surface its field error; do not duplicate asynchronous uniqueness logic unless required.

**Backend confirmation required:** YES

**Final decision:** TBD

## 3. Branch Fields and Geofence

### BRN-001 — Complete Branch Field Contract

**Question:** What are the exact Branch field names, types, required rules, defaults, and nullability?

**Why it matters:** The documentation lists concepts but not the definitive serializer contract.

**Options:**
- Flat Branch payload
- Nested contact/address/geofence objects
- Separate related resources

**Recommended:** Match the backend serializer and group fields in frontend UI without reshaping the transport contract unnecessarily.

**Backend confirmation required:** YES

**Final decision:** TBD

### BRN-002 — Branch Address and Pincode

**Question:** Is Branch address a single full-address string or structured fields, and is pincode required?

**Why it matters:** The tab specification says Full Address while validation separately requires pincode.

**Options:**
- Full address plus pincode
- Structured address fields
- Full address only

**Recommended:** Use structured fields if the backend needs location filtering; otherwise explicitly define full address and pincode as separate fields.

**Backend confirmation required:** YES

**Final decision:** TBD

### BRN-003 — Coordinate Contract

**Question:** Are latitude and longitude numbers or decimal strings, and what precision is retained?

**Why it matters:** HTML inputs, Zod coercion, payload serialization, map integration, and geofence accuracy depend on this.

**Options:**
- JSON numbers
- Decimal strings
- GeoJSON point

**Recommended:** Use the backend's precise representation and expose a typed adapter only if the map/geofence UI requires numeric values.

**Backend confirmation required:** YES

**Final decision:** TBD

### BRN-004 — Radius Unit and Limits

**Question:** Is the geofence radius always measured in meters, and what minimum/maximum limits apply?

**Why it matters:** Validation and Attendance distance comparisons must use the same unit and permitted range.

**Options:**
- Positive meters with backend-defined maximum
- Kilometers
- Configurable unit

**Recommended:** Standardize the API on positive integer meters, matching the existing Attendance concept, subject to backend confirmation.

**Backend confirmation required:** YES

**Final decision:** TBD

### BRN-005 — Branch as Attendance Work Location

**Question:** Does every Branch automatically become an Attendance work location, or is attendance/geofence enablement separate?

**Why it matters:** The documentation says Branch should eventually replace the hardcoded geofence but does not define eligibility or selection.

**Options:**
- Every active Branch is a work location
- Branch has an attendance-enabled flag
- Separate Work Location resource references Branch

**Recommended:** Use an explicit backend-defined relationship or enablement flag rather than assuming all branches permit clock-in.

**Backend confirmation required:** YES

**Final decision:** TBD

### BRN-006 — Multiple Branch Geofence Selection

**Question:** How does Attendance determine which Branch geofence applies to an Employee and whether any authorized Branch may be used?

**Why it matters:** Replacing the hardcoded location requires an assignment and authorization rule outside the Company module.

**Options:**
- Employee has one assigned Branch
- Employee has multiple allowed Branches
- Nearest active Branch is accepted
- Separate attendance assignment rules

**Recommended:** Use backend-authorized Employee-to-Branch assignments; do not make proximity alone an authorization decision in the frontend.

**Backend confirmation required:** YES

**Final decision:** TBD

### BRN-007 — Employee ID Series

**Question:** What is the format, validation, uniqueness scope, and generation behavior for Employee ID series?

**Why it matters:** A plain string field may be insufficient if it controls actual Employee identifiers.

**Options:**
- Prefix only
- Configurable pattern and next sequence
- Display-only label
- Managed by a separate backend resource

**Recommended:** Keep sequence generation and concurrency control on the backend and expose only approved configuration fields.

**Backend confirmation required:** YES

**Final decision:** TBD

### BRN-008 — Branch Status and Lifecycle

**Question:** What Branch statuses exist and what happens to assigned Employees or Attendance when a Branch becomes inactive?

**Why it matters:** The UI needs valid transitions and downstream systems need predictable behavior.

**Options:**
- Active/inactive
- Draft/active/inactive/archived
- Hard deletion only when unused

**Recommended:** Prefer an inactive/archive lifecycle for referenced Branches.

**Backend confirmation required:** YES

**Final decision:** TBD

## 4. Department

### DEP-001 — Department Contract

**Question:** Beyond ID, Company, and name, does Department have status, code, description, or audit fields?

**Why it matters:** `SimpleMasterList` inputs, columns, types, and API payloads must reflect the actual resource.

**Options:**
- Name-only master
- Name plus status
- Expanded backend-defined resource

**Recommended:** Keep the Phase 1/6 UI name-only only if the backend confirms that contract; do not hide required fields inside API defaults.

**Backend confirmation required:** YES

**Final decision:** TBD

### DEP-002 — Department Name Uniqueness

**Question:** Is Department name unique within a Company, and is comparison case-insensitive?

**Why it matters:** It affects backend constraints, duplicate messaging, mock parity, and edit behavior.

**Options:**
- Case-insensitive unique per Company
- Case-sensitive unique per Company
- Duplicates allowed

**Recommended:** Prefer case-insensitive uniqueness per Company for a master list, subject to business approval.

**Backend confirmation required:** YES

**Final decision:** TBD

### DEP-003 — Department Deactivation/Deletion

**Question:** What happens when a Department referenced by Employees, Designations, or Recruitment Jobs is removed?

**Why it matters:** Company configuration must not create dangling cross-module references.

**Options:**
- Reject deletion while referenced
- Soft deactivate and retain references
- Reassign dependencies before deletion

**Recommended:** Deactivate referenced Departments and let the backend prevent invalid hard deletion.

**Backend confirmation required:** YES

**Final decision:** TBD

## 5. Designation

### DES-001 — Department Relationship

**Question:** Must every Designation belong to a Department?

**Why it matters:** This is explicitly unresolved and changes the form, types, API payload, filters, and query dependencies.

**Options:**
- Department is required
- Department is optional
- Designation may belong to multiple Departments
- Designation is Company-wide with no Department relation

**Recommended:** Follow the approved backend/business model; if organizational reporting requires it, prefer one required Department per Designation for a simple initial contract.

**Backend confirmation required:** YES

**Final decision:** TBD

### DES-002 — Designation Contract

**Question:** Beyond ID, Company, name, and the possible Department relationship, does Designation have status, code, level, or description?

**Why it matters:** It determines whether `SimpleMasterList` is sufficient.

**Options:**
- Name-only master
- Name plus Department
- Expanded hierarchy/level resource

**Recommended:** Use `SimpleMasterList` only for the fields confirmed by the initial backend contract.

**Backend confirmation required:** YES

**Final decision:** TBD

### DES-003 — Designation Uniqueness

**Question:** Is Designation name unique per Company, per Department, or not unique?

**Why it matters:** The answer changes backend constraints and duplicate handling.

**Options:**
- Unique per Company
- Unique per Department
- Duplicates allowed

**Recommended:** If Department is required, prefer case-insensitive uniqueness within Department; otherwise prefer uniqueness within Company.

**Backend confirmation required:** YES

**Final decision:** TBD

### DES-004 — Designation Deactivation/Deletion

**Question:** What happens when a Designation referenced by Employees is removed?

**Why it matters:** Existing Employee records currently store designation strings and future records may store IDs.

**Options:**
- Reject deletion while referenced
- Soft deactivate
- Require reassignment before deletion

**Recommended:** Deactivate referenced Designations and exclude them from new assignments while preserving historical records.

**Backend confirmation required:** YES

**Final decision:** TBD

## 6. Week Off

### WOF-001 — One or Multiple Week Off Policies

**Question:** Does a Company have exactly one Week Off grid or multiple named policies?

**Why it matters:** The validation document mentions a policy name, while the data model does not define one; the answer changes list/detail APIs and UI structure.

**Options:**
- One grid per Company
- Multiple named policies per Company
- Policies scoped by Branch or Employee group

**Recommended:** Resolve the business scope before defining types; do not include `policy_name` unless the backend confirms multiple policies.

**Backend confirmation required:** YES

**Final decision:** TBD

### WOF-002 — Grid Payload Shape

**Question:** How is the 5×7 Week Off grid represented in requests and responses?

**Why it matters:** The grid editor, Zod schema, mock data, and update mutation require a stable transport format.

**Options:**
- Array of 35 cells with occurrence/day/state
- Nested row/day object
- Backend-defined compact schedule format

**Recommended:** Use an explicit array or nested object with backend enum values; avoid positional arrays whose meaning is implicit.

**Backend confirmation required:** YES

**Final decision:** TBD

### WOF-003 — Day and Occurrence Indexing

**Question:** How are weekdays and the first through fifth occurrence identified?

**Why it matters:** Different zero/one-based indexing and weekday ordering can silently corrupt schedules.

**Options:**
- Named weekdays plus occurrence 1–5
- ISO weekday numbers 1–7 plus occurrence 1–5
- Backend-specific indices

**Recommended:** Prefer explicit weekday names or documented ISO weekday numbers and occurrences 1–5.

**Backend confirmation required:** YES

**Final decision:** TBD

### WOF-004 — Supported State Values

**Question:** Are `working`, `half_day`, and `week_off` the exact persisted enum values?

**Why it matters:** Types, validation, display labels, Attendance calculations, and API serialization depend on exact values.

**Options:**
- Exactly the documented values
- Backend choices with different values
- Additional states

**Recommended:** Publish and reuse the backend enum without frontend-only aliases in transport types.

**Backend confirmation required:** YES

**Final decision:** TBD

### WOF-005 — Defaults, Effective Dates, and History

**Question:** What is the default grid, when does a change take effect, and are historical versions retained?

**Why it matters:** Immediate changes could alter past or in-progress Attendance and Leave calculations.

**Options:**
- One mutable current configuration
- Effective-dated versions
- Monthly/yearly schedules

**Recommended:** Prefer effective-dated backend configuration if Attendance/Leave calculations require historical accuracy.

**Backend confirmation required:** YES

**Final decision:** TBD

### WOF-006 — Assignment Scope and Overrides

**Question:** Is Week Off assigned at Company, Branch, Department, or Employee level, and are overrides supported?

**Why it matters:** The Company module may own the master while another module owns assignment.

**Options:**
- Company-wide only
- Branch-specific
- Master policies assigned elsewhere
- Hierarchical overrides

**Recommended:** Keep Company responsible for master configuration and place Employee-specific assignment outside Company, consistent with the documented scope boundary.

**Backend confirmation required:** YES

**Final decision:** TBD

## 7. Holiday List

### HLI-001 — Holiday List Contract

**Question:** Are `name`, `year`, and optional `remarks` the complete Holiday List fields?

**Why it matters:** Types, validation, list columns, create/edit UI, and mutation payloads depend on the exact contract.

**Options:**
- Exactly the documented fields
- Additional status/effective-scope fields
- Backend-defined expanded calendar model

**Recommended:** Start with the three documented fields only if the backend serializer confirms them.

**Backend confirmation required:** YES

**Final decision:** TBD

### HLI-002 — Year Representation and Range

**Question:** Is year an integer or string, and what valid range applies?

**Why it matters:** Zod validation, form control type, sorting, and query parameters must align.

**Options:**
- Four-digit integer
- Four-character string
- Full start/end dates

**Recommended:** Use a four-digit integer with a backend-approved range.

**Backend confirmation required:** YES

**Final decision:** TBD

### HLI-003 — Holiday List Uniqueness

**Question:** Can a Company have multiple Holiday Lists for the same year, and what fields define uniqueness?

**Why it matters:** It affects create validation, selectors, assignment, and mock behavior.

**Options:**
- One list per Company/year
- Multiple named lists per Company/year
- One globally reusable list per year

**Recommended:** Allow multiple named lists per Company/year only if different employee or branch calendars are a supported business requirement.

**Backend confirmation required:** YES

**Final decision:** TBD

### HLI-004 — Holiday List Lifecycle

**Question:** Can a Holiday List be edited or deleted after it is assigned or used by Attendance/Leave?

**Why it matters:** Calendar changes can affect historical calculations.

**Options:**
- Mutable and deletable
- Lock after assignment/use
- Archive/version instead of delete

**Recommended:** Prevent destructive changes once used and provide archive/version behavior if the backend supports it.

**Backend confirmation required:** YES

**Final decision:** TBD

## 8. Holiday

### HOL-001 — Holiday Endpoint Nesting

**Question:** Are Holidays nested under a Holiday List, under a Company, or exposed as top-level resources?

**Why it matters:** Endpoint constants, query keys, enabled guards, and mutation invalidation depend on the ownership hierarchy.

**Options:**
- `/holiday-lists/:id/holidays/`
- Company-nested holidays with Holiday List filter
- Top-level holidays with relationship IDs

**Recommended:** Nest Holiday operations under Holiday List because the documented dependency makes the list the owning calendar.

**Backend confirmation required:** YES

**Final decision:** TBD

### HOL-002 — Complete Holiday Fields

**Question:** Besides Holiday List and date, what fields exist, such as name, description, type, or optional status?

**Why it matters:** The documentation explicitly leaves these fields unresolved.

**Options:**
- Name and date
- Name, date, and description
- Backend-defined expanded fields

**Recommended:** Implement only backend-confirmed fields; a human-readable name is likely necessary for the list but remains unapproved.

**Backend confirmation required:** YES

**Final decision:** TBD

### HOL-003 — Date Serialization and Timezone

**Question:** Is a Holiday stored as an ISO calendar date without time, and which timezone determines the date?

**Why it matters:** DatePicker serialization must not shift a holiday across dates.

**Options:**
- ISO `YYYY-MM-DD` date
- Datetime with timezone
- Backend-specific format

**Recommended:** Use an ISO date-only value for a calendar holiday.

**Backend confirmation required:** YES

**Final decision:** TBD

### HOL-004 — Duplicate Date and Year Validation

**Question:** May a Holiday List contain multiple Holidays on one date, and must the date year equal the Holiday List year?

**Why it matters:** It defines both backend constraints and form error behavior.

**Options:**
- One Holiday per date and matching year required
- Multiple entries per date allowed
- Cross-year dates allowed

**Recommended:** Prefer one Holiday per date and require the date to match the selected list year, subject to business confirmation.

**Backend confirmation required:** YES

**Final decision:** TBD

### HOL-005 — Holiday Edit/Delete Rules

**Question:** Does the backend support edit, delete, or only add/remove, and what happens after Attendance/Leave has used a date?

**Why it matters:** The UI specification says Add and Remove but the API overview suggests CRUD as supported.

**Options:**
- Full CRUD
- Add and delete only
- Lock after use

**Recommended:** Expose only backend-supported actions and prevent changes that would invalidate historical calculations.

**Backend confirmation required:** YES

**Final decision:** TBD

## 9. Asset Type

### AST-001 — Asset Type Contract

**Question:** Beyond ID, Company, and name, does Asset Type have code, description, status, or other fields?

**Why it matters:** It determines whether the shared simple-master UI is sufficient.

**Options:**
- Name-only master
- Name plus status
- Expanded backend-defined fields

**Recommended:** Keep Asset Type as a minimal Company-owned master unless the backend contract requires more.

**Backend confirmation required:** YES

**Final decision:** TBD

### AST-002 — Asset Type Uniqueness

**Question:** Is Asset Type name case-insensitively unique per Company?

**Why it matters:** It affects validation, duplicate errors, and mock parity.

**Options:**
- Unique per Company
- Globally unique
- Duplicates allowed

**Recommended:** Prefer case-insensitive uniqueness per Company.

**Backend confirmation required:** YES

**Final decision:** TBD

### AST-003 — Asset Type Deletion

**Question:** What happens when an Asset Type is referenced by assigned or historical assets?

**Why it matters:** Company owns the master but Assets owns assignment, so deletion can break another module.

**Options:**
- Reject deletion while referenced
- Soft deactivate
- Require migration to another type

**Recommended:** Deactivate referenced Asset Types and let the backend enforce referential integrity.

**Backend confirmation required:** YES

**Final decision:** TBD

## 10. Policy/File Management

### POL-001 — Policy Metadata Contract

**Question:** What are the exact Policy metadata fields and required rules?

**Why it matters:** Policy types and validation cannot be copied from Employee documents because the business contract differs.

**Options:**
- Name, optional description, and file
- Name, required description, and file
- Expanded version/effective-date fields

**Recommended:** Define the smallest backend-supported metadata set and keep file metadata read-only in the frontend.

**Backend confirmation required:** YES

**Final decision:** TBD

### POL-002 — Upload Workflow

**Question:** How are Policy files uploaded?

**Why it matters:** It determines multipart handling, endpoint constants, progress behavior, and mutation inputs.

**Options:**
- Multipart create/update endpoint
- Dedicated file endpoint
- Pre-signed object-storage upload

**Recommended:** Use the backend's established file-storage pattern; if none exists, define a dedicated Policy upload contract before implementation.

**Backend confirmation required:** YES

**Final decision:** TBD

### POL-003 — File Limits

**Question:** Which MIME types/extensions and maximum file size are allowed?

**Why it matters:** The documentation prohibits inventing file validation; Employee's PDF/JPG/PNG and 10 MB limits cannot be assumed for Policy.

**Options:**
- PDF only
- Documents supported by backend policy
- Configurable server-provided limits

**Recommended:** Make backend validation authoritative and mirror the confirmed rules in Zod/UI for early feedback.

**Backend confirmation required:** YES

**Final decision:** TBD

### POL-004 — Returned File Metadata

**Question:** Which file metadata fields are returned: filename, size, MIME type, upload time, uploader, version, or checksum?

**Why it matters:** The Policy list must show only available metadata and must not fabricate values.

**Options:**
- Basic filename/size/type
- Full audit/version metadata
- Backend-specific subset

**Recommended:** Return stable metadata required by the documented list and actions.

**Backend confirmation required:** YES

**Final decision:** TBD

### POL-005 — View and Download Authorization

**Question:** How are view/download URLs produced and authorized?

**Why it matters:** The frontend must not fabricate file URLs or expose unprotected storage links.

**Options:**
- Authenticated API download endpoint
- Short-lived signed URL
- Protected media URL using session/token

**Recommended:** Use authenticated downloads or short-lived signed URLs generated by the backend.

**Backend confirmation required:** YES

**Final decision:** TBD

### POL-006 — Edit, Replace, and Versioning

**Question:** Can Policy metadata be edited, can its file be replaced, and are previous versions retained?

**Why it matters:** It determines available actions, mutation APIs, cache invalidation, and audit behavior.

**Options:**
- Metadata edit plus file replacement
- New version for every file change
- Immutable upload with delete/recreate

**Recommended:** Prefer explicit versioning when Policies are employee-facing compliance records, subject to business/backend approval.

**Backend confirmation required:** YES

**Final decision:** TBD

### POL-007 — Delete Semantics

**Question:** Does Delete remove the file only, archive the Policy, or permanently delete the complete Policy record?

**Why it matters:** The UI contains View/Download/Delete actions but the destructive scope is undefined.

**Options:**
- Delete Policy record and file
- Archive Policy and retain file/history
- Delete current file only

**Recommended:** Prefer archive for published or previously acknowledged Policies.

**Backend confirmation required:** YES

**Final decision:** TBD

### POL-008 — Employee-facing Policy Relationship

**Question:** Does the existing `/policy` navigation item display the same Company Policies, and how are Policies assigned or published?

**Why it matters:** Company owns management while Employee access may be a separate read-only experience.

**Options:**
- All active Company Policies are visible to all Employees
- Policies require audience/assignment rules
- Employee-facing Policy is a separate domain

**Recommended:** Keep management in Company and define a backend-controlled published/audience view for Employees.

**Backend confirmation required:** YES

**Final decision:** TBD

## 11. Permissions

### PER-001 — Approved Role Set

**Question:** What are the canonical roles, and does `Admin` need to be added to the current `hr | manager | employee` frontend role model?

**Why it matters:** The documentation requires Admin, HR, Manager, and Employee, while the current navigation model lacks Admin.

**Options:**
- Add Admin as a distinct role
- Treat HR as administrative access
- Replace fixed roles with backend permissions/roles

**Recommended:** Treat backend permissions as authoritative and avoid equating a navigation section named Admin with an actual security role.

**Backend confirmation required:** YES

**Final decision:** TBD

### PER-002 — Company Permission Matrix

**Question:** Which roles receive each documented Company action?

**Why it matters:** The frontend must not invent visibility for View, Create, Edit, Delete, or nested-resource management.

**Options:**
- Approve a role/action matrix
- Backend returns explicit permission codes
- Hybrid role defaults plus overrides

**Recommended:** Have the backend return explicit permission codes and maintain a reviewed matrix as policy documentation.

**Backend confirmation required:** YES

**Final decision:** TBD

### PER-003 — Permission Code Names

**Question:** What exact permission identifiers should the frontend use for Company actions?

**Why it matters:** The current `Permission` union contains no Company permissions, and code names must align with backend authorization.

**Options:**
- `company.view`, `company.create`, and resource-specific codes
- Django-style `app.action_model` codes
- Backend-provided opaque codes

**Recommended:** Use stable backend-defined permission codes and type them centrally in the frontend.

**Backend confirmation required:** YES

**Final decision:** TBD

### PER-004 — Route and Navigation Authorization

**Question:** Should Company access be guarded at route level, navigation level, action level, or all three?

**Why it matters:** Hiding buttons alone does not prevent unauthorized navigation.

**Options:**
- Route, navigation, and action checks
- Route plus action checks
- Navigation filtering only

**Recommended:** Apply permission-aware navigation and route guards, plus action checks; backend enforcement remains mandatory.

**Backend confirmation required:** NO

**Final decision:** TBD

### PER-005 — Sensitive Section Permissions

**Question:** Do SMTP configuration, bank information, Policy downloads, and destructive Company actions need permissions beyond general Company edit/view?

**Why it matters:** These operations expose secrets, financial information, files, or high-impact changes.

**Options:**
- Covered by general Company permissions
- Separate sensitive-data and file permissions
- Section-specific permissions

**Recommended:** Use separate backend-enforced permissions for sensitive configuration and destructive operations.

**Backend confirmation required:** YES

**Final decision:** TBD

### PER-006 — `RequirePermission` Pattern

**Question:** Should the project introduce a shared `RequirePermission` component and/or route guard?

**Why it matters:** The documentation references this pattern, but it does not currently exist.

**Options:**
- Shared component plus route guard
- Hook checks only
- Backend-driven navigation without a wrapper

**Recommended:** Add a small shared guard abstraction after the permission source and code names are approved.

**Backend confirmation required:** NO

**Final decision:** TBD

## 12. Routing

### ROU-001 — Canonical Company Routes

**Question:** Should Company use documented `/company` and `/company/:id`, or the existing navigation prefix `/hr/companies`?

**Why it matters:** Routes, links, redirects, active sidebar detection, and deep links must agree.

**Options:**
- `/company` and `/company/:id`
- `/hr/companies` and `/hr/companies/:id`
- Another approved route structure

**Recommended:** Use the existing HR-prefixed navigation convention.

**Backend confirmation required:** NO

**Final decision:** Use `/hr/companies` for the Company list and reserve `/hr/companies/:id` for the later Company Detail phase. Do not add `/company` aliases.

### ROU-002 — Tab URL Model

**Question:** How should the active Company Detail tab be represented in the URL?

**Why it matters:** It affects deep linking, browser history, reload behavior, lazy rendering, and accessibility.

**Options:**
- Nested routes such as `/company/:id/branches`
- Query parameter such as `?tab=branch`
- Local component state only

**Recommended:** Use nested routes or a stable query parameter so tabs can be deep-linked; keep the detail shell thin.

**Backend confirmation required:** NO

**Final decision:** TBD

### ROU-003 — Invalid or Missing Company ID UX

**Question:** What should happen for malformed IDs, inaccessible Companies, and HTTP 404 responses?

**Why it matters:** The test plan requires invalid-ID handling but does not define the result.

**Options:**
- Dedicated not-found state with link back to list
- Redirect to Company list with notification
- Global error page

**Recommended:** Render an explicit not-found/access-denied state and provide a route back to the Company list.

**Backend confirmation required:** NO

**Final decision:** TBD

### ROU-004 — Create Success Navigation

**Question:** After minimum Company creation, should navigation go to the Overview tab or another onboarding step?

**Why it matters:** The documentation says redirect to detail but does not define the initial tab state or success message.

**Options:**
- Company detail Overview
- First incomplete configuration area
- Stay on list and show success

**Recommended:** Navigate to Company detail Overview using the ID returned by the create API.

**Backend confirmation required:** NO

**Final decision:** TBD

## 13. Pagination/Search/Filtering

### LST-001 — Pagination Strategy

**Question:** Which Company resource lists are paginated, and is pagination server-side?

**Why it matters:** Query keys, parameters, response types, table UI, and empty states differ between paginated and unpaginated lists.

**Options:**
- Server pagination for all lists
- Company list and large resources only
- No pagination for nested masters

**Recommended:** Use server pagination for Company and potentially large resources; allow small nested masters to be unpaginated only when the backend explicitly supports it.

**Backend confirmation required:** YES

**Final decision:** TBD

### LST-002 — Pagination Parameters and Defaults

**Question:** What are the page parameter, page-size parameter, default size, allowed sizes, and indexing convention?

**Why it matters:** Frontend state and query keys must match the backend exactly.

**Options:**
- DRF `page`/`page_size`, one-based pages
- Offset/limit
- Cursor pagination

**Recommended:** Follow the existing Django pagination convention and include all pagination inputs in query keys.

**Backend confirmation required:** YES

**Final decision:** TBD

### LST-003 — Search Behavior

**Question:** Which resources and fields support search, what parameter is used, and is matching case-insensitive?

**Why it matters:** Search cannot be safely implemented as client filtering over a server-paginated list.

**Options:**
- DRF `search` parameter
- Field-specific query parameters
- No search in initial scope

**Recommended:** Use server-side search for paginated resources and debounce user input in the frontend.

**Backend confirmation required:** YES

**Final decision:** TBD

### LST-004 — Filters

**Question:** Which filters are supported for Company and nested resources?

**Why it matters:** Documentation names status/year/relationships but does not define filtering behavior.

**Options:**
- Company status and industry
- Branch status
- Holiday List year
- Department relationship for Designation
- Backend-defined subset

**Recommended:** Implement only filters exposed and documented by the backend, with normalized query parameters.

**Backend confirmation required:** YES

**Final decision:** TBD

### LST-005 — Sorting

**Question:** Which fields are sortable and what ordering syntax does the API use?

**Why it matters:** Table headers and query keys must not imply unsupported server behavior.

**Options:**
- DRF `ordering`
- Separate `sort_by` and `sort_order`
- Fixed backend ordering only

**Recommended:** Follow the existing backend ordering convention and expose sorting only for approved fields.

**Backend confirmation required:** YES

**Final decision:** TBD

### LST-006 — Shared Pagination UI

**Question:** Should a shared Pagination component be created before Company list pages?

**Why it matters:** The documentation requires reuse, but no shared Pagination UI currently exists.

**Options:**
- Create shared Pagination in the appropriate shared-UI phase
- Keep pagination local to Company
- Use an existing library component if one is adopted

**Recommended:** Create one shared accessible Pagination component after the backend pagination contract is confirmed.

**Backend confirmation required:** NO

**Final decision:** TBD

## 14. Mock API

### MCK-001 — Mock Contract Parity

**Question:** Must mock responses exactly match real API envelopes, IDs, defaults, errors, and pagination?

**Why it matters:** Different mock and real shapes hide integration defects.

**Options:**
- Exact contract parity
- Simplified frontend-only arrays
- Partial parity for implemented operations

**Recommended:** Require exact contract parity for every implemented operation.

**Backend confirmation required:** YES

**Final decision:** TBD

### MCK-002 — Mock Data Location

**Question:** Should Company mock records remain inside `company.api.ts` like existing modules or live in separate mock files?

**Why it matters:** Nine resource types could make one API file difficult to maintain.

**Options:**
- Keep all mock state in `company.api.ts`
- Use `api/company.mock.ts` or a `mocks/` directory
- Adopt a mock server layer

**Recommended:** Preserve `VITE_USE_MOCK_API` behavior but separate substantial Company mock data/handlers from the real API functions.

**Backend confirmation required:** NO

**Final decision:** TBD

### MCK-003 — Mock Persistence

**Question:** Should mock CRUD state survive a page reload?

**Why it matters:** In-memory mocks reset on reload and may complicate multi-tab workflow testing.

**Options:**
- In-memory only
- LocalStorage persistence
- Seed/reset development store

**Recommended:** Use deterministic in-memory mocks initially unless persistent mock workflows are explicitly required.

**Backend confirmation required:** NO

**Final decision:** TBD

### MCK-004 — Mock Error and Empty-State Controls

**Question:** How will developers reliably trigger loading, empty, validation-error, permission-error, and server-error states?

**Why it matters:** The Definition of Done and test plan require all these states.

**Options:**
- Environment/query-parameter scenarios
- Exported mock fixtures for automated tests
- Manual code edits

**Recommended:** Provide deterministic fixtures/scenarios usable by automated tests without requiring source edits.

**Backend confirmation required:** NO

**Final decision:** TBD

### MCK-005 — Mock File Behavior

**Question:** How should Policy/logo upload, preview, download, replacement, and deletion behave in mock mode?

**Why it matters:** Browser object URLs are temporary and cannot represent an unapproved backend file contract.

**Options:**
- Object URLs for the current session
- Fixed bundled fixtures
- File features disabled until the contract exists

**Recommended:** Define mock file behavior only after the real metadata and lifecycle contract is confirmed; clearly label session-only behavior if object URLs are used.

**Backend confirmation required:** YES

**Final decision:** TBD

## 15. Testing

### TST-001 — Frontend Test Framework

**Question:** Which frontend test framework and DOM testing tools should be added?

**Why it matters:** The repository has no test script or frontend test runner, while the Company test plan requires extensive behavior testing.

**Options:**
- Vitest plus React Testing Library
- Another approved unit/component stack
- End-to-end tests only

**Recommended:** Use Vitest with React Testing Library for hooks/components and retain a separate browser-level tool for critical flows if approved.

**Backend confirmation required:** NO

**Final decision:** TBD

### TST-002 — API Mocking in Automated Tests

**Question:** Should tests mock Company API functions, intercept HTTP requests, or run against Django?

**Why it matters:** Query state, errors, pagination, and integration boundaries require a repeatable strategy.

**Options:**
- Mock Service Worker/network interception
- Module-mock the Company API layer
- Django integration environment
- Layered combination

**Recommended:** Use network-level mocking for frontend integration tests and a separate backend integration suite for the real API contract.

**Backend confirmation required:** NO

**Final decision:** TBD

### TST-003 — Required Coverage and Phase Gates

**Question:** Which tests must pass in each phase, and are coverage thresholds required?

**Why it matters:** The test plan lists scenarios but does not define automation level or acceptance thresholds.

**Options:**
- Scenario-based phase gates without a percentage
- Global line/branch thresholds
- Critical-path tests only initially

**Recommended:** Make documented scenarios the initial phase gates and add realistic coverage thresholds after the test foundation exists.

**Backend confirmation required:** NO

**Final decision:** TBD

### TST-004 — End-to-End Tool and Environment

**Question:** Which tool and backend/mock environment should cover create-and-redirect, tab navigation, and file workflows?

**Why it matters:** These flows cross router, query cache, forms, and API behavior.

**Options:**
- Playwright against mock mode
- Playwright against a test backend
- Cypress or another approved tool
- No end-to-end coverage initially

**Recommended:** Use browser tests against a controlled test backend for contract-critical flows, with mock-mode smoke coverage where useful.

**Backend confirmation required:** NO

**Final decision:** TBD

### TST-005 — Accessibility, Responsive, and Dark-mode Verification

**Question:** Which checks are automated and which remain manual for accessibility, responsive layouts, and dark mode?

**Why it matters:** These are explicit Definition of Done requirements but currently have no verification process.

**Options:**
- Automated accessibility plus visual snapshots
- Manual checklist only
- Combined automated and manual review

**Recommended:** Combine automated accessibility checks with targeted visual/browser review at documented viewport and theme states.

**Backend confirmation required:** NO

**Final decision:** TBD

## 16. Cross-module Integration

### INT-001 — Employee Master Value Migration

**Question:** How will Employee `company`, `department`, `designation`, `week_off`, and `holiday_master` strings migrate to Company-managed resources?

**Why it matters:** Introducing IDs without a migration plan can break existing forms, mock data, serializers, and records.

**Options:**
- Replace strings with foreign-key IDs
- Return both ID and display label during transition
- Keep strings and use Company only as an option source

**Recommended:** Move toward backend foreign-key relationships with a documented transition response that includes IDs and display labels.

**Backend confirmation required:** YES

**Final decision:** TBD

### INT-002 — Recruitment Department Integration

**Question:** Should Recruitment Job `department` become a Department ID relationship or remain free text?

**Why it matters:** Recruitment currently defines a local Department list and stores a string, creating duplicate master data.

**Options:**
- Required Department foreign key
- Optional Department relationship plus legacy text
- Continue free text

**Recommended:** Use the Company Department master as a backend relationship when the Job belongs to a known Company.

**Backend confirmation required:** YES

**Final decision:** TBD

### INT-003 — Attendance Geofence Integration

**Question:** What API supplies authorized Branch geofences to Attendance, and when will the hardcoded constant be removed?

**Why it matters:** Company must not copy the Attendance constant, and Attendance must not trust unrestricted frontend configuration.

**Options:**
- Attendance-specific endpoint returns authorized geofences
- Attendance consumes Branch list directly
- Backend validates coordinates without exposing all geofences

**Recommended:** Use an Attendance-specific backend contract that returns only authorized work locations or validates clock events server-side.

**Backend confirmation required:** YES

**Final decision:** TBD

### INT-004 — Week Off and Holiday Consumption

**Question:** How will Attendance and Leave resolve the applicable Week Off and Holiday List for an Employee on a date?

**Why it matters:** Company owns configuration, but downstream calculation and assignment rules are outside its scope.

**Options:**
- Company-wide configuration
- Branch/Employee assignments
- Effective-dated policy assignment service

**Recommended:** Resolve assignments and date-effective calculations on the backend; Company should manage only approved masters/configuration.

**Backend confirmation required:** YES

**Final decision:** TBD

### INT-005 — Asset Type Consumption

**Question:** How will the Assets module reference Company-owned Asset Types and handle inactive types?

**Why it matters:** Deleting or renaming a master must not corrupt existing asset assignments.

**Options:**
- Foreign-key relationship with inactive records retained
- Snapshot the type label on assignment
- Assets maintains a separate master

**Recommended:** Use a foreign-key relationship, preserve referenced inactive types, and keep assignment outside Company.

**Backend confirmation required:** YES

**Final decision:** TBD

### INT-006 — Policy Publication and Employee Access

**Question:** How do managed Policies become visible to Employees, and are acknowledgements or audience assignments in scope?

**Why it matters:** The navigation already contains an employee-facing Company Policy entry, but Company documentation covers only management.

**Options:**
- All active Policies are automatically published
- Explicit publish/audience fields
- Separate Policy assignment/acknowledgement module

**Recommended:** Define publication/audience rules in the backend and keep acknowledgement/assignment outside Company unless separately specified.

**Backend confirmation required:** YES

**Final decision:** TBD

### INT-007 — Shared Master Option APIs

**Question:** Should consuming modules use full Company CRUD list endpoints or lightweight option endpoints for selectors?

**Why it matters:** Employee and Recruitment forms need stable labels/IDs without loading administrative pagination or sensitive fields.

**Options:**
- Reuse CRUD lists with filters
- Dedicated option endpoints
- Shared frontend cache populated from Company pages

**Recommended:** Use backend-scoped lightweight option endpoints or compact list responses where full administrative resources are inappropriate.

**Backend confirmation required:** YES

**Final decision:** TBD

### INT-008 — Cross-module Cache Invalidation

**Question:** When Company masters change, should Employee, Recruitment, Attendance, Assets, or Policy option queries be invalidated immediately?

**Why it matters:** Unrelated broad invalidation is prohibited, but shared master consumers can otherwise display stale options.

**Options:**
- Shared master query keys consumed by all modules
- Module-specific option queries invalidated selectively
- Rely on stale time/refetch only

**Recommended:** Define shared master/option query keys and invalidate only the affected master and known option consumers.

**Backend confirmation required:** NO

**Final decision:** TBD

## Phase 1 Can Start When

Phase 1 may begin only after the minimum decisions needed to define real transport types, schemas, endpoint constants, API functions, and query hooks are approved.

Required before real API integration:

- [ ] **API-001** — Company ID type
- [ ] **API-002** — Nested resource ID types
- [ ] **API-003** — Exact endpoint URLs for the Phase 1 operations
- [ ] **API-004** — List response envelope
- [ ] **API-005** — Detail and mutation response shapes
- [ ] **API-006** — Update method and partial payload rules
- [ ] **API-008** — Error response contract
- [ ] **API-009** — Company/tenant scoping
- [ ] **COM-001** — Minimum Company create payload
- [ ] **COM-002** — Complete Company field map needed by the initial API/types
- [ ] **COM-003** — Industry source and value type
- [ ] **COM-004** — Company status values
- [ ] **BRN-001** — Branch contract, if Branch types/endpoints are included in Phase 1
- [ ] **DEP-001** — Department contract, if Department types/endpoints are included in Phase 1
- [ ] **DES-001** and **DES-002** — Designation relationship and contract, if Designation is included in Phase 1
- [ ] **WOF-001** through **WOF-004** — Week Off ownership and payload contract, if Week Off is included in Phase 1
- [ ] **HLI-001** and **HLI-002** — Holiday List field/year contract, if Holiday List is included in Phase 1
- [ ] **HOL-001** through **HOL-003** — Holiday ownership, fields, and date contract, if Holiday is included in Phase 1
- [ ] **AST-001** — Asset Type contract, if Asset Type is included in Phase 1
- [ ] **POL-001** through **POL-005** — Policy metadata, upload, validation, metadata, and access contract, if Policy is included in Phase 1
- [ ] **LST-001** and **LST-002** — Pagination scope and parameters for every Phase 1 list API
- [ ] **MCK-001** — Required mock/real contract parity

The following may be decided after the API foundation if Phase 1 contains no routing or UI work, but must be resolved before their respective later phases:

- Permission matrix and permission code names
- Canonical routes and tab URL model
- Shared Tabs, Pagination, Alert, and confirmation patterns
- Frontend testing stack and phase gates
- Cross-module migration and assignment rules

No unchecked item should be treated as implicitly approved. Recommendations in this document must not be converted into code or backend behavior until the corresponding **Final decision** is recorded.
