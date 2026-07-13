import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { candidateSchema, type CandidateFormData } from '../schema/candidate.schema';
import { Button } from '@/shared/ui/button/Button';
import { Input } from '@/shared/ui/input/Input';
import { Textarea } from '@/shared/ui/textarea/Textarea';
import { Select } from '@/shared/ui/select/Select';
import type { Job } from '../types';

const SOURCE_OPTIONS = [
  { value: 'LinkedIn',        label: 'LinkedIn'        },
  { value: 'Referral',        label: 'Referral'        },
  { value: 'Job Portal',      label: 'Job Portal'      },
  { value: 'Company Website', label: 'Company Website' },
  { value: 'Walk-in',         label: 'Walk-in'         },
  { value: 'Other',           label: 'Other'           },
];

interface CandidateFormProps {
  jobs:          Job[];
  onSubmit:      (data: CandidateFormData) => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<CandidateFormData>;
  mode?: "create" | "edit";
}

export const CandidateForm = ({ jobs, onSubmit, isSubmitting, defaultValues, mode="create" }: CandidateFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: { notes: "", ...defaultValues },
  });

  const openJobs = jobs.filter((j) => j.status === 'open').map((j) => ({
    value: j.id, label: `${j.title} — ${j.department}`,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input label="First Name" required placeholder="Ravi"
          error={errors.first_name?.message} {...register('first_name')} />
        <Input label="Last Name" required placeholder="Sharma"
          error={errors.last_name?.message} {...register('last_name')} />
        <Input label="Email" required type="email" placeholder="ravi@example.com"
          error={errors.email?.message} {...register('email')} />
        <Input label="Phone" required placeholder="9876543210"
          error={errors.phone?.message} {...register('phone')} />
        <Select label="Applying For" required options={openJobs}
          placeholder="— Select a job —"
          error={errors.jobId?.message}
          {...register('jobId', { valueAsNumber: true })} />
        <Select label="Source" required options={SOURCE_OPTIONS}
          placeholder="— How did they apply? —"
          error={errors.source?.message} {...register('source')} />
        <div className="sm:col-span-2">
          <Textarea label="Notes" rows={3} placeholder="Any initial notes about this candidate..."
            error={errors.notes?.message} {...register('notes')} />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button type="submit" isLoading={isSubmitting}>{mode === "edit" ? "Update Candidate": "Add Candidate"}</Button>
      </div>
    </form>
  );
};
