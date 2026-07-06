import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants/query-keys';
import { recruitmentApi } from '../api/recruitment.api';
import type { Offer } from '../types';

export const useOffers = () =>
  useQuery({ queryKey: queryKeys.recruitment.offers(), queryFn: recruitmentApi.getOffers });

export const useCreateOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Offer, 'id' | 'issued_at'>) => recruitmentApi.createOffer(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.recruitment.offers() }),
  });
};

export const useUpdateOfferStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: Offer['status'] }) =>
      recruitmentApi.updateOfferStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.recruitment.offers() }),
  });
};
