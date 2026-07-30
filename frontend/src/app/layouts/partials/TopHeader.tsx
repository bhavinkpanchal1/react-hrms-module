import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui";
import { Moon, Sun } from "lucide-react";
import {
  useClockIn,
  useClockOut,
  useTodayAttendance,
} from "@/modules/attendance/hooks/useAttendance";
import { useCurrentPosition } from "@/modules/attendance/hooks/useCurrentPosition";
import toast from "react-hot-toast";
import { useAttendanceTimer } from "@/modules/attendance/hooks/useAttendanceTimer";


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
  const clockIn = useClockIn();
  const clockOut = useClockOut();
  const { data: todayAttendance } = useTodayAttendance();

  const {
    position,
    refreshLocation,
    loading: locationLoading,
  } = useCurrentPosition();

  const isClockedIn = !!todayAttendance?.clock_in_at && !todayAttendance?.clock_out_at;
  const { formattedTimer} = useAttendanceTimer({
    clockInAt: todayAttendance?.clock_in_at ?? null,
    clockOutAt: todayAttendance?.clock_out_at ?? null,
  });

  const handleAttendance = async () => {
    if (!position) {
      await refreshLocation();
      return;
    }

    try {
      if (isClockedIn) {
        await clockOut.mutateAsync({
          latitude: position.lat,
          longitude: position.lng,
        });
        toast.success("Clock Out Successful");
      } else {
        await clockIn.mutateAsync({
          latitude: position.lat,
          longitude: position.lng,
        });

        toast.success("Clock In Successful");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        isClockedIn ? "Clock Out Failed" : "Clock In Failed",
      );
    }
  };
  console.log({
    clockInAt: todayAttendance?.clock_in_at,
    clockOutAt: todayAttendance?.clock_out_at,
    isClockedIn,
  });

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
              "block h-0.5 bg-current transition-all duration-[250ms]",
              isSidebarOpen ? "w-[11px] translate-x-2 -rotate-45" : "w-5",
            )}
          />
          <span
            className={cn(
              "block h-0.5 w-3 bg-current transition-all duration-[250ms]",
              isSidebarOpen && "hidden",
            )}
          />
          <span
            className={cn(
              "block h-0.5 bg-current transition-all duration-[250ms]",
              isSidebarOpen ? "w-[11px] translate-x-2 rotate-45" : "w-5",
            )}
          />
        </button>

        {/* RIGHT — actions */}
        <div className="flex items-center gap-2">
          {isClockedIn && (
            <span className="text-sm font-medium ">{formattedTimer}</span>
          )}
          <Button
            onClick={handleAttendance}
            disabled={
              locationLoading ||
              clockIn.isPending ||
              clockOut.isPending
            }
          >
            {clockIn.isPending
              ? "Clocking In..."
              : clockOut.isPending
                ? "Clocking Out..."
                : isClockedIn
                  ? "Clock Out"
                  : "Clock In"}
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
