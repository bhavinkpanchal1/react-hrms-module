# Company Module — Frontend Mock Contract

## Contract Status and Terminology

This document is a provisional frontend development contract. It does not approve backend fields, URLs, permissions, storage behavior, or business rules recorded as open in `13-open-decisions.md`.

The following labels are used throughout:

- **Documented requirement** — explicitly required by Company documentation.
- **Existing repository pattern** — already used by Employee, Recruitment, Attendance, shared API, or TanStack Query code.
- **Frontend mock assumption — backend confirmation required** — a temporary shape selected so frontend work and tests can proceed. It must be reconciled with the Django contract.
- **Backend TBD** — no real API behavior is confirmed.

Unless stated otherwise, all provisional entity IDs use `number` in mock mode because current Employee, Recruitment, and Attendance types use numeric IDs. This is a **frontend mock assumption — backend confirmation required**. Types should keep the ID choice centralized so a backend-driven change is mechanical.

## 1. Purpose

This contract lets the frontend team build and test the Company module before Django endpoints are available without coupling UI components to mock arrays.

The required architecture is:

```text
Component
  ↓
TanStack Query hook
  ↓
Company API service
  ↓
Mock implementation OR real httpClient implementation
```

Example:

```text
CompanyListPage
  ↓
useCompanies(params)
  ↓
companyApi.getCompanies(params)
  ↓
VITE_USE_MOCK_API
  ├── mockCompanies
  └── httpClient → Django API
```

Components consume domain values and hook states only. They do not know whether the active transport is in-memory mock data or Django. When backend contracts arrive, transport mapping should be contained in the API/types layer wherever possible.

This document intentionally does not create source files or settle the open backend decisions.

## 2. Mock Mode

The repository already uses this pattern in Employee, Employee Documents, Recruitment, and Attendance API modules:

```ts
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";
```

Required behavior:

- `VITE_USE_MOCK_API=true` → Company API service uses mock data and mock mutations.
- `VITE_USE_MOCK_API=false` → Company API service uses `httpClient` and centralized endpoint constants.
- Missing or any value other than the exact string `"true"` → real API mode, matching the current repository pattern.
- Components must never read `VITE_USE_MOCK_API` or `USE_MOCK`.
- Components and hooks must never import mock records, seed factories, or mock scenario controls.
- Hooks call only public `companyApi` functions.
- The Company API layer owns the mock/real branch.
- Mock and real branches of a public API function must return the same frontend-facing Promise type.
- Mock delay follows the existing module pattern: approximately 300 ms for detail reads, 500 ms for lists, 400–600 ms for mutations. Exact timing is a frontend test aid, not a backend expectation.
- Initial mock storage is module-scoped and resets on page refresh, matching Recruitment. Persistence is not required unless separately approved.

Recommended internal organization when implementation begins:

```text
src/modules/company/
├── api/
│   ├── company.api.ts       # stable public API and mock/real selection
│   └── company.mock.ts      # mock records/helpers if company.api.ts becomes large
├── hooks/
├── schema/
└── types/
```

Separating `company.mock.ts` is a frontend organization choice, not a new public architecture. Components and hooks still depend only on `company.api.ts`.

## 3. Entity Contracts

### Shared provisional scalar types

```ts
type CompanyEntityId = number;
type ISODate = string;      // YYYY-MM-DD in mock data
type ISODateTime = string;  // ISO-8601 timestamp in mock data
type EntityStatus = "active" | "inactive";
```

All four aliases are frontend mock assumptions. Date strings match existing repository types and DatePicker usage. Backend ID, status, nullability, and serialization remain TBD.

### Company

The documentation requires six Overview sections but defines only the minimum create fields precisely. Fields beyond those three are provisional, visibly marked below.

| Field | TypeScript type | Required? | Description | Mock example | Status |
|---|---|---:|---|---|---|
| `id` | `CompanyEntityId` | Yes, response | Company identifier | `1` | Frontend mock assumption — backend confirmation required |
| `company_name` | `string` | Yes | Company name; minimum create field | `"PeoplePulse Technologies Pvt. Ltd."` | Documented requirement |
| `industry_type` | `string` | Yes | Industry value; source/enum is unresolved | `"information_technology"` | Documented field; value is a frontend mock assumption — backend confirmation required |
| `company_start_date` | `ISODate` | Yes | Company start date; minimum create field | `"2018-04-01"` | Documented requirement; serialization confirmation required |
| `status` | `EntityStatus` | Yes in mock | Company status used in list/detail | `"active"` | Documented concept; enum/default are a frontend mock assumption — backend confirmation required |
| `logo` | `MockFileMetadata \| null` | No | Company logo metadata/preview | `null` | Documented concept; representation is a frontend mock assumption — backend confirmation required |
| `contact_email` | `string` | No | General Company contact email | `"hr@peoplepulse.example"` | Frontend mock assumption — backend confirmation required |
| `contact_number` | `string` | No | General Company contact number | `"+91 98765 43210"` | Frontend mock assumption — backend confirmation required |
| `website` | `string` | No | Company website | `"https://peoplepulse.example"` | Frontend mock assumption — backend confirmation required |
| `smtp` | `CompanyEmailConfiguration` | No | Email configuration section | See below | Documented section; exact fields are frontend mock assumptions — backend confirmation required |
| `registered_office` | `CompanyAddress` | No | Registered Office section | See below | Documented section; exact fields are frontend mock assumptions — backend confirmation required |
| `corporate_office` | `CompanyAddress` | No | Corporate Office section | See below | Documented section; exact fields are frontend mock assumptions — backend confirmation required |
| `bank_information` | `CompanyBankInformation` | No | Bank Information section | See below | Documented section; exact fields are frontend mock assumptions — backend confirmation required |
| `created_at` | `ISODateTime` | Yes in mock response | Creation timestamp | `"2026-08-01T09:00:00.000Z"` | Frontend mock assumption — backend confirmation required |
| `updated_at` | `ISODateTime` | Yes in mock response | Last update timestamp | `"2026-08-10T11:30:00.000Z"` | Frontend mock assumption — backend confirmation required |

