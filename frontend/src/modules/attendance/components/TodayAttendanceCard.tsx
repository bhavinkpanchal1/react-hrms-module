import { Card } from "@/components/ui/card";
import { Badge } from "@/shared/ui";
import { formatTime } from "@/shared/utils/date";
import { Clock } from "lucide-react";
import type { AttendanceRecord } from "../types/attendance.types";

interface TodayAttendanceCardProps {
  todayAttendance?: AttendanceRecord;
  formattedTimer: string;
}

const TodayAttendanceCard = ({ todayAttendance, formattedTimer }: TodayAttendanceCardProps) => {
  const clockInAt = todayAttendance?.clock_in_at;
  const clockOutAt = todayAttendance?.clock_out_at;
  return (
    <Card className="p-6">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-navy-600">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Clock className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-sm lg:text-base font-semibold text-slate-800 dark:text-white">
              Today's Attendance
            </h3>

            <p className="text-xs text-slate-500">
              {todayAttendance?.attendance_date ?? "--"}
            </p>
          </div>
        </div>

        <Badge
          label={
            clockOutAt ? "Completed" : clockInAt ? "Working" : "Not Clocked In"
          }
          variant={clockOutAt ? "success" : clockInAt ? "primary" : "default"}
        />
      </div>

      {/* Card Body */}
      <div className="mt-6 grid grid-cols-2 xl:grid-cols-3  gap-y-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Clock In
          </p>

          <p className="mt-1 text-base font-semibold uppercase text-slate-800 dark:text-white">
            {formatTime(todayAttendance?.clock_in_at, { hour12: true }) ?? "--"}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Clock Out
          </p>

          <p className="mt-1 text-base font-semibold text-slate-800 dark:text-white">
            {formatTime(todayAttendance?.clock_out_at, { hour12: true }) ??
              "--"}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Working Hours
          </p>

          <p className="mt-1 text-base font-semibold text-primary">
            {formattedTimer}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TodayAttendanceCard ;
