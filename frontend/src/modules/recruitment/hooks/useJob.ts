import { queryKeys } from "@/shared/constants/query-keys"
import { useQuery } from "@tanstack/react-query"
import { recruitmentApi } from "../api/recruitment.api"

export const useJob = (id: number) => {
  return useQuery({
    queryKey: queryKeys.recruitment.jobDetail(id),
    queryFn: () => recruitmentApi.getJobById(id),
    enabled: !!id,
  });
};