Provisional supporting shapes:

```ts
interface CompanyAddress {
  address_line_1: string;
  address_line_2?: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
}

interface CompanyEmailConfiguration {
  host: string;
  port: number;
  username: string;
  from_email: string;
  use_tls: boolean;
  password_configured: boolean;
}

interface CompanyBankInformation {
  bank_name: string;
  branch_name: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
}
```

Every supporting field above is a **frontend mock assumption — backend confirmation required**. Mock data must never include or return a real SMTP password. `password_configured` exists only to exercise safe UI states without representing secret storage.

Suggested form/request types should be explicit rather than using broad `Partial<Company>` everywhere:

```ts
type CreateCompanyInput = Pick<
  Company,
  "company_name" | "industry_type" | "company_start_date"
>;

type UpdateCompanyInput = Partial<
  Omit<Company, "id" | "created_at" | "updated_at">
>;
```

The minimum create fields are documented. The update shape remains provisional until the backend serializer is known.

### Branch

| Field | TypeScript type | Required? | Description | Mock example | Status |
|---|---|---:|---|---|---|
| `id` | `CompanyEntityId` | Yes, response | Branch identifier | `101` | Frontend mock assumption — backend confirmation required |
| `company_id` | `CompanyEntityId` | Yes | Owning Company | `1` | Documented relationship; ID type confirmation required |
| `branch_name` | `string` | Yes | Branch/work-location name | `"Vadodara Head Office"` | Documented requirement |
| `email` | `string` | Yes in mock form | Branch email | `"vadodara@peoplepulse.example"` | Documented field; required rule confirmation required |
| `contact_number` | `string` | Yes in mock form | Branch contact | `"+91 98765 41001"` | Documented field; format confirmation required |
| `address` | `string` | Yes | Full address | `"K-PLEX, Gotri Road, Vadodara, Gujarat"` | Documented requirement |
| `pincode` | `string` | Yes | Address pincode | `"390021"` | Documented validation requirement; payload placement confirmation required |
| `latitude` | `number` | Yes | Geofence center latitude, −90 through 90 | `22.3072` | Documented requirement; numeric transport is a frontend mock assumption |
| `longitude` | `number` | Yes | Geofence center longitude, −180 through 180 | `73.1812` | Documented requirement; numeric transport is a frontend mock assumption |
| `radius_meters` | `number` | Yes | Positive geofence radius in meters | `100` | Documented field/unit |
| `employee_id_series` | `string` | Yes in mock form | Display/configuration value for Employee ID series | `"VAD-EMP"` | Documented concept; syntax/required rule are frontend mock assumptions — backend confirmation required |
| `start_date` | `ISODate` | Yes | Branch start date | `"2018-04-01"` | Documented requirement; serialization confirmation required |
| `status` | `EntityStatus` | Yes | Branch status | `"active"` | Documented concept; enum/default are a frontend mock assumption — backend confirmation required |
| `created_at` | `ISODateTime` | Yes in mock response | Creation timestamp | `"2026-08-01T09:10:00.000Z"` | Frontend mock assumption — backend confirmation required |
| `updated_at` | `ISODateTime` | Yes in mock response | Update timestamp | `"2026-08-10T10:00:00.000Z"` | Frontend mock assumption — backend confirmation required |

Branch mock validation mirrors only documented rules: trimmed name/address, valid email, contact present, pincode present, latitude/longitude bounds, radius greater than zero, start date present, and status present. It does not define maximum radius, phone format, Employee ID series grammar, uniqueness, or attendance authorization.

### Department

| Field | TypeScript type | Required? | Description | Mock example | Status |
|---|---|---:|---|---|---|
| `id` | `CompanyEntityId` | Yes, response | Department identifier | `201` | Frontend mock assumption — backend confirmation required |
| `company_id` | `CompanyEntityId` | Yes | Owning Company | `1` | Documented relationship; ID type confirmation required |
| `name` | `string` | Yes | Required trimmed Department name | `"Engineering"` | Documented requirement |
| `created_at` | `ISODateTime` | Yes in mock response | Creation timestamp | `"2026-08-01T09:20:00.000Z"` | Frontend mock assumption — backend confirmation required |
| `updated_at` | `ISODateTime` | Yes in mock response | Update timestamp | `"2026-08-01T09:20:00.000Z"` | Frontend mock assumption — backend confirmation required |

No status, code, description, or uniqueness rule is assumed.

### Designation

