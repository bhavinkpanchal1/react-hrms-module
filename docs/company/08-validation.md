# Company Module — Validation Specification

## General
Use Zod + React Hook Form. Keep validation in schemas, not JSX.

## Company
Known initial Create Company requirements:
- company_name
- industry_type
- company_start_date

Additional fields must follow the final backend/business contract.

## Branch
Validate:
- branch name
- email
- contact
- address
- pincode
- latitude (-90 to 90)
- longitude (-180 to 180)
- radius greater than zero
- start date
- status

## Simple Masters
Department: required trimmed name.
Designation: required trimmed name; department requirement follows final rule.
Asset Type: required trimmed name.

## Week Off
Validate policy name and supported grid states:
- working
- half_day
- week_off

## Holiday List
- name required
- valid year
- remarks optional

## Holiday
- Holiday List required
- date required
- other fields according to backend contract

## Policy
- policy name
- description according to business rule
- file type/size according to backend storage limits

## Rule
Do not invent business validation. If undefined, report the missing decision.
