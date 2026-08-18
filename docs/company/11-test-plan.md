# Company Module — Test Plan

## Company List
- load
- loading
- empty
- error
- Add Company
- validation
- create and redirect
- row navigation
- pagination

## Company Detail
- invalid ID handling
- loading
- company load
- all tabs render
- tab switching
- no request loops

## Overview
- all sections
- validation
- location cascading
- save
- error/success
- logo preview
- logo upload only with backend support

## Branch
- list
- create
- edit
- delete confirmation
- coordinate validation
- radius validation
- empty/error states

## Department / Designation / Asset Type
For each:
- list
- create
- edit where supported
- delete
- validation
- loading
- empty
- error
- shared component reuse

## Week Off
- 5 × 7 grid
- valid states only
- save
- reload existing configuration

## Holiday List
- list
- create
- edit
- delete
- year validation

## Holiday
- selected list controls data
- add/remove
- changing list changes data
- no request without required IDs

## Policy
- list
- upload
- validation
- view
- download
- delete confirmation
- file errors

## Regression
After Company changes verify Employee, Recruitment, Attendance header clock-in/out, Attendance timer, routing and shared UI.

## Build Gate
Do not mark a phase complete if TypeScript/build fails, a route crashes, implementation errors remain in console, mock mode fails, or existing modules regress.
