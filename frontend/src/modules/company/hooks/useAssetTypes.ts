import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { companyApi } from "../api/company.api";
import type {
  AssetTypeParams,
  CompanyEntityId,
  CreateAssetTypeInput,
  UpdateAssetTypeInput,
} from "../types/company.types";

export const useAssetTypes = (
  companyId: CompanyEntityId,
  params: AssetTypeParams,
) =>
  useQuery({
    queryKey: queryKeys.company.assetTypes(companyId, params),
    queryFn: () => companyApi.getAssetTypes(companyId, params),
    enabled: companyId > 0,
  });

export const useAssetType = (
  companyId: CompanyEntityId,
  assetTypeId: CompanyEntityId,
) =>
  useQuery({
    queryKey: queryKeys.company.assetType(companyId, assetTypeId),
    queryFn: () => companyApi.getAssetTypeById(companyId, assetTypeId),
    enabled: companyId > 0 && assetTypeId > 0,
  });

export const useCreateAssetType = (companyId: CompanyEntityId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAssetTypeInput) =>
      companyApi.createAssetType(companyId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.assetTypeLists(companyId),
      }),
  });
};

export const useUpdateAssetType = (companyId: CompanyEntityId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      assetTypeId,
      data,
    }: {
      assetTypeId: CompanyEntityId;
      data: UpdateAssetTypeInput;
    }) => companyApi.updateAssetType(companyId, assetTypeId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.assetTypeLists(companyId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.assetType(companyId, variables.assetTypeId),
      });
    },
  });
};

export const useDeleteAssetType = (companyId: CompanyEntityId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assetTypeId: CompanyEntityId) =>
      companyApi.deleteAssetType(companyId, assetTypeId),
    onSuccess: (_, assetTypeId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.company.assetTypeLists(companyId),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.company.assetType(companyId, assetTypeId),
      });
    },
  });
};
