import { getModulesForRole, type NavModule, type Role } from "@/app/config/nav-config";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  role: Role;
  activeModuleId: string;
  isPanelOpen: boolean;
  visibleModules: NavModule[];
  activeModule: NavModule | undefined;
  setRole: (role: Role) => void;
  setActiveModule: (id: string) => void;
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => {
      // Default role — change "hr" to "employee" or "manager" to test
      // Later: replace this with: const role = getAuthRole() or from API
      const defaultRole: Role = "hr";
      const defaultModules = getModulesForRole(defaultRole);
      const defaultModuleId = defaultModules[0]?.id ?? "";

      return {
        role: defaultRole,
        activeModuleId: defaultModuleId,
        isPanelOpen: false, // Default to collapsed on first load
        
        // Computed: re-derived whenever role changes
        visibleModules: defaultModules,
        activeModule: defaultModules.find((m) => m.id === defaultModuleId),

        setRole: (role) =>   {
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
          const hasItems = module && module.items && module.items.length > 0;
          
          set({ 
            activeModuleId: id, 
            activeModule: module,
            // Auto-open if the module has items (as requested, except home/logo)
            ...(hasItems ? { isPanelOpen: true } : {})
          });
        },

        togglePanel: () => set((s) => ({ isPanelOpen: !s.isPanelOpen })),
        openPanel: ()  => set({ isPanelOpen: true }),
        closePanel: () => set({ isPanelOpen: false }),
      };
    },
    {
      name: "sidebar-preferences",
      partialize: (state) => ({ isPanelOpen: state.isPanelOpen }), // Only persist the toggle state
    }
  )
);