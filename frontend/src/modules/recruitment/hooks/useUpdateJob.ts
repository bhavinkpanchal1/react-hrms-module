import { useMutation, useQueryClient } from "@tanstack/react-query"
import { recruitmentApi } from "../api/recruitment.api";
import type { Job } from "../types";
import { queryKeys } from "@/shared/constants/query-keys";

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<Job> }) => recruitmentApi.updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.recruitment.jobs(),
      });
    },
  });
};