| Field | TypeScript type | Required? | Description | Mock example | Status |
|---|---|---:|---|---|---|
| `id` | `CompanyEntityId` | Yes, response | Designation identifier | `301` | Frontend mock assumption — backend confirmation required |
| `company_id` | `CompanyEntityId` | Yes | Owning Company | `1` | Documented relationship; ID type confirmation required |
| `name` | `string` | Yes | Required trimmed Designation name | `"Senior Software Engineer"` | Documented requirement |
| `department_id` | `CompanyEntityId \| null` | Yes in mock shape | Related Department when selected | `201` | Frontend mock assumption — backend confirmation required; relationship requirement is unresolved |
| `created_at` | `ISODateTime` | Yes in mock response | Creation timestamp | `"2026-08-01T09:30:00.000Z"` | Frontend mock assumption — backend confirmation required |
| `updated_at` | `ISODateTime` | Yes in mock response | Update timestamp | `"2026-08-01T09:30:00.000Z"` | Frontend mock assumption — backend confirmation required |

For mock development, `department_id` is nullable so both Company-wide and Department-linked UI states can be exercised. This does not decide whether the backend will require it.

### Week Off

The documented grid has five occurrence rows, Monday–Sunday columns, and exactly three states.

```ts
type WeekOffOccurrence = 1 | 2 | 3 | 4 | 5;

type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type WeekOffState = "working" | "half_day" | "week_off";

interface WeekOffCell {
  occurrence: WeekOffOccurrence;
  weekday: Weekday;
  state: WeekOffState;
}

type WeekOffGrid = readonly WeekOffCell[];

interface WeekOff {
  id: CompanyEntityId;
  company_id: CompanyEntityId;
  policy_name: string;
  grid: WeekOffGrid;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}
```

| Field | TypeScript type | Required? | Description | Mock example | Status |
|---|---|---:|---|---|---|
| `id` | `CompanyEntityId` | Yes, response | Week Off record identifier | `401` | Frontend mock assumption — backend confirmation required |
| `company_id` | `CompanyEntityId` | Yes | Owning Company | `1` | Documented relationship; ID type confirmation required |
| `policy_name` | `string` | Yes in mock | Name displayed in editor/list | `"Standard Office Week"` | Mentioned by validation documentation; model/cardinality are unresolved, so backend confirmation is required |
| `grid` | `WeekOffGrid` | Yes | Exactly 35 unique occurrence/weekday cells | See example below | Documented grid; array transport is a frontend mock assumption — backend confirmation required |
| `created_at` | `ISODateTime` | Yes in mock response | Creation timestamp | `"2026-08-01T09:40:00.000Z"` | Frontend mock assumption — backend confirmation required |
| `updated_at` | `ISODateTime` | Yes in mock response | Update timestamp | `"2026-08-12T12:00:00.000Z"` | Frontend mock assumption — backend confirmation required |

Exact mock grid rules:

- Contains exactly 35 cells.
- Contains one cell for every `occurrence × weekday` pair.
- Uses Monday-through-Sunday display order.
- Allows only `working`, `half_day`, and `week_off`.
- Example default fixture: Monday–Friday are `working`; every Sunday is `week_off`; the second and fourth Saturday are `week_off`; remaining Saturdays are `working`.
- A second fixture should include at least one `half_day` cell.
- Cell-array representation is intentionally explicit and avoids ambiguous positional arrays. **Frontend mock assumption — backend confirmation required.**
- Effective dates, versioning, Branch/Employee assignment, overrides, and one-versus-many policies remain Backend TBD.

### Holiday List

| Field | TypeScript type | Required? | Description | Mock example | Status |
|---|---|---:|---|---|---|
| `id` | `CompanyEntityId` | Yes, response | Holiday List identifier | `501` | Frontend mock assumption — backend confirmation required |
| `company_id` | `CompanyEntityId` | Yes | Owning Company | `1` | Documented relationship; ID type confirmation required |
| `name` | `string` | Yes | Calendar name | `"India Holidays 2026"` | Documented requirement |
| `year` | `number` | Yes | Four-digit year in mock UI | `2026` | Documented field; numeric representation/range are frontend mock assumptions — backend confirmation required |
| `remarks` | `string` | No | Optional notes | `"Applicable to India offices"` | Documented requirement |
| `created_at` | `ISODateTime` | Yes in mock response | Creation timestamp | `"2026-08-01T09:50:00.000Z"` | Frontend mock assumption — backend confirmation required |
| `updated_at` | `ISODateTime` | Yes in mock response | Update timestamp | `"2026-08-01T09:50:00.000Z"` | Frontend mock assumption — backend confirmation required |

Multiple Holiday Lists for one Company/year are allowed in mock data to test selectors and relationships. This is a frontend mock assumption, not an approved uniqueness rule.

### Holiday

| Field | TypeScript type | Required? | Description | Mock example | Status |
|---|---|---:|---|---|---|
| `id` | `CompanyEntityId` | Yes, response | Holiday identifier | `601` | Frontend mock assumption — backend confirmation required |
| `company_id` | `CompanyEntityId` | Yes | Owning Company, retained for mock filtering | `1` | Frontend mock assumption — backend confirmation required |
| `holiday_list_id` | `CompanyEntityId` | Yes | Owning Holiday List | `501` | Documented relationship; ID type confirmation required |
| `date` | `ISODate` | Yes | Holiday calendar date | `"2026-01-26"` | Documented requirement; date serialization confirmation required |
| `name` | `string` | Yes in mock | Human-readable Holiday label | `"Republic Day"` | Frontend mock assumption — backend confirmation required |
| `description` | `string` | No | Optional Holiday note | `"National holiday"` | Frontend mock assumption — backend confirmation required |
| `created_at` | `ISODateTime` | Yes in mock response | Creation timestamp | `"2026-08-01T10:00:00.000Z"` | Frontend mock assumption — backend confirmation required |
| `updated_at` | `ISODateTime` | Yes in mock response | Update timestamp | `"2026-08-01T10:00:00.000Z"` | Frontend mock assumption — backend confirmation required |

