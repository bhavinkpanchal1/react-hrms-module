import { useState }            from 'react';
import { CalendarCheck2, Eye, MoreVertical, Plus, Users }          from 'lucide-react';
import { useCandidates, useDeleteCandidate, useUpdateCandidateStatus } from '../hooks/useCandidates';
import { CandidateStatusBadge } from '../components/CandidateStatusBadge';
import { Button }               from '@/shared/ui/button/Button';
import { TableRowSkeleton }     from '@/shared/ui/skeleton/Skeleton';
import EmptyState               from '@/shared/ui/empty-state/EmptyState';
import type { Candidate }   from '../types';
import { useNavigate } from 'react-router-dom';
import { AppDropdown } from '@/shared/ui/dropdown/AppDropdown';
import ScheduleInterviewPage from './Interview/scheduleInterviewPage';
import type { CandidateStatus } from '../constant/candidate';

const STATUS_FILTERS: { label: string; value: CandidateStatus | 'all' }[] = [
  { label: 'All',       value: 'all'       },
  { label: 'Applied',   value: 'applied'   },
  { label: 'Screening', value: 'screening' },
  { label: 'Interview', value: 'interview' },
  { label: 'Offer',     value: 'offer'     },
  { label: 'Onboarding', value: 'onboarding' },
  { label: 'Hired',     value: 'hired'     },
  { label: 'Rejected',  value: 'rejected'  },
];

const CandidatesPage = () => {
  const [search, setSearch]     = useState('');
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | 'all'>('all');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const { data: candidates = [], isLoading } = useCandidates();
  const navigate = useNavigate();
  const deleteCandidate = useDeleteCandidate();
  const updateStatus = useUpdateCandidateStatus();

  const filtered = candidates.filter((c) => {
    const matchSearch = `${c.first_name} ${c.last_name} ${c.email} ${c.job_title} ${c.source}` 
      .toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });


  const handleDelete = (id: number) => {
    if (window.confirm('Remove this candidate?')) deleteCandidate.mutate({ id });
  };

  const handleReject = (id: number) => {
    if (window.confirm('Reject this candidate? This can be reversed later by editing their status.')) {
      updateStatus.mutate({ id, status: 'rejected' });
    }
  };

  const handleSchedule = (c: Candidate) => {
    setIsOpen(true);
    setSelectedCandidate(c);
  }

  const close = () => {
    setIsOpen(false);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-navy-100">
            Candidates
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-navy-300">
            {candidates.length} total across all jobs
          </p>
        </div>
        <Button
          onClick={() => navigate("/recruitment/candidates/new")}
          leftIcon={<Plus className="size-4" />}
        >
          Add Candidate
        </Button>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, job..."
          className="form-input w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm
                     dark:border-navy-500 dark:bg-navy-700 dark:text-navy-100"
        />
        <div className="flex flex-wrap gap-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`btn px-3 py-1.5 text-xs font-medium ${
                statusFilter === f.value
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-navy-600 dark:text-navy-200"
              }`}
            >
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
                {[
                  "Candidate",
                  "Job Applied",
                  "Source",
                  "Status",
                  "Applied On",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-navy-300 ${h === "" ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-600">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={6} />
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      icon={Users}
                      title="No candidates found"
                      description={
                        search || statusFilter !== "all"
                          ? "Try adjusting your filters."
                          : "Add your first candidate to get started."
                      }
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800 dark:text-navy-100">
                        {c.first_name} {c.last_name}
                      </div>
                      <div className="text-xs text-slate-400 dark:text-navy-400">
                        {c.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-navy-300">
                      {c.job_title}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-navy-300">
                      {c.source}
                    </td>
                    <td className="px-4 py-3">
                      <CandidateStatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-navy-400">
                      {new Date(c.applied_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate(`/recruitment/candidates/${c.id}/`)
                        }
                      >
                        <Eye size={18} />
                      </Button>
                      {(c.status === "screening" || c.status === "interview") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSchedule(c)}
                          title={c.status === "screening" ? "Schedule Interview" : "Manage Interview"}
                        >
                          <CalendarCheck2 size={18} />
                        </Button>
                      )}
                      <AppDropdown
                        trigger={
                          <Button variant="ghost" size="sm">
                            <MoreVertical size={18} />
                          </Button>
                        }
                        items={[
                          ...(c.status === "applied"
                            ? [{
                                label: "Move to Screening",
                                onClick: () => updateStatus.mutate({ id: c.id, status: "screening" }),
                              }]
                            : []),
                          {
                            label: "Edit",
                            onClick: () =>
                              navigate(`/recruitment/candidates/${c.id}/edit`),
                          },
                          ...(["applied", "screening", "interview"].includes(c.status)
                            ? [{
                                label: "Reject",
                                onClick: () => handleReject(c.id),
                              }]
                            : []),
                          {
                            label: "Delete",
                            onClick: () => handleDelete(c.id),
                          },
                        ]}
                      ></AppDropdown>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ScheduleInterviewPage 
      isOpen={isOpen}
      close={close}
      title='Schedule Interview'
      candidate={selectedCandidate}
      />
    </div>
  );
};

export default CandidatesPage;
