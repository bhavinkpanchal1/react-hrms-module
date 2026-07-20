import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants/query-keys';
import { recruitmentApi } from '../api/recruitment.api';
import type { Interview } from '../types/interview.type';


export const useInterviews = () =>
  useQuery({ queryKey: queryKeys.recruitment.interviews(), queryFn: recruitmentApi.getInterviews });

export const useCreateInterview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Interview, 'id'>) => recruitmentApi.createInterview(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.recruitment.interviews() });
      qc.invalidateQueries({ queryKey: queryKeys.recruitment.candidates() });
    },
  });
};

// Used for both recording an interview response and rescheduling an
// existing round — see recruitmentApi.updateInterview for why these share
// one mutation.
export const useUpdateInterview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Interview> }) =>
      recruitmentApi.updateInterview(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.recruitment.interviews() });
      qc.invalidateQueries({ queryKey: queryKeys.recruitment.candidates() });
    },
  });
};

// Derived — reuses the interviews list cache instead of firing a new
// request, since the mock/API already returns the full list.
export const useCandidateInterviews = (candidateId: number) =>
  useQuery({
    queryKey: queryKeys.recruitment.interviews(),
    queryFn: recruitmentApi.getInterviews,
    enabled: !!candidateId,
    select: (interviews) =>
      interviews
        .filter((iv) => iv.candidateId === candidateId)
        .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at)),
  });