Mock fixtures keep Holiday dates within their Holiday List year and avoid duplicate dates within a list to support realistic UI behavior. Those constraints are frontend mock assumptions until confirmed.

### Asset Type

| Field | TypeScript type | Required? | Description | Mock example | Status |
|---|---|---:|---|---|---|
| `id` | `CompanyEntityId` | Yes, response | Asset Type identifier | `701` | Frontend mock assumption — backend confirmation required |
| `company_id` | `CompanyEntityId` | Yes | Owning Company | `1` | Documented relationship; ID type confirmation required |
| `name` | `string` | Yes | Required trimmed Asset Type name | `"Laptop"` | Documented requirement |
| `created_at` | `ISODateTime` | Yes in mock response | Creation timestamp | `"2026-08-01T10:10:00.000Z"` | Frontend mock assumption — backend confirmation required |
| `updated_at` | `ISODateTime` | Yes in mock response | Update timestamp | `"2026-08-01T10:10:00.000Z"` | Frontend mock assumption — backend confirmation required |

No asset assignment, status, code, description, depreciation, or inventory fields belong in this contract.

### Policy

```ts
interface MockFileMetadata {
  file_name: string;
  mime_type: string;
  size_bytes: number;
  uploaded_at: ISODateTime;
  mock_object_url?: string;
  mock_fixture_path?: string;
}
```

| Field | TypeScript type | Required? | Description | Mock example | Status |
|---|---|---:|---|---|---|
| `id` | `CompanyEntityId` | Yes, response | Policy identifier | `801` | Frontend mock assumption — backend confirmation required |
| `company_id` | `CompanyEntityId` | Yes | Owning Company | `1` | Documented relationship; ID type confirmation required |
| `policy_name` | `string` | Yes | Policy name | `"Remote Work Policy"` | Documented requirement |
| `description` | `string` | No in mock | Policy description | `"Guidelines for approved remote work."` | Documented concept; required rule confirmation required |
| `file` | `MockFileMetadata` | Yes for upload fixture | File metadata used by list/actions | See below | Documented concept; shape is a frontend mock assumption — backend confirmation required |
| `created_at` | `ISODateTime` | Yes in mock response | Record creation timestamp | `"2026-08-01T10:20:00.000Z"` | Frontend mock assumption — backend confirmation required |
| `updated_at` | `ISODateTime` | Yes in mock response | Record update timestamp | `"2026-08-01T10:20:00.000Z"` | Frontend mock assumption — backend confirmation required |

`mock_object_url` and `mock_fixture_path` are mock-only implementation details. They must not leak into components as assumed backend URLs. The API service should expose a view/download operation rather than requiring components to fabricate a URL.

File type/size limits are Backend TBD and must not copy Employee Document limits without approval.

## 4. Relationships

### Documented relationships

```text
Company
├── Branch
├── Department
├── Designation
├── Week Off
├── Holiday List
├── Asset Type
└── Policy

Department
└── Designation (relationship exists; required/cardinality TBD)

Holiday List
└── Holiday
```

Documented future consumers:

```text
Branch → Employee / Attendance work location and geofence
Department → Employee
Designation → Employee
Week Off → Attendance / Leave
Holiday List → Holiday → Attendance / Leave
Asset Type → Employee Assets
Policy → Employee / HR
```

### Frontend mock relationship rules

- Nested fixtures use `company_id` for deterministic filtering.
- A fixture whose `company_id` does not match an existing Company is invalid test data.
- `Holiday.holiday_list_id` must reference a Holiday List with the same `company_id`.
- `Designation.department_id`, when non-null, must reference a Department with the same `company_id`.
- Deleting a Company in the mock service may cascade-delete its nested mock records so isolated UI tests do not leave orphans. **Frontend mock assumption — backend confirmation required.** It must not be presented as real backend behavior.
- Deleting a Department referenced by a Designation should produce a deterministic mock conflict error rather than silently orphaning it. **Frontend mock assumption — backend confirmation required.**
- Deleting a Holiday List containing Holidays should produce a deterministic mock conflict error unless the test scenario explicitly enables cascade behavior. **Frontend mock assumption — backend confirmation required.**
- Assignment of Branch, Week Off, Holiday List, Asset Type, or Policy to Employees is outside Company scope and is not added to these mock entities.

## 5. Mock Data

The mock database should contain mutable arrays with typed records:

```ts
let mockCompanies: Company[];
let mockBranches: Branch[];
let mockDepartments: Department[];
let mockDesignations: Designation[];
let mockWeekOffs: WeekOff[];
let mockHolidayLists: HolidayList[];
let mockHolidays: Holiday[];
let mockAssetTypes: AssetType[];
let mockPolicies: Policy[];
```

Recommended seed coverage:

