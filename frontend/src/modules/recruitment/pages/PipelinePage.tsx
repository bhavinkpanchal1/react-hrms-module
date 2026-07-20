import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck2 } from 'lucide-react';
import { useCandidates, useUpdateCandidateStatus } from '../hooks/useCandidates';
import { useCandidateInterviews } from '../hooks/useInterviews';
import { CandidateStatusBadge } from '../components/CandidateStatusBadge';
import { PageSpinner }          from '@/shared/ui/spinner/Spinner';
import { Button }               from '@/shared/ui';
import type { Candidate, CandidateStatus } from '../types';
import ScheduleInterviewPage from './Interview/scheduleInterviewPage';

const STAGES: { status: CandidateStatus; label: string; color: string }[] = [
  { status: 'applied',   label: 'Applied',   color: 'border-t-slate-400' },
  { status: 'screening', label: 'Screening', color: 'border-t-info'      },
  { status: 'interview', label: 'Interview', color: 'border-t-warning'   },
  { status: 'offer',     label: 'Offer',     color: 'border-t-primary'   },
  { status: 'hired',     label: 'Hired',     color: 'border-t-success'   },
];

// Card content differs per stage since each stage's forward move has a
// different real-world action attached to it (schedule / pass a round /
// go review the offer) — a single generic "Next" button can't express that.
const PipelineCard = ({
  candidate,
  onBack,
  onScheduleInterview,
  isMutating,
}: {
  candidate: Candidate;
  onBack: () => void;
  onScheduleInterview: () => void;
  isMutating: boolean;
}) => {
  const navigate = useNavigate();
  const { data: rounds = [] } = useCandidateInterviews(
    candidate.status === 'interview' ? candidate.id : 0,
  );
  const latest = rounds[rounds.length - 1];
  const isFirstStage = candidate.status === STAGES[0].status;

  return (
    <div className="card cursor-default px-4 py-3 transition-shadow hover:shadow-md">
      <p className="font-medium text-slate-800 dark:text-navy-100">
        {candidate.first_name} {candidate.last_name}
      </p>
      <p className="mt-0.5 text-xs text-slate-400 dark:text-navy-400">{candidate.job_title}</p>
      <p className="mt-0.5 text-xs text-slate-400 dark:text-navy-400">{candidate.source}</p>

      {candidate.status === 'interview' && (
        <p className="mt-1.5 text-xs font-medium text-warning">
          {latest
            ? `Round ${rounds.length} — ${latest.status === 'scheduled' ? 'Scheduled' : latest.result === 'pass' ? 'Passed' : latest.result === 'fail' ? 'Failed' : 'Awaiting response'}`
            : 'Not yet scheduled'}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        <button
          disabled={isFirstStage || isMutating}
          onClick={onBack}
          className="btn flex-1 border border-slate-200 py-1 text-xs text-slate-500 hover:bg-slate-50 disabled:opacity-40 dark:border-navy-600 dark:text-navy-300">
          ← Back
        </button>

        {candidate.status === 'screening' && (
          <Button size="sm" className="flex-1 py-1 text-xs" onClick={onScheduleInterview} isLoading={isMutating}
            leftIcon={<CalendarCheck2 className="size-3.5" />}>
            Schedule Interview
          </Button>
        )}

        {candidate.status === 'interview' && (
          latest?.result === 'pass' ? (
            <Button size="sm" className="flex-1 py-1 text-xs" onClick={() => navigate('/recruitment/offers')}>
              Move to Offer →
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="flex-1 py-1 text-xs" onClick={onScheduleInterview}
              leftIcon={<CalendarCheck2 className="size-3.5" />}>
              {rounds.length === 0 ? 'Schedule' : 'Next Round'}
            </Button>
          )
        )}

        {candidate.status === 'offer' && (
          <Button size="sm" variant="outline" className="flex-1 py-1 text-xs" onClick={() => navigate('/recruitment/offers')}>
            View Offer →
          </Button>
        )}
      </div>
    </div>
  );
};

const PipelinePage = () => {
  const { data: candidates = [], isLoading } = useCandidates();
  const updateStatus = useUpdateCandidateStatus();
  const [scheduleTarget, setScheduleTarget] = useState<Candidate | null>(null);

  if (isLoading) return <PageSpinner />;

  const byStage = (status: CandidateStatus): Candidate[] =>
    candidates.filter((c) => c.status === status);

  const moveBack = (c: Candidate) => {
    const idx = STAGES.findIndex((s) => s.status === c.status);
    if (idx <= 0) return;
    updateStatus.mutate({ id: c.id, status: STAGES[idx - 1].status });
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
                  <PipelineCard
                    key={c.id}
                    candidate={c}
                    onBack={() => moveBack(c)}
                    onScheduleInterview={() => setScheduleTarget(c)}
                    isMutating={updateStatus.isPending}
                  />
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

      <ScheduleInterviewPage
        isOpen={scheduleTarget !== null}
        close={() => setScheduleTarget(null)}
        title="Schedule Interview"
        candidate={scheduleTarget}
      />
    </div>
  );
};

export default PipelinePage;
