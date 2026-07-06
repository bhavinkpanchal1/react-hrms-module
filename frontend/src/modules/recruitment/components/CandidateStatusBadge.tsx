import { Badge } from '@/shared/ui/badge/Badge';
import type { BadgeVariant } from '@/shared/ui/badge/Badge';
import type { CandidateStatus } from '../types';

const variantMap: Record<CandidateStatus, BadgeVariant> = {
  applied: 'default',
  screening: 'info',
  interview: 'warning',
  offer: 'primary',
  hired: 'success',
  rejected: 'error',
};

export const CandidateStatusBadge = ({ status }: { status: CandidateStatus }) => (
  <Badge label={status.charAt(0).toUpperCase() + status.slice(1)} variant={variantMap[status]} />
);
