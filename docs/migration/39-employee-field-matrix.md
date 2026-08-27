# Employee Field Matrix

## Evidence rule

The legacy source is unavailable. “Legacy evidence” is therefore limited to the migration summaries; a blank/unknown legacy name is not guessed. “Required” and validation describe current React unless explicitly marked legacy. All identity/master/file contracts remain frontend assumptions until approved.

## Core and personal fields

| Legacy field/capability evidence | React field | React type | Required/default | Current validation | Display/edit source | Company relation | Dependency | Status |
|---|---|---|---|---|---|---|---|---|
| Primary key | `id` | number | response-only | none | list/edit lookup; API | Tenant scope absent | Backend ID | PARTIAL |
| Employee code; branch-driven/temp-sensitive | `employee_id` | string | optional form; generated mock | none; disabled input | list, employment, review | Should relate to Branch series | Backend generation | REFACTOR REQUIRED |
| First name | `first_name` | string | required | trimmed, min 2 | personal/list/review | none | Exact legacy rules unknown | PARTIAL |
| Middle name | `middle_name` | string? | optional | trimmed | personal/review | none | Legacy presence unknown | UNKNOWN |
| Last name | `last_name` | string | required | trimmed, min 2 | personal/list/review | none | Exact legacy rules unknown | PARTIAL |
| Aadhaar-name field not confirmed | `name_as_per_aadhar` | string | required | trimmed, min 6 | personal/review | none | Product/legal spelling and rules | UNKNOWN |
| Email | `email` | string | required | trimmed email | personal/list/review | identity/account candidate | Uniqueness/account contract | PARTIAL |
| Phone/mobile | `phone` | string | required | Indian 10-digit, starts 6–9 | personal/review | none | Locale/product rule | PARTIAL |
| DOB | `dob` | string | required | age 18–100 | personal/review | none | Legacy exact rule unknown | PARTIAL |
| Gender | `gender` | Recruitment enum? | optional | shared Candidate values | personal/review | none | Employee-owned choices needed | REFACTOR REQUIRED |
| Marital status | `marital_status` | Recruitment enum? | optional | shared Candidate values | personal/review | none | Employee-owned choices needed | REFACTOR REQUIRED |
| Aadhaar number evidence not enumerated | `aadhar_card_number` | string | required | exactly 12 digits | personal/review | none | Privacy/uniqueness/masking | UNKNOWN |
| PAN evidence via tax domain | `pan_card_number` | string | required | PAN regex | personal/review | none | Privacy/uniqueness/tax | PARTIAL |
| Legacy blood/status fields noted missing | none | — | — | — | nowhere | none | Legacy extraction/product | MISSING/UNKNOWN |

## Address fields

| Legacy field evidence | React field | Type | Required/default | Validation | Display/edit source | Company relation | Dependency | Status |
|---|---|---|---|---|---|---|---|---|
| Address breadth verified | `corresponding_address_line1` | string | required | trimmed, min 1 | Address/Review | none | DTO naming | PARTIAL |
| Unknown exact field | `corresponding_address_line2` | string? | optional | none | Address/Review | none | DTO naming | UNKNOWN |
| Country | `corresponding_country` | number | required/default 0 | min 1 | Address/Review renders numeric value | none | Location catalog contract | PARTIAL |
| State | `corresponding_state` | number | required/default 0 | min 1 | Address/Review renders numeric value | none | Location dependency filtering absent | PARTIAL |
| City | `corresponding_city` | number | required/default 0 | min 1 | Address/Review renders numeric value | none | Location dependency filtering absent | PARTIAL |
| Pincode | `corresponding_pincode` | string | required | six digits | Address/Review | none | Locale rule | PARTIAL |
| Same-address behavior | `same_as_above` | boolean | optional/default false | none | Address only | none | Copy/sync behavior unspecified | REFACTOR REQUIRED |
| Permanent address | `permanent_address_line1` | string | schema-required | no minimum | Address/Review | none | Conditional requirement decision | PARTIAL |
| Unknown exact field | `permanent_address_line2` | string? | optional | none | Address/Review | none | DTO naming | UNKNOWN |
| Country | `permanent_country` | number | required/default 0 | min 1 | Address | none | Location catalog | PARTIAL |
| State | `permanent_state` | number | required/default 0 | min 1 | Address | none | Dependency filtering absent | PARTIAL |
| City | `permanent_city` | number | required/default 0 | min 1 | Address | none | Dependency filtering absent | PARTIAL |
| Pincode | `permanent_pincode` | string | required | six digits | Address/Review | none | Locale rule | PARTIAL |

## Employment, assignment and lifecycle fields

