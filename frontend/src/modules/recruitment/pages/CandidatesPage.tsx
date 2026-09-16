import { useState } from "react";
import { Eye, MoreVertical, Plus, Search, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { AppDropdown } from "@/shared/ui/dropdown/AppDropdown";
import { Button, Modal, Textarea } from "@/shared/ui";
import EmptyState from "@/shared/ui/empty-state/EmptyState";
import { TableRowSkeleton } from "@/shared/ui/skeleton/Skeleton";
import { CandidateStatusBadge } from "../components/CandidateStatusBadge";
import { useApplications } from "../hooks/useApplications";
import { useActivateCandidate, useCandidates, useDeactivateCandidate, useDeleteCandidate } from "../hooks/useCandidates";
import { useJobs } from "../hooks/useJobs";
import type { Candidate, CandidateLifecycleStatus } from "../types";

const CandidatesPage = () => {
  const [search, setSearch] = useState("");
  const [lifecycle, setLifecycle] = useState<CandidateLifecycleStatus | "ALL">("ACTIVE");
  const [deactivateTarget, setDeactivateTarget] = useState<Candidate | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const isHr = user?.role === "hr";
  const navigate = useNavigate();
  const { data: candidates = [], isLoading } = useCandidates();
  const { data: applications = [] } = useApplications();
  const { data: jobs = [] } = useJobs();
  const activate = useActivateCandidate();
  const deactivate = useDeactivateCandidate();
  const remove = useDeleteCandidate();
  const filtered = candidates.filter((candidate) => {
    const matchesLifecycle = lifecycle === "ALL" || candidate.status === lifecycle;
    const haystack = `${candidate.id} ${candidate.first_name} ${candidate.last_name} ${candidate.email} ${candidate.phone}`.toLowerCase();
    return matchesLifecycle && haystack.includes(search.trim().toLowerCase());
  });
  const candidateApplications = (id: number) => applications.filter((item) => item.candidateId === id);
  const deleteCandidate = async (candidate: Candidate) => {
    if (!window.confirm("Permanently delete this candidate?")) return;
    setError(null);
    try { await remove.mutateAsync({ id: candidate.id }); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to delete Candidate"); }
  };
  const confirmDeactivate = async () => {
    if (!deactivateTarget || !reason.trim()) { setError("A deactivation reason is required."); return; }
    setError(null);
    try { await deactivate.mutateAsync({ id: deactivateTarget.id, reason }); setDeactivateTarget(null); setReason(""); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to deactivate Candidate"); }
  };

  return <div className="grid grid-cols-1 gap-4 pb-8 sm:gap-5 lg:gap-6">
    <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between lg:py-6"><div><h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">Candidates</h2><p className="mt-0.5 text-sm text-slate-500 dark:text-navy-300">{candidates.length} candidate profiles</p></div>{isHr && <Button onClick={() => navigate("/recruitment/candidates/new")} leftIcon={<Plus className="size-4" />}>Add Candidate</Button>}</div>
    {error && <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">{error}</div>}
    <div className="card p-4 sm:p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><label className="relative block w-full sm:max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, mobile, ID..." className="form-input w-full rounded-lg border border-slate-300 bg-transparent py-2 pl-9 pr-3 text-sm placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" /></label><div className="flex flex-wrap gap-2">{(["ACTIVE", "INACTIVE", "ALL"] as const).map((value) => <button type="button" key={value} onClick={() => setLifecycle(value)} className={`btn px-3 py-1.5 font-inter text-xs ${lifecycle === value ? "bg-primary text-white dark:bg-accent" : "bg-slate-150 text-slate-700 hover:bg-slate-200 dark:bg-navy-500 dark:text-navy-100"}`}>{value === "ALL" ? "All" : value.toLowerCase().replace(/^./, (letter) => letter.toUpperCase())}</button>)}</div></div></div>
    <div className="card overflow-hidden"><div className="overflow-x-auto"><table className="is-hoverable w-full text-left"><thead><tr className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">{["Candidate", "Mobile", "Applications", "Lifecycle", ""].map((head) => <th key={head} className={`whitespace-nowrap px-4 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 sm:px-5 ${head ? "text-left" : "text-right"}`}>{head}</th>)}</tr></thead><tbody>{isLoading ? Array.from({ length: 5 }).map((_, index) => <TableRowSkeleton key={index} cols={5} />) : filtered.length === 0 ? <tr><td colSpan={5}><EmptyState icon={Users} title="No candidates found" description="Try adjusting your search or lifecycle filter." /></td></tr> : filtered.map((candidate) => { const apps = candidateApplications(candidate.id); return <tr key={candidate.id} className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500"><td className="whitespace-nowrap px-4 py-3 sm:px-5"><p className="font-medium text-slate-800 dark:text-navy-100">{candidate.first_name} {candidate.last_name}</p><p className="font-inter text-xs text-slate-400 dark:text-navy-300">#{candidate.id} · {candidate.email}</p></td><td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-navy-200 sm:px-5">{candidate.phone}</td><td className="min-w-60 px-4 py-3 sm:px-5">{apps.length ? <div className="space-y-1.5">{apps.map((application) => <div key={application.id} className="flex items-center gap-2"><span className="text-slate-600 dark:text-navy-200">{jobs.find((job) => job.id === application.jobId)?.title ?? "Unknown job"}</span><CandidateStatusBadge status={application.status} /></div>)}</div> : <span className="text-slate-400 dark:text-navy-400">No history</span>}</td><td className="px-4 py-3 sm:px-5"><CandidateStatusBadge status={candidate.status} />{candidate.deactivationReason && <div className="mt-1 max-w-48 text-xs text-slate-400">{candidate.deactivationReason}</div>}</td><td className="whitespace-nowrap px-4 py-3 text-right sm:px-5"><div className="inline-flex items-center gap-1"><Button aria-label={`View ${candidate.first_name}`} variant="ghost" size="sm" onClick={() => navigate(`/recruitment/candidates/${candidate.id}/`)}><Eye className="size-4" /></Button>{isHr && <AppDropdown trigger={<Button aria-label={`Actions for ${candidate.first_name}`} variant="ghost" size="sm"><MoreVertical className="size-4" /></Button>} items={[{ label: "Edit", onClick: () => navigate(`/recruitment/candidates/${candidate.id}/edit`) }, ...(candidate.status === "ACTIVE" ? [{ label: "Deactivate", onClick: () => { setError(null); setDeactivateTarget(candidate); } }] : [{ label: "Activate", onClick: () => activate.mutate(candidate.id, { onError: (cause) => setError(cause instanceof Error ? cause.message : "Unable to activate Candidate") }) }]), { label: "Delete", onClick: () => void deleteCandidate(candidate) }]} />}</div></td></tr>; })}</tbody></table></div></div>
    <Modal isOpen={deactivateTarget !== null} onClose={() => { setDeactivateTarget(null); setReason(""); setError(null); }} title="Deactivate Candidate?"><div className="space-y-4"><p className="text-sm text-slate-500 dark:text-navy-200">The Candidate’s recruitment history will be preserved. Active Applications must be completed or rejected first.</p><Textarea label="Reason" required rows={3} value={reason} onChange={(event) => setReason(event.target.value)} error={!reason.trim() && error ? "Reason is required" : undefined} /><div className="flex flex-wrap justify-end gap-2"><Button variant="secondary" onClick={() => setDeactivateTarget(null)}>Cancel</Button><Button variant="danger" isLoading={deactivate.isPending} onClick={() => void confirmDeactivate()}>Deactivate</Button></div></div></Modal>
  </div>;
};

export default CandidatesPage;
