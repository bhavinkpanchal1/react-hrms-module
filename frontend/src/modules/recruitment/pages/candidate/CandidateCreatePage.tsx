import { useState } from "react";
import { CandidateForm } from "../../components/CandidateForm";
import type { CandidateFormData } from '../../schema/candidate.schema';
import { useJobs } from "../../hooks/useJobs";
import { useCheckCandidateDuplicates, useCreateCandidate } from "../../hooks/useCandidates";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "@/shared/ui";
import type { CandidateDuplicateMatch } from "../../types";
import { useAuth } from "@/modules/auth/hooks/useAuth";

const CandidateCreatePage = () => {
  const { data: jobs = [] } = useJobs();
  const createCandidate = useCreateCandidate();
  const checkDuplicates = useCheckCandidateDuplicates();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [pendingData, setPendingData] = useState<CandidateFormData | null>(null);
  const [duplicateMatches, setDuplicateMatches] = useState<CandidateDuplicateMatch[]>([]);

  const create = async (data: CandidateFormData, allowDuplicate = false) => {
    await createCandidate.mutateAsync({ ...data, allowDuplicate });
    navigate("/recruitment/candidates");
  };

  const handleSubmit = async (data: CandidateFormData) => {
    setMutationError(null);

    try {
      const matches = await checkDuplicates.mutateAsync({ email: data.email, phone: data.phone });
      if (matches.length) { setPendingData(data); setDuplicateMatches(matches); return; }
      await create(data);
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Unable to create candidate.");
    }
  };

  if (user?.role !== "hr") return <div className="card p-6 text-error">Only HR can create Candidates.</div>;

  return (
    <div className="grid grid-cols-1 gap-4 pb-8 sm:gap-5 lg:gap-6">
      <div className="py-5 lg:py-6"><h1 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Add Candidate</h1><p className="mt-0.5 text-sm text-slate-500 dark:text-navy-300">Create a candidate profile and initial Application.</p></div>
      {mutationError && (
        <div className="mb-5 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {mutationError}
        </div>
      )}
      <CandidateForm
        jobs={jobs}
        onSubmit={handleSubmit}
        isSubmitting={createCandidate.isPending || checkDuplicates.isPending}
      />
      <Modal isOpen={duplicateMatches.length > 0} onClose={() => { setDuplicateMatches([]); setPendingData(null); }} title="Possible duplicate Candidate">
        <div className="space-y-4"><p className="text-sm text-slate-500">An existing Candidate has the same email or mobile. Review the match before continuing.</p>{duplicateMatches.map((match) => <div key={match.id} className="rounded-lg border p-3"><p className="font-medium">{match.first_name} {match.last_name} · #{match.id}</p><p className="text-sm text-slate-500">{match.email} · {match.phone}</p><p className="text-xs text-warning">Matched by {match.matchedBy.join(" and ").toLowerCase()}</p></div>)}<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => navigate(`/recruitment/candidates/${duplicateMatches[0].id}/`)}>View Existing</Button><Button isLoading={createCandidate.isPending} onClick={() => pendingData && void create(pendingData, true).catch((error) => setMutationError(error instanceof Error ? error.message : "Unable to create candidate."))}>Continue Creating</Button></div></div>
      </Modal>
    </div>
  );
};

export default CandidateCreatePage;
