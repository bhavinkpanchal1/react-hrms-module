# Sidebar Implementation — Step by Step

**Stack:** React + TypeScript + Zustand + React Router + Tailwind CSS  
**Goal:** A dual-sidebar (icon rail + panel) that is role-aware, scalable, and easy to extend.

---

## What we are building

```
┌──────┬──────────────┬──────────────────────────────┐
│      │              │                              │
│  70px│   220px      │   Main content area          │
│      │              │                              │
│  📋  │  My Access   │                              │
│ ─── │  ─────────   │                              │
│  👤  │  Attendance  │                              │
│ (act)│  Salary      │                              │
│  👥  │  Appraisal   │                              │
│  💼  │  ▸ Tax &     │                              │
│  ⚙️  │    Regime    │                              │
│      │    Form 16   │                              │
└──────┴──────────────┴──────────────────────────────┘
  Icon    Panel           Page
  Rail    (changes on
          icon click)
```

The icon rail always shows. The panel stays open on desktop.  
Clicking an icon highlights it and changes the panel content.  
Roles control which icons appear in the rail.

---

## Today's tasks (in order — do one at a time)

| # | Task | Files you touch |
|---|------|----------------|
| 1 | Install Zustand | terminal only |
| 2 | Create the nav config | `nav-config.ts` |
| 3 | Create the Zustand store | `sidebar.store.ts` |
| 4 | Build the Icon Rail | `IconRail.tsx` |
| 5 | Build the Nav Panel | `NavPanel.tsx` |
| 6 | Assemble the layout | `DashboardLayout.tsx` |
| 7 | Wire up roles (mock) | `sidebar.store.ts` edit |

---

## Task 1 — Install Zustand

Open your terminal in the project root:

```bash
npm install zustand
```

That is all. Zustand has no other dependencies.

**What is Zustand?**  
Think of it as a tiny global variable that any component can read and update. No prop-drilling. No context boilerplate. Just `useStore()` anywhere.

---

## Task 2 — Create the nav config

**Create:** `src/shared/config/nav-config.ts`

This file is the **single source of truth** for the entire sidebar.  
Adding a new module = add one object here. Nothing else changes.

```ts
// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type Role = "hr" | "manager" | "employee";

// A single link
export interface NavLeaf {
  kind: "leaf";
  label: string;
  to: string;        // React Router path
}

// A collapsible group with child links
export interface NavGroup {
  kind: "group";
  label: string;
  children: NavLeaf[];
}

// One item in the panel list (either a link or a group)
export type NavItem = NavLeaf | NavGroup;

// One full module (one icon in the rail)
export interface Module {
  id: string;
  label: string;
  icon: string;      // We'll use SVG paths or Lucide icon names
  roles: Role[];     // Which roles can see this module
  sectionLabel: string;   // Header shown at the top of the panel
  items: NavItem[];
}
```

Then define your modules. Here is the exact structure matching your Django templates:

