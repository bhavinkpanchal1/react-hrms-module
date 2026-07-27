import { queryKeys } from "@/shared/constants/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  clockIn,
  clockOut,
  createRegularization,
  getAttendanceCalendar,
  getAttendanceHistory,
  getTodayAttendance,
} from "../api/attendance.api";

export const useTodayAttendance = () =>
  useQuery({
    queryKey: queryKeys.attendance.today(),
    queryFn: getTodayAttendance,
  });

export const useAttendanceHistory = (month: number, year: number) =>
  useQuery({
    queryKey: queryKeys.attendance.history(month, year),
    queryFn: () => getAttendanceHistory(month, year),
  });

export const useAttendanceCalendar = (month: number, year: number) =>
  useQuery({
    queryKey: queryKeys.attendance.calendar(month, year),
    queryFn: () => getAttendanceCalendar(month, year),
  });

export const useClockIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clockIn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.attendance.today(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.attendance.all,
      });
    },
  });
};

export const useClockOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clockOut,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.attendance.today(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.attendance.all,
      });
    },
  });
};

export const useCreateRegularization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRegularization,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.attendance.regularizations(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.attendance.today(),
      });
    },
  });
};


