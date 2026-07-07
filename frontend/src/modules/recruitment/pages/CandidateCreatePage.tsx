import { CandidateForm } from "../components/CandidateForm";
import type { CandidateFormData } from '../schema/candidate.schema';
import { useJobs } from "../hooks/useJobs";
import { useCreateCandidate } from "../hooks/useCandidates";
import { useNavigate } from "react-router-dom";

const CandidateCreatePage = () => {
  const { data: jobs = [] } = useJobs();
    const createCandidate = useCreateCandidate();
    const navigate = useNavigate();

   const handleSubmit = async (data: CandidateFormData) => {
    const candidate = await createCandidate.mutate(data);
   alert("submit" + candidate);
    navigate(`/recruitment/candidates`);
  };

  return (
     <>
    <CandidateForm
      jobs={jobs}
      onSubmit={handleSubmit}
    />
  </>
  )
};

export default CandidateCreatePage;
