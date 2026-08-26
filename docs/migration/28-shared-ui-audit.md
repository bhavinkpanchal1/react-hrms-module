# Shared UI audit

## Classification

| UI responsibility | Current implementation | Classification | Evidence/recommendation |
|---|---|---|---|
| Button | `shared/ui/button/Button.tsx` | EXISTS_AND_REUSE | Used across modules; supports variants/loading/icons |
| Input | `shared/ui/input/Input.tsx` | EXISTS_AND_REUSE | Reuse with RHF; confirm error `aria-describedby` behavior |
| Textarea | `shared/ui/textarea/Textarea.tsx` | EXISTS_AND_REUSE | Reused in forms |
| Select | `shared/ui/select/Select.tsx` | EXISTS_BUT_IMPROVE | Generic and feature-rich, but 356 lines and multiple casts; native registration and generic modes need focused tests |
| Date picker | `shared/ui/date-picker/DatePicker.tsx` | EXISTS_BUT_IMPROVE | Reused, but 432 lines; keyboard/date-format/timezone tests required |
| Checkbox/Radio | Shared primitives | EXISTS_AND_REUSE | Domain options must stay outside shared UI |
| Modal | `shared/ui/modal/Modal.tsx` | EXISTS_BUT_IMPROVE | Company reuses it; verify focus trap, restoration and destructive semantics in browser tests |
| Badge | `shared/ui/badge/Badge.tsx` | EXISTS_AND_REUSE | Visual primitive; domain status maps should provide semantics |
| Empty state | `shared/ui/empty-state/EmptyState.tsx` | EXISTS_AND_REUSE | Used by Company lists |
| Spinner/Skeleton | Shared primitives | EXISTS_AND_REUSE | Loading use is inconsistent outside Company |
| Pagination | `shared/ui/pagination/Pagination.tsx` | EXISTS_AND_REUSE | Generic one-based pagination; backend mapping still TBD |
| Step navigation | `shared/ui/step-navigation` | EXISTS_AND_REUSE | Employee/Candidate wizard boundary |
| Stepper | `shared/ui/stepper/Stepper.tsx` | EXISTS_BUT_IMPROVE | Imports missing Recruitment `StepItem`, causing TypeScript failure and cross-domain coupling |
| Review summary | `shared/ui/review-summary` | EXISTS_AND_REUSE | Generic review display |
| Toast | `react-hot-toast` in `AppProviders` | EXISTS_AND_REUSE | No domain wrapper; message consistency/retry policy not centralized |
| Confirmation dialog | Repeated compositions of shared Modal | MISSING_SHARED_COMPONENT | Company repeats cancel/delete footer and error presentation; create only after inventorying all modules |
| Error/retry panel | Repeated Company markup and `SimpleMasterList` API | MISSING_SHARED_COMPONENT | A small accessible shared state component may reduce drift |
| Tabs | Company implements accessible local tab strip | MISSING_SHARED_COMPONENT | Reuse candidate only after other tab requirements are known |
| Data table | Hand-built in Company/Employee/Recruitment | DUPLICATED | Sorting, responsive behavior, filters and actions vary |
| Card | Global `card` class plus `components/ui/card.tsx` | DUPLICATED | Clarify primitive ownership; avoid parallel shared systems |
| File upload | Employee and Company native file inputs | DOMAIN_SPECIFIC | Share only low-level file picker if requirements converge; keep Policy/Documents services separate |
| File download | Policy component-local Blob behavior | EXISTS_BUT_IMPROVE | Future private-file service abstraction is required |
| Status badge maps | Candidate and Attendance separate; Company inline | DOMAIN_SPECIFIC | Share visual tokens, not workflow enums |
| Drawer/Accordion | No approved shared primitive found | MISSING_SHARED_COMPONENT | Add only when a confirmed migrated workflow needs it |

## Product consistency

### Strongest area

Company uses consistent cards, responsive grids, horizontal overflow, Modal, EmptyState, Pagination and toast feedback. `SimpleMasterList` appropriately centralizes Department, Designation, Asset Type and Policy-compatible list behavior.

### Inconsistencies

- Employee and Recruitment tables are hand-built independently from Company lists.
- Loading/error/empty coverage is much stronger in Company than elsewhere.
- Company and Branch repeat active/inactive option arrays.
- Confirmation Modal footers are repeated across Company tabs.
- `components/ui` and `shared/ui` form two primitive locations.
- Navigation exposes many unimplemented pages, creating misleading affordances.

## Accessibility audit

| Area | Finding | Status |
|---|---|---|
| Company tabs | Proper tablist/tab/tabpanel, roving focus and arrow/Home/End keys | IMPLEMENTED |
| Company search/filter | Accessible labels present | IMPLEMENTED |
| Forms | Shared labels and inline errors used | PARTIAL |
| Modal focus | Requires browser-level verification | UNKNOWN |
| Icon-only actions | Mixed; exact full-repository coverage not guaranteed | PARTIAL |
| Custom Select/DatePicker keyboard use | Complex implementation; automated accessibility coverage absent | UNKNOWN |
| Tables on mobile | Horizontal overflow used, but semantic/caption behavior varies | PARTIAL |
| Dark mode | Broad Tailwind dark classes, no automated visual test | PARTIAL |

## Future shared-component rule

Before creating a primitive, search both `shared/ui` and `components/ui`. Share interaction mechanics only; keep Company, Attendance, Payroll, permission and workflow rules inside their domains.

