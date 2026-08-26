import { Card } from "@/components/ui/card";
import { useAttendanceTimer } from "../hooks/useAttendanceTimer";
//import { Clock } from "lucide-react";
//import { Badge } from "@/shared/ui";
import { useTodayAttendance } from "../hooks/useAttendance";
//import { formatTime } from "@/shared/utils/date";
import TodayAttendanceCard from "../components/TodayAttendanceCard";

const AttendancePage = () => {
  const { data: todayAttendance } = useTodayAttendance();
  const clockInAt = todayAttendance?.clock_in_at;
  const clockOutAt = todayAttendance?.clock_out_at;

  const { formattedTimer } = useAttendanceTimer({
    clockInAt: clockInAt ?? null,
    clockOutAt: clockOutAt ?? null,
  });

  return (
    <section className="space-y-6">
      {/* Page Header */}
      <div>
        <h3 className="text-2xl font-semibold text-slate-800 dark:text-white">
          Attendance
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-navy-200">
          View today's attendance and working hours.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Today's Attendance */}
        <TodayAttendanceCard todayAttendance={todayAttendance} formattedTimer={formattedTimer} />
        <Card className="p-6">
          
        </Card>
      </div>
    </section>
  );
};

export default AttendancePage;
