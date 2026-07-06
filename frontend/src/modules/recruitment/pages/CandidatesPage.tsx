import { useState }            from 'react';
import { Plus, Users }          from 'lucide-react';
import { useCandidates, useCreateCandidate, useDeleteCandidate } from '../hooks/useCandidates';
import { useJobs }              from '../hooks/useJobs';
import { CandidateForm }        from '../components/CandidateForm';
import { CandidateStatusBadge } from '../components/CandidateStatusBadge';
import { Modal }                from '@/shared/ui/modal/Modal';
import { Button }               from '@/shared/ui/button/Button';
import { TableRowSkeleton }     from '@/shared/ui/skeleton/Skeleton';
import EmptyState               from '@/shared/ui/empty-state/EmptyState';
import type { CandidateFormData } from '../schema/candidate.schema';
import type { CandidateStatus }   from '../types';

const STATUS_FILTERS: { label: string; value: CandidateStatus | 'all' }[] = [
  { label: 'All',       value: 'all'       },
  { label: 'Applied',   value: 'applied'   },
  { label: 'Screening', value: 'screening' },
  { label: 'Interview', value: 'interview' },
  { label: 'Offer',     value: 'offer'     },
  { label: 'Hired',     value: 'hired'     },
  { label: 'Rejected',  value: 'rejected'  },
];

const CandidatesPage = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [search, setSearch]     = useState('');
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | 'all'>('all');

  const { data: candidates = [], isLoading } = useCandidates();
  const { data: jobs = [] }                  = useJobs();
  const createCandidate = useCreateCandidate();
  const deleteCandidate = useDeleteCandidate();

  const filtered = candidates.filter((c) => {
    const matchSearch = `${c.first_name} ${c.last_name} ${c.email} ${c.job_title}`
      .toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSubmit = (data: CandidateFormData) => {
    createCandidate.mutate(data, { onSuccess: () => setIsOpen(false) });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Remove this candidate?')) deleteCandidate.mutate({ id });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-navy-100">Candidates</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-navy-300">
            {candidates.length} total across all jobs
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)} leftIcon={<Plus className="size-4" />}>
          Add Candidate
        </Button>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, job..."
          className="form-input w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm
                     dark:border-navy-500 dark:bg-navy-700 dark:text-navy-100"
        />
        <div className="flex flex-wrap gap-1">
          {STATUS_FILTERS.map((f) => (
            <button key={f.value} onClick={() => setStatusFilter(f.value)}
              className={`btn px-3 py-1.5 text-xs font-medium ${
                statusFilter === f.value
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-navy-600 dark:text-navy-200'
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="is-hoverable w-full text-sm">
            <thead>
              <tr className="border-b border-slate-150 dark:border-navy-600">
                {['Candidate', 'Job Applied', 'Source', 'Status', 'Applied On', ''].map((h) => (
                  <th key={h} className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-navy-300 ${h === '' ? 'text-right' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-600">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
                : filtered.length === 0
                ? (
                  <tr><td colSpan={6}>
                    <EmptyState icon={Users} title="No candidates found"
                      description={search || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'Add your first candidate to get started.'} />
                  </td></tr>
                )
                : filtered.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800 dark:text-navy-100">
                        {c.first_name} {c.last_name}
                      </div>
                      <div className="text-xs text-slate-400 dark:text-navy-400">{c.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-navy-300">{c.job_title}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-navy-300">{c.source}</td>
                    <td className="px-4 py-3"><CandidateStatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-slate-500 dark:text-navy-400">
                      {new Date(c.applied_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)}
                        className="text-error hover:bg-error/10">Remove</Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Candidate" size="lg">
        <CandidateForm jobs={jobs} onSubmit={handleSubmit} onCancel={() => setIsOpen(false)}
          isSubmitting={createCandidate.isPending} />
      </Modal>
    </div>
  );
};

export default CandidatesPage;
