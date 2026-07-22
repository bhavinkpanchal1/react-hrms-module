import { useForm, Controller } from "react-hook-form"
import { Button, DatePicker, Select,  } from "@/shared/ui";
import { interviewSchema, type InterviewFormData } from "../schema/interview.schema";
import { INTERVIEW_MODES, INTERVIEW_ROUND } from "../types/interview.type";
import { EMPLOYEE_LIST } from "../../employee/constants/employee";
import { zodResolver } from "@hookform/resolvers/zod";

interface InterviewFormProps {
  onSubmit: (data: InterviewFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  defaultValues?: Partial<InterviewFormData>;
  submitLabel?: string;
}

export const InterviewForm = ({ onSubmit, onCancel, isSubmitting, defaultValues, submitLabel = "Submit" }: InterviewFormProps) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm<InterviewFormData>({
    resolver: zodResolver(interviewSchema),
    defaultValues,
  });
  return (
    <div className="scrollbar-sm overflow-y-auto">
      <form onSubmit={ handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Controller
            control={control}
            name="scheduled_at"
            render={({ field, fieldState }) => (
              <DatePicker
                mode="datetime"
                label="Date & Time"
                required
                placeholder="Select date & time"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
          <Select label="Round" required options={INTERVIEW_ROUND} placeholder="— Select round —" error={errors.round?.message} {...register('round')}
          />
          <Select label="Mode" required options={INTERVIEW_MODES} placeholder="— Select mode —" error={errors.mode?.message} {...register('mode')}
          />
          <Select label="Interviewer" required options={EMPLOYEE_LIST} placeholder="— Select interviewer —" error={errors.interviewer?.message} {...register('interviewer')}
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" size="md" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>{submitLabel}</Button>
        </div>
      </form>
    </div>
  )
}