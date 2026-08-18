# Company Module — Permission Specification

## Principle
Frontend permissions control UI/UX. They are not the security boundary. Backend must enforce authorization.

## Roles to define
- Admin
- HR
- Manager
- Employee

## Actions to define
- View Company
- Create Company
- Edit Company
- Delete Company
- Manage Branch
- Manage Department
- Manage Designation
- Manage Week Off
- Manage Holiday List
- Manage Holiday
- Manage Asset Type
- Manage Policy

## Frontend
Hide/disable actions according to the approved permission matrix and use the existing RequirePermission pattern where appropriate.

## Backend
Every sensitive read/write must be independently authorized.

## Codex Rule
If the role matrix is not approved, do not invent it. Mark it unresolved.
