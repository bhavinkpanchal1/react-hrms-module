import { httpClient } from "@/shared/services/http/client";
import type {
  AttendanceRecord,
  ClockInPayload,
  ClockOutPayload,
  RegularizationInput,
} from "../types/attendance.types";

const ATTENDANCE_ENDPOINTS = {
  TODAY: "/attendance/today/",
  CLOCK_IN: "/attendance/clock-in/",
  CLOCK_OUT: "/attendance/clock-out/",
  HISTORY: "/attendance/history/",
  CALENDAR: "/attendance/calendar/",
  REGULARIZATION: "/attendance/regularizations/",
} as const;

export const getTodayAttendance = async () => {
  const { data } = await httpClient.get<AttendanceRecord>(
    ATTENDANCE_ENDPOINTS.TODAY,
  );

  return data;
};

export const clockIn = async (payload: ClockInPayload) => {
  const { data } = await httpClient.post(
    ATTENDANCE_ENDPOINTS.CLOCK_IN,
    payload,
  );

  return data;
};

export const clockOut = async (payload: ClockOutPayload) => {
  const { data } = await httpClient.post(
    ATTENDANCE_ENDPOINTS.CLOCK_OUT,
    payload,
  );

  return data;
};

export const getAttendanceHistory = async (month: number, year: number) => {
  const { data } = await httpClient.get(ATTENDANCE_ENDPOINTS.HISTORY, {
    params: {
      month,
      year,
    },
  });
  return data;
};

export const getAttendanceCalendar = async (month: number, year: number) => {
  const { data } = await httpClient.get(ATTENDANCE_ENDPOINTS.CALENDAR, {
    params: {
      month,
      year,
    },
  });
  return data;
};

export const createRegularization = async (
  payload: RegularizationInput
) => {
  const { data } = await httpClient.post(
    ATTENDANCE_ENDPOINTS.REGULARIZATION,
    payload
  );

  return data;
};