import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants/query-keys';
import { recruitmentApi } from '../api/recruitment.api';
import type { JobFormData } from '../schema/job.schema';

export const useJobs = () =>
  useQuery({ queryKey: queryKeys.recruitment.jobs(), queryFn: recruitmentApi.getJobs });

export const useCreateJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: JobFormData) => recruitmentApi.createJob(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.recruitment.jobs() }),
  });
};

export const useUpdateJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<JobFormData> }) => recruitmentApi.updateJob(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.recruitment.jobs() }),
  });
};

export const useDeleteJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => recruitmentApi.deleteJob(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.recruitment.jobs() }),
  });
};
