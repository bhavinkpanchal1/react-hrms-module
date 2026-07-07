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
      
      // 1. Check the current path immediately on boot
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
      
      // 2. Find if the URL matches a module right away
      const initialMatchingModule = defaultModules.find((mod) =>
        currentPath.includes(`/${mod.id}`) || currentPath === mod.id
      );

      // Fallback to the first module if no URL match
      const activeMod = initialMatchingModule || defaultModules[0];
      const defaultModuleId = activeMod?.id ?? "";
      
      // 3. Determine if the matching module has sub-items to display
      const hasSubItems = activeMod && activeMod.items && activeMod.items.length > 0;

      return {
        role: defaultRole,
        activeModuleId: defaultModuleId,
        isPanelOpen: !!hasSubItems, // Default to collapsed on first load
        
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

      // ADD THIS CONFIGURATION BLOCK BELOW PARTIALIZE:
      onRehydrateStorage: () => {
        return (hydratedState, error) => {
          if (error || !hydratedState) return;

          const currentPath = window.location.pathname; 
          const matchingModule = hydratedState.visibleModules.find((mod) =>
            currentPath.includes(`/${mod.id}`) || currentPath === mod.id
          );

          // 3. Force update the active states directly in the store on boot
          if (matchingModule) {
            hydratedState.activeModuleId = matchingModule.id;
            hydratedState.activeModule = matchingModule;
            
            // Auto open panel if it contains nested items
            if (matchingModule.items && matchingModule.items.length > 0) {
              hydratedState.isPanelOpen = true;
            }
          }
        };
      },
    }
  )
);