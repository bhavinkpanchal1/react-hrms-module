import { useTheme } from "@/shared/hooks/use-theme";
import { Outlet } from "react-router-dom";
import { cn } from "@/shared/lib/cn";
import { TopHeader } from "../partials/TopHeader";
import { useSidebarStore } from "@/shared/stores/sidebar.store";
import { MainSideBarIcon } from "@/shared/ui/sidebar/MainSideBarIcon";
import { ASideNavPanel } from "@/shared/ui/sidebar/ASideNavPanel";

function DashboardLayout() {
  const { isDark, toggleTheme } = useTheme();
  const isPanelOpen = useSidebarStore((s) => s.isPanelOpen);
  const togglePanel = useSidebarStore((s) => s.togglePanel);
  
  // Disable old route sync since it points to the old navigation.config.ts
  // useRouteSync();

  return (
    <>
      <MainSideBarIcon />

      {/* ── Nav Panel (open on desktop, toggle on mobile) ── */}
      <ASideNavPanel />
      
      {/* ── Mobile overlay ── */}
      {isPanelOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/50 xl:hidden"
          onClick={togglePanel}
        />
      )}

      
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-[250ms]",
          "md:ml-[var(--main-sidebar-width)]",
          isPanelOpen && "xl:ml-[calc(var(--main-sidebar-width)+var(--sidebar-panel-width))]"
        )}
      >
   
        {/* Top header */}
        <TopHeader
            isSidebarOpen={isPanelOpen}
            onToggleSidebar={togglePanel}
            isDark={isDark}
            onToggleTheme={toggleTheme}
          />

        <main
          className={cn(
            "mt-[var(--header-height)] flex-1 p-[var(--margin-x)]",
            "transition-[padding] duration-[250ms]"
          )}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default DashboardLayout;
