import { useMutation, useQueryClient } from "@tanstack/react-query"
import { recruitmentApi } from "../api/recruitment.api";
import { queryKeys } from "@/shared/constants/query-keys";

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => 
      recruitmentApi.deleteJob(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.recruitment.jobs(),
      });
    },
  });
};