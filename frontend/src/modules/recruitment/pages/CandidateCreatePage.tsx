import { useState } from "react";
import { CandidateForm } from "../components/CandidateForm";
import type { CandidateFormData } from '../schema/candidate.schema';
import { useJobs } from "../hooks/useJobs";
import { useCreateCandidate } from "../hooks/useCandidates";
import { useNavigate } from "react-router-dom";

const CandidateCreatePage = () => {
  const { data: jobs = [] } = useJobs();
  const createCandidate = useCreateCandidate();
  const navigate = useNavigate();
  const [mutationError, setMutationError] = useState<string | null>(null);

  const handleSubmit = async (data: CandidateFormData) => {
    setMutationError(null);

    try {
      await createCandidate.mutateAsync(data, {
        onError: (error) => {
          setMutationError(error instanceof Error ? error.message : "Unable to create candidate.");
        },
      });
      navigate("/recruitment/candidates");
    } catch {
      return;
    }
  };

  return (
    <>
      {mutationError && (
        <div className="mb-5 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {mutationError}
        </div>
      )}
      <CandidateForm
        jobs={jobs}
        onSubmit={handleSubmit}
        isSubmitting={createCandidate.isPending}
      />
    </>
  );
};

export default CandidateCreatePage;
