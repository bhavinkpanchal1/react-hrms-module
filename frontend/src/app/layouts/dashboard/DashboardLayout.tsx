import { useTheme } from "@/shared/hooks/use-theme";
import AppHeader from "@/shared/ui/header/AppHeader";
import AppSidebar from "@/shared/ui/sidebar/AppSidebar";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <div className="flex-1">
        <AppHeader isDark={isDark} onToggleTheme={toggleTheme} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