```ts
// ─────────────────────────────────────────────
// MODULE DEFINITIONS
// ─────────────────────────────────────────────

export const ALL_MODULES: Module[] = [

  // ── My Access (visible to everyone) ──────────
  {
    id: "my-access",
    label: "My Access",
    icon: "user",
    roles: ["hr", "manager", "employee"],
    sectionLabel: "My Access",
    items: [
      { kind: "leaf", label: "Attendance",      to: "/attendance" },
      { kind: "leaf", label: "Salary",          to: "/employee/salary" },
      { kind: "leaf", label: "Notifications",   to: "/notifications" },
      { kind: "leaf", label: "Company Policy",  to: "/policy" },
      { kind: "leaf", label: "Appraisal",       to: "/employee/cycles" },
      {
        kind: "group",
        label: "Tax & Compliance",
        children: [
          { kind: "leaf", label: "Tax Regime",       to: "/employee/tax-regime" },
          { kind: "leaf", label: "Tax Declarations",  to: "/employee/tax-declarations" },
          { kind: "leaf", label: "My Form 16s",       to: "/employee/form16" },
        ],
      },
      { kind: "leaf", label: "Assets", to: "/employee/assets" },
    ],
  },

  // ── Manager Access (manager + hr) ─────────────
  {
    id: "manager",
    label: "Manager",
    icon: "users-plus",
    roles: ["hr", "manager"],
    sectionLabel: "Manager Access",
    items: [
      { kind: "leaf", label: "Attendance Report",         to: "/report/team-attendance" },
      { kind: "leaf", label: "Monthly Attendance Report", to: "/report/team-monthly-attendance" },
      { kind: "leaf", label: "Leave Approve",             to: "/hr/team_leave_approval_list" },
      { kind: "leaf", label: "Regularization Approve",    to: "/hr/team_regularization_approval_list" },
      { kind: "leaf", label: "Resignation Approve",       to: "/employee/team_resignation" },
      { kind: "leaf", label: "Appraisal Review",          to: "/supervisor/cycles" },
    ],
  },

  // ── HR Access (hr only) ───────────────────────
  {
    id: "hr",
    label: "HR",
    icon: "users",
    roles: ["hr"],
    sectionLabel: "HR Access",
    items: [
      { kind: "leaf", label: "Dashboard",    to: "/hr/dashboard" },
      { kind: "leaf", label: "Company",      to: "/hr/companies" },
      { kind: "leaf", label: "Employee",     to: "/hr/employees" },
      { kind: "leaf", label: "Annual Leave", to: "/hr/annual-leave" },
      {
        kind: "group",
        label: "Payroll",
        children: [
          { kind: "leaf", label: "Salary Generate",    to: "/payroll/salary" },
          { kind: "leaf", label: "Salary Register",    to: "/payroll/salary-sheet" },
          { kind: "leaf", label: "Tax Approvals",      to: "/payroll/tax-approvals" },
          { kind: "leaf", label: "Form 16 Dashboard",  to: "/payroll/form16" },
        ],
      },
      { kind: "leaf", label: "Salary Slip", to: "/payroll/salary-slip" },
      {
        kind: "group",
        label: "Approvals",
        children: [
          { kind: "leaf", label: "Leave",           to: "/hr/leave-approval" },
          { kind: "leaf", label: "Regularizations", to: "/hr/regularization-approval" },
          { kind: "leaf", label: "Resignation",     to: "/hr/resignation" },
        ],
      },
      { kind: "leaf", label: "Announcements", to: "/hr/announcements" },
      {
        kind: "group",
        label: "Appraisal",
        children: [
          { kind: "leaf", label: "Questions", to: "/hr/appraisal/questions" },
          { kind: "leaf", label: "Cycles",    to: "/hr/appraisal/cycles" },
        ],
      },
    ],
  },

  // ── Recruitment (hr + manager) ─────────────────
  {
    id: "recruitment",
    label: "Recruitment",
    icon: "briefcase",
    roles: ["hr", "manager"],
    sectionLabel: "Recruitment",
    items: [
      {
        kind: "group",
        label: "Candidates",
        children: [
          { kind: "leaf", label: "All Candidates", to: "/recruitment/candidates" },
          { kind: "leaf", label: "Pipeline",        to: "/recruitment/pipeline" },
          { kind: "leaf", label: "Interviews",      to: "/recruitment/interviews" },
        ],
      },
      { kind: "leaf", label: "Job Listings", to: "/recruitment/jobs" },
      { kind: "leaf", label: "Offers",       to: "/recruitment/offers" },
    ],
  },

  // ── Admin (hr + manager) ───────────────────────
  {
    id: "admin",
    label: "Admin",
    icon: "settings",
    roles: ["hr", "manager"],
    sectionLabel: "Admin",
    items: [
      { kind: "leaf", label: "Assets",         to: "/admin/assets" },
      { kind: "leaf", label: "Asset Requests", to: "/asset/request/list" },
      {
        kind: "group",
        label: "Vendor",
        children: [
          { kind: "leaf", label: "Service Category", to: "/vendor/service-category" },
          { kind: "leaf", label: "Vendor List",       to: "/vendor/list" },
        ],
      },
      { kind: "leaf", label: "Visitors", to: "/vendor/gate-scan" },
      {
        kind: "group",
        label: "Petty Cash / Expense",
        children: [
          { kind: "leaf", label: "Expense Claims", to: "/expense/claims" },
          { kind: "leaf", label: "Petty Cash",     to: "/expense/petty-cash" },
        ],
      },
    ],
  },

  // ── Reports (hr + manager) ──────────────────────
  {
    id: "reports",
    label: "Reports",
    icon: "bar-chart",
    roles: ["hr", "manager"],
    sectionLabel: "Reports",
    items: [
      {
        kind: "group",
        label: "Candidates",
        children: [
          { kind: "leaf", label: "Hiring Funnel",   to: "/reports/candidates/funnel" },
          { kind: "leaf", label: "Source Analysis", to: "/reports/candidates/source" },
          { kind: "leaf", label: "Offer Acceptance",to: "/reports/candidates/offers" },
        ],
      },
      {
        kind: "group",
        label: "Employee",
        children: [
          { kind: "leaf", label: "Headcount",          to: "/reports/employee/headcount" },
          { kind: "leaf", label: "Attrition",           to: "/reports/employee/attrition" },
          { kind: "leaf", label: "Attendance Summary",  to: "/reports/employee/attendance" },
        ],
      },
    ],
  },

];

// Helper — filter modules for a given role
export const getModulesForRole = (role: Role): Module[] =>
  ALL_MODULES.filter((m) => m.roles.includes(role));
```

