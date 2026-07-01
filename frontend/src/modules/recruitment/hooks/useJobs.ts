import { queryKeys } from "@/shared/constants/query-keys"
import { useQuery } from "@tanstack/react-query"
import { recruitmentApi } from "../api/recruitment.api"

export const useJobs = () => {
  return useQuery({
    queryKey: queryKeys.recruitment.jobs(),
    queryFn: recruitmentApi.getJobs,
  });
};