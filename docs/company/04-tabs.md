# Company Module — Tab Specification

## 1. Overview
Purpose: manage company profile and organization-level configuration.

Sections:
- Company Information
- Contact Information
- Email Configuration
- Registered Office
- Corporate Office
- Bank Information

Reuse existing Input, Select, DatePicker, Checkbox, RadioGroup, LogoUpload and shared layout patterns.

## 2. Branch
Purpose: manage company branches/work locations.

List:
- Branch Name
- Location
- Contact
- Employee ID Series
- Status
- Actions

Create/Edit:
- Branch Name
- Email
- Contact Number
- Full Address
- Radius
- Latitude
- Longitude
- Employee ID Series
- Start Date
- Status

Branch geofence configuration must eventually replace hardcoded Attendance work-location configuration.

## 3. Department
Use `SimpleMasterList`.
Primary field: Department Name.

## 4. Designation
Use `SimpleMasterList`.
Fields:
- Designation Name
- Department relationship if required by final contract.

## 5. Week Off
Use a self-contained 5 × 7 grid editor.
Rows: 1st–5th occurrence.
Columns: Monday–Sunday.
States: Working, Half Day, Week Off.

## 6. Holiday
Manages individual dates inside a selected Holiday List.
UI:
- Holiday List selector
- holiday list
- Add Holiday
- Remove Holiday with confirmation

## 7. Holiday List
Yearly holiday-calendar master.
Fields:
- Name
- Year
- Remarks

Implement before Holiday.

## 8. Asset Type
Use `SimpleMasterList`.
Company owns only the master type. Employee asset assignment belongs elsewhere.

## 9. Policy
List:
- Policy name
- Description
- File information
- Actions

Actions:
- View
- Download
- Edit if supported
- Delete

Reuse the Employee document upload interaction pattern. Do not invent file storage behavior without a backend contract.
