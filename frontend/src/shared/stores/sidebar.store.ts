import { getModulesForRole, type NavModule, type Role } from "@/app/config/nav-config";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { resolveModuleIdForPath } from "./resolveModuleIdForPath";

interface SidebarState {
  role: Role;

  // The module that owns the CURRENT PAGE — driven entirely by the URL via
  // syncActiveModuleFromPath. This is the "primary" highlighted icon and
  // never changes just from clicking a different icon to browse it.
  activeModuleId: string;
  activeModule: NavModule | undefined;

  // The module whose panel is currently DISPLAYED — changes the moment you
  // click any icon, independent of whether you've actually navigated into
  // it yet. This is what ASideNavPanel renders, and gets the "grey" style
  // in MainSideBarIcon whenever it differs from activeModuleId (you're
  // previewing a section without having navigated into it).
  openModuleId: string;
  openModule: NavModule | undefined;

  isPanelOpen: boolean;
  visibleModules: NavModule[];

  setRole: (role: Role) => void;

  // Called when the user clicks a sidebar icon — opens/previews that
  // module's panel. Deliberately does NOT touch activeModuleId; only
  // actually navigating to a page in that module does that (see
  // syncActiveModuleFromPath).
  setOpenModule: (id: string) => void;

  // Called on every route change (see useSidebarRouteSync). Updates
  // activeModuleId to whatever module owns the new URL, and — since a real
  // navigation happened — also collapses openModuleId back to match, so
  // the "grey preview" state resolves into the single "primary active"
  // state once you've actually navigated somewhere.
  syncActiveModuleFromPath: (pathname: string) => void;

  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
}

const resolveActiveModule = (modules: NavModule[], pathname: string) => {
  const matchedId = resolveModuleIdForPath(pathname, modules);
  return modules.find((m) => m.id === matchedId) ?? modules[0];
};

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => {
      // Default role — change "hr" to "employee" or "manager" to test
      // Later: replace this with: const role = getAuthRole() or from API
      const defaultRole: Role = "hr";
      const defaultModules = getModulesForRole(defaultRole);

      const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
      const activeMod = resolveActiveModule(defaultModules, currentPath);
      const defaultModuleId = activeMod?.id ?? "";
      const hasSubItems = !!activeMod?.items?.length;

      return {
        role: defaultRole,

        activeModuleId: defaultModuleId,
        activeModule: activeMod,

        // On first load, the open panel matches the active module — you
        // haven't clicked anything to "preview" a different section yet.
        openModuleId: defaultModuleId,
        openModule: activeMod,

        isPanelOpen: !!hasSubItems, // Default to collapsed on first load
        visibleModules: defaultModules,

        setRole: (role) => {
          const modules = getModulesForRole(role);
          const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
          const mod = resolveActiveModule(modules, currentPath);
          set({
            role,
            visibleModules: modules,
            activeModuleId: mod?.id ?? "",
            activeModule: mod,
            openModuleId: mod?.id ?? "",
            openModule: mod,
          });
        },

        setOpenModule: (id) => {
          const { visibleModules } = get();
          const module = visibleModules.find((m) => m.id === id);
          const hasItems = !!module?.items?.length;

          set({
            openModuleId: id,
            openModule: module,
            // Auto-open the panel if the module has items (as before,
            // except home/logo-style entries with no sub-items).
            ...(hasItems ? { isPanelOpen: true } : {}),
          });
        },

        syncActiveModuleFromPath: (pathname) => {
          const { visibleModules, activeModuleId } = get();
          const matchedId = resolveModuleIdForPath(pathname, visibleModules);
          if (!matchedId || matchedId === activeModuleId) return;
          const mod = visibleModules.find((m) => m.id === matchedId);
          set({
            activeModuleId: matchedId,
            activeModule: mod,
            // A real navigation happened — collapse the "browsing preview"
            // state back to match, so only one icon stays highlighted.
            openModuleId: matchedId,
            openModule: mod,
          });
        },

        togglePanel: () => set((s) => ({ isPanelOpen: !s.isPanelOpen })),
        openPanel: () => set({ isPanelOpen: true }),
        closePanel: () => set({ isPanelOpen: false }),
      };
    },
    {
      name: "sidebar-preferences",
      partialize: (state) => ({ isPanelOpen: state.isPanelOpen }), // Only persist the toggle state

      // No onRehydrateStorage needed. useSidebarRouteSync recomputes
      // activeModuleId/openModuleId from the current URL on mount, which
      // correctly handles reload without relying on mutating the hydrated
      // state object directly (that never reached Zustand's subscribers).
    },
  ),
);