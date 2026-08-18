import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { companyApi } from "../api/company.api";
import type {
  CompanyEntityId,
  CreateDesignationInput,
  DesignationListParams,
  UpdateDesignationInput,
} from "../types/company.types";

export const useDesignations = (
  companyId: CompanyEntityId,
  params: DesignationListParams,
) =>
  useQuery({
    queryKey: queryKeys.company.designations(companyId, params),
    queryFn: () => companyApi.getDesignations(companyId, params),
    enabled: companyId > 0,
  });

export const useDesignation = (
  companyId: CompanyEntityId,
  designationId: CompanyEntityId,
) =>
  useQuery({
    queryKey: queryKeys.company.designation(companyId, designationId),
    queryFn: () => companyApi.getDesignationById(companyId, designationId),
    enabled: companyId > 0 && designationId > 0,
  });

export const useCreateDesignation = (companyId: CompanyEntityId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDesignationInput) =>
      companyApi.createDesignation(companyId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.designationLists(companyId),
      }),
  });
};

export const useUpdateDesignation = (companyId: CompanyEntityId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      designationId,
      data,
    }: {
      designationId: CompanyEntityId;
      data: UpdateDesignationInput;
    }) => companyApi.updateDesignation(companyId, designationId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.designationLists(companyId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.designation(companyId, variables.designationId),
      });
    },
  });
};

export const useDeleteDesignation = (companyId: CompanyEntityId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (designationId: CompanyEntityId) =>
      companyApi.deleteDesignation(companyId, designationId),
    onSuccess: (_, designationId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.designationLists(companyId),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.company.designation(companyId, designationId),
      });
    },
  });
};
