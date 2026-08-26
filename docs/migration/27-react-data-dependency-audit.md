# React data-dependency audit

## Master dependency comparison

```text
Legacy: User → selected Company → Branch → Department/Designation/Shift/WeekOff/Holiday
React:  no User/tenant context → Company admin records → nested masters (no Shift)
```

| Relationship | Current React identifiers/source | Query/option behavior | Status | Required migration/backend contract |
|---|---|---|---|---|
| User → Company | None | No tenant query | MISSING | Identity membership, active Company selection, scope enforcement |
| Company → Branch | Numeric IDs; Company mock/service | Company-scoped query keys and ownership checks | PARTIAL | Authoritative IDs/endpoints/lifecycle |
| Company → Department | Numeric IDs | Company-scoped query | PARTIAL | Legacy branch relation and uniqueness decision |
| Department → Designation | `department_id: number|null` | Department filter and cross-company validation | PARTIAL | Required/cardinality and delete behavior |
| Company → Shift | None | None | MISSING | Master and assignment contract |
| Company → Week Off | Numeric ID and 5x7 grid | Company-scoped query | PARTIAL | Effective assignment and historical rules |
| Company → Holiday List → Holiday | Numeric IDs and nested query keys | Required parent and cross-company checks | PARTIAL | Assignment/timezone/lifecycle |
| Company → Asset Type | Numeric IDs | Company-scoped query | PARTIAL | Assets FK/lifecycle |
| Company → Policy | Numeric IDs and Blob metadata | Company-scoped query/file service methods | PARTIAL | Publication/access/file contract |
| Masters → Employee | Employee stores `company`, `work_location`, `department`, `designation`, `week_off`, `holiday_master` as strings | Static option arrays | REFACTOR_REQUIRED | Foreign keys, legacy migration and option adapters |
| Branch → Attendance geofence | Company has lat/lng/radius; Attendance has hardcoded `location.lat/lng/radiusMeters` | Geofence helper is not used by clock UI | REFACTOR_REQUIRED | Authorized work-location DTO and server clock validation |
| Week Off/Holiday → Attendance | Attendance has weekend/holiday statuses only | No dependency query/calculation | MISSING | Effective employee schedule resolution |
| Attendance/Leave/Holiday/WeekOff → Payroll | Payroll absent | None | MISSING | Backend calculation contract |
| Candidate → Interview | Numeric `candidateId` | Query hooks; mock records | PARTIAL | Backend FK/transition/permissions |
| Candidate → Offer/Letters | Offer uses `candidateId`; letters absent | Mock offers | PARTIAL | Legacy mapping and file/email contract |
| Candidate → Employee | Query params and source IDs; copies Job strings | Cross-module hooks in Employee create page | PARTIAL | Atomic conversion and authoritative master IDs |
| Asset Type → Asset → Allocation/Request | Asset Type only | No consumer | MISSING | Inventory/lifecycle contracts |
| Employee → Tax → Form16 | Employee only | No tax queries | MISSING | FY/employee/private-file contracts |
| Vendor category → Vendor → docs/performance | None | None | MISSING | Full domain graph |
| Visitor + Host → Visit/QR/log | None | None | MISSING | Host FK, QR and state log contract |
| Appraisal cycle/questions → reviews | None | None | MISSING | Workflow graph |

## ID and type conflicts

| Area | Current representation | Risk |
|---|---|---|
| Company masters | Central provisional `number` | Backend may use another ID type |
| Employee Company/Department/Designation/Work Location | Display strings | Cannot guarantee referential integrity or company scope |
| Recruitment Job Department | `department: string` plus unused `departmentId?: number` | Dual representation and drift |
| Recruitment Job title/location | Strings copied into Employee designation/work location | Bypasses Company masters |
| Employee reporting manager | Optional string | No Employee FK or team integrity |
| Employee location address fields | Domain type strings; schema coerces numeric IDs | Existing compile/runtime mapping conflict |
| Employee documents | Numeric Employee ID | File authorization/ownership still missing |

## Query dependencies

- Company query keys are centralized, parameterized and company-scoped.
- Employee and Recruitment have separate centralized families but do not consume Company master queries.
- Attendance uses its own keys, which is appropriate for authorized operational data, but has no master adapter.
- Company mutations do not invalidate future consumer option caches; that policy remains undecided.
- Employee creation imports Recruitment hooks directly, creating a cross-domain UI dependency. A conversion/application service or route payload contract would be safer.

## Safe migration sequence

1. Confirm identity, tenant and ID contracts.
2. Introduce DTO adapters and ID/label option boundaries.
3. Make Recruitment Jobs company-scoped and resolve Department/Designation/Branch semantics.
4. Migrate Employee strings to IDs with legacy dual-read mapping if required.
5. Make conversion submit IDs atomically.
6. Add Attendance-authorized location and schedule-resolution contracts.
7. Add Leave/Payroll consumers only after effective-date rules are stable.

