import { useEffect, useState } from "react";

interface UseAttendanceTimerProps {
  clockInAt: string | null;
  clockOutAt: string | null;
}

export const useAttendanceTimer = ({
  clockInAt,
  clockOutAt,
}: UseAttendanceTimerProps) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!clockInAt || clockOutAt) return;

    const id = setInterval(() => setNow(Date.now()), 1000);

    return () => clearInterval(id);
  }, [clockInAt, clockOutAt]);

  const isRunning = !!clockInAt && !clockOutAt;
  const start = clockInAt ? new Date(clockInAt).getTime() : Number.NaN;
  const end = clockOutAt ? new Date(clockOutAt).getTime() : now;
  const elapsedSeconds = Number.isNaN(start) || Number.isNaN(end)
    ? 0
    : Math.max(0, Math.floor((end - start) / 1000));
  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;

  const formattedTimer =
  `${String(hours).padStart(2, "0")}:` +
  `${String(minutes).padStart(2, "0")}:` +
  `${String(seconds).padStart(2, "0")}`;

  return {
    elapsedSeconds,
    hours,
    minutes,
    seconds,
    formattedTimer,
    isRunning,
  };
};
