# Phase 1 — Identity, Tenancy and Permission Foundation

## 1. Identity Model

The frontend identity contract is intentionally small:

- `AuthUser`: numeric frontend ID, display name, email, documented React role, and typed permissions.
- `AuthSession`: current user, available companies, and active Company ID.
- `AvailableCompany`: numeric Company ID and display name only.

The only represented roles are the three already present in the React navigation: `hr`, `manager`, and `employee`. Roles and permissions are separate values. The nine permission codes are the pre-existing provisional React codes; they are not claimed to map to the legacy 65 flags or a future backend matrix.

## 2. Auth Flow

`LoginPage → useAuth → authApi → authMock/future backend`.

The Login page never accesses storage, mock data, environment flags, HTTP clients, or endpoints. In mock mode, three role personas are supported with password `password`:

- `hr@peoplepulse.test`
- `manager@peoplepulse.test`
- `employee@peoplepulse.test`

These credentials and persona mappings are test fixtures isolated in `auth.mock.ts`, not backend assumptions.

When `VITE_USE_MOCK_API !== "true"`, auth operations reject with `Auth backend endpoint TBD`. No endpoint was invented.

## 3. Session Flow

The Zustand auth store is the single runtime source of truth. It owns the current session, status, and restore/login error. `AuthSessionProvider` restores persisted state once when the application starts. The service alone owns the `hrms-auth-session` storage entry.

Stored data is structurally checked before restoration. Invalid JSON, an invalid session shape, or an active Company outside the user's memberships removes only the invalid auth session and produces a restore error.

Logout runs through the service, clears the auth session and legacy access-token key, clears the TanStack Query cache, changes the runtime state to unauthenticated, and lets the route guard return the user to Login. It does not clear unrelated browser storage.

## 4. Tenant / Company Model

Company membership belongs to the authenticated mock session. Company admin records are not treated as proof that a user can access those tenants. Consumers obtain `availableCompanies`, `activeCompany`, and `activeCompanyId` through `useAuth`.

The foundation does not change Company CRUD or automatically scope older operational modules. Future company-scoped queries must include `activeCompanyId` in their centralized query keys and service inputs before cross-company data is loaded.

## 5. Active Company Behavior

The responsive header selector lists only session memberships. Selection is validated by the service and persisted. Invalid IDs reject without changing the active Company. Refresh restoration retains the selection. An authenticated session with no active Company receives a dedicated selection screen instead of a redirect loop.

Switching Company does not rewrite current Company administration query keys: those already use explicit Company IDs. Future active-tenant queries must be keyed by tenant ID to prevent stale cross-company results.

## 6. Role Model

The existing `hr`, `manager`, and `employee` roles remain. No admin, accounts, gate-operator, or new role was invented. The sidebar's cached navigation model is derived from the authenticated user; it is not an independent identity source.

## 7. Permission Model

`usePermission` exposes:

- `hasPermission`
- `hasAnyPermission`
- `hasAllPermissions`

`PermissionGate` provides reusable conditional rendering with an optional denied fallback. Navigation filtering uses the same typed permission values. The previous disconnected permission Zustand store was removed so permissions have one source: the authenticated session.

The current permission codes remain provisional pending DEC-003 and backend confirmation.

## 8. Route Protection

`AuthenticatedRoute` protects the existing Dashboard layout and all existing application children. Anonymous access redirects to `/login` while preserving the requested pathname. `UnauthenticatedRoute` prevents an authenticated user from being sent back to Login. Loading restoration uses a full-page loading state.

No existing business route was removed or renamed, and no missing legacy route was fabricated.

## 9. Navigation Protection

Navigation modules remain role-filtered and can additionally declare a typed permission. Links can also declare a permission. Missing permissions remove the corresponding module/link without leaving empty groups.

This is navigation UX only. It is not a security boundary and does not authorize API access.

## 10. Mock Behavior

- HR has three Company memberships and the existing nine provisional permissions.
- Manager and Employee have smaller permission sets and one Company membership.
- Wrong credentials deterministically return `Invalid email or password`.
- Invalid Company selection deterministically rejects.
- Session persistence, restoration, Company persistence, corrupted-session rejection, and logout are implemented by the testable auth service.

## 11. Backend Replacement Strategy

Components and hooks depend on the stable `authApi` interface. Once the authoritative identity/session contract exists, the real branch can delegate to an HTTP adapter without changing Login, guards, header, navigation, or permission consumers. Token acquisition/refresh and backend session endpoints remain TBD.

## 12. Security Boundary

Frontend route guards, hidden navigation, and `PermissionGate` are usability controls only. The backend must authorize every request, enforce tenant membership, validate active Company scope, deny forbidden actions/files, and return an authoritative identity/permission contract.

## 13. Open Decisions

No new decision category was discovered. Existing blocked decisions remain:

- DEC-001: authoritative identity/session/token/expiry contract.
- DEC-002: authoritative Company memberships, selection, and tenant enforcement.
- DEC-003: surviving roles, canonical permission codes, and route/action/file matrix.

The test framework decision, backend denial contract, session expiry behavior, and active-Company propagation into older modules also remain unresolved under existing audit findings.

## 14. Files Changed

Created:

- `frontend/src/modules/auth/api/auth.api.ts`
- `frontend/src/modules/auth/api/auth.mock.ts`
- `frontend/src/modules/auth/api/auth.service.ts`
- `frontend/src/modules/auth/components/AuthSessionProvider.tsx`
- `frontend/src/modules/auth/components/PermissionGate.tsx`
- `frontend/src/modules/auth/components/RouteGuards.tsx`
- `frontend/src/modules/auth/hooks/useAuth.ts`
- `frontend/src/modules/auth/hooks/usePermission.ts`
- `frontend/src/modules/auth/stores/auth.store.ts`
- `frontend/src/modules/auth/types/auth.types.ts`
- `frontend/src/shared/types/access.types.ts`
- `docs/migration/36-phase-1-identity-tenancy-permission.md`

Modified:

- `frontend/src/modules/auth/pages/LoginPage.tsx`
- `frontend/src/app/providers/AppProviders.tsx`
- `frontend/src/app/router/index.tsx`
- `frontend/src/app/layouts/dashboard/DashboardLayout.tsx`
- `frontend/src/app/layouts/partials/TopHeader.tsx`
- `frontend/src/app/config/nav-config.ts`
- `frontend/src/shared/stores/sidebar.store.ts`

Deleted:

- `frontend/src/shared/hooks/use-permission-store.ts` (unused, disconnected duplicate permission state)

Company and other domain business files were not modified by Phase 1.

## 15. Tests Performed

- Executable Node smoke: HR mock login success; invalid password rejection; session persistence and restore; available companies; Company switch and persisted switch; invalid Company rejection; logout; corrupt-session rejection/removal; allowed and denied navigation filtering.
- TypeScript project build.
- Full ESLint run.
- Mock-mode production build.
- Production server route-shell smoke for existing routes.
- Static searches for component storage/mock/environment/HTTP access, shared domain imports, TypeScript suppressions, and `any`.
- `git diff --check`.

Local Chrome/Edge DevTools automation was attempted but the DevTools transport stalled in this environment. It was terminated and its isolated browser profile was removed. Consequently, DOM-level click/refresh behavior is not claimed as an automated browser test; service persistence and routing compilation are covered by the executable contract/build checks above.

