import { Badge, type BadgeVariant } from '@/shared/ui/badge/Badge';
import type { ApplicationStatus, CandidateLifecycleStatus } from '../types';

const variantMap: Record<ApplicationStatus, BadgeVariant> = {
  APPLIED: 'default', SCREENING: 'info', INTERVIEW: 'warning', OFFERED: 'primary',
  OFFER_ACCEPTED: 'info', CONVERTED: 'success', REJECTED: 'error',
};
const candidateVariants: Record<CandidateLifecycleStatus, BadgeVariant> = { ACTIVE: 'success', INACTIVE: 'default' };

export const CandidateStatusBadge = ({ status }: { status: ApplicationStatus | CandidateLifecycleStatus }) => (
  <Badge label={status.replaceAll('_', ' ').toLowerCase().replace(/^./, (value) => value.toUpperCase())} variant={'ACTIVE' === status || 'INACTIVE' === status ? candidateVariants[status] : variantMap[status]} />
);
