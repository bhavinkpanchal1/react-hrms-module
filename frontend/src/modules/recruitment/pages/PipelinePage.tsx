import { useCandidates, useUpdateCandidateStatus } from '../hooks/useCandidates';
import { CandidateStatusBadge } from '../components/CandidateStatusBadge';
import { PageSpinner }          from '@/shared/ui/spinner/Spinner';
import type { Candidate, CandidateStatus } from '../types';

const STAGES: { status: CandidateStatus; label: string; color: string }[] = [
  { status: 'applied',   label: 'Applied',   color: 'border-t-slate-400' },
  { status: 'screening', label: 'Screening', color: 'border-t-info'      },
  { status: 'interview', label: 'Interview', color: 'border-t-warning'   },
  { status: 'offer',     label: 'Offer',     color: 'border-t-primary'   },
  { status: 'hired',     label: 'Hired',     color: 'border-t-success'   },
];

const PipelinePage = () => {
  const { data: candidates = [], isLoading } = useCandidates();
  const updateStatus = useUpdateCandidateStatus();

  if (isLoading) return <PageSpinner />;

  const byStage = (status: CandidateStatus): Candidate[] =>
    candidates.filter((c) => c.status === status);

  const moveCandidate = (c: Candidate, direction: 'forward' | 'back') => {
    const idx = STAGES.findIndex((s) => s.status === c.status);
    const nextIdx = direction === 'forward' ? idx + 1 : idx - 1;
    if (nextIdx < 0 || nextIdx >= STAGES.length) return;
    updateStatus.mutate({ id: c.id, status: STAGES[nextIdx].status });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-navy-100">Pipeline</h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-navy-300">
          Track candidates across each stage of your recruitment process
        </p>
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageCandidates = byStage(stage.status);
          return (
            <div key={stage.status} className="flex w-64 shrink-0 flex-col gap-3">
              {/* Column header */}
              <div className={`card border-t-4 px-4 py-3 ${stage.color}`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-navy-100">{stage.label}</span>
                  <span className="badge bg-slate-150 text-slate-600 dark:bg-navy-600 dark:text-navy-200">
                    {stageCandidates.length}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2">
                {stageCandidates.length === 0 && (
                  <div className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center text-xs text-slate-400 dark:border-navy-600 dark:text-navy-400">
                    No candidates
                  </div>
                )}
                {stageCandidates.map((c) => (
                  <div key={c.id}
                    className="card cursor-default px-4 py-3 transition-shadow hover:shadow-md">
                    <p className="font-medium text-slate-800 dark:text-navy-100">
                      {c.first_name} {c.last_name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400 dark:text-navy-400">{c.job_title}</p>
                    <p className="mt-0.5 text-xs text-slate-400 dark:text-navy-400">{c.source}</p>
                    {/* Move buttons */}
                    <div className="mt-3 flex justify-between gap-1">
                      <button
                        disabled={STAGES[0].status === c.status || updateStatus.isPending}
                        onClick={() => moveCandidate(c, 'back')}
                        className="btn flex-1 border border-slate-200 py-1 text-xs text-slate-500 hover:bg-slate-50 disabled:opacity-40 dark:border-navy-600 dark:text-navy-300">
                        ← Back
                      </button>
                      <button
                        disabled={STAGES[STAGES.length - 1].status === c.status || updateStatus.isPending}
                        onClick={() => moveCandidate(c, 'forward')}
                        className="btn flex-1 bg-primary/10 py-1 text-xs text-primary hover:bg-primary/20 disabled:opacity-40">
                        Next →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Rejected column — separate, right edge */}
        <div className="flex w-64 shrink-0 flex-col gap-3">
          <div className="card border-t-4 border-t-error px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-navy-100">Rejected</span>
              <span className="badge bg-slate-150 text-slate-600 dark:bg-navy-600 dark:text-navy-200">
                {candidates.filter((c) => c.status === 'rejected').length}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {candidates.filter((c) => c.status === 'rejected').map((c) => (
              <div key={c.id} className="card px-4 py-3 opacity-60">
                <p className="font-medium text-slate-800 dark:text-navy-100">{c.first_name} {c.last_name}</p>
                <p className="mt-0.5 text-xs text-slate-400 dark:text-navy-400">{c.job_title}</p>
                <div className="mt-2">
                  <CandidateStatusBadge status="rejected" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelinePage;
