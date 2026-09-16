import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants/query-keys';
import { recruitmentApi } from '../api/recruitment.api';
import type { CreateCandidateInput, Candidate } from '../types';
import { useAuth } from '@/modules/auth/hooks/useAuth';

const useCompanyId = () => {
  const { activeCompanyId, user } = useAuth();
  const companyId = activeCompanyId ?? 1;
  recruitmentApi.setCompanyContext(companyId, user?.role);
  return companyId;
};

export const useCandidates = () => {
  const companyId = useCompanyId();
  return useQuery({ queryKey: queryKeys.recruitment.candidates(companyId), queryFn: recruitmentApi.getCandidates });
};

export const useCandidate =(id: number) => {
 const companyId = useCompanyId();
 return useQuery({
  queryKey: queryKeys.recruitment.candidate(id, companyId),
  queryFn: () => recruitmentApi.getCandidateById(id),
  enabled: !!id,
})}

export const useCreateCandidate = () => {
  const companyId = useCompanyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCandidateInput) => recruitmentApi.createCandidate(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.recruitment.candidates(companyId) }); qc.invalidateQueries({ queryKey: queryKeys.recruitment.applications(companyId) }); },
  });
};

export const useUpdateCandidate = () => {
  const companyId = useCompanyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Candidate> }) =>
      recruitmentApi.updateCandidate(id, data),
    onSuccess: (_, variable) => {
      qc.invalidateQueries({ queryKey: queryKeys.recruitment.candidates(companyId) });
      qc.invalidateQueries({ queryKey: queryKeys.recruitment.candidate(variable.id, companyId)});
    },
  });
};

export const useDeleteCandidate = () => {
  const companyId = useCompanyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => recruitmentApi.deleteCandidate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.recruitment.candidates(companyId) }),
  });
};

export const useCheckCandidateDuplicates = () => {
  useCompanyId();
  return useMutation({ mutationFn: ({ email, phone }: { email: string; phone: string }) => recruitmentApi.findCandidateDuplicates(email, phone) });
};

export const useActivateCandidate = () => {
  const companyId = useCompanyId(); const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => recruitmentApi.activateCandidate(id), onSuccess: (_, id) => { qc.invalidateQueries({ queryKey: queryKeys.recruitment.candidates(companyId) }); qc.invalidateQueries({ queryKey: queryKeys.recruitment.candidate(id, companyId) }); } });
};

export const useDeactivateCandidate = () => {
  const companyId = useCompanyId(); const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, reason }: { id: number; reason: string }) => recruitmentApi.deactivateCandidate(id, reason), onSuccess: (_, input) => { qc.invalidateQueries({ queryKey: queryKeys.recruitment.candidates(companyId) }); qc.invalidateQueries({ queryKey: queryKeys.recruitment.candidate(input.id, companyId) }); } });
};
