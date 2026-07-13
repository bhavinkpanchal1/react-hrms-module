import { useForm } from "react-hook-form"
import { Button, Input, Select } from "@/shared/ui";
import { interviewSchema, type InterviewFormData } from "../schema/interview.schema";
import { INTERVIEW_MODES, INTERVIEW_ROUND } from "../types/interview.type";
import { EMPLOYEE_LIST } from "../constant/employee";
import { zodResolver } from "@hookform/resolvers/zod";

interface InterviewFormProps {
  onSubmit: (data: InterviewFormData) => void;
  onCancel: ()=> void;
  isSubmitting: boolean;
  //candidate: Candidate;
}

export const InterviewForm = ({onSubmit, onCancel, isSubmitting}: InterviewFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<InterviewFormData>({
    resolver: zodResolver(interviewSchema),
  });
  return (
    <div className="scrollbar-sm overflow-y-auto">
      <form onSubmit={ handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input label="Date" type="date" required  error={errors.date?.message} {...register('date')}/>
          <Input label="time" type="time" required error={errors.time?.message} {...register('time')} />
          <Select label="Round" required options={INTERVIEW_ROUND} placeholder="— Select round —" error={errors.round?.message} {...register('round')}
          />
          <Select label="Mode" required options={INTERVIEW_MODES} placeholder="— Select mode —" error={errors.mode?.message} {...register('mode')}
          />
          <Select label="Interviewer" required options={EMPLOYEE_LIST} placeholder="— Select mode —" error={errors.interviewer?.message} {...register('interviewer')}
          />
        </div>
        <div className="pmt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" size="md" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>Submit</Button>
        </div>
      </form>
    </div>
  )
}
