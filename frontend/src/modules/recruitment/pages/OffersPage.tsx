import { FileText, UserPlus }  from 'lucide-react';
import { useNavigate }         from 'react-router-dom';
import { useOffers, useUpdateOfferStatus } from '../hooks/useOffers';
import { useCandidates, useUpdateCandidateStatus } from '../hooks/useCandidates';
import { Badge }               from '@/shared/ui/badge/Badge';
import { Button }              from '@/shared/ui/button/Button';
import { TableRowSkeleton }    from '@/shared/ui/skeleton/Skeleton';
import EmptyState              from '@/shared/ui/empty-state/EmptyState';
import type { OfferStatus }    from '../types';
import type { BadgeVariant }   from '@/shared/ui/badge/Badge';

const statusVariant: Record<OfferStatus, BadgeVariant> = {
  pending:   'warning',
  accepted:  'success',
  rejected:  'error',
  expired:   'default',
  withdrawn: 'default',
};

const OffersPage = () => {
  const { data: offers = [], isLoading } = useOffers();
  const { data: candidates = [] } = useCandidates();
  const updateStatus = useUpdateOfferStatus();
  const updateCandidateStatus = useUpdateCandidateStatus();
  const navigate = useNavigate();

  // Accepting an offer moves the candidate to 'onboarding', not 'hired' —
  // 'hired' is reserved for once an actual employee record exists (see the
  // Onboard action below). Two separate mutations, but one user action.
  const handleAccept = (offerId: number, candidateId: number) => {
    updateStatus.mutate({ id: offerId, status: 'accepted' });
    updateCandidateStatus.mutate({ id: candidateId, status: 'onboarding' });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-navy-100">Offers</h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-navy-300">
          Track offer letters issued to candidates
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total',    value: offers.length,                                        cls: 'text-slate-800 dark:text-navy-100' },
          { label: 'Pending',  value: offers.filter((o) => o.status === 'pending').length,  cls: 'text-warning' },
          { label: 'Accepted', value: offers.filter((o) => o.status === 'accepted').length, cls: 'text-success' },
          { label: 'Rejected', value: offers.filter((o) => o.status === 'rejected').length, cls: 'text-error'   },
        ].map((s) => (
          <div key={s.label} className="card px-4 py-3">
            <p className="text-xs text-slate-400 dark:text-navy-400">{s.label}</p>
            <p className={`mt-1 text-2xl font-semibold ${s.cls}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="is-hoverable w-full text-sm">
            <thead>
              <tr className="border-b border-slate-150 dark:border-navy-600">
                {['Candidate', 'Job', 'Offered Salary', 'Joining Date', 'Issued On', 'Status', 'Actions'].map((h) => (
                  <th key={h} className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-navy-300 ${h === 'Actions' ? 'text-right' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-600">
              {isLoading
                ? Array.from({ length: 2 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)
                : offers.length === 0
                ? (
                  <tr><td colSpan={7}>
                    <EmptyState icon={FileText} title="No offers yet"
                      description="Offers will appear here once they are issued to candidates." />
                  </td></tr>
                )
                : offers.map((o) => {
                  const candidate = candidates.find((c) => c.id === o.candidateId);
                  return (
                  <tr key={o.id}>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-navy-100">{o.candidate_name}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-navy-300">{o.job_title}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-navy-300">
                      ₹{o.offered_salary.toLocaleString('en-IN')} / yr
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-navy-300">
                      {new Date(o.joining_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-navy-400">
                      {new Date(o.issued_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <Badge label={o.status} variant={statusVariant[o.status]} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      {o.status === 'pending' && (
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm"
                            isLoading={updateStatus.isPending || updateCandidateStatus.isPending}
                            onClick={() => handleAccept(o.id, o.candidateId)}
                            className="text-success hover:bg-success/10">
                            Accept
                          </Button>
                          <Button variant="ghost" size="sm"
                            isLoading={updateStatus.isPending}
                            onClick={() => updateStatus.mutate({ id: o.id, status: 'rejected' })}
                            className="text-error hover:bg-error/10">
                            Decline
                          </Button>
                        </div>
                      )}
                      {o.status === 'accepted' && !candidate?.converted_to_employee && (
                        <Button variant="ghost" size="sm"
                          onClick={() => navigate(`/employees/new?candidateId=${o.candidateId}&offerId=${o.id}`)}
                          leftIcon={<UserPlus className="size-4" />}
                          className="text-primary hover:bg-primary/10">
                          Onboard
                        </Button>
                      )}
                      {candidate?.converted_to_employee && (
                        <Badge label="Onboarded" variant="success" />
                      )}
                    </td>
                  </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OffersPage;