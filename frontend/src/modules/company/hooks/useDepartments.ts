import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { companyApi } from "../api/company.api";
import type {
  CompanyEntityId,
  CreateDepartmentInput,
  DepartmentListParams,
  UpdateDepartmentInput,
} from "../types/company.types";

export const useDepartments = (
  companyId: CompanyEntityId,
  params: DepartmentListParams,
) =>
  useQuery({
    queryKey: queryKeys.company.departments(companyId, params),
    queryFn: () => companyApi.getDepartments(companyId, params),
    enabled: companyId > 0,
  });

export const useDepartment = (
  companyId: CompanyEntityId,
  departmentId: CompanyEntityId,
) =>
  useQuery({
    queryKey: queryKeys.company.department(companyId, departmentId),
    queryFn: () => companyApi.getDepartmentById(companyId, departmentId),
    enabled: companyId > 0 && departmentId > 0,
  });

export const useCreateDepartment = (companyId: CompanyEntityId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDepartmentInput) =>
      companyApi.createDepartment(companyId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.departmentLists(companyId),
      }),
  });
};

export const useUpdateDepartment = (companyId: CompanyEntityId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      departmentId,
      data,
    }: {
      departmentId: CompanyEntityId;
      data: UpdateDepartmentInput;
    }) => companyApi.updateDepartment(companyId, departmentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.departmentLists(companyId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.department(companyId, variables.departmentId),
      });
    },
  });
};

export const useDeleteDepartment = (companyId: CompanyEntityId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (departmentId: CompanyEntityId) =>
      companyApi.deleteDepartment(companyId, departmentId),
    onSuccess: (_, departmentId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.departmentLists(companyId),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.company.department(companyId, departmentId),
      });
    },
  });
};
