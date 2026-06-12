import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  DollarSign,
  Briefcase,
  Settings,
  LogOut,
  Icon,
} from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { NavLink } from "react-router-dom";

// HRMS navigation items for the icon rail
const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/employees", icon: Users, label: "Employees" },
  { to: "/attendance", icon: Clock, label: "Attendance" },
  { to: "/leave", icon: CalendarDays, label: "Leave" },
  { to: "/payroll", icon: DollarSign, label: "Payroll" },
  { to: "/recruitment", icon: Briefcase, label: "Recruitment" },
] as const;

export const MainSidebar = ({ isOpen. onNavClick }) => (
  <aside
    className={cn(
      // Base: fixed, full height, icon-rail width, off-screen on mobile
      "fixed left-0 top-0 z-40 h-full w-[var(--main-sidebar-width)]",
      "flex flex-col -translate-x-full",
      // Slide in on md+ always; translate-x-0
      "md:translate-x-0",
      // Slide in on mobile when sidebar open
      isOpen && "translate-x-0",
      "transition-transform duration-200 ease-in",
    )}
    aria-label="Main navigation rail"
  >
    <div className="flex h-full flex-col items-center border-r border-slate-150 bg-white dark:border-navy-700 dark:bg-navy-800">
      {/* Logo */}
      <div className="flex h-[var(--header-height)] w-full shrink-0 items-center justify-center border-b border-slate-150 dark:border-navy-700">
        <img
          src="/src/assets/images/app-logo.svg"
          alt="HRMS"
          className="size-8"
        />
      </div>

      {/* Nav icons */}
      <nav>
        {NAV_ITEMS.map(({to, icon: Icon, label}) => (
          <NavLink
          key={to}
          to={to}
          onClick={onNavClick}
          title={label}
          className={({isActive}) => cn (
              'group flex size-11 items-center justify-center rounded-lg',
                'outline-none transition-colors duration-200',
                isActive
                  ? 'bg-primary/10 text-primary dark:bg-navy-600 dark:text-accent-light'
                  : 'text-slate-500 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:text-navy-300 dark:hover:bg-navy-300/20'
            )
          }
          >
            <Icon className="size-5" />
            <span className="sr-only">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  </aside>
);
