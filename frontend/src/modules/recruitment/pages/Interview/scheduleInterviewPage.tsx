import { useState } from "react";
import { Modal } from "@/shared/ui";
import type { Candidate } from "../../types";
import type { Interview } from "../../types/interview.type";
import { InterviewForm } from "../../components/InterviewForm";
import { useCreateInterview, useUpdateInterview } from "../../hooks/useInterviews";
import { useUpdateCandidateStatus } from "../../hooks/useCandidates";
import type { InterviewFormData } from "../../schema/interview.schema";

type ScheduleInterviewPageProps = {
  isOpen: boolean;
  close: () => void;
  title: string;
  candidate?: Candidate | null;
  // When set, the form edits this interview (reschedule) instead of
  // creating a new round — same record, status reset to 'scheduled'.
  editingInterview?: Interview | null;
};

const ScheduleInterviewPage = ({
  isOpen,
  close,
  title,
  candidate,
  editingInterview,
}: ScheduleInterviewPageProps) => {
  const createInterview = useCreateInterview();
  const updateInterview = useUpdateInterview();
  const updateCandidateStatus = useUpdateCandidateStatus();
  const [mutationError, setMutationError] = useState<string | null>(null);

  if (!candidate) {
    return null;
  }

  const isReschedule = !!editingInterview;

  const handleSubmit = (data: InterviewFormData) => {
    setMutationError(null);

    const onError = (error: unknown) => {
      setMutationError(
        error instanceof Error
          ? error.message
          : `Unable to ${isReschedule ? "reschedule" : "schedule"} interview.`,
      );
    };

    if (isReschedule && editingInterview) {
      updateInterview.mutate(
        {
          id: editingInterview.id,
          data: {
            round: data.round as Interview["round"],
            interviewer: data.interviewer,
            scheduled_at: `${data.date}T${data.time}:00`,
            mode: data.mode,
            status: "scheduled",
            result: "pending",
          },
        },
        { onSuccess: close, onError },
      );
      return;
    }

    createInterview.mutate(
      {
        candidateId: candidate.id,
        round: data.round as Interview["round"],
        candidate_name: `${candidate.first_name} ${candidate.last_name}`,
        job_title: candidate.job_title,
        interviewer: data.interviewer,
        scheduled_at: `${data.date}T${data.time}:00`,
        duration_minutes: 60,
        mode: data.mode,
        status: "scheduled",
        result: "pending",
        feedback: "",
      },
      {
        onSuccess: () => {
          // First interview scheduled for this candidate — move them into
          // the Interview pipeline stage. No-op if they're already there
          // (e.g. scheduling round 2+).
          if (candidate.status !== "interview") {
            updateCandidateStatus.mutate({ id: candidate.id, status: "interview" });
          }
          close();
        },
        onError,
      },
    );
  };

  const isMutating = createInterview.isPending || updateInterview.isPending;

  const defaultValues: Partial<InterviewFormData> | undefined = editingInterview
    ? {
        date: editingInterview.scheduled_at.slice(0, 10),
        time: editingInterview.scheduled_at.slice(11, 16),
        round: editingInterview.round,
        mode: editingInterview.mode,
        interviewer: editingInterview.interviewer,
      }
    : undefined;

  return (
    <Modal isOpen={isOpen} onClose={close} title={title}>
      <p>Candidate: {candidate.first_name} {candidate.last_name}</p>
      <p className="mb-5 text-sm text-slate-500 dark:text-navy-300">Job: {candidate.job_title}</p>

      {mutationError && (
        <div className="mb-5 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {mutationError}
        </div>
      )}

      <InterviewForm
        onSubmit={handleSubmit}
        onCancel={close}
        isSubmitting={isMutating}
        defaultValues={defaultValues}
        submitLabel={isReschedule ? "Reschedule" : "Schedule"}
      />
    </Modal>
  );
};

export default ScheduleInterviewPage;
