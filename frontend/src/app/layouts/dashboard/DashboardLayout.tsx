import { useSidebar } from "@/shared/hooks/use-sidebar";
import { useTheme } from "@/shared/hooks/use-theme";
import AppHeader from "@/shared/ui/header/AppHeader";
import AppSidebar from "@/shared/ui/sidebar/AppSidebar";
import { createContext, useContext } from "react";
import { Outlet } from "react-router-dom";
import { MainSidebar } from "../partials/MainSidebar";

interface SidebarContextValue {
  isOpen: boolean;
  toggle: () => void;
  close:() => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export const useSidebarContext = () => {
  const ctx = useContext(SidebarContext);
  if(!ctx) throw new Error('useSidebarContext must be inside DashboardLayout');
  return ctx;
}

function DashboardLayout() {
  const { isDark, toggleTheme } = useTheme();
  const {isOpen, toggle, close} = useSidebar();
  return (
    <SidebarContext.Provider value={{isOpen, toggle, close }}>
      <MainSidebar isOpen={isOpen} onNavClick={toggle} />
    </SidebarContext.Provider>
    // <div className="min-h-screen flex">
    //   <AppSidebar />
    //   <div className="flex-1">
    //     <AppHeader isDark={isDark} onToggleTheme={toggleTheme} />
    //     <main className="p-6">
    //       <Outlet />
    //     </main>
    //   </div>
    // </div>
  );
}

export default DashboardLayout;
