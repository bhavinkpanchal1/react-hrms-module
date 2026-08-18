# Company Module — UI Specification

## General
Follow the existing HRMS/Linenone visual language. Reuse shared UI. Do not create duplicate Button, Input, Select, Modal, Tabs, Badge, EmptyState, Pagination or confirmation components.

## Company List
- Page title
- Add Company button
- Table
- Loading state
- Empty state
- Error state
- Pagination where required

Columns:
- Company Name
- Industry
- Start Date
- Status
- Actions

Row click navigates to Company Detail.

## Company Detail
Header with company identity/status and optional actions.
Below it: horizontal tabs.
Keep the page shell thin.

## Forms
Use React Hook Form + Zod.
Desktop: responsive grid, normally two columns where appropriate.
Mobile: one column.
Every form needs validation, submit loading/disabled state, success feedback and error feedback.

## Master Lists
Department, Designation and Asset Type should use `SimpleMasterList`.

## Tables
Provide header, rows, loading, empty, error, actions and responsive overflow.

## Modals
Use existing Modal. Destructive actions use existing confirmation pattern.

## File UI
Policy should show filename and file metadata where available, plus View/Download/Delete. Never fabricate file URLs.

## Accessibility
Labels must be associated with controls. Icon-only buttons need aria-label/title. Follow existing Modal focus/close behavior.

## Theme
All Company UI must support existing dark mode and responsive behavior.
