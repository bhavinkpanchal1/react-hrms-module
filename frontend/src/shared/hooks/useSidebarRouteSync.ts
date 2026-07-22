import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSidebarStore } from "@/shared/stores/sidebar.store";

// Keeps the highlighted sidebar module in sync with the current route.
// Runs once on mount (handles reload/deep-links — the store's initial
// state already computes this once at module-load time, but this effect
// re-confirms it once React has actually mounted) and again on every
// subsequent navigation, so browsing to a page that isn't reached via an
// explicit sidebar icon click (a NavLink inside the panel, browser
// back/forward, a redirect, a link from elsewhere in the app) still keeps
// the correct top-level icon highlighted.
export const useSidebarRouteSync = () => {
  const location = useLocation();
  const syncActiveModuleFromPath = useSidebarStore((s) => s.syncActiveModuleFromPath);

  useEffect(() => {
    syncActiveModuleFromPath(location.pathname);
  }, [location.pathname, syncActiveModuleFromPath]);
};