import { CalendarClock } from 'lucide-react';
import { useInterviews }    from '../hooks/useInterviews';
import { Badge, type BadgeVariant }            from '@/shared/ui/badge/Badge';
import { TableRowSkeleton } from '@/shared/ui/skeleton/Skeleton';
import EmptyState           from '@/shared/ui/empty-state/EmptyState';
import type { InterviewStatus } from '../types/interview.type';

const statusVariant = {
  scheduled:  'info',
  completed:  'success',
  cancelled:  'error',
  no_show:    'warning',
} satisfies Record<InterviewStatus, BadgeVariant>;

const InterviewsPage = () => {
  const { data: interviews = [], isLoading } = useInterviews();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-navy-100">Interviews</h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-navy-300">
          Scheduled and completed interview sessions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total',     value: interviews.length,                                          cls: 'text-slate-800 dark:text-navy-100' },
          { label: 'Scheduled', value: interviews.filter((i) => i.status === 'scheduled').length,  cls: 'text-info'    },
          { label: 'Completed', value: interviews.filter((i) => i.status === 'completed').length,  cls: 'text-success' },
          { label: 'Cancelled', value: interviews.filter((i) => i.status === 'cancelled').length,  cls: 'text-error'   },
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
                {['Candidate', 'Job', 'Interviewer', 'Date & Time', 'Duration', 'Mode', 'Status'].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-navy-300">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-600">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)
                : interviews.length === 0
                ? (
                  <tr><td colSpan={7}>
                    <EmptyState icon={CalendarClock} title="No interviews yet"
                      description="Interviews will appear here once candidates move to the interview stage." />
                  </td></tr>
                )
                : interviews.map((iv) => (
                  <tr key={iv.id}>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-navy-100">{iv.candidate_name}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-navy-300">{iv.job_title}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-navy-300">{iv.interviewer}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-navy-300">
                      {new Date(iv.scheduled_at).toLocaleString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-navy-300">{iv.duration_minutes} min</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-navy-300">
                      {iv.mode === 'online' ? '🖥 Online' : '🏢 In Person'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge label={iv.status.replace('_', ' ')} variant={statusVariant[iv.status]} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InterviewsPage;
