import { useState } from "react";
import { Modal } from "@/shared/ui";
import type { Interview } from "../../types/interview.type";
import { InterviewResponseForm } from "../../components/InterviewResponseForm";
import { useUpdateInterview } from "../../hooks/useInterviews";
import type { InterviewResponseFormData } from "../../schema/interview.schema";

type RecordInterviewResponsePageProps = {
  isOpen: boolean;
  close: () => void;
  interview: Interview | null;
};

const RecordInterviewResponsePage = ({
  isOpen,
  close,
  interview,
}: RecordInterviewResponsePageProps) => {
  const updateInterview = useUpdateInterview();
  const [mutationError, setMutationError] = useState<string | null>(null);

  if (!interview) {
    return null;
  }

  const handleSubmit = (data: InterviewResponseFormData) => {
    setMutationError(null);
    updateInterview.mutate(
      { id: interview.id, data },
      {
        onSuccess: close,
        onError: (error) => {
          setMutationError(
            error instanceof Error ? error.message : "Unable to save response.",
          );
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={close} title="Record Interview Response">
      <p className="mb-5 text-sm text-slate-500 dark:text-navy-300">
        {interview.candidate_name} — {interview.job_title}
      </p>

      {mutationError && (
        <div className="mb-5 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {mutationError}
        </div>
      )}

      <InterviewResponseForm
        onSubmit={handleSubmit}
        onCancel={close}
        isSubmitting={updateInterview.isPending}
        defaultValues={{
          status: interview.status === "scheduled" ? "completed" : interview.status,
          result: interview.result,
          feedback: interview.feedback,
        }}
      />
    </Modal>
  );
};

export default RecordInterviewResponsePage;
