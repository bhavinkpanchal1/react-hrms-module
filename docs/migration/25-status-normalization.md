# Status normalization audit

## Rule

This is a mapping inventory, not an approval to normalize backend values. Legacy raw values must be preserved through explicit DTO mapping until canonical contracts are approved.

| Domain | Legacy value/label | React value/label | React mapping/UI | Conflict and transition status | Audit status |
|---|---|---|---|---|---|
| Generic masters | `1 Active`, `0 Inactive` | `active`, `inactive` | Company `EntityStatus`, Badge | Numeric/string mapping unconfirmed | BLOCKED |
| Company/Branch | Generic legacy active flags | `active`, `inactive` | Company forms/lists | Backend enum/default/transition unknown | PARTIAL |
| Employee | Includes `3 Resigned`, `4 Temp`; others unverified | `is_active: boolean`; employment type separate | Employee list lacks legacy status model | Loses Resigned/Temp and F&F semantics | MISSING |
| Attendance | present/active, absent, halfday, onleave; P/A/L/H/WO | `present`, `absent`, `half_day`, `leave`, `holiday`, `weekend`, `regularization_pending`, `regularized` | `ATTENDANCE_STATUS_META` | `active`, `halfday`, `onleave`, `WO` need adapters; precedence absent | PARTIAL |
| Leave | `1 Pending`, `3 Approved`, rejected unknown | None | None | Raw rejected value remains unknown | MISSING |
| Recruitment candidate | `Pending`, `IsEmployee`; multiple fields | `applied`, `screening`, `interview`, `offer`, `onboarding`, `hired`, `rejected` | Candidate badge/pipeline | React pipeline is richer but legacy mapping is unapproved | BLOCKED |
| Interview | `1 Pending`, `2 Rejected`, `3 Complete` | status: `scheduled/completed/cancelled/no_show`; result: `pending/pass/fail` | Interview forms/cards | Split status/result may improve model but requires mapping | BLOCKED |
| Job | No standalone legacy model verified | `draft/open/closed/on_hold` | Job form/table | Legacy relationship unknown | UNKNOWN |
| Offer | Legacy letters/actions, no standalone model verified | `pending/accepted/rejected/expired/withdrawn` | Offers page | Backend/product mapping unknown | UNKNOWN |
| Payroll | `0 Inactive`, `1 Active`; monthly default `Paid` | None | None | No React model | MISSING |
| Tax declaration | `pending/approved/rejected` | None | None | No React model | MISSING |
| Form16 | Model `draft/published`; views `pending/generated/uploaded` | None | None | Legacy itself conflicts; do not collapse | UNKNOWN |
| Asset request | pending/approved/rejected; return/repair; returned/closed | None | None | Entity status vs action/lifecycle needs separation | MISSING |
| Petty cash | requested/admin_approved/accounts_approved/paid/closed; `rejected` and `Rejected` | None | None | Legacy casing conflict | UNKNOWN |
| Visitor visit | pending/checked_in/checked_out | None | None | No React model | MISSING |
| Week Off cell | Legacy schedule semantics | `working/half_day/week_off` | Grid controls | Exact backend values unknown | BLOCKED |

## React status duplication

- Candidate colors are domain-specific in `CandidateStatusBadge.tsx`; Attendance uses `ATTENDANCE_STATUS_META`; Company maps active/inactive inline. There is no cross-domain status token contract.
- A single universal status enum is not recommended: raw workflow states have different meanings. Shared visual tokens may be centralized while domain transitions remain domain-owned.
- `CandidateStatus` is inferred from a mutable options array rather than the readonly value tuple, weakening the intended literal union.

## Required decisions

1. Publish raw backend values and labels per entity.
2. Separate lifecycle state, outcome, action and display label.
3. Define allowed transitions and actor for each workflow.
4. Define legacy alias mapping without rewriting historical values.
5. Resolve Form16 and Petty Cash legacy contradictions explicitly.
6. Define badge semantic tokens independently of raw values.

