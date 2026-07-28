import { httpClient } from "@/shared/services/http/client";

import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";
import type {
  AttendanceRecord,
  ClockInPayload,
  ClockOutPayload,
  RegularizationInput,
} from "../types/attendance.types";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// const mockAttendance: AttendanceRecord[] = [
//   {
//     id: 1,
//     employee_id: 1,
//     attendance_date: "2026-07-28",
//     clock_in_at: "2026-07-28T09:15:00",
//     clock_out_at: null,
//     clock_in_location: {
//       lat: 22.3072,
//       lng: 73.1812,
//     },
//     clock_out_location: null,
//     clock_method: "office",
//     status: "present",
//     work_hours: null,
//     regularization_reason: null,
//     regularization_requested_at: null,
//   },
// ];

const mockAttendance: AttendanceRecord[] = [
  {
    id: 1,
    employee_id: 1,
    attendance_date: "2026-07-28",
    clock_in_at: null,
    clock_out_at: null,
    clock_in_location: null,
    clock_out_location: null,
    clock_method: null,
    status: "absent",
    work_hours: null,
    regularization_reason: null,
    regularization_requested_at: null,
  },
];

export const attendanceApi = {
  getTodayAttendance: async (): Promise<AttendanceRecord> => {

    if (USE_MOCK) {
      await delay();
      return mockAttendance[0];
    }

    const { data } = await httpClient.get<AttendanceRecord>(
      API_ENDPOINTS.attendance.today,
    );
    return data;
  },

  clockIn: async (payload: ClockInPayload) => {
    if (USE_MOCK) {
      await delay();

      mockAttendance[0] = {
        ...mockAttendance[0],
        clock_in_at: new Date().toISOString(),
        clock_in_location: {
          lat: payload.latitude,
          lng: payload.longitude,
        },
        clock_method: "office",
      };

      return {
        message: "Clock in successful",
        attendance: mockAttendance[0],
      };
    }

    const { data } = await httpClient.post(
      API_ENDPOINTS.attendance.clockIn,
      payload,
    );

    return data;
  },

  clockOut: async (payload: ClockOutPayload) => {
    if (USE_MOCK) {
      await delay();

      mockAttendance[0] = {
        ...mockAttendance[0],
        clock_out_at: new Date().toISOString(),
        clock_out_location: {
          lat: payload.latitude,
          lng: payload.longitude,
        },
      };

      return {
        message: "Clock out successful",
        attendance: mockAttendance[0],
      };
    }

    const { data } = await httpClient.post(
      API_ENDPOINTS.attendance.clockOut,
      payload,
    );

    return data;
  },

  getAttendanceHistory: async (month: number, year: number) => {
    if (USE_MOCK) {
      await delay();

      return mockAttendance;
    }

    const { data } = await httpClient.get(API_ENDPOINTS.attendance.history, {
      params: {
        month,
        year,
      },
    });

    return data;
  },

  getAttendanceCalendar: async (month: number, year: number) => {
    if (USE_MOCK) {
      await delay();

      return mockAttendance;
    }

    const { data } = await httpClient.get(API_ENDPOINTS.attendance.calendar, {
      params: {
        month,
        year,
      },
    });

    return data;
  },

  createRegularization: async (payload: RegularizationInput) => {
    if (USE_MOCK) {
      await delay();

      return {
        id: 1,
        status: "Pending",
        ...payload,
      };
    }

    const { data } = await httpClient.post(
      API_ENDPOINTS.attendance.regularization,
      payload,
    );

    return data;
  },
};