---

## Task 3 — Create the Zustand store

**Create:** `src/shared/store/sidebar.store.ts`

This is the "brain" of the sidebar. Any component can read from it or update it.

```ts
import { create } from "zustand";
import type { Role, Module } from "@/shared/config/nav-config";
import { getModulesForRole, ALL_MODULES } from "@/shared/config/nav-config";

// ─────────────────────────────────────────────
// Shape of the store (what it holds)
// ─────────────────────────────────────────────
interface SidebarState {
  // The current user role (hardcoded for now, swap for auth later)
  role: Role;

  // Which module icon is currently active in the rail
  activeModuleId: string;

  // Whether the panel is open (used on mobile for toggle)
  isPanelOpen: boolean;

  // ── Computed helpers ──
  // All modules this role can see
  visibleModules: Module[];

  // The currently active module object (full data)
  activeModule: Module | undefined;

  // ── Actions ──
  setRole: (role: Role) => void;
  setActiveModule: (id: string) => void;
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
}

// ─────────────────────────────────────────────
// Create the store
// ─────────────────────────────────────────────
export const useSidebarStore = create<SidebarState>((set, get) => {

  // Default role — change "hr" to "employee" or "manager" to test
  // Later: replace this with: const role = getAuthRole() or from API
  const defaultRole: Role = "hr";
  const defaultModules = getModulesForRole(defaultRole);
  const defaultModuleId = defaultModules[0]?.id ?? "";

  return {
    role: defaultRole,
    activeModuleId: defaultModuleId,
    isPanelOpen: true, // open by default on desktop

    // Computed: re-derived whenever role changes
    visibleModules: defaultModules,
    activeModule: defaultModules.find((m) => m.id === defaultModuleId),

    // ── Actions ──
    setRole: (role) => {
      const modules = getModulesForRole(role);
      const firstId = modules[0]?.id ?? "";
      set({
        role,
        visibleModules: modules,
        activeModuleId: firstId,
        activeModule: modules.find((m) => m.id === firstId),
      });
    },

    setActiveModule: (id) => {
      const { visibleModules } = get();
      const module = visibleModules.find((m) => m.id === id);
      set({ activeModuleId: id, activeModule: module });
    },

    togglePanel: () => set((s) => ({ isPanelOpen: !s.isPanelOpen })),
    openPanel: ()  => set({ isPanelOpen: true }),
    closePanel: () => set({ isPanelOpen: false }),
  };
});
```

