import { useState }         from 'react';
import { Plus }              from 'lucide-react';
import { useJobs }           from '../hooks/useJobs';
import { useCreateJob }      from '../hooks/useCreateJob';
import { useUpdateJob }      from '../hooks/useUpdateJob';
import { useDeleteJob }      from '../hooks/useDeleteJob';
import { JobForm }           from '../components/JobForm';
import { JobTable }          from '../components/JobTable';
import { Modal }             from '@/shared/ui/modal/Modal';
import { Button }            from '@/shared/ui/button/Button';
import { ConfirmationDialog } from '@/shared/ui/confirmation-dialog/ConfirmationDialog';
import type { Job }          from '../types';
import type { JobFormData }  from '../schema/job.schema';

const STATS = (jobs: Job[]) => [
  { label: 'Total',   value: jobs.length, cls: 'text-slate-800 dark:text-navy-100' },
  { label: 'Open',    value: jobs.filter((j) => j.status === 'open').length, cls: 'text-success'  },
  { label: 'Draft',   value: jobs.filter((j) => j.status === 'draft').length, cls: 'text-slate-400 dark:text-navy-400' },
  { label: 'Closed',  value: jobs.filter((j) => j.status === 'closed').length, cls: 'text-error'    },
];

const JobsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Job | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);

  const { data: jobs = [], isLoading } = useJobs();
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const deleteJob = useDeleteJob();

  const openCreate = () => { setSelected(null); setIsOpen(true); };
  const openEdit = (j: Job) => { setSelected(j); setIsOpen(true); };
  const close = () => { setIsOpen(false);  setSelected(null); };

  const handleSubmit = (data: JobFormData) => {
    if (selected) {
      updateJob.mutate({ id: selected.id, data }, { onSuccess: close });
    } else {
      createJob.mutate(data, { onSuccess: close });
    }
  };

  const handleDelete = (id: number) => setDeleteTarget(jobs.find((job) => job.id === id) ?? null);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteJob.mutate({ id: deleteTarget.id }, { onSuccess: () => setDeleteTarget(null) });
  };

  const isMutating = createJob.isPending || updateJob.isPending;
  const mutationError = createJob.error || updateJob.error || deleteJob.error;

  return (
    <div className="grid grid-cols-1 gap-4 pb-8 sm:gap-5 lg:gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between lg:py-6">
        <div>
          <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Job Listings</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-navy-300">
            Manage open positions and track recruitment pipeline
          </p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus className="size-4" />}>Add Job</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {STATS(jobs).map((s) => (
          <div key={s.label} className="card px-4 py-4 sm:px-5">
            <p className="font-inter text-xs-plus text-slate-400 dark:text-navy-300">{s.label}</p>
            <p className={`mt-1 font-inter text-2xl font-semibold tracking-tight ${s.cls}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Error banner */}
      {mutationError && (
        <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {(mutationError as Error).message}
        </div>
      )}

      {/* Table */}
      <JobTable jobs={jobs} isLoading={isLoading} onEdit={openEdit} onDelete={handleDelete} />

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={close} title={selected ? 'Edit Job Listing' : 'Create Job Listing'} size="lg">
        <JobForm defaultValues={selected ?? undefined} onSubmit={handleSubmit} onCancel={close} isSubmitting={isMutating} />
      </Modal>

      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete job listing"
        description={<>Delete <strong className="font-medium text-slate-800 dark:text-navy-50">{deleteTarget?.title}</strong>? This cannot be undone.</>}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isConfirming={deleteJob.isPending}
        error={deleteJob.error}
        confirmLabel="Delete Job"
      />
    </div>
  );
};

export default JobsPage;
