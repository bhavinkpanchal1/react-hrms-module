import { cn } from "@/shared/lib/cn";
import { ChevronRight, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const NAV_GROUPS = [
  {
    label: "Core HR",
    items: [
      { to: "/employees", label: "Employees" },
      { to: "/attendance", label: "Attendance" },
      { to: "/leave", label: "Leave" },
      { to: "/payroll", label: "Payroll" },
    ],
  },
  {
    label: "Recruitment",
    items: [
      { to: "/recruitment", label: "Job Listings" },
      { to: "/recruitment/candidates", label: "Candidates" },
    ],
  },
  {
    label: "Administration",
    items: [
      { to: "/settings", label: "Settings" },
      { to: "/settings/roles", label: "Roles" },
    ],
  },
];

interface SidebarPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SidebarPanel = ({ isOpen, onClose }: SidebarPanelProps) => {
  const location = useLocation();
  return (
    <aside
      className={cn(
        // Position: left-aligned, starts at icon-rail offset on md+
        "fixed left-0 top-0 z-30 h-full",
        "w-[calc(var(--main-sidebar-width)+var(--sidebar-panel-width))]",
        // Hidden by default, slide in when open
        "-translate-x-full transition-transform",
        "duration-[250ms] ease-in shadow-soft dark:shadow-soft-dark",
        isOpen && "translate-x-0 ease-out",
      )}
      aria-label="Navigation panel"
    >
      {/* Inner panel (offset to start after icon rail) */}
      <div className="flex h-full flex-col bg-white pl-[var(--main-sidebar-width)] dark:bg-navy-750">
        {/* Panel header */}
        <div className="flex h-[var(--header-height)] shrink-0 items-center justify-between border-b border-slate-150 px-4 dark:border-navy-700">
          <span className="text-base font-semibold tracking-wider text-slate-800 dark:text-navy-100">
            HRMS
          </span>
          {/* Close button — visible only on mobile */}
          <button
            onClick={onClose}
            className="btn size-7 rounded-full p-0 text-primary hover:bg-slate-300/20 xl:hidden dark:text-accent-light/80 dark:hover:bg-navy-300/20"
            aria-label="Close sidebar"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto pb-6 pt-2">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mt-3">
              
              {/* Group label */}
              <div className="px-4 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-navy-400">
                {group.label}
              </div>

              <ul className="px-4">
                {group.items.map(({ to, label }) => {
                  const isActive =
                    location.pathname === to ||
                    location.pathname.startsWith(to + "/");
                  return (
                    <li key={to}>
                      <NavLink
                        to={to}
                        onClick={() => {
                          // On mobile, close panel after navigation
                          if (window.innerWidth < 1280) onClose();
                        }}
                        className={cn(
                          "flex items-center justify-between py-2",
                          "text-xs-plus tracking-wide",
                          "outline-none transition-[color,padding-left] duration-300 ease-in-out",
                          isActive
                            ? "font-medium text-primary dark:text-accent-light"
                            : "text-slate-600 hover:text-slate-800 dark:text-navy-200 dark:hover:text-navy-50",
                        )}
                      >
                        {label}
                        {isActive && (
                          <ChevronRight className="size-3.5 text-primary dark:text-accent-light" />
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>

              {/* Divider after each group except last */}
              <div className="mx-4 mt-3 h-px bg-slate-200 dark:bg-navy-500" />
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};
