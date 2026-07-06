import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui";
import { Moon, Sun } from "lucide-react";

interface TopHeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const TopHeader = ({
  isSidebarOpen,
  onToggleSidebar,
  isDark,
  onToggleTheme,
}: TopHeaderProps) => {
  return (
    <header
      className={cn(
        // Fixed, full-width on mobile; shrinks on md+ to exclude icon rail
        "fixed right-0 top-0 z-20",
        "h-[var(--header-height)] w-full",
        "border-b border-slate-150 bg-white dark:border-navy-700 dark:bg-navy-700",
        "md:w-[calc(100%-var(--main-sidebar-width))]",
        "transition-all duration-[250ms]",
        // On xl, shrink further when panel is open
        isSidebarOpen &&
          "xl:w-[calc(100%-(var(--main-sidebar-width)+var(--sidebar-panel-width)))]",
      )}
    >
      <div className="flex h-full items-center justify-between px-[var(--margin-x)]">
        {/* LEFT — hamburger toggle */}
        <button
          onClick={onToggleSidebar}
          className="flex flex-col justify-center space-y-1.5 text-primary dark:text-accent-light/80 size-7 cursor-pointer"
          aria-label={isSidebarOpen ? "Close navigation" : "Open navigation"}
        >
         {/* Animated hamburger — 3 bars → X when open */}
        <span
          className={cn(
            'block h-0.5 bg-current transition-all duration-[250ms]',
            isSidebarOpen ? 'w-[11px] translate-x-2 -rotate-45' : 'w-5'
          )}
        />
        <span
          className={cn(
            'block h-0.5 w-3 bg-current transition-all duration-[250ms]',
            isSidebarOpen && 'hidden'
          )}
        />
        <span
          className={cn(
            'block h-0.5 bg-current transition-all duration-[250ms]',
            isSidebarOpen ? 'w-[11px] translate-x-2 rotate-45' : 'w-5'
          )}
        />
        </button>

        {/* RIGHT — actions */}
        <div className="flex items-center gap-1">
          <Button className="px-2">
            Clock In
          </Button>
          <button
            onClick={onToggleTheme}
            className="btn size-8 rounded-full p-0 hover:bg-slate-300/20 dark:hover:bg-navy-300/20"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Moon className="h-6 text-amber-400 fill-amber-400" />
              
            ) : (
              <Sun className="size-6 text-amber-400 fill-amber-400" />
            )}
          </button>
        </div>

         

        
      </div>
    </header>
  );
};