| Collection | Minimum seed | Required coverage |
|---|---:|---|
| `mockCompanies` | 12–15 | At least two industries, active/inactive status, pagination beyond one page, search matches/non-matches, create and redirect |
| `mockBranches` | 5–7 across at least three Companies | Multiple branches for one Company, one Company with no branches, different radii/statuses, coordinate editing |
| `mockDepartments` | 8–12 | Multiple per Company, one empty Company, Department-linked Designations |
| `mockDesignations` | 10–15 | Multiple per Department, at least one nullable `department_id` fixture, filtering by Company/Department |
| `mockWeekOffs` | 3 | Standard grid, grid containing half days, Company with no grid |
| `mockHolidayLists` | 4–6 | Multiple years, multiple lists for one Company/year as an assumption test, Company with no list |
| `mockHolidays` | 12–20 | Several dates per list, selector-driven filtering, list with zero Holidays |
| `mockAssetTypes` | 8–10 | Multiple records, empty Company, edit/delete |
| `mockPolicies` | 5–7 | Multiple MIME/size metadata values, object-URL upload fixture, empty Company, view/download/delete |

Example relationship set:

```text
Company 1: PeoplePulse Technologies
  Branches: Vadodara Head Office, Ahmedabad Office
  Departments: Engineering, Human Resources, Finance
  Designations: Software Engineer → Engineering; HR Executive → Human Resources
  Week Off: Standard Office Week
  Holiday Lists: India Holidays 2026, Gujarat Optional Holidays 2026
  Asset Types: Laptop, Mobile Phone, Access Card
  Policies: Remote Work Policy, Information Security Policy

Company 2: Northstar Services
  Branch: Mumbai Office
  Departments: Operations, Customer Support
  Designations: Operations Executive → Operations
  Week Off: Support Rotation (contains half-day cells)
  Holiday List: Maharashtra Holidays 2026
  Asset Types: Headset, Laptop
  Policy: Workplace Conduct Policy

Company 3: Empty-state Company
  No nested records
```

Mock fixture values must be fictional, must not contain real secrets, and must avoid real file URLs. Seed creation should be deterministic so tests can assert exact relationships. Each test suite should be able to reset mutable arrays and ID counters to their initial state.

Empty-state testing should use a scenario/reset helper or a Company with no nested records; it should not require components to import and mutate arrays.

## 6. Mock CRUD Behavior

### Common rules

- Every API function returns a Promise.
- List reads return defensive copies, not mutable internal arrays.
- Detail, update, and delete validate IDs after the simulated delay.
- Invalid IDs reject with an `Error` carrying a stable human-readable message such as `"Company not found"` or `"Branch not found"`, matching existing repository behavior.
- Create generates a unique mock numeric ID, adds timestamps, appends the record, and returns a copy.
- Update changes only submitted mutable fields, sets `updated_at`, retains ID/ownership, and returns the updated record.
- Delete removes the record only after relationship checks and resolves `void`.
- Nested operations verify the parent Company and verify that the nested record belongs to it.
- Mutations do not update the TanStack Query cache directly; hooks invalidate targeted keys.
- Zod performs client validation. The mock API should additionally support deterministic server-style failure scenarios so mutation error UI can be tested.
- Mock mutation behavior is not evidence of backend behavior.

### Public API operations

| Entity | List | Detail | Create | Update | Delete |
|---|---|---|---|---|---|
| Company | `getCompanies(params)` | `getCompanyById(id)` | `createCompany(input)` | `updateCompany(id, input)` | `deleteCompany(id)` |
| Branch | `getBranches(companyId, params?)` | `getBranchById(companyId, id)` | `createBranch(companyId, input)` | `updateBranch(companyId, id, input)` | `deleteBranch(companyId, id)` |
| Department | `getDepartments(companyId, params?)` | `getDepartmentById(companyId, id)` | `createDepartment(companyId, input)` | `updateDepartment(companyId, id, input)` | `deleteDepartment(companyId, id)` |
| Designation | `getDesignations(companyId, params?)` | `getDesignationById(companyId, id)` | `createDesignation(companyId, input)` | `updateDesignation(companyId, id, input)` | `deleteDesignation(companyId, id)` |
| Week Off | `getWeekOffs(companyId)` | `getWeekOffById(companyId, id)` | `createWeekOff(companyId, input)` | `updateWeekOff(companyId, id, input)` | `deleteWeekOff(companyId, id)` |
| Holiday List | `getHolidayLists(companyId, params?)` | `getHolidayListById(companyId, id)` | `createHolidayList(companyId, input)` | `updateHolidayList(companyId, id, input)` | `deleteHolidayList(companyId, id)` |
| Holiday | `getHolidays(companyId, holidayListId, params?)` | `getHolidayById(companyId, holidayListId, id)` | `createHoliday(companyId, holidayListId, input)` | `updateHoliday(companyId, holidayListId, id, input)` | `deleteHoliday(companyId, holidayListId, id)` |
| Asset Type | `getAssetTypes(companyId, params?)` | `getAssetTypeById(companyId, id)` | `createAssetType(companyId, input)` | `updateAssetType(companyId, id, input)` | `deleteAssetType(companyId, id)` |
| Policy | `getPolicies(companyId, params?)` | `getPolicyById(companyId, id)` | `createPolicy(companyId, input)` | `updatePolicy(companyId, id, input)` if UI supports edit | `deletePolicy(companyId, id)` |

Policy also needs stable service operations:

```ts
viewPolicyFile(companyId, policyId): Promise<PolicyFileAccess>
downloadPolicyFile(companyId, policyId): Promise<Blob>
```

The exact Policy edit/upload split remains Backend TBD. In mock mode, `createPolicy` may accept a `File` and build mock metadata, but the public signature should be revisited when the backend upload workflow is confirmed.

## 7. TanStack Query Contract

### Query keys

Add a `company` section to the existing shared `queryKeys` object; do not create a separate query-key system.

