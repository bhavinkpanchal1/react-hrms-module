import { useMutation, useQueryClient } from "@tanstack/react-query"
import { recruitmentApi } from "../api/recruitment.api";
import { queryKeys } from "@/shared/constants/query-keys";

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recruitmentApi.createJob,
    onSuccess: () =>{
      queryClient.invalidateQueries({
        queryKey: queryKeys.recruitment.jobs(),
      });
    },
  });
};