| Legacy field/capability evidence | React field | Type | Required/default | Validation | Display/edit source | Company relationship | Dependency | Status |
|---|---|---|---|---|---|---|---|---|
| Selected Company/tenant | `company` | string? | UI marked required, schema optional | none | Employment/Review | Company has numeric `id` | Tenant/ID mapping | REFACTOR REQUIRED |
| Branch required for code/work scope | none | — | — | — | absent | Branch numeric `id`, company-scoped | Cardinality/code/assignment | MISSING |
| Department | `department` | string | required | min 1 | Employment/list/review | Department numeric `id` | Branch relation undecided | REFACTOR REQUIRED |
| Designation | `designation` | string | required | min 1 | Employment/list/review | Designation numeric `id`, nullable Department | Cardinality/migration | REFACTOR REQUIRED |
| Work location | `work_location` | string | required | min 1 | Employment/review | Static local options, not Branch | Authorized location/geofence | REFACTOR REQUIRED |
| Joining date | `date_of_joining` | string | required | nonempty; UI max today | Employment/list/review | Branch/code may depend | Future-date rule/format | PARTIAL |
| Reporting manager/team | `reporting_manager` | string? | optional | none | Employment/review | Should reference Employee ID | Team/supervisor graph | REFACTOR REQUIRED |
| Job role | `job_role` | string? | optional | none | schema/mock only | Designation overlap unclear | Product mapping | MISSING/UNKNOWN |
| Employment type; legacy Temp status conflicts | `employment_type` | four-value enum | required/default full_time | enum | Employment/list/review | none | Legacy type/status mapping | BLOCKED |
| Annual salary | `annual_salary` | number | required | coerced, min 1 | Employment/review | none | Sensitive/payroll ownership | PARTIAL |
| Week Off assignment | `week_off` | string? | optional | none | schema/mock only | WeekOff numeric `id` | Effective assignment/history | REFACTOR REQUIRED |
| Holiday List assignment | `holiday_master` | string? | optional | none | schema/mock only | HolidayList numeric `id` | Year/timezone/effective rules | REFACTOR REQUIRED |
| Shift assignment | none | — | — | — | absent | Company Shift absent | Shift contract | BLOCKED/MISSING |
| Remote clock exception | `clockin_remotely` | boolean | default false | none | edit Permissions only | Work location/geofence | Authorization semantics | PARTIAL |
| Legacy statuses include Resigned/Temp | `is_active` | boolean | response/default true | none | not displayed/editable | tenant lifecycle | Status transitions/F&F | MISSING |
| Candidate provenance | `source_candidate_id` | number? | optional | none | list source badge | future tenant scope | Atomic conversion | PARTIAL |
| Offer provenance | `source_offer_id` | number? | optional | none | not displayed | future tenant scope | Job/Offer mapping | PARTIAL |

## Bank, statutory and emergency fields

| Legacy evidence | React field | Type | Required/default | Validation | Display/edit source | Dependency | Status |
|---|---|---|---|---|---|---|---|
| Bank details verified | `ifsc_code` | string | required | IFSC regex/uppercase UI | Account/Review | Privacy/backend validation | PARTIAL |
| Bank details | `bank_name` | string | required | trimmed min 2 | Account/Review | Reference-vs-text decision | PARTIAL |
| Bank branch | `branch_name` | string | required | trimmed min 2 | Account/Review | Not Company Branch | PARTIAL |
| Bank account | `account_number` | string | required | 8–20 digits | Account/Review | Masking/encryption/uniqueness | PARTIAL |
| Account holder | `account_holder_name` | string | required | trimmed min 2 | Account/Review | Privacy | PARTIAL |
| PF/UAN verified | `uan_number` | string? | optional | UI 12 digits; schema none | Account/Review | Statutory validation | PARTIAL |
| PF | `pf_number` | string? | optional | UI uppercase/alphanumeric; schema none | Account/Review | Statutory validation | PARTIAL |
| PF date | `pf_joining_date` | string? | optional | UI max today | Account/Review | Date semantics | PARTIAL |
| ESIC | `esic_number` | string? | optional | UI digits/max 17; schema none | Account/Review | Statutory validation | PARTIAL |
| ESIC date | `esic_joining_date` | string? | optional | UI max today | Account/Review | Date semantics | PARTIAL |
| Emergency contact | `emergency_contact_name` | string? | optional | trimmed | Emergency/Review | Exact legacy requirement | PARTIAL |
| Emergency phone | `emergency_contact_number` | string? | optional | regex still rejects empty-string values | Emergency/Review | Optional-value normalization | REFACTOR REQUIRED |
| Emergency relation | `emergency_contact_relation` | string? | optional | trimmed | Emergency/Review | Choice-vs-text decision | PARTIAL |

## Document and audit fields

| Legacy evidence | React field | Type | Required/default | Validation/source | Dependency | Status |
|---|---|---|---|---|---|---|
| Category | `document_category` | five-value enum? | optional in Employee schema; required upload | local select | Exact taxonomy | UNKNOWN/PARTIAL |
| Type/name | `document_name` | 22-value enum? | optional in Employee schema; required upload | filtered local select | Exact taxonomy | UNKNOWN/PARTIAL |
| Description | `document_description` | string? | optional | trimmed/schema; local upload state | Metadata contract | PARTIAL |
| File | upload `file`; schema `file_url` | File / URL? | upload required | PDF/JPEG/PNG, max 10 MB client-side | Private file contract | REFACTOR REQUIRED |
| Document ID | document `id` | number | response | none | Backend ID | PARTIAL |
| Owner | document `employee_id` | number | response/input scope | query-scoped | Authorization | PARTIAL |
| File name/type/size | metadata strings | string | response | mock-derived | Authoritative metadata | PARTIAL |
| Uploaded at/by | metadata | string | response | mock values | Identity/audit | PARTIAL |
| Created timestamp | `created_at` | string | response | none | Audit contract | PARTIAL |
| Updated timestamp | `updated_at` | string? | response | none | Audit contract | PARTIAL |
| Created/updated by | `created_by`, `updated_by` | number? | response | none | Identity/audit | UNKNOWN |

## Legacy fields not recoverable from available evidence

The audit summaries explicitly note missing “blood/status/team/role details” and a broad legacy profile, but the concrete names, types, defaults, validators and editability are unavailable. They remain `UNKNOWN`; they must be extracted from the legacy repository before implementation sign-off.
