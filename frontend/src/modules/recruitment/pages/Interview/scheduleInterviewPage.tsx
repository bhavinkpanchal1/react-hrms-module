import { useState } from "react";
import { Modal } from "@/shared/ui";
import type { Application, Candidate } from "../../types";
import type { Interview } from "../../types/interview.type";
import { InterviewForm } from "../../components/InterviewForm";
import { useApplicationInterviews, useCreateInterview, useNextInterviewRound, useRescheduleInterview, useReviewerEmployees, useSubmitInterview } from "../../hooks/useInterviews";
import { useJobs } from "../../hooks/useJobs";
import type { InterviewFormData } from "../../schema/interview.schema";

type Props = { isOpen:boolean; close:()=>void; title:string; candidate?:Candidate|null; application?:Application|null; editingInterview?:Interview|null; nextFrom?:Interview|null; action?:"schedule"|"submit"|"reschedule" };
const ScheduleInterviewPage = ({isOpen,close,title,candidate,application,editingInterview,nextFrom,action="schedule"}:Props) => {
  const create=useCreateInterview(); const submit=useSubmitInterview(); const reschedule=useRescheduleInterview(); const next=useNextInterviewRound(); const {data:employees=[]}=useReviewerEmployees(); const {data:rounds=[]}=useApplicationInterviews(application?.id??0); const {data:jobs=[]}=useJobs(); const [error,setError]=useState<string|null>(null);
  if(!candidate||!application) return null;
  const roundNumber=editingInterview ? editingInterview.roundNumber : nextFrom ? nextFrom.roundNumber+1 : Math.max(0,...rounds.map(row=>row.roundNumber))+1;
  const handleSubmit=(data:InterviewFormData)=>{ setError(null); const common={...data,meetingLink:data.meetingLink||null,locationDetails:data.locationDetails||null}; const options={onSuccess:close,onError:(value:unknown)=>setError(value instanceof Error?value.message:"Unable to save Interview")};
    if(editingInterview&&action==="reschedule") return reschedule.mutate({id:editingInterview.id,data:{scheduledAt:data.scheduledAt,mode:data.mode,meetingLink:data.meetingLink||null,locationDetails:data.locationDetails||null,notes:data.notes}},options);
    if(editingInterview&&action==="submit") return submit.mutate({id:editingInterview.id,data:common},options);
    if(nextFrom) return next.mutate({id:nextFrom.id,data:common},options);
    create.mutate({applicationId:application.id,...common},options);
  };
  const source=editingInterview; const defaults=source?{roundName:source.roundName,scheduledAt:source.scheduledAt.slice(0,16),reviewerEmployeeId:source.reviewerEmployeeId,mode:source.mode,meetingLink:source.meetingLink??"",locationDetails:source.locationDetails??"",notes:source.notes??""}:undefined;
  return <Modal isOpen={isOpen} onClose={close} title={title}><p className="text-sm">Candidate: {candidate.first_name} {candidate.last_name}</p><p className="mb-5 text-sm text-slate-500">Job: {jobs.find(job=>job.id===application.jobId)?.title??""}</p>{error&&<div className="mb-4 rounded-lg bg-error/10 p-3 text-sm text-error">{error}</div>}<InterviewForm onSubmit={handleSubmit} onCancel={close} isSubmitting={create.isPending||submit.isPending||reschedule.isPending||next.isPending} defaultValues={defaults} submitLabel={action==="reschedule"?"Reschedule":action==="submit"?"Submit":"Schedule"} roundNumber={roundNumber} reviewers={employees.map(employee=>({value:employee.id,label:`${employee.fullName} · ${employee.designation}`}))}/></Modal>;
};
export default ScheduleInterviewPage;
