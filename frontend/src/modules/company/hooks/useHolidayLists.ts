import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { companyApi } from "../api/company.api";
import type {
  CompanyEntityId,
  CreateHolidayListInput,
  HolidayListParams,
  UpdateHolidayListInput,
} from "../types/company.types";

export const useHolidayLists = (
  companyId: CompanyEntityId,
  params: HolidayListParams,
) =>
  useQuery({
    queryKey: queryKeys.company.holidayLists(companyId, params),
    queryFn: () => companyApi.getHolidayLists(companyId, params),
    enabled: companyId > 0,
  });

export const useHolidayList = (
  companyId: CompanyEntityId,
  holidayListId: CompanyEntityId,
) =>
  useQuery({
    queryKey: queryKeys.company.holidayList(companyId, holidayListId),
    queryFn: () => companyApi.getHolidayListById(companyId, holidayListId),
    enabled: companyId > 0 && holidayListId > 0,
  });

export const useCreateHolidayList = (companyId: CompanyEntityId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateHolidayListInput) =>
      companyApi.createHolidayList(companyId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.holidayListLists(companyId),
      }),
  });
};

export const useUpdateHolidayList = (companyId: CompanyEntityId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      holidayListId,
      data,
    }: {
      holidayListId: CompanyEntityId;
      data: UpdateHolidayListInput;
    }) => companyApi.updateHolidayList(companyId, holidayListId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.holidayListLists(companyId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.holidayList(
          companyId,
          variables.holidayListId,
        ),
      });
    },
  });
};

export const useDeleteHolidayList = (companyId: CompanyEntityId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (holidayListId: CompanyEntityId) =>
      companyApi.deleteHolidayList(companyId, holidayListId),
    onSuccess: (_, holidayListId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.holidayListLists(companyId),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.company.holidayList(companyId, holidayListId),
      });
    },
  });
};
