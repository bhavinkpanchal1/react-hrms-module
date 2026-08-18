# Company Module — API Specification

## Rule
This is the frontend contract shape. Exact URLs must match the Django backend contract. Never invent backend endpoints silently.

## Company
Conceptually:
```text
GET    companies/
GET    companies/:id/
POST   companies/
PATCH  companies/:id/
DELETE companies/:id/
```

## Branch
Conceptually:
```text
GET    company/:companyId/branches/
GET    company/:companyId/branches/:id/
POST   company/:companyId/branches/
PATCH  company/:companyId/branches/:id/
DELETE company/:companyId/branches/:id/
```

## Other Resources
Department, Designation, Week Off, Holiday List, Holiday, Asset Type and Policy each require list/create/update/delete operations as supported by the backend.

## File Operations
Policy file upload/download/view/delete requires the backend file-storage contract.

## Frontend Rules
- API functions live in `src/modules/company/api/company.api.ts`.
- Use the existing `httpClient`.
- Components must never call Axios/httpClient directly.
- Centralize endpoint paths.
- Follow `VITE_USE_MOCK_API` for mock behavior.
- Every implemented operation should have a mock path when mock mode is enabled.
