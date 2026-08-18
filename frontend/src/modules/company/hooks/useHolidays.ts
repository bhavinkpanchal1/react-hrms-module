import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { companyApi } from "../api/company.api";
import type {
  CompanyEntityId,
  CreateHolidayInput,
  HolidayParams,
  UpdateHolidayInput,
} from "../types/company.types";

export const useHolidays = (
  companyId: CompanyEntityId,
  holidayListId: CompanyEntityId,
  params: HolidayParams,
) =>
  useQuery({
    queryKey: queryKeys.company.holidays(companyId, holidayListId, params),
    queryFn: () => companyApi.getHolidays(companyId, holidayListId, params),
    enabled: companyId > 0 && holidayListId > 0,
  });

export const useHoliday = (
  companyId: CompanyEntityId,
  holidayListId: CompanyEntityId,
  holidayId: CompanyEntityId,
) =>
  useQuery({
    queryKey: queryKeys.company.holiday(companyId, holidayListId, holidayId),
    queryFn: () =>
      companyApi.getHolidayById(companyId, holidayListId, holidayId),
    enabled: companyId > 0 && holidayListId > 0 && holidayId > 0,
  });

export const useCreateHoliday = (
  companyId: CompanyEntityId,
  holidayListId: CompanyEntityId,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateHolidayInput) =>
      companyApi.createHoliday(companyId, holidayListId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.holidayListsHolidays(
          companyId,
          holidayListId,
        ),
      }),
  });
};

export const useUpdateHoliday = (
  companyId: CompanyEntityId,
  holidayListId: CompanyEntityId,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      holidayId,
      data,
    }: {
      holidayId: CompanyEntityId;
      data: UpdateHolidayInput;
    }) => companyApi.updateHoliday(companyId, holidayListId, holidayId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.holidayListsHolidays(
          companyId,
          holidayListId,
        ),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.company.holiday(
          companyId,
          holidayListId,
          variables.holidayId,
        ),
      });
    },
  });
};

export const useDeleteHoliday = (
  companyId: CompanyEntityId,
  holidayListId: CompanyEntityId,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (holidayId: CompanyEntityId) =>
      companyApi.deleteHoliday(companyId, holidayListId, holidayId),
    onSuccess: (_, holidayId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.holidayListsHolidays(
          companyId,
          holidayListId,
        ),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.holiday(
          companyId,
          holidayListId,
          holidayId,
        ),
      });
    },
  });
};
