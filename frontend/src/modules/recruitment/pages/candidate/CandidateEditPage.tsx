import {  useParams } from "react-router-dom";
import { useCandidate, useUpdateCandidate } from "../../hooks/useCandidates";
import { CandidateForm } from "../../components/CandidateForm";
import { useJobs } from "../../hooks/useJobs";

const CandidateEditPage = () => {
  const { id } = useParams();
  const candidateId = Number(id);
  const { data: jobs = [] } = useJobs();
  const { data: candidate, isLoading, error } = useCandidate(candidateId);
  const { mutate: updateCandidate, isPending } = useUpdateCandidate();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !candidate) {
    return <div>Candidate not found</div>;
  }
  return (
    <>
      <h1>Edit Candidate</h1>

      <p>{candidate.first_name}</p>

      <CandidateForm
        jobs={jobs}
        mode="edit"
        defaultValues={candidate}
        onSubmit={(data) => {
          updateCandidate({ id: candidateId, data });
        }}
        isSubmitting={isPending}
      />
    </>
  );
};

export default CandidateEditPage;