**How to use the store in any component:**
```ts
// Read state
const activeModule = useSidebarStore((s) => s.activeModule);

// Call an action
const setActiveModule = useSidebarStore((s) => s.setActiveModule);
setActiveModule("hr");
```

---

## Task 4 — Build the Icon Rail

**Create:** `src/shared/ui/sidebar/IconRail.tsx`

The left strip with module icons. Clicking one sets the active module.

```tsx
import { useSidebarStore } from "@/shared/store/sidebar.store";

// Simple SVG icon map — replace with Lucide if you prefer
const ICONS: Record<string, React.ReactNode> = {
  "user": (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  "users": (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  "users-plus": (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  ),
  "briefcase": (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  "settings": (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  "bar-chart": (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
};

export const IconRail = () => {
  const visibleModules  = useSidebarStore((s) => s.visibleModules);
  const activeModuleId  = useSidebarStore((s) => s.activeModuleId);
  const setActiveModule = useSidebarStore((s) => s.setActiveModule);

  return (
    <aside className="flex h-full w-[70px] flex-col items-center border-r border-slate-200 bg-white dark:border-navy-700 dark:bg-navy-800">

      {/* Logo */}
      <div className="flex pt-4 pb-6">
        <a href="/">
          <img className="size-11" src="/logo.png" alt="logo" />
        </a>
      </div>

      {/* Module icons */}
      <nav className="flex flex-1 flex-col items-center gap-1 overflow-y-auto">
        {visibleModules.map((mod) => {
          const isActive = mod.id === activeModuleId;
          return (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              title={mod.label}
              className={[
                "flex size-11 items-center justify-center rounded-lg transition-colors duration-200",
                isActive
                  ? "bg-primary text-white"                          // active = filled colour
                  : "text-slate-500 hover:bg-primary/10 hover:text-primary dark:text-navy-300",
              ].join(" ")}
            >
              {ICONS[mod.icon]}
            </button>
          );
        })}
      </nav>

      {/* Avatar at bottom */}
      <div className="flex flex-col items-center pb-4">
        <button className="size-10 rounded-full overflow-hidden border-2 border-slate-200">
          <img src="/avatar-placeholder.png" alt="avatar" />
        </button>
      </div>

    </aside>
  );
};
```

---

## Task 5 — Build the Nav Panel

**Create:** `src/shared/ui/sidebar/NavPanel.tsx`

The panel that shows the list of links for the active module.

```tsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSidebarStore } from "@/shared/store/sidebar.store";
import type { NavItem, NavLeaf, NavGroup } from "@/shared/config/nav-config";

// ── Single flat link ──────────────────────────
const LeafLink = ({ item }: { item: NavLeaf }) => (
  <NavLink
    to={item.to}
    className={({ isActive }) =>
      [
        "flex py-2 px-2 text-sm tracking-wide rounded transition-colors duration-200 outline-none",
        isActive
          ? "font-semibold text-primary dark:text-accent-light"
          : "text-slate-600 hover:text-slate-900 dark:text-navy-200 dark:hover:text-navy-50",
      ].join(" ")
    }
  >
    {item.label}
  </NavLink>
);

// ── Collapsible group ─────────────────────────
const GroupLink = ({ item }: { item: NavGroup }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Group trigger button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="flex w-full items-center justify-between py-2 px-2 text-sm tracking-wide text-slate-600 hover:text-slate-900 dark:text-navy-200 dark:hover:text-navy-50 transition-colors"
      >
        <span>{item.label}</span>
        <svg
          className={`size-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Children — only shown when open */}
      {isOpen && (
        <ul className="ml-2 border-l border-slate-200 dark:border-navy-600 pl-3">
          {item.children.map((child) => (
            <li key={child.to}>
              <NavLink
                to={child.to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-2 py-1.5 px-2 text-sm rounded transition-colors duration-200",
                    isActive
                      ? "font-semibold text-primary dark:text-accent-light"
                      : "text-slate-500 hover:text-slate-800 dark:text-navy-300 dark:hover:text-navy-50",
                  ].join(" ")
                }
              >
                <span className="size-1.5 rounded-full border border-current opacity-50 shrink-0" />
                {child.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ── Renders the right component for leaf vs group ─
const NavItemRenderer = ({ item }: { item: NavItem }) => {
  if (item.kind === "leaf")  return <LeafLink item={item} />;
  if (item.kind === "group") return <GroupLink item={item} />;
  return null;
};

// ── The panel itself ──────────────────────────────
export const NavPanel = () => {
  const activeModule = useSidebarStore((s) => s.activeModule);
  const closePanel   = useSidebarStore((s) => s.closePanel);

  if (!activeModule) return null;

  return (
    <aside className="flex h-full w-[220px] flex-col border-r border-slate-200 bg-white dark:border-navy-700 dark:bg-navy-750">

      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-navy-700">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-navy-300">
          {activeModule.sectionLabel}
        </span>

        {/* Close button — only visible on mobile (xl:hidden) */}
        <button
          onClick={closePanel}
          className="xl:hidden flex size-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-0.5">
          {activeModule.items.map((item, idx) => (
            <li key={idx}>
              <NavItemRenderer item={item} />
            </li>
          ))}
        </ul>
      </nav>

    </aside>
  );
};
```

---

## Task 6 — Assemble the layout

**Edit:** `src/app/layouts/dashboard/DashboardLayout.tsx`

Combine the icon rail + panel + main content:

```tsx
import { IconRail } from "@/shared/ui/sidebar/IconRail";
import { NavPanel } from "@/shared/ui/sidebar/NavPanel";
import { useSidebarStore } from "@/shared/store/sidebar.store";
import { Outlet } from "react-router-dom";

export const DashboardLayout = () => {
  const isPanelOpen = useSidebarStore((s) => s.isPanelOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-navy-900">

      {/* ── Icon Rail (always visible) ── */}
      <IconRail />

      {/* ── Nav Panel (open on desktop, toggle on mobile) ── */}
      {isPanelOpen && <NavPanel />}

      {/* ── Mobile overlay ── */}
      {isPanelOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/40 xl:hidden"
          onClick={() => useSidebarStore.getState().closePanel()}
        />
      )}

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
};
```

---

## Task 7 — Swap the mock role (do this last)

Right now, `sidebar.store.ts` has:
```ts
const defaultRole: Role = "hr";  // ← hardcoded
```

**When you have auth**, replace it like this:

```ts
// Option A: From an API response on login
const defaultRole: Role = authResponse.user.role as Role;

// Option B: From a JWT token in localStorage
import { jwtDecode } from "jwt-decode";
const token = localStorage.getItem("token");
const decoded = jwtDecode<{ role: Role }>(token!);
const defaultRole = decoded.role;

// Option C: From a React context (if you already have one)
// → in that case, call setRole(role) from inside the auth context
```

To test different roles right now, just change the string in the store and save.

---

## File structure after all tasks

```
src/
├── shared/
│   ├── config/
│   │   └── nav-config.ts          ← Task 2: all menus defined here
│   ├── store/
│   │   └── sidebar.store.ts       ← Task 3: Zustand store
│   └── ui/
│       └── sidebar/
│           ├── IconRail.tsx       ← Task 4: left icon strip
│           └── NavPanel.tsx       ← Task 5: panel with nav links
└── app/
    └── layouts/
        └── dashboard/
            └── DashboardLayout.tsx ← Task 6: wires it together
```

---

## How to add a new module in the future

1. Open `nav-config.ts`
2. Add one object to `ALL_MODULES` with: `id`, `label`, `icon`, `roles`, `sectionLabel`, `items`
3. Done — the icon rail and panel update automatically

No other files need to change.

---

## How roles work — summary

| File | Role's job |
|------|-----------|
| `nav-config.ts` | Defines `roles: ["hr", "manager"]` per module |
| `sidebar.store.ts` | Filters `ALL_MODULES` using `getModulesForRole(role)` |
| `IconRail.tsx` | Renders only `visibleModules` (already filtered) |
| `NavPanel.tsx` | Renders whatever `activeModule` contains |

The role filter happens **once** in the store. Components just display what they're given.
