import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants/query-keys';
import { recruitmentApi } from '../api/recruitment.api';
import type { JobFormData } from '../schema/job.schema';
import { useAuth } from '@/modules/auth/hooks/useAuth';

const useCompanyContext=()=>{const {activeCompanyId,user}=useAuth();const companyId=activeCompanyId??1;recruitmentApi.setCompanyContext(companyId,user?.role,user?.name,user?.id);return companyId;};
export const useJobs = () => { const companyId=useCompanyContext(); return useQuery({ queryKey: queryKeys.recruitment.jobs(companyId), queryFn: recruitmentApi.getJobs }); };

export const useCreateJob = () => {
  const companyId=useCompanyContext();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: JobFormData) => recruitmentApi.createJob(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.recruitment.jobs(companyId) }),
  });
};

export const useUpdateJob = () => {
  const companyId=useCompanyContext();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<JobFormData> }) => recruitmentApi.updateJob(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.recruitment.jobs(companyId) }),
  });
};

export const useDeleteJob = () => {
  const companyId=useCompanyContext();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => recruitmentApi.deleteJob(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.recruitment.jobs(companyId) }),
  });
};
