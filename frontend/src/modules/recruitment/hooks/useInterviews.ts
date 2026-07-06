import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants/query-keys';
import { recruitmentApi } from '../api/recruitment.api';
import type { Interview } from '../types';

export const useInterviews = () =>
  useQuery({ queryKey: queryKeys.recruitment.interviews(), queryFn: recruitmentApi.getInterviews });

export const useCreateInterview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Interview, 'id'>) => recruitmentApi.createInterview(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.recruitment.interviews() }),
  });
};
