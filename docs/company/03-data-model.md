# Company Module — Data Model

## Entities
- Company
- Branch
- Department
- Designation
- WeekOff
- WeekOffGrid
- HolidayList
- Holiday
- AssetType
- Policy

## Company
Sections:
- Company Information
- Contact Information
- Email Configuration
- Registered Office
- Corporate Office
- Bank Information

Known concepts include company name, industry, start date, status, logo, contact details, SMTP configuration, office addresses and bank information. Exact final fields must match the backend contract.

## Branch
Known fields:
- branch name
- email
- contact number
- address
- radius_meters
- latitude
- longitude
- employee ID series
- start date
- status

The geofence fields mirror the Attendance work-location concept.

## Department
Master name plus company relationship.

## Designation
Master name plus company relationship and department relationship according to the final backend/business rule.

## WeekOff
5 × 7 grid:
- Rows: 1st, 2nd, 3rd, 4th, 5th
- Columns: Monday–Sunday
- States: Working, Half Day, Week Off

## HolidayList
- name
- year
- remarks

## Holiday
Belongs to a Holiday List and represents an individual holiday date. Exact name/description fields must match backend contract.

## AssetType
Master name plus company relationship.

## Policy
- policy name
- description
- uploaded file metadata

File storage behavior depends on backend contract.

## Relationships
```text
Company
├── Branch
├── Department
├── Designation
├── WeekOff
├── HolidayList
├── AssetType
└── Policy

Department
└── Designation

HolidayList
└── Holiday
```

Future cross-module relationships:
```text
Branch → Employee / Attendance
Department → Employee
Designation → Employee
WeekOff → Attendance / Leave
HolidayList → Holiday → Attendance / Leave
AssetType → Employee Assets
Policy → Employee / HR
```

Domain types belong in `src/modules/company/types/company.types.ts`. Form validation belongs in `src/modules/company/schema/company.schema.ts`.
