import { useEffect, useState } from "react";

interface UseAttendanceTimerProps {
  clockInAt: string | null;
  clockOutAt: string | null;
}

export const useAttendanceTimer = ({
  clockInAt,
  clockOutAt,
}: UseAttendanceTimerProps) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  
  
  useEffect(() => {
    if (!clockInAt) {
      setElapsedSeconds(0);
      return;
    } 

    const start = new Date(clockInAt).getTime();

    if (Number.isNaN(start)) {
    setElapsedSeconds(0);
    return;
  }

    // Employee already clocked out
    if (clockOutAt) {
      const end = new Date(clockOutAt).getTime();
      setElapsedSeconds(Math.floor((end - start) / 1000));
      return;
    }

    // Employee still working
    const update = () => {
      setElapsedSeconds(Math.floor((Date.now() - start) / 1000));
    };

    update();

    const id = setInterval(update, 1000);

    return () => clearInterval(id);
  }, [clockInAt, clockOutAt]);

  const isRunning = !!clockInAt && !clockOutAt;
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