Conceptual structure, adapted to existing factory conventions:

```ts
company: {
  all: ["company"],
  lists: ["company", "list"],
  list: (params) => ["company", "list", params],
  details: ["company", "detail"],
  detail: (id) => ["company", "detail", id],

  branches: (companyId, params?) => ["company", companyId, "branches", params],
  branch: (companyId, id) => ["company", companyId, "branches", id],
  departments: (companyId, params?) => ["company", companyId, "departments", params],
  department: (companyId, id) => ["company", companyId, "departments", id],
  designations: (companyId, params?) => ["company", companyId, "designations", params],
  designation: (companyId, id) => ["company", companyId, "designations", id],
  weekOffs: (companyId) => ["company", companyId, "week-offs"],
  weekOff: (companyId, id) => ["company", companyId, "week-offs", id],
  holidayLists: (companyId, params?) => ["company", companyId, "holiday-lists", params],
  holidayList: (companyId, id) => ["company", companyId, "holiday-lists", id],
  holidays: (companyId, holidayListId, params?) =>
    ["company", companyId, "holiday-lists", holidayListId, "holidays", params],
  holiday: (companyId, holidayListId, id) =>
    ["company", companyId, "holiday-lists", holidayListId, "holidays", id],
  assetTypes: (companyId, params?) => ["company", companyId, "asset-types", params],
  assetType: (companyId, id) => ["company", companyId, "asset-types", id],
  policies: (companyId, params?) => ["company", companyId, "policies", params],
  policy: (companyId, id) => ["company", companyId, "policies", id],
}
```

Parameters must be serializable primitives/objects with stable values. Omit `params` from a key when that list is not paginated or filtered. Exact pagination keys remain a frontend mock contract until backend format is confirmed.

### Hooks

Required Company hooks:

```text
useCompanies(params)
useCompany(id)
useCreateCompany()
useUpdateCompany()
useDeleteCompany()
```

Required nested hooks, using the same list/detail/create/update/delete naming pattern:

```text
useBranches / useBranch / useCreateBranch / useUpdateBranch / useDeleteBranch
useDepartments / useDepartment / useCreateDepartment / useUpdateDepartment / useDeleteDepartment
useDesignations / useDesignation / useCreateDesignation / useUpdateDesignation / useDeleteDesignation
useWeekOffs / useWeekOff / useCreateWeekOff / useUpdateWeekOff / useDeleteWeekOff
useHolidayLists / useHolidayList / useCreateHolidayList / useUpdateHolidayList / useDeleteHolidayList
useHolidays / useHoliday / useCreateHoliday / useUpdateHoliday / useDeleteHoliday
useAssetTypes / useAssetType / useCreateAssetType / useUpdateAssetType / useDeleteAssetType
usePolicies / usePolicy / useCreatePolicy / useUpdatePolicy / useDeletePolicy
```

Detail hooks are required only where detail/edit flows need an independent read. They may be omitted from UI use for name-only master modals while retaining API capability.

Rules:

- ID-dependent queries use `enabled: Boolean(id)` or an equivalent validated guard.
- Holiday queries require both `companyId` and `holidayListId`.
- Create invalidates only the affected list family.
- Update invalidates the affected list and exact detail.
- Delete invalidates the affected list and removes/invalidates the exact detail.
- A nested mutation must not invalidate all Company or the entire application.
- Company Overview update invalidates the Company detail and relevant Company list, not nested tabs.
- Hooks remain identical in mock and real modes.

## 8. API Service Contract

`src/modules/company/api/company.api.ts` is the only public transport boundary for Company hooks.

Each public function has one stable signature and two internal execution paths:

```ts
getCompanies: async (params: CompanyListParams): Promise<PagedResult<Company>> => {
  if (USE_MOCK) return getMockCompanies(params);

  // Backend endpoint and envelope mapping are added when confirmed.
  const response = await httpClient.get(/* centralized endpoint */, { params });
  return mapCompanyListResponse(response.data);
}
```

Rules:

- Public API functions return frontend domain contracts, not Axios responses.
- `httpClient` is used only in the real branch.
- Endpoint strings live in `shared/constants/api-endpoints.ts`, never components or hooks.
- Transport-specific DTO mapping may be introduced inside the API layer when Django differs from the provisional frontend shape.
- Components must not depend on DRF envelopes, Axios types, mock counters, object URLs, or delay helpers.
- No `any` is allowed. Unknown external payloads should use defined DTOs or `unknown` plus validation/mapping.
- Mock helpers must use the same input/output contracts as the public service.
- Real branches may initially throw a clear configuration error while endpoints are unavailable, but mock mode must remain fully functional.

## 9. API Endpoint Assumptions

Every real endpoint is currently:

> **Mock contract only — backend endpoint TBD.**

The conceptual shapes from `06-api-spec.md` may guide naming discussions but are not confirmed URLs:

| Resource | Suggested conceptual shape | Contract status |
|---|---|---|
| Company list/create | `companies/` | Frontend suggestion only; backend endpoint TBD |
| Company detail/update/delete | `companies/:id/` | Frontend suggestion only; backend endpoint TBD |
| Branch | `company/:companyId/branches/` and detail child | Frontend suggestion only; backend endpoint TBD |
| Department | Company-nested collection/detail | Frontend assumption; backend endpoint TBD |
| Designation | Company-nested collection/detail | Frontend assumption; backend endpoint TBD |
| Week Off | Company-nested collection/detail | Frontend assumption; backend endpoint TBD |
| Holiday List | Company-nested collection/detail | Frontend assumption; backend endpoint TBD |
| Holiday | Prefer Holiday-List nesting for mock ownership | Frontend assumption; backend endpoint TBD |
| Asset Type | Company-nested collection/detail | Frontend assumption; backend endpoint TBD |
| Policy | Company-nested collection/detail plus file actions | Frontend assumption; backend endpoint TBD |

