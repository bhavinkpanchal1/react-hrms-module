import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { companyApi } from "../api/company.api";
import type {
  CompanyEntityId,
  CreatePolicyInput,
  PolicyListParams,
} from "../types/company.types";

export const usePolicies = (
  companyId: CompanyEntityId,
  params: PolicyListParams,
) =>
  useQuery({
    queryKey: queryKeys.company.policies(companyId, params),
    queryFn: () => companyApi.getPolicies(companyId, params),
    enabled: companyId > 0,
  });

export const usePolicy = (
  companyId: CompanyEntityId,
  policyId: CompanyEntityId,
) =>
  useQuery({
    queryKey: queryKeys.company.policy(companyId, policyId),
    queryFn: () => companyApi.getPolicyById(companyId, policyId),
    enabled: companyId > 0 && policyId > 0,
  });

export const useCreatePolicy = (companyId: CompanyEntityId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePolicyInput) =>
      companyApi.createPolicy(companyId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.policyLists(companyId),
      }),
  });
};

export const useDeletePolicy = (companyId: CompanyEntityId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (policyId: CompanyEntityId) =>
      companyApi.deletePolicy(companyId, policyId),
    onSuccess: (_, policyId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.policyLists(companyId),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.company.policy(companyId, policyId),
      });
    },
  });
};

export const useViewPolicyFile = (companyId: CompanyEntityId) =>
  useMutation({
    mutationFn: (policyId: CompanyEntityId) =>
      companyApi.viewPolicyFile(companyId, policyId),
  });

export const useDownloadPolicyFile = (companyId: CompanyEntityId) =>
  useMutation({
    mutationFn: (policyId: CompanyEntityId) =>
      companyApi.downloadPolicyFile(companyId, policyId),
  });
