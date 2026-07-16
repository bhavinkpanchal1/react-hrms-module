import { useState } from "react";
import { Modal } from "@/shared/ui";
import type { Candidate } from "../../types";
import { InterviewForm } from "../../components/InterviewForm";
import { useCreateInterview } from "../../hooks/useInterviews";
import type { InterviewFormData } from "../../schema/interview.schema";

type ScheduleInterviewPageProps = {
  isOpen: boolean;
  close: () => void;
  title: string;
  candidate?: Candidate | null;
};

const ScheduleInterviewPage = ({
  isOpen,
  close,
  title,
  candidate,
}: ScheduleInterviewPageProps) => {
  const createInterview = useCreateInterview();
  const [mutationError, setMutationError] = useState<string | null>(null);

  // if (!candidate) {
  //   return null;
  // }

  const handleSubmit = (data: InterviewFormData) => {
    setMutationError(null);
    createInterview.mutate(
      {
        candidateId: candidate.id,
        candidate_name: `${candidate.first_name} ${candidate.last_name}`,
        job_title: candidate.job_title,
        interviewer: data.interviewer,
        scheduled_at: `${data.date}T${data.time}:00`,
        duration_minutes: 60,
        mode: data.mode,
        status: "scheduled",
        feedback: "",
      },
      {
        onSuccess: close,
        onError: (error) => {
          setMutationError(
            error instanceof Error
              ? error.message
              : "Unable to schedule interview.",
          );
        },
      },
    );
  };

  const isMutating = createInterview.isPending;
  return (
    <>
      <Modal isOpen={isOpen} onClose={close} title={title}>
        {candidate && (
          <>
            <p>Candidate ID: {candidate?.id}</p>
            <p>
              Candidate Name: {candidate?.first_name} {candidate?.last_name}
            </p>
            <p>Job Title: {candidate?.job_title}</p>
          </>
        )}
        {mutationError && (
          <div className="mb-5 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
            {mutationError}
          </div>
        )}
        <InterviewForm
          onSubmit={handleSubmit}
          onCancel={close}
          isSubmitting={isMutating}
        />
      </Modal>
    </>
  );
};

export default ScheduleInterviewPage;
