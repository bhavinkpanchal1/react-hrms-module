# Company Module — TanStack Query Specification

## Rule
All server state uses TanStack Query.

Pattern:
```text
Component
  ↓
useCompany hook
  ↓
company.api.ts
  ↓
httpClient
```

## Query Keys
Add a `company` section to shared query keys.

Conceptual keys:
```text
company.all
company.list
company.details(id)

company.branches(companyId)
company.branch(companyId, id)

company.departments(companyId)
company.department(companyId, id)

company.designations(companyId)
company.designation(companyId, id)

company.weekOffs(companyId)
company.weekOff(companyId, id)

company.holidayLists(companyId)
company.holidayList(companyId, id)
company.holidays(companyId, holidayListId)

company.assetTypes(companyId)
company.assetType(companyId, id)

company.policies(companyId)
company.policy(companyId, id)
```

Adapt naming to existing project conventions.

## Hooks
Provide hooks for Company and each sub-entity:
- list
- detail where needed
- create
- update
- delete

## Invalidation
Create → invalidate relevant list.
Update → invalidate list + detail.
Delete → invalidate relevant list.
Nested mutation → invalidate affected nested list/detail only.

Queries depending on IDs must use appropriate `enabled` guards.

Do not invalidate the entire application after every mutation.
