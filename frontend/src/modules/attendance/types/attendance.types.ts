export type AttendanceStatus =
  | "present"
  | "absent"
  | "half_day"
  | "leave"
  | "holiday"
  | "weekend"
  | "regularization_pending"
  | "regularized";

export type ClockMethod = "office" | "remote";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface AttendanceRecord {
  id: number;
  employee_id: number;
  attendance_date: string;
  clock_in_at: string | null;
  clock_out_at: string | null;
  clock_in_location: GeoPoint | null;
  clock_out_location: GeoPoint | null;
  clock_method: ClockMethod | null;
  status: AttendanceStatus;
  work_hours: number | null;
  regularization_reason: string | null;
  regularization_requested_at: string | null;
}

export interface ClockInPayload {
  latitude: number;
  longitude: number;
}

export interface ClockOutPayload {
  latitude: number;
  longitude: number;
}

export interface RegularizationInput {
  attendance_date: string;
  requested_clock_in?: string;
  requested_clock_out?: string;
  reason: string;
}

export const ATTENDANCE_STATUS_META: Record<
  AttendanceStatus,
  {
    label: string;
    colorClass: string;
  }
> = {
  present: {
    label: "Present",
    colorClass: "bg-success/15 text-success",
  },

  absent: {
    label: "Absent",
    colorClass: "bg-error/15 text-error",
  },

  half_day: {
    label: "Half Day",
    colorClass: "bg-warning/15 text-warning",
  },

  leave: {
    label: "Leave",
    colorClass: "bg-info/15 text-info",
  },

  regularization_pending: {
    label: "Pending",
    colorClass: "bg-accent/15 text-accent-focus",
  },

  regularized: {
    label: "Regularized",
    colorClass: "bg-primary/15 text-primary",
  },

  holiday: {
    label: "Holiday",
    colorClass:
      "bg-slate-150 text-slate-500 dark:bg-navy-600 dark:text-navy-300",
  },

  weekend: {
    label: "Weekend",
    colorClass:
      "bg-slate-100 text-slate-400 dark:bg-navy-700 dark:text-navy-400",
  },
};
