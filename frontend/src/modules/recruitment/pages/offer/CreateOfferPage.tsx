import { useState } from "react";
import { Modal } from "@/shared/ui";
import type { Candidate } from "../../types";
import { OfferForm } from "../../components/OfferForm";
import { useCreateOffer } from "../../hooks/useOffers";
import { useUpdateCandidateStatus } from "../../hooks/useCandidates";
import type { OfferFormData } from "../../schema/offer.schema";

type CreateOfferPageProps = {
  isOpen: boolean;
  close: () => void;
  candidate?: Candidate | null;
};

const CreateOfferPage = ({ isOpen, close, candidate }: CreateOfferPageProps) => {
  const createOffer = useCreateOffer();
  const updateCandidateStatus = useUpdateCandidateStatus();
  const [mutationError, setMutationError] = useState<string | null>(null);

  if (!candidate) {
    return null;
  }

  const handleSubmit = (data: OfferFormData) => {
    setMutationError(null);
    createOffer.mutate(
      {
        candidateId: candidate.id,
        candidate_name: `${candidate.first_name} ${candidate.last_name}`,
        job_title: candidate.job_title,
        offered_salary: data.offered_salary,
        joining_date: data.joining_date,
        expires_at: data.expires_at || undefined,
        notes: data.notes,
        status: "pending",
      },
      {
        onSuccess: () => {
          // Only move the candidate to 'offer' once a real offer record
          // exists — mirrors the schedule-interview pattern elsewhere.
          if (candidate.status !== "offer") {
            updateCandidateStatus.mutate({ id: candidate.id, status: "offer" });
          }
          close();
        },
        onError: (error) => {
          setMutationError(
            error instanceof Error ? error.message : "Unable to create offer.",
          );
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={close} title="Create Offer">
      <p className="mb-5 text-sm text-slate-500 dark:text-navy-300">
        {candidate.first_name} {candidate.last_name} — {candidate.job_title}
      </p>

      {mutationError && (
        <div className="mb-5 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {mutationError}
        </div>
      )}

      <OfferForm
        onSubmit={handleSubmit}
        onCancel={close}
        isSubmitting={createOffer.isPending || updateCandidateStatus.isPending}
      />
    </Modal>
  );
};

export default CreateOfferPage;