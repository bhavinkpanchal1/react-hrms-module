import { Pencil, Trash2, Briefcase } from 'lucide-react';
import { Badge }           from '@/shared/ui/badge/Badge';
import { Button }          from '@/shared/ui/button/Button';
import { TableRowSkeleton } from '@/shared/ui/skeleton/Skeleton';
import EmptyState          from '@/shared/ui/empty-state/EmptyState';
import type { Job, JobStatus } from '../types';
import type { BadgeVariant } from '@/shared/ui/badge/Badge';

const statusVariant: Record<JobStatus, BadgeVariant> = {
  open: 'success', draft: 'default', on_hold: 'warning', closed: 'error',
};

interface JobTableProps {
  jobs:      Job[];
  isLoading: boolean;
  onEdit:    (job: Job) => void;
  onDelete:  (id: number) => void;
}

export const JobTable = ({ jobs, isLoading, onEdit, onDelete }: JobTableProps) => (
  <div className="card overflow-hidden">
    <div className="overflow-x-auto">
      <table className="is-hoverable w-full text-sm">
        <thead>
          <tr className="border-b border-slate-150 dark:border-navy-600">
            {['Job Title', 'Department', 'Location', 'Exp.', 'Openings', 'Status', ''].map((h) => (
              <th key={h} className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-navy-300 ${h === '' ? 'text-right' : 'text-left'}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-navy-600">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)
            : jobs.length === 0
            ? (
              <tr><td colSpan={7}>
                <EmptyState icon={Briefcase} title="No jobs yet"
                  description="Create your first job listing to start receiving applications." />
              </td></tr>
            )
            : jobs.map((job) => (
              <tr key={job.id}>
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-navy-100">{job.title}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-navy-300">{job.department}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-navy-300">{job.location}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-navy-300">{job.experience} yr{job.experience !== 1 ? 's' : ''}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-navy-300">{job.openings}</td>
                <td className="px-4 py-3">
                  <Badge label={job.status.replace('_', ' ')} variant={statusVariant[job.status as JobStatus]} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(job)} leftIcon={<Pencil className="size-3.5" />}>Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(job.id)} leftIcon={<Trash2 className="size-3.5" />} className="text-error hover:bg-error/10">Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </div>
);
