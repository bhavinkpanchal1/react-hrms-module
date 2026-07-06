import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants/query-keys';
import { recruitmentApi } from '../api/recruitment.api';
import type { CreateCandidateInput, Candidate } from '../types';

export const useCandidates = () =>
  useQuery({ queryKey: queryKeys.recruitment.candidates(), queryFn: recruitmentApi.getCandidates });

export const useCreateCandidate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCandidateInput) => recruitmentApi.createCandidate(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.recruitment.candidates() }),
  });
};

export const useUpdateCandidateStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: Candidate['status'] }) =>
      recruitmentApi.updateCandidateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.recruitment.candidates() });
      qc.invalidateQueries({ queryKey: queryKeys.recruitment.pipeline() });
    },
  });
};

export const useDeleteCandidate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => recruitmentApi.deleteCandidate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.recruitment.candidates() }),
  });
};
