// src/modules/attendance/components/HeaderAttendanceWidget.tsx

import { useEffect, useState } from "react";
import { Clock, LogIn, LogOut } from "lucide-react";

import { Button } from "@/shared/ui/button/Button";
import { Badge } from "@/shared/ui/badge/Badge";

import {
  useClockIn,
  useClockOut,
  useTodayAttendance,
} from "../hooks/useAttendance";

import { useCurrentPosition } from "../hooks/useCurrentPosition";

const formatTime = (date?: string) =>
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

  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    if (!today?.clock_in_at || today?.clock_out_at) {
      setElapsed("");
      return;
    }

    const updateElapsed = () => {
      const diff = Date.now() - new Date(today.clock_in_at).getTime();

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);

      setElapsed(`${hours}h ${minutes}m`);
    };

    updateElapsed();

    const timer = setInterval(updateElapsed, 60000);

    return () => clearInterval(timer);
  }, [today?.clock_in_at, today?.clock_out_at]);

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