import { queryKeys } from "@/shared/constants/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { attendanceApi } from "../api/attendance.api";

export const useTodayAttendance = () =>
  useQuery({
    queryKey: queryKeys.attendance.today(),
    queryFn: attendanceApi.getTodayAttendance,
  });

export const useAttendanceHistory = (month: number, year: number) =>
  useQuery({
    queryKey: queryKeys.attendance.history(month, year),
    queryFn: () => attendanceApi.getAttendanceHistory(month, year),
  });

export const useAttendanceCalendar = (month: number, year: number) =>
  useQuery({
    queryKey: queryKeys.attendance.calendar(month, year),
    queryFn: () => attendanceApi.getAttendanceCalendar(month, year),
  });

export const useClockIn = () => {
  const queryClient = useQueryClient();
  

  return useMutation({
    mutationFn: attendanceApi.clockIn,
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
    mutationFn: attendanceApi.clockOut,
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
    mutationFn: attendanceApi.createRegularization,
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
