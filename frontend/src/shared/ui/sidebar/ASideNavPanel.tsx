import { cn } from "@/shared/lib/cn";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import type { NavGroup, NavItems, NavPanelLink } from "@/app/config/nav-config";
import { useSidebarStore } from "@/shared/stores/sidebar.store";



// ── Single flat link ──────────────────────────
const LeafLink = ({ item }: { item: NavPanelLink }) => (
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
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(() => {
    return item.children.some(child => location.pathname.includes(child.to)); 
  });

 // 2. Compute if a child is active directly during rendering
  const hasActiveChild = item.children.some((child) => location.pathname.includes(child.to));

  // 3. Combine your local toggle state with the computed active path state
  const shouldBeExpanded = isOpen || hasActiveChild;

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
      {shouldBeExpanded && (
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
const NavItemRenderer = ({ item }: { item: NavItems }) => {
  if (item.kind === "link")  return <LeafLink item={item} />;
  if (item.kind === "group") return <GroupLink item={item} />;
  return null;
};

// ── The panel itself ──────────────────────────────
export const ASideNavPanel = () => {
  const openModule  = useSidebarStore((s) => s.openModule);
  const closePanel  = useSidebarStore((s) => s.closePanel);
  const isPanelOpen = useSidebarStore((s) => s.isPanelOpen);

  if (!openModule) return null;

  return (
    <aside className={cn(
      "fixed left-[var(--main-sidebar-width)] top-0 z-30 flex h-full w-[var(--sidebar-panel-width)] flex-col border-r border-slate-200 bg-white dark:border-navy-700 dark:bg-navy-750 transition-transform duration-[250ms] ease-in-out",
      isPanelOpen ? "translate-x-0" : "-translate-x-[calc(100%+var(--main-sidebar-width))] xl:translate-x-0 xl:hidden"
    )}>

      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-navy-700">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-navy-300">
          {openModule.sectionLabel}
        </span>

        {/* Close button — only visible on mobile (xl:hidden). Changed from arrow to X to prevent duplication with top header. */}
        <button
          onClick={closePanel}
          className="xl:hidden flex size-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-0.5">
          {openModule.items.map((item, idx) => (
            <li key={idx}>
              <NavItemRenderer item={item} />
            </li>
          ))}
        </ul>
      </nav>

    </aside>
  );
};