# Company Module — User Flow

## Company List
Route: `/hr/companies`

1. Load companies.
2. Show list with loading, empty and error states.
3. User selects Add Company.
4. Create minimum company record.
5. On success remain in the Company list for the Phase 1 mock-first flow. Company Detail navigation will be added in its later phase.
6. User completes configuration through tabs.

## Company Detail
Planned route: `/hr/companies/:id`

Tabs:
`Overview | Branch | Department | Designation | Week Off | Holiday | Holiday List | Asset Type | Policy`

The detail page remains a thin shell.

## Tab Rules
- Each server-backed tab owns its own query/mutation hooks.
- Avoid unnecessary reloads of unrelated tabs.
- Mutations invalidate only affected query keys.
- Destructive operations require confirmation.
- Every feature needs loading, empty, error and success states.

## Dependency Flow

Company → Branch → Attendance work location

Company → Department → Designation → Employee

Company → Holiday List → Holiday → Attendance/Leave

Company → Asset Type → Employee Assets

Company → Policy → Employee/HR

## Holiday Dependency
Holiday List is the master calendar containing Name, Year and Remarks. Holiday represents individual dates inside a selected Holiday List. Holiday List must be implemented before Holiday.

## Navigation
`/hr/companies` = list  
`/hr/companies/:id` = planned detail route

The `/hr/companies` prefix is the resolved canonical frontend route because it matches the existing HR navigation. Do not add a duplicate `/company` route.
