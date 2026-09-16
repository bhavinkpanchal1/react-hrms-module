import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useEmployees } from "@/modules/employee/hooks/useEmployees";
import { Badge, type BadgeVariant } from "@/shared/ui/badge/Badge";
import { Button } from "@/shared/ui/button/Button";
import { TableRowSkeleton } from "@/shared/ui/skeleton/Skeleton";
import EmptyState from "@/shared/ui/empty-state/EmptyState";
import { useApplications } from "../hooks/useApplications";
import { useCandidates } from "../hooks/useCandidates";
import { useJobs } from "../hooks/useJobs";
import { useAcceptOffer, useDeclineOffer, useExpireOffer, useOffers } from "../hooks/useOffers";
import type { OfferStatus } from "../types";
const variants:Record<OfferStatus,BadgeVariant>={OFFERED:"warning",ACCEPTED:"success",DECLINED:"error",EXPIRED:"default"};
const date=(value?:string|null)=>value?new Date(value).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"—";

const HrOffersPage=()=>{
  const navigate=useNavigate(); const {activeCompanyId}=useAuth(); const companyId=activeCompanyId??1;
  const {data:offers=[],isLoading}=useOffers(); const {data:applications=[]}=useApplications(); const {data:candidates=[]}=useCandidates(); const {data:jobs=[]}=useJobs();
  const employees=useEmployees({companyId,page:1,pageSize:500,search:"",statuses:[],branchIds:[],departmentIds:[],designationIds:[],sortBy:"fullName",sortDirection:"asc"});
  const accept=useAcceptOffer(); const decline=useDeclineOffer(); const expire=useExpireOffer();
  return <div className="space-y-5"><div><h2 className="text-xl font-semibold">Offers</h2><p className="text-sm text-slate-500">Application-owned Offer lifecycle and history</p></div><div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{(["OFFERED","ACCEPTED","DECLINED","EXPIRED"] as OfferStatus[]).map(status=><div className="card px-4 py-3" key={status}><p className="text-xs text-slate-400">{status}</p><p className="mt-1 text-2xl font-semibold">{offers.filter(offer=>offer.status===status).length}</p></div>)}</div><div className="card overflow-x-auto"><table className="w-full text-sm"><thead><tr>{["Candidate / Job","Salary / CTC","Joining","Offered","Expiry","Status","Notes","Actions"].map(h=><th key={h} className="px-4 py-3 text-left text-xs uppercase">{h}</th>)}</tr></thead><tbody>{isLoading?Array.from({length:3}).map((_,i)=><TableRowSkeleton key={i} cols={8}/>):offers.map(offer=>{const application=applications.find(item=>item.id===offer.applicationId);const candidate=candidates.find(item=>item.id===application?.candidateId);const job=jobs.find(item=>item.id===application?.jobId);const convertedEmployee=employees.data?.items.find(employee=>employee.recruitmentProvenance?.applicationId===String(application?.id));return <tr className="border-t" key={offer.id}><td className="px-4 py-3"><b>{candidate?`${candidate.first_name} ${candidate.last_name}`:"Unknown"}</b><br/><span className="text-xs text-slate-500">{job?.title}</span></td><td className="px-4 py-3">₹{offer.salary.toLocaleString("en-IN")} / yr</td><td className="px-4 py-3">{date(offer.joiningDate)}</td><td className="px-4 py-3">{date(offer.offeredAt)}</td><td className="px-4 py-3">{date(offer.expiryDate)}</td><td className="px-4 py-3"><Badge label={offer.status} variant={variants[offer.status]}/></td><td className="max-w-52 px-4 py-3 text-xs">{offer.notes||"—"}</td><td className="px-4 py-3">{offer.status==="OFFERED"&&<div className="flex gap-1"><Button size="sm" variant="ghost" className="text-success" isLoading={accept.isPending} onClick={()=>accept.mutate(offer.id)}>Accept</Button><Button size="sm" variant="ghost" className="text-error" isLoading={decline.isPending} onClick={()=>decline.mutate(offer.id)}>Decline</Button>{offer.expiryDate&&new Date(offer.expiryDate)<=new Date()&&<Button size="sm" variant="ghost" isLoading={expire.isPending} onClick={()=>expire.mutate(offer.id)}>Mark Expired</Button>}</div>}{offer.status==="ACCEPTED"&&application?.status==="OFFER_ACCEPTED"&&<Button size="sm" onClick={()=>navigate(`/employees/list/new?candidateId=${application.candidateId}&applicationId=${application.id}&offerId=${offer.id}`)}>Convert to Employee</Button>}{application?.status==="CONVERTED"&&<button className="text-left text-xs text-success" onClick={()=>convertedEmployee&&navigate(`/employees/list/${convertedEmployee.id}`)}>Converted{convertedEmployee&&<><br/>Employee ID: {convertedEmployee.employeeCode}</>}</button>}</td></tr>})}</tbody></table>{!isLoading&&!offers.length&&<EmptyState icon={FileText} title="No Offers" description="Eligible Offers created by HR will appear here."/>}</div></div>;
};
const OffersPage=()=>{const {user}=useAuth();return user?.role==="hr"?<HrOffersPage/>:<div className="card"><EmptyState icon={FileText} title="Offer access restricted" description="Offer management is available only to HR."/></div>};
export default OffersPage;
