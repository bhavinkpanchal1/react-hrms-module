import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { companyApi } from "../api/company.api";
import type {
  CompanyEntityId,
  CompanyListParams,
  CreateCompanyInput,
  UpdateCompanyInput,
} from "../types/company.types";

export const useCompanies = (params: CompanyListParams) =>
  useQuery({
    queryKey: queryKeys.company.list(params),
    queryFn: () => companyApi.getCompanies(params),
  });

export const useCompany = (id: CompanyEntityId) =>
  useQuery({
    queryKey: queryKeys.company.detail(id),
    queryFn: () => companyApi.getCompanyById(id),
    enabled: id > 0,
  });

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCompanyInput) => companyApi.createCompany(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.company.lists() }),
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: CompanyEntityId; data: UpdateCompanyInput }) =>
      companyApi.updateCompany(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.company.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.detail(variables.id),
      });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: CompanyEntityId) => companyApi.deleteCompany(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.company.lists() });
      queryClient.removeQueries({ queryKey: queryKeys.company.detail(id) });
      queryClient.removeQueries({ queryKey: [...queryKeys.company.all, id] });
    },
  });
};
