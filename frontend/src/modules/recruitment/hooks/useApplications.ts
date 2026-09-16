import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { queryKeys } from "@/shared/constants/query-keys";
import { recruitmentApi } from "../api/recruitment.api";
import type { ApplicationStatus, CreateApplicationInput } from "../types";

const invalidateRecruitment = (queryClient: ReturnType<typeof useQueryClient>, companyId: number) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.recruitment.applications(companyId) });
};

const useCompanyId = () => {
  const { activeCompanyId, user } = useAuth();
  const companyId = activeCompanyId ?? 1;
  recruitmentApi.setCompanyContext(companyId, user?.role, user?.name, user?.id);
  return companyId;
};

export const useApplications = () => {
  const companyId = useCompanyId();
  return useQuery({ queryKey: queryKeys.recruitment.applications(companyId), queryFn: recruitmentApi.listApplications });
};

export const useApplication = (id: number) => {
  const companyId = useCompanyId();
  return useQuery({ queryKey: queryKeys.recruitment.application(id, companyId), queryFn: () => recruitmentApi.getApplication(id), enabled: !!id });
};

export const useCreateApplication = () => {
  const companyId = useCompanyId();
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (input: CreateApplicationInput) => recruitmentApi.createApplication(input), onSuccess: () => invalidateRecruitment(queryClient, companyId) });
};

export const useUpdateApplicationStatus = () => {
  const companyId = useCompanyId();
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: ({ id, status }: { id: number; status: ApplicationStatus }) => recruitmentApi.updateApplicationStatus(id, status), onSuccess: () => invalidateRecruitment(queryClient, companyId) });
};

export const useRejectApplication = () => {
  const companyId = useCompanyId();
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: ({ id, rejectionReason }: { id: number; rejectionReason: string }) => recruitmentApi.rejectApplication(id, rejectionReason), onSuccess: () => invalidateRecruitment(queryClient, companyId) });
};

export const useCandidateApplications = (candidateId: number) => {
  const companyId = useCompanyId();
  return useQuery({ queryKey: queryKeys.recruitment.applications(companyId), queryFn: recruitmentApi.listApplications, enabled: !!candidateId, select: (items) => items.filter((item) => item.candidateId === candidateId) });
};
