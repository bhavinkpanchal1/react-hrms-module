import { useNavigate, useParams } from "react-router-dom";
import { useCandidate, useUpdateCandidate } from "../../hooks/useCandidates";
import { CandidateForm } from "../../components/CandidateForm";
import { useJobs } from "../../hooks/useJobs";
import type { CandidateFormData } from "../../schema/candidate.schema";
import { useCandidateApplications } from "../../hooks/useApplications";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { CardSkeleton } from "@/shared/ui/skeleton/Skeleton";

const CandidateEditPage = () => {
  const { id } = useParams();
  const candidateId = Number(id);
  const { data: jobs = [] } = useJobs();
  const { data: candidate, isLoading, error } = useCandidate(candidateId);
  const { data: applications = [] } = useCandidateApplications(candidateId);
  const { mutate: updateCandidate, isPending } = useUpdateCandidate();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user?.role !== "hr") return <div className="card p-6 text-error">Only HR can edit Candidates.</div>;

  if (isLoading) {
    return <div className="grid gap-5 py-5 lg:py-6"><div className="h-8 w-52 animate-pulse rounded bg-slate-200 dark:bg-navy-600" /><CardSkeleton /></div>;
  }

  if (error || !candidate) {
    return <div className="card my-6 p-6 text-center text-slate-500 dark:text-navy-200">Candidate not found</div>;
  }

  const handleSubmitUpdateCandiddate = (data: CandidateFormData) => {
    const { jobId: _jobId, ...candidateData } = data;
    void _jobId;
    updateCandidate(
      { id: candidateId, data: candidateData },
      {
        onSuccess: () => {
          navigate(`/recruitment/candidates/${candidateId}`);
        },
      },
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 pb-8 sm:gap-5 lg:gap-6">
      <div className="py-5 lg:py-6"><h1 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Edit Candidate</h1><p className="mt-0.5 text-sm text-slate-500 dark:text-navy-300">Update {candidate.first_name} {candidate.last_name}’s profile information.</p></div>

      <CandidateForm
        jobs={jobs}
        mode="edit"
        defaultValues={{
          ...candidate,
          jobId: applications[0]?.jobId,
          linkedin_url: candidate.linkedin_url ?? undefined,
          github_url: candidate.github_url ?? undefined,
          portfolio_url: candidate.portfolio_url ?? undefined,
        }}
        onSubmit={handleSubmitUpdateCandiddate}
        isSubmitting={isPending}
      />
    </div>
  );
};

export default CandidateEditPage;
