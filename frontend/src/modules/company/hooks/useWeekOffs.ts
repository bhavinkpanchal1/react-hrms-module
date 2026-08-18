import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { companyApi } from "../api/company.api";
import type {
  CompanyEntityId,
  CreateWeekOffInput,
  UpdateWeekOffInput,
} from "../types/company.types";

export const useWeekOffs = (companyId: CompanyEntityId) =>
  useQuery({
    queryKey: queryKeys.company.weekOffs(companyId),
    queryFn: () => companyApi.getWeekOffs(companyId),
    enabled: companyId > 0,
  });

export const useWeekOff = (
  companyId: CompanyEntityId,
  weekOffId: CompanyEntityId,
) =>
  useQuery({
    queryKey: queryKeys.company.weekOff(companyId, weekOffId),
    queryFn: () => companyApi.getWeekOffById(companyId, weekOffId),
    enabled: companyId > 0 && weekOffId > 0,
  });

export const useCreateWeekOff = (companyId: CompanyEntityId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWeekOffInput) =>
      companyApi.createWeekOff(companyId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.weekOffs(companyId),
      }),
  });
};

export const useUpdateWeekOff = (companyId: CompanyEntityId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      weekOffId,
      data,
    }: {
      weekOffId: CompanyEntityId;
      data: UpdateWeekOffInput;
    }) => companyApi.updateWeekOff(companyId, weekOffId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.weekOffs(companyId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.weekOff(companyId, variables.weekOffId),
      });
    },
  });
};

export const useDeleteWeekOff = (companyId: CompanyEntityId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (weekOffId: CompanyEntityId) =>
      companyApi.deleteWeekOff(companyId, weekOffId),
    onSuccess: (_, weekOffId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.weekOffs(companyId),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.company.weekOff(companyId, weekOffId),
      });
    },
  });
};