Do not add these suggested strings to production endpoint constants as confirmed URLs. When backend URLs arrive, merge only authoritative paths into `API_ENDPOINTS`.

## 10. File Upload / Policy

### Mock representation

Policy records store display metadata, not a fabricated backend URL:

```ts
interface MockFileMetadata {
  file_name: string;
  mime_type: string;
  size_bytes: number;
  uploaded_at: ISODateTime;
  mock_object_url?: string;
  mock_fixture_path?: string;
}
```

### Upload behavior

- The mock create/upload function receives the browser `File` selected by the user.
- It records `file.name`, `file.type`, `file.size`, and a mock upload timestamp.
- It may call `URL.createObjectURL(file)` for session-only View/Download testing.
- Object URLs must be revoked when the Policy is deleted, replaced, the mock database resets, or the application no longer needs them.
- The object URL is not a backend URL and should stay behind API service functions.
- Seed Policies may reference safe bundled fixture files through `mock_fixture_path`; paths are explicitly mock assets, not claimed backend storage.

### View behavior

`viewPolicyFile(companyId, policyId)` resolves a mock file-access result from either the current session object URL or a bundled fixture. The component may open the returned temporary URL with `noopener,noreferrer`. The API contract must make its mock-only lifetime clear.

### Download behavior

`downloadPolicyFile(companyId, policyId)` returns a `Blob` or a typed temporary access result. The UI creates the download interaction using the stored filename. It must not construct `/media/...`, `/mock/...`, or any presumed Django URL.

### Delete behavior

Deleting a Policy removes its mock record and revokes any associated object URL. Whether a real delete archives metadata, deletes the file, or deletes the complete record remains Backend TBD.

### Validation

Filename, MIME type, size, uploaded date, view, download, and delete can be tested in mock mode. Accepted MIME types, maximum size, versioning, replacement, authentication, signed URLs, and server storage remain Backend TBD. No Employee Document limits are inherited silently.

## 11. Loading / Empty / Error States

Mock mode must make every documented state testable through the API/hook boundary.

| State | Mock behavior | Expected hook/UI result |
|---|---|---|
| Loading | All reads/mutations wait for the configured delay | Query/mutation exposes pending state; UI shows spinner/skeleton/disabled submit |
| Empty list | Scenario returns a valid empty page/array | UI renders shared EmptyState, not an error |
| API error | Scenario rejects with `Error("Unable to load companies")` or resource-specific message | Query exposes error; UI renders visible error/retry state |
| Invalid ID | Detail rejects after delay with `Error("<Entity> not found")` | Detail page/tab renders not-found/error behavior without request loop |
| Create failure | Scenario rejects before mutating mock storage | Form remains open, values retained, error feedback visible, list unchanged |
| Update failure | Scenario rejects before changing record | Existing record remains unchanged; error feedback visible |
| Delete failure | Scenario rejects before removing record | Record remains present; error feedback visible |
| Relationship conflict | Delete rejects with a stable conflict message | Confirmation closes or remains according to UI decision; list remains unchanged |

Scenario control must stay outside components. Suitable frontend-only mechanisms include typed test fixtures, a resettable mock scenario module, or development-only query parameters interpreted inside mock helpers. Manual source editing is not an acceptable testing strategy.

Recommended typed scenario names:

```ts
type CompanyMockScenario =
  | "default"
  | "empty"
  | "list_error"
  | "detail_error"
  | "create_error"
  | "update_error"
  | "delete_error";
```

This scenario API is a frontend test assumption and must not become part of the production API service interface used by components.

## 12. Pagination / Search / Filtering

### Provisional frontend result contract

```ts
interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

interface CompanyListParams {
  page: number;
  page_size: number;
  search?: string;
  status?: EntityStatus;
  industry_type?: string;
}
```

`PagedResult<T>`, parameter names, and one-based pagination are **frontend mock assumptions — backend confirmation required**. The API service may later map a DRF `{ count, next, previous, results }` payload to this stable frontend result.

Mock behavior:

1. Start from the typed collection.
2. Scope nested lists by `company_id` and any required parent ID.
3. Apply case-insensitive trimmed search to explicitly supported display fields.
4. Apply exact-match filters.
5. Apply stable default ordering by the relevant display name unless a resource requires date/year order.
6. Calculate `total` after filtering.
7. Slice using one-based `page` and `page_size`.
8. Return defensive copies in `PagedResult<T>`.

Initial mock search/filter coverage:

- Companies: search `company_name`; filter `status` and `industry_type`.
- Branches: search `branch_name`, `address`, and contact values; filter `status` only if UI exposes it.
- Departments, Designations, Asset Types: search `name` when list size/UI warrants it.
- Holiday Lists: search `name`; filter `year`.
- Holidays: search `name`; selected `holiday_list_id` is mandatory ownership scope.
- Policies: search `policy_name` and description.
- Week Off: search is not required unless multiple named policies are confirmed.

