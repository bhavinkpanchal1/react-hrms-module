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
  candidate
}: ScheduleInterviewPageProps) => {

  const createInterview = useCreateInterview()
  
  const handleSubmit = (data: InterviewFormData) => {
  createInterview.mutate(
    {
      candidateId: candidate!.id,
      candidate_name: `${candidate!.first_name} ${candidate!.last_name}`,
      job_title: candidate!.job_title,
      interviewer: data.interviewer,
      scheduled_at: `${data.date}T${data.time}:00`,
      duration_minutes: 60,
      mode: data.mode,
      status: "scheduled",
      feedback: "",
    },
    {
      onSuccess: close,
    }
  );
};

  const isMutating = createInterview.isPending;
  //const mutationError = createInterview.error;
  return (
    <>
      <Modal isOpen={isOpen} onClose={close} title={title}>   
        <p>Candidate ID: {candidate?.id}</p>
        <p>Candidate Name: `${candidate!.first_name} ${candidate!.last_name}`</p>
        <p>Job Title: {candidate!.job_title}</p>
        <InterviewForm onSubmit={handleSubmit} onCancel={close} isSubmitting={isMutating}/>
      </Modal>
    </>
  );
};

export default ScheduleInterviewPage;
