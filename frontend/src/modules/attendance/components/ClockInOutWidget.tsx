// src/modules/attendance/components/HeaderAttendanceWidget.tsx

import { Clock, LogIn, LogOut } from "lucide-react";

import { Button } from "@/shared/ui/button/Button";
import { Badge } from "@/shared/ui/badge/Badge";

import {
  useClockIn,
  useClockOut,
  useTodayAttendance,
} from "../hooks/useAttendance";

import { useCurrentPosition } from "../hooks/useCurrentPosition";
import { useAttendanceTimer } from "../hooks/useAttendanceTimer";

const formatTime = (date?: string | null) =>
  date
    ? new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    : "--:--";

export const HeaderAttendanceWidget = () => {
  const { data: today, isLoading } = useTodayAttendance();

  const {
    position,
    loading: locationLoading,
    error: locationError,
    refreshLocation,
  } = useCurrentPosition();

  const clockInMutation = useClockIn();
  const clockOutMutation = useClockOut();

  const { hours, minutes } = useAttendanceTimer({
    clockInAt: today?.clock_in_at ?? null,
    clockOutAt: today?.clock_out_at ?? null,
  });
  const elapsed = `${hours}h ${minutes}m`;

  const handleClockIn = async () => {
    if (!position) {
      refreshLocation();
      return;
    }

    await clockInMutation.mutateAsync({
      latitude: position.lat,
      longitude: position.lng,
    });
  };

  const handleClockOut = async () => {
    if (!position) {
      refreshLocation();
      return;
    }

    await clockOutMutation.mutateAsync({
      latitude: position.lat,
      longitude: position.lng,
    });
  };

  const hasClockedIn = Boolean(today?.clock_in_at);
  const hasClockedOut = Boolean(today?.clock_out_at);

  const loading =
    isLoading ||
    locationLoading ||
    clockInMutation.isPending ||
    clockOutMutation.isPending;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm dark:border-navy-600 dark:bg-navy-700">

      <Clock className="h-5 w-5 text-primary" />

      <div className="min-w-[160px]">
        <p className="text-xs text-slate-500">
          Today's Attendance
        </p>

        <div className="flex items-center gap-2">
          <Badge
            label={
              hasClockedOut
                ? "Completed"
                : hasClockedIn
                  ? "Working"
                  : "Not Clocked In"
            }
          />

          {hasClockedIn && !hasClockedOut && (
            <span className="text-xs text-success font-medium">
              {elapsed}
            </span>
          )}
        </div>

        <div className="mt-1 text-xs text-slate-500">
          In : {formatTime(today?.clock_in_at)}
          {" • "}
          Out : {formatTime(today?.clock_out_at)}
        </div>

        {locationError && (
          <p className="mt-1 text-xs text-red-500">
            {locationError}
          </p>
        )}
      </div>

      {!hasClockedIn && (
        <Button
          size="sm"
          onClick={handleClockIn}
          isLoading={loading}
          leftIcon={<LogIn className="h-4 w-4" />}
        >
          Clock In
        </Button>
      )}

      {hasClockedIn && !hasClockedOut && (
        <Button
          size="sm"
          variant="danger"
          onClick={handleClockOut}
          isLoading={loading}
          leftIcon={<LogOut className="h-4 w-4" />}
        >
          Clock Out
        </Button>
      )}
    </div>
  );
};
