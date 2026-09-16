import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { queryKeys } from "@/shared/constants/query-keys";
import { recruitmentApi } from "../api/recruitment.api";
import type { UploadRecruitmentDocumentInput } from "../types";

const useDocumentContext = () => {
  const { activeCompanyId, user } = useAuth(); const companyId = activeCompanyId ?? 1;
  recruitmentApi.setCompanyContext(companyId, user?.role, user?.name); return companyId;
};

export const useRecruitmentDocuments = (candidateId: number) => {
  const companyId = useDocumentContext();
  const { user } = useAuth();
  return useQuery({ queryKey: queryKeys.recruitment.documents(candidateId, companyId), queryFn: () => recruitmentApi.listRecruitmentDocuments(candidateId), enabled: !!candidateId && user?.role === "hr" });
};

const useDocumentMutation = <T,>(candidateId: number, mutationFn: (input: T) => Promise<unknown>) => {
  const companyId = useDocumentContext(); const queryClient = useQueryClient();
  return useMutation({ mutationFn, onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.recruitment.documents(candidateId, companyId) }) });
};

export const useUploadRecruitmentDocument = (candidateId: number) => useDocumentMutation<UploadRecruitmentDocumentInput>(candidateId, recruitmentApi.uploadRecruitmentDocument);
export const useDeleteRecruitmentDocument = (candidateId: number) => useDocumentMutation<string>(candidateId, recruitmentApi.deleteRecruitmentDocument);
