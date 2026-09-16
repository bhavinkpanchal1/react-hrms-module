import { useState } from "react";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { Modal } from "@/shared/ui";
import type { Application, Candidate } from "../../types";
import { OfferForm } from "../../components/OfferForm";
import { useCreateOffer } from "../../hooks/useOffers";
import { useJobs } from "../../hooks/useJobs";
import type { OfferFormData } from "../../schema/offer.schema";

const CreateOfferPage=({isOpen,close,candidate,application}:{isOpen:boolean;close:()=>void;candidate?:Candidate|null;application?:Application|null})=>{
  const {user}=useAuth(); const create=useCreateOffer(); const {data:jobs=[]}=useJobs(); const [error,setError]=useState<string|null>(null);
  if(user?.role!=="hr"||!candidate||!application)return null;
  const submit=(data:OfferFormData)=>{setError(null);create.mutate({applicationId:application.id,salary:data.offered_salary,joiningDate:data.joining_date,expiryDate:data.expires_at||null,notes:data.notes},{onSuccess:close,onError:value=>setError(value instanceof Error?value.message:"Unable to create Offer")});};
  return <Modal isOpen={isOpen} onClose={close} title="Create Offer"><p className="mb-5 text-sm text-slate-500">{candidate.first_name} {candidate.last_name} · {jobs.find(job=>job.id===application.jobId)?.title??""}</p>{application.status!=="OFFERED"&&<div className="mb-4 rounded-lg bg-warning/10 p-3 text-sm text-warning">Pass & Complete the final Interview before creating an Offer.</div>}{error&&<div className="mb-4 rounded-lg bg-error/10 p-3 text-sm text-error">{error}</div>}<OfferForm onSubmit={submit} onCancel={close} isSubmitting={create.isPending}/></Modal>;
};
export default CreateOfferPage;
