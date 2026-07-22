import { cn } from "@/shared/lib/cn";
import { useSidebarStore } from "@/shared/stores/sidebar.store";
import { Link } from "react-router-dom";


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

export const MainSideBarIcon = () => {
  const visibleModules  = useSidebarStore((s) => s.visibleModules);
  const activeModuleId  = useSidebarStore((s) => s.activeModuleId);
  const openModuleId    = useSidebarStore((s) => s.openModuleId);
  const setOpenModule   = useSidebarStore((s) => s.setOpenModule);
  const isPanelOpen     = useSidebarStore((s) => s.isPanelOpen);

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 flex h-full w-[var(--main-sidebar-width)] flex-col items-center border-r border-slate-200 bg-white dark:border-navy-700 dark:bg-navy-800 transition-transform duration-[250ms] ease-in-out",
      isPanelOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    )}>

      {/* Logo */}
      <div className="flex pt-4 pb-6">
        <Link to="/">
          <img className="size-11" src="/src/assets/images/logo.png" alt="logo" />
        </Link>
      </div>

      {/* Module icons */}
      <nav className="flex flex-1 flex-col items-center gap-1 overflow-y-auto">
        {visibleModules.map((mod) => {
          // Primary highlight: this module owns the page you're actually
          // on right now (URL-driven, survives reload, only changes when
          // you actually navigate).
          const isActive = mod.id === activeModuleId;
          // Secondary "previewing" highlight: you clicked this icon to
          // look at its panel, but haven't navigated into it — only shown
          // when it's a *different* module than the active one, so you
          // never see both styles on the same icon at once.
          const isOpenOnly = !isActive && mod.id === openModuleId;

          return (
            <button
              key={mod.id}
              onClick={() => setOpenModule(mod.id)}
              title={mod.label}
              className={cn(
                "flex size-11 items-center justify-center rounded-lg transition-colors duration-200",
                isActive && "bg-primary/15 text-primary dark:bg-primary20",
                isOpenOnly && "bg-slate-150 text-slate-600 dark:bg-navy-600 dark:text-navy-200",
                !isActive && !isOpenOnly && "text-slate-500 hover:bg-primary/10 hover:text-primary dark:text-navy-300",
              )}
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