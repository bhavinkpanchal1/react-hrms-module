import type { NavModule } from "@/app/config/nav-config";

interface FlatRoute {
  to: string;
  moduleId: string;
}

// Flattens every module's items (including nested group children) into a
// flat {to, moduleId} list — this is the actual source of truth for "which
// module owns this route", unlike matching the module's id string against
// the URL, which silently fails for modules whose routes don't happen to
// contain the module id (e.g. "manager" -> /report/team-attendance,
// "admin" -> /vendor/list — neither contains "/manager" or "/admin").
const flattenModuleRoutes = (modules: NavModule[]): FlatRoute[] => {
  const routes: FlatRoute[] = [];
  for (const mod of modules) {
    for (const item of mod.items) {
      if (item.kind === "link") {
        routes.push({ to: item.to, moduleId: mod.id });
      } else {
        for (const child of item.children) {
          routes.push({ to: child.to, moduleId: mod.id });
        }
      }
    }
  }
  // Longest path first, so a more specific nested route always wins over
  // a shorter overlapping prefix from a different module.
  return routes.sort((a, b) => b.to.length - a.to.length);
};

// Segment-boundary-safe prefix match — "/employees" matches "/employees"
// and "/employees/new" and "/employees/5/edit", but never "/employeesArchive".
const isPathMatch = (pathname: string, to: string) =>
  pathname === to || pathname.startsWith(to.endsWith("/") ? to : `${to}/`);

export const resolveModuleIdForPath = (
  pathname: string,
  modules: NavModule[],
): string | undefined => {
  const routes = flattenModuleRoutes(modules);
  return routes.find((r) => isPathMatch(pathname, r.to))?.moduleId;
};
