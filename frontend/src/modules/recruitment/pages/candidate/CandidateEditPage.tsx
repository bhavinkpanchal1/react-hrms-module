import { useNavigate, useParams } from "react-router-dom";
import { useCandidate, useUpdateCandidate } from "../../hooks/useCandidates";
import { CandidateForm } from "../../components/CandidateForm";
import { useJobs } from "../../hooks/useJobs";
import type { CandidateFormData } from "../../schema/candidate.schema";

const CandidateEditPage = () => {
  const { id } = useParams();
  const candidateId = Number(id);
  const { data: jobs = [] } = useJobs();
  const { data: candidate, isLoading, error } = useCandidate(candidateId);
  const { mutate: updateCandidate, isPending } = useUpdateCandidate();
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !candidate) {
    return <div>Candidate not found</div>;
  }

  const handleSubmitUpdateCandiddate = (data: CandidateFormData) => {
    updateCandidate(
      { id: candidateId, data },
      {
        onSuccess: () => {
          navigate(`/recruitment/candidates/${candidateId}`);
        },
      },
    );
  };

  return (
    <>
      <h1>Edit Candidate</h1>

      <p>{candidate.first_name}</p>

      <CandidateForm
        jobs={jobs}
        mode="edit"
        defaultValues={{
          ...candidate,
          resume_url: candidate.resume_url ?? undefined,
          linkedin_url: candidate.linkedin_url ?? undefined,
          github_url: candidate.github_url ?? undefined,
          portfolio_url: candidate.portfolio_url ?? undefined,
        }}
        onSubmit={handleSubmitUpdateCandiddate}
        isSubmitting={isPending}
      />
    </>
  );
};

export default CandidateEditPage;
