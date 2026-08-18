import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { companyApi } from "../api/company.api";
import type {
  BranchListParams,
  CompanyEntityId,
  CreateBranchInput,
  UpdateBranchInput,
} from "../types/company.types";

export const useBranches = (
  companyId: CompanyEntityId,
  params: BranchListParams,
) =>
  useQuery({
    queryKey: queryKeys.company.branches(companyId, params),
    queryFn: () => companyApi.getBranches(companyId, params),
    enabled: companyId > 0,
  });

export const useBranch = (
  companyId: CompanyEntityId,
  branchId: CompanyEntityId,
) =>
  useQuery({
    queryKey: queryKeys.company.branch(companyId, branchId),
    queryFn: () => companyApi.getBranchById(companyId, branchId),
    enabled: companyId > 0 && branchId > 0,
  });

export const useCreateBranch = (companyId: CompanyEntityId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBranchInput) =>
      companyApi.createBranch(companyId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.branchLists(companyId),
      }),
  });
};

export const useUpdateBranch = (companyId: CompanyEntityId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      branchId,
      data,
    }: {
      branchId: CompanyEntityId;
      data: UpdateBranchInput;
    }) => companyApi.updateBranch(companyId, branchId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.branchLists(companyId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.branch(companyId, variables.branchId),
      });
    },
  });
};

export const useDeleteBranch = (companyId: CompanyEntityId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (branchId: CompanyEntityId) =>
      companyApi.deleteBranch(companyId, branchId),
    onSuccess: (_, branchId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.branchLists(companyId),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.company.branch(companyId, branchId),
      });
    },
  });
};
