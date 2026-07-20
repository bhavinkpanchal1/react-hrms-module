import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Select, Textarea } from "@/shared/ui";
import {
  interviewResponseSchema,
  type InterviewResponseFormData,
} from "../schema/interview.schema";

const STATUS_OPTIONS = [
  { value: "completed", label: "Completed" },
  { value: "no_show", label: "No Show" },
  { value: "cancelled", label: "Cancelled" },
];

const RESULT_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "pass", label: "Pass" }, 
  { value: "fail", label: "Fail" },
];

interface InterviewResponseFormProps {
  onSubmit: (data: InterviewResponseFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  defaultValues?: Partial<InterviewResponseFormData>;
}

export const InterviewResponseForm = ({
  onSubmit,
  onCancel,
  isSubmitting,
  defaultValues,
}: InterviewResponseFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<InterviewResponseFormData>({
    resolver: zodResolver(interviewResponseSchema),
    defaultValues: {
      status: "completed",
      result: "pending",
      feedback: "",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Select label="Outcome" required options={STATUS_OPTIONS}
          error={errors.status?.message} {...register("status")} />
        <Select label="Result" required options={RESULT_OPTIONS}
          error={errors.result?.message} {...register("result")} />
        <div className="sm:col-span-2">
          <Textarea label="Feedback" required rows={4}
            placeholder="Interviewer notes on the candidate's performance..."
            error={errors.feedback?.message} {...register("feedback")} />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="secondary" size="md" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>Save Response</Button>
      </div>
    </form>
  );
};
