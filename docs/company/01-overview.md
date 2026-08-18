# Company Module — Overview

## Purpose
The Company module is the HRMS master-configuration area for company-level information and configuration used by other HRMS modules.

## Current Scope
1. Overview
2. Branch
3. Department
4. Designation
5. Week Off
6. Holiday
7. Holiday List
8. Asset Type
9. Policy

## Architecture
Follow the established project layering:

`types → schema → api → hooks → pages/components`

Reuse existing shared UI such as Select, DatePicker, Modal, Tabs, Alert, confirmation utilities and Pagination.

## Business Role
Company configuration will eventually be consumed by Employee, Attendance, Leave, Payroll, Assets and other HRMS modules.

Important relationships:
- Branch → Attendance work location/geofence
- Department → Designation → Employee
- Week Off / Holiday → Attendance and Leave calculations
- Asset Type → Employee Assets
- Policy → Employee/HR

## Scope Boundary
Company owns master configuration. Do not implement Employee assignment, attendance authorization, payroll calculations, leave calculations or asset assignment inside this module unless separately specified.

## Important Existing Constraint
The reference design already contains a foundation, shared components, Company List, Company Detail shell and Overview implementation. Some items remain pending and backend contracts may still be required. Do not invent backend behavior.