The Company list should seed enough records to exercise pagination. Nested master lists may remain unpaginated in mock UI until product/backend decisions require pagination. Backend envelope, search parameters, fields, sorting syntax, cursor/offset strategy, and allowed page sizes remain TBD.

## 13. Cross-Module Integration

No cross-module integration is implemented as part of this contract. The provisional relationships preserve stable IDs so later adapters are possible.

| Consumer | Future Company data | Current boundary |
|---|---|---|
| Employee | Company, Branch/work location, Department, Designation, Week Off, Holiday List | Employee currently uses strings/static options; migration contract remains TBD |
| Attendance | Authorized Branch geofence, Week Off, Holidays | Company does not authorize clock-in or calculate attendance; hardcoded geofence replacement remains later work |
| Leave | Week Off and Holiday dates | Company owns configuration only; leave calculations/assignments remain backend/module concerns |
| Payroll | Company identity, bank/configuration, possibly Branch/Department | No payroll calculations or assignments in Company |
| Assets | Asset Type | Company owns the master; asset inventory/assignment remains in Assets/Employee |
| Employee/HR Policy | Published Policy metadata and file access | Publication, audience, acknowledgement, and permission rules remain TBD |

Rules for future compatibility:

- Preserve identifiers separately from display labels.
- Do not make Employee or Recruitment import Company mock arrays.
- Do not copy Branch geofence constants into Attendance.
- Do not add assignment fields merely to make a mock screen convenient.
- Cross-module consumers should eventually use their own API contracts or approved shared option hooks, not administrative Company page state.

## 14. Backend Replacement Strategy

### Current mock path

```text
Component
  ↓
TanStack Query hook
  ↓
company.api.ts public function
  ↓
typed mock data/helper
```

### Later real path

```text
Component
  ↓
TanStack Query hook
  ↓
company.api.ts public function
  ↓
httpClient
  ↓
Django API
```

Replacement steps:

1. Backend team publishes authoritative IDs, serializers, endpoint URLs, response envelopes, validation errors, permissions, pagination, and file contracts.
2. Compare those decisions with `13-open-decisions.md` and record final decisions.
3. Update transport/domain types in `company.types.ts`; add explicit DTOs and mapping functions if backend payloads differ from UI-friendly types.
4. Add confirmed endpoint builders to `shared/constants/api-endpoints.ts`.
5. Implement each real branch in `company.api.ts` with `httpClient`.
6. Map backend list envelopes to the same frontend `PagedResult<T>` if retaining that public contract is sensible.
7. Replace mock-only file access internally with authenticated download responses or signed URLs as confirmed.
8. Keep existing hook names, query keys, mutation inputs, and return values stable wherever the backend contract allows.
9. Run all mock-mode tests, then add real-contract/integration tests.
10. Update documentation for any approved contract change before changing components.

Files that should ideally change when switching transports:

- `src/modules/company/types/company.types.ts` — only where authoritative fields/IDs differ
- `src/modules/company/api/company.api.ts` — real HTTP branches and response mapping
- `src/modules/company/api/company.mock.ts` — mock parity updates, if separated
- `src/shared/constants/api-endpoints.ts` — confirmed paths
- `src/shared/constants/query-keys.ts` — only if confirmed server parameters change cache identity
- `src/modules/company/schema/company.schema.ts` — confirmed backend/business validation
- Company API/hook tests and fixtures
- Relevant Company documentation/open-decision statuses

Files that should ideally not change merely because the backend replaces mocks:

- Company pages
- Company tab components
- Shared UI components
- Router/navigation
- Form layout components
- Hook call sites

Component changes are acceptable only when the approved backend/business contract introduces genuinely different capabilities or fields; transport differences alone belong in the API mapping layer.

## 15. Open Backend Decisions

Frontend mock development may proceed while these remain unresolved:

- Exact ID type for Company and every nested entity
- Exact endpoint URLs and nesting
- List/detail/mutation response envelopes
- Pagination, search, filtering, and sorting parameters
- Company tenant/scoping behavior
- Complete Company Overview fields and nullability
- Industry source and values
- Company and Branch status enums/defaults
- Address and location representations
- SMTP secret/configuration behavior
- Company bank fields and sensitive-data rules
- Logo upload/storage/removal contract
- Branch coordinate precision, radius limits, Employee ID series grammar, and Attendance authorization
- Department/Designation uniqueness and deletion behavior
- Whether Designation requires Department
- Whether Week Off is one Company grid or multiple named/effective-dated policies
- Week Off backend grid payload, assignment, versioning, and history
- Holiday List uniqueness/lifecycle
- Holiday fields, nesting, duplicate-date, and edit/delete behavior
- Asset Type lifecycle and referential behavior
- Policy metadata, file limits, upload, versioning, view/download authorization, and delete semantics
- Permission codes, role matrix, sensitive-section access, and backend enforcement
- Real API error contract
- Cross-module foreign-key migration and assignment contracts

These items do not block frontend mock development because they are explicitly isolated as provisional assumptions behind types, API services, hooks, and mapping boundaries. They do block claiming real API compatibility until confirmed.

## FRONTEND CAN PROCEED = YES

Frontend Phase 1 can begin in mock-first mode using this provisional contract, provided implementation:

- keeps every mock assumption clearly provisional;
- does not add guessed real endpoint URLs;
- preserves the component → hook → API service boundary;
- keeps mock records inaccessible to components;
- uses stable typed API signatures with no `any`;
- validates and tests both success and failure behavior; and
- reconciles this contract with `13-open-decisions.md` when Django contracts arrive.

