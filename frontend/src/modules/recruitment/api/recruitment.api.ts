// recruitment.api.ts
// Opt into the in-memory data only when explicitly requested.
import { httpClient } from "@/shared/services/http/client";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";
import type { Job, Candidate, Interview, Offer, Application, ApplicationStatus, CreateApplicationInput, CreateOfferInput, ConvertApplicationInput, RecruitmentConversionContext, RecruitmentConversionResult, CandidateDuplicateMatch, RecruitmentDocument, RecruitmentDocumentDeletion, UploadRecruitmentDocumentInput } from "../types";
import type { JobFormData } from "../schema/job.schema";
import type { CreateCandidateInput } from "../types/candidate.types";
import type { NextRoundInput, NoShowAttribution, RescheduleInterviewInput, ReviewerInterviewProjection, ScheduleInterviewInput } from "../types/interview.type";
import { employeeService } from "@/modules/employee/api/employee.service";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";
const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));
let activeCompanyId = 1;
let activeActorRole = "employee";
let activeActorName = "Current user";
let activeActorUserId = 0;

export class RecruitmentDomainError extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "RecruitmentDomainError";
  }
}

const domainError = (code: string, message: string): never => {
  throw new RecruitmentDomainError(code, message);
};
const requireHr = () => {
  if (activeActorRole !== "hr") domainError("FORBIDDEN", "Only HR can access Recruitment administration");
};
const normalizeEmail = (value: string) => value.trim().toLowerCase();
const normalizePhone = (value: string) => value.replace(/\D/g, "");

// ── Mock DB (lives in module scope — resets on page refresh) ─────────
let mockJobs: Job[] = [
  {
    id: 1,
    companyId: 1,
    title: "Frontend Developer",
    department: "Engineering",
    description:
      "We are building an enterprise HRMS. Looking for a React developer with TypeScript experience.",
    experience: 2,
    location: "Vadodara, Gujarat",
    openings: 2,
    status: "open",
    created_at: "2025-01-15",
    closing_date: "2025-06-01",
  },
  {
    id: 2,
    companyId: 1,
    title: "HR Executive",
    department: "Human Resources",
    description: "Manage full recruitment lifecycle and employee relations.",
    experience: 3,
    location: "Ahmedabad, Gujarat",
    openings: 1,
    status: "open",
    created_at: "2025-01-20",
    closing_date: null,
  },
  {
    id: 3,
    companyId: 1,
    title: "Product Manager",
    department: "Product",
    description:
      "Define roadmap, work closely with engineering and design teams.",
    experience: 5,
    location: "Remote",
    openings: 1,
    status: "draft",
    created_at: "2025-02-01",
    closing_date: null,
  },
  {
    id: 4,
    companyId: 1,
    title: "Backend Developer",
    department: "Engineering",
    description: "Django/DRF developer for our core API platform.",
    experience: 3,
    location: "Vadodara, Gujarat",
    openings: 1,
    status: "closed",
    created_at: "2025-01-05",
    closing_date: "2025-03-01",
  },
];

// let mockCandidates: Candidate[] = [
//   {
//     id: 1,
//     first_name: "Ravi",
//     last_name: "Sharma",
//     email: "ravi@example.com",
//     phone: "9876543210",
//     jobId: 1,
//     job_title: "Frontend Developer",
//     status: "interview",
//     source: "LinkedIn",
//     resume_url: null,
//     applied_at: "2025-02-10",
//     notes: "Strong React skills, noticed portfolio on GitHub.",
//   },
//   {
//     id: 2,
//     first_name: "Priya",
//     last_name: "Patel",
//     email: "priya@example.com",
//     phone: "9876500001",
//     jobId: 1,
//     job_title: "Frontend Developer",
//     status: "applied",
//     source: "Referral",
//     resume_url: null,
//     applied_at: "2025-02-12",
//     notes: "",
//   },
//   {
//     id: 3,
//     first_name: "Amit",
//     last_name: "Shah",
//     email: "amit@example.com",
//     phone: "9876500002",
//     jobId: 2,
//     job_title: "HR Executive",
//     status: "screening",
//     source: "Job Portal",
//     resume_url: null,
//     applied_at: "2025-02-14",
//     notes: "5 years HR experience.",
//   },
//   {
//     id: 4,
//     first_name: "Sneha",
//     last_name: "Mehta",
//     email: "sneha@example.com",
//     phone: "9876500003",
//     jobId: 1,
//     job_title: "Frontend Developer",
//     status: "offer",
//     source: "LinkedIn",
//     resume_url: null,
//     applied_at: "2025-01-28",
//     notes: "Excellent candidate.",
//   },
//   {
//     id: 5,
//     first_name: "Karan",
//     last_name: "Joshi",
//     email: "karan@example.com",
//     phone: "9876500004",
//     jobId: 1,
//     job_title: "Frontend Developer",
//     status: "rejected",
//     source: "Walk-in",
//     resume_url: null,
//     applied_at: "2025-02-01",
//     notes: "Not enough React experience.",
//   },
//   {
//     id: 6,
//     first_name: "Nisha",
//     last_name: "Verma",
//     email: "nisha@example.com",
//     phone: "9876500005",
//     jobId: 2,
//     job_title: "HR Executive",
//     status: "hired",
//     source: "Referral",
//     resume_url: null,
//     applied_at: "2025-01-15",
//     notes: "Joining 1st March.",
//   },
// ];

const defaultCandidateData = {
  dob: "",

  gender: undefined,
  marital_status: undefined,

  address_line1: "",
  address_line2: "",

  country_id: 1,
  state_id: 1,
  city_id: 1,

  pincode: "",

  current_position: "",
  current_company: "",

  current_salary: 0,
  expected_salary: 0,
  notice_period: 0,
  total_experience: 0,

  highest_education: "",
  institution: "",
  graduation_year: 0,


  referenced_by: "",

  linkedin_url: null,
  github_url: null,
  portfolio_url: null,

  skills: [],
  certifications: [],
};

const legacyCandidates = [
  {
    ...defaultCandidateData,

    id: 1,
    first_name: "Ravi",
    last_name: "Sharma",
    email: "ravi@example.com",
    phone: "9876543210",

    jobId: 1,
    job_title: "Frontend Developer",

    status: "interview",
    source: "LinkedIn",

    applied_at: "2025-02-10",

    notes: "Strong React skills, noticed portfolio on GitHub.",

    gender: "male",
    marital_status: "single",

    current_position: "Frontend Developer",
    current_company: "TechNova Solutions",

    current_salary: 850000,
    expected_salary: 1100000,
    notice_period: 30,
    total_experience: 4,

    highest_education: "B.E Computer Engineering",
    institution: "GTU",
    graduation_year: 2020,

    skills: ["React", "TypeScript", "Next.js", "Tailwind"],
    certifications: ["AWS Cloud Practitioner"],

    linkedin_url: "https://linkedin.com/in/ravi",
    github_url: "https://github.com/ravi",
    portfolio_url: "https://ravi.dev",
  },

  {
    ...defaultCandidateData,

    id: 2,
    first_name: "Priya",
    last_name: "Patel",
    email: "priya@example.com",
    phone: "9876500001",

    jobId: 1,
    job_title: "Frontend Developer",

    status: "applied",
    source: "Referral",

    applied_at: "2025-02-12",

    notes: "",

    gender: "female",
    marital_status: "single",

    current_position: "UI Developer",
    current_company: "Innotech",

    total_experience: 2,

    skills: ["HTML", "CSS", "JavaScript"],
  },
  {
    ...defaultCandidateData,
    id: 3,
    first_name: "Amit",
    last_name: "Shah",
    email: "amit@example.com",
    phone: "9876500002",

    jobId: 2,
    job_title: "HR Executive",

    status: "screening",
    source: "Job Portal",

    applied_at: "2025-02-14",

    notes: "5 years HR experience.",

    gender: "male",

    current_position: "HR Executive",
    current_company: "PeopleFirst HR",

    total_experience: 5,

    skills: ["Recruitment", "Payroll", "HRMS"],
  },

  {
    ...defaultCandidateData,

    id: 4,
    first_name: "Sneha",
    last_name: "Mehta",
    email: "sneha@example.com",
    phone: "9876500003",

    jobId: 1,
    job_title: "Frontend Developer",

    status: "offer",
    source: "LinkedIn",

    applied_at: "2025-01-28",

    notes: "Excellent candidate.",

    gender: "female",

    current_position: "Senior Frontend Developer",
    current_company: "CodeWave",

    current_salary: 1400000,
    expected_salary: 1700000,

    notice_period: 60,
    total_experience: 6,

    skills: ["React", "Redux", "TypeScript", "GraphQL"],
  },

  {
    ...defaultCandidateData,

    id: 5,
    first_name: "Karan",
    last_name: "Joshi",
    email: "karan@example.com",
    phone: "9876500004",

    jobId: 1,
    job_title: "Frontend Developer",

    status: "rejected",
    source: "Walk-in",

    applied_at: "2025-02-01",

    notes: "Not enough React experience.",

    gender: "male",

    total_experience: 1,

    skills: ["HTML", "CSS"],
  },

  {
    ...defaultCandidateData,

    id: 6,
    first_name: "Nisha",
    last_name: "Verma",
    email: "nisha@example.com",
    phone: "9876500005",

    jobId: 2,
    job_title: "HR Executive",

    status: "hired",
    source: "Referral",

    applied_at: "2025-01-15",

    notes: "Joining 1st March.",

    gender: "female",

    current_position: "Senior HR Executive",
    current_company: "TalentSphere",

    total_experience: 7,

    skills: ["Recruitment", "Compliance", "Employee Engagement"],
  },
];

let mockCandidates: Candidate[] = legacyCandidates.map((legacy) => {
  const { jobId: _jobId, job_title: _jobTitle, applied_at: _appliedAt, status: _status, ...candidate } = legacy;
  void _jobId; void _jobTitle; void _appliedAt; void _status;
  return { ...candidate, companyId: 1, status: "ACTIVE", deactivationReason: null } as Candidate;
});

const applicationStatus = (legacyStatus: string): ApplicationStatus => ({
  applied: "APPLIED", screening: "SCREENING", interview: "INTERVIEW",
  offer: "OFFERED", onboarding: "OFFER_ACCEPTED", hired: "CONVERTED",
  rejected: "REJECTED",
}[legacyStatus] as ApplicationStatus);

let mockApplications: Application[] = legacyCandidates.map((legacy) => ({
  id: legacy.id, companyId: 1, candidateId: legacy.id, jobId: legacy.jobId,
  status: applicationStatus(legacy.status), appliedAt: legacy.applied_at,
  rejectionReason: legacy.status === "rejected" ? legacy.notes || "Not selected" : null,
  createdAt: legacy.applied_at, updatedAt: legacy.applied_at,
}));
mockApplications = mockApplications.map((application) => application.id === 2 ? { ...application, status: "OFFER_ACCEPTED" } : application);

let mockInterviews: Interview[] = [
  { id: 1, companyId: 1, applicationId: 1, roundNumber: 1, roundName: "HR Screening", scheduledAt: "2025-03-10T10:00:00", reviewerEmployeeId: "emp-2", mode: "ONLINE", meetingLink: "https://meet.example.com/ravi-hr", locationDetails: null, notes: "Initial discussion", status: "COMPLETED", feedback: "Clear communication.", createdAt: "2025-03-01T09:00:00Z", updatedAt: "2025-03-10T11:00:00Z" },
  { id: 2, companyId: 1, applicationId: 1, roundNumber: 2, roundName: "Technical Interview", scheduledAt: "2026-09-10T10:00:00", reviewerEmployeeId: "emp-3", mode: "ONLINE", meetingLink: "https://meet.example.com/ravi-technical", locationDetails: null, notes: "React and TypeScript", status: "SCHEDULED", feedback: "", createdAt: "2026-09-01T09:00:00Z", updatedAt: "2026-09-01T09:00:00Z" },
  { id: 3, companyId: 1, applicationId: 3, roundNumber: 1, roundName: "HR Interview", scheduledAt: "2026-09-11T14:00:00", reviewerEmployeeId: "emp-2", mode: "OFFLINE", meetingLink: null, locationDetails: "Ahmedabad meeting room 2", notes: "", status: "SCHEDULED", feedback: "", createdAt: "2026-09-02T09:00:00Z", updatedAt: "2026-09-02T09:00:00Z" },
  { id: 4, companyId: 1, applicationId: 4, roundNumber: 1, roundName: "Final Interview", scheduledAt: "2025-03-08T10:00:00", reviewerEmployeeId: "emp-2", mode: "ONLINE", meetingLink: "https://meet.example.com/sneha-final", status: "COMPLETED", feedback: "Recommended for offer.", createdAt: "2025-03-01T09:00:00Z", updatedAt: "2025-03-08T11:00:00Z" },
  { id: 5, companyId: 1, applicationId: 2, roundNumber: 1, roundName: "Final Interview", scheduledAt: "2025-03-10T14:00:00", reviewerEmployeeId: "emp-2", mode: "OFFLINE", locationDetails: "Ahmedabad meeting room 1", status: "COMPLETED", feedback: "Offer accepted.", createdAt: "2025-03-05T09:00:00Z", updatedAt: "2025-03-10T15:00:00Z" },
];

let mockOffers: Offer[] = [
  { id: 1, companyId: 1, applicationId: 4, salary: 1600000, joiningDate: "2025-04-01", status: "OFFERED", offeredAt: "2025-03-10T09:00:00Z", expiryDate: "2025-03-24", notes: "Standard employment terms", createdAt: "2025-03-10T09:00:00Z", updatedAt: "2025-03-10T09:00:00Z" },
  { id: 2, companyId: 1, applicationId: 2, salary: 650000, joiningDate: "2025-04-15", status: "ACCEPTED", offeredAt: "2025-03-12T09:00:00Z", acceptedAt: "2025-03-14T10:00:00Z", notes: "Accepted by candidate", createdAt: "2025-03-12T09:00:00Z", updatedAt: "2025-03-14T10:00:00Z" },
  { id: 3, companyId: 1, applicationId: 5, salary: 500000, joiningDate: "2025-03-20", status: "DECLINED", offeredAt: "2025-02-12T09:00:00Z", declinedAt: "2025-02-14T10:00:00Z", notes: "Candidate declined", createdAt: "2025-02-12T09:00:00Z", updatedAt: "2025-02-14T10:00:00Z" },
  { id: 4, companyId: 1, applicationId: 6, salary: 900000, joiningDate: "2025-03-01", status: "ACCEPTED", offeredAt: "2025-02-20T09:00:00Z", acceptedAt: "2025-02-25T09:00:00Z", notes: "Converted recruitment history", createdAt: "2025-02-20T09:00:00Z", updatedAt: "2025-02-25T09:00:00Z" },
];

let mockRecruitmentDocuments: RecruitmentDocument[] = [
  { id: "recruitment-document-001-resume-v1", companyId: 1, candidateId: 1, applicationId: null, documentType: "RESUME", documentKey: "RESUME", displayName: "Resume", fileName: "Ravi_Sharma_Resume_2024.pdf", fileUrl: "", fileSize: 184320, mimeType: "application/pdf", version: 1, isCurrent: false, createdAt: "2024-12-10T09:00:00Z", createdBy: "HR Administrator" },
  { id: "recruitment-document-001-resume-v2", companyId: 1, candidateId: 1, applicationId: null, documentType: "RESUME", documentKey: "RESUME", displayName: "Resume", fileName: "Ravi_Sharma_Resume.pdf", fileUrl: "", fileSize: 204800, mimeType: "application/pdf", version: 2, isCurrent: true, createdAt: "2025-02-10T09:00:00Z", createdBy: "HR Administrator" },
  { id: "recruitment-document-001-experience-certificate-v1", companyId: 1, candidateId: 1, applicationId: 1, documentType: "OTHER", documentKey: "EXPERIENCE_CERTIFICATE", displayName: "Experience Certificate", fileName: "Ravi_Experience_Certificate.pdf", fileUrl: "", fileSize: 160000, mimeType: "application/pdf", version: 1, isCurrent: true, createdAt: "2025-02-11T09:00:00Z", createdBy: "HR Administrator" },
  { id: "recruitment-document-001-previous-employment-letter-v1", companyId: 1, candidateId: 1, applicationId: 1, documentType: "OTHER", documentKey: "PREVIOUS_EMPLOYMENT_LETTER", displayName: "Previous Employment Letter", fileName: "Ravi_Previous_Employment_Letter.pdf", fileUrl: "", fileSize: 170000, mimeType: "application/pdf", version: 1, isCurrent: true, createdAt: "2025-02-11T10:00:00Z", createdBy: "HR Administrator" },
  { id: "recruitment-document-002-resume-v1", companyId: 1, candidateId: 2, applicationId: null, documentType: "RESUME", documentKey: "RESUME", displayName: "Resume", fileName: "Priya_Patel_Resume.pdf", fileUrl: "", fileSize: 153600, mimeType: "application/pdf", version: 1, isCurrent: true, createdAt: "2025-02-12T09:00:00Z", createdBy: "HR Administrator" },
];
let recruitmentDocumentDeletions: RecruitmentDocumentDeletion[] = [];

let nextJobId = 5,
  nextCandId = 7,
  nextApplicationId = 7,
  nextIntId = 6,
  nextOffId = 5;
const conversionLocks = new Map<number, Promise<RecruitmentConversionResult>>();

const getScopedOffer = (id: number) => {
  const offer = mockOffers.find((item) => item.id === id && item.companyId === activeCompanyId);
  if (!offer) throw new Error("Offer not found in the active Company");
  const application = mockApplications.find((item) => item.id === offer.applicationId && item.companyId === activeCompanyId);
  if (!application) throw new Error("Offer Application not found in the active Company");
  const candidate = mockCandidates.find((item) => item.id === application.candidateId && item.companyId === activeCompanyId);
  const job = mockJobs.find((item) => item.id === application.jobId && item.companyId === activeCompanyId);
  if (!candidate || !job) throw new Error("Offer ownership does not match the active Company");
  return { offer, application };
};

// ── Jobs ─────────────────────────────────────────────────────────────
export const recruitmentApi = {
  setCompanyContext: (companyId: number, actorRole?: string, actorName?: string, actorUserId?: number) => {
    activeCompanyId = companyId;
    if (actorRole) activeActorRole = actorRole;
    if (actorName) activeActorName = actorName;
    if (actorUserId !== undefined) activeActorUserId = actorUserId;
  },
  // JOBS
  getJobs: async (): Promise<Job[]> => {
    requireHr();
    if (USE_MOCK) {
      await delay();
      return mockJobs.filter((job) => job.companyId === activeCompanyId);
    }
    const r = await httpClient.get<{ results: Job[] }>(
      API_ENDPOINTS.recruitment.jobs,
    );
    return r.data.results;
  },

  getJobById: async (id: number): Promise<Job> => {
    requireHr();
    if (USE_MOCK) {
      await delay(300);
      const j = mockJobs.find((j) => j.id === id && j.companyId === activeCompanyId);
      if (!j) throw new Error("Job not found");
      return j;
    }
    const r = await httpClient.get<Job>(
      `${API_ENDPOINTS.recruitment.jobs}${id}/`,
    );
    return r.data;
  },

  createJob: async (data: JobFormData): Promise<Job> => {
    requireHr();
    if (USE_MOCK) {
      await delay(600);
      const j: Job = {
        ...data,
        id: nextJobId++,
        companyId: activeCompanyId,
        created_at: new Date().toISOString(),
      };
      mockJobs = [...mockJobs, j];
      return j;
    }
    const r = await httpClient.post<Job>(API_ENDPOINTS.recruitment.jobs, data);
    return r.data;
  },

  updateJob: async (id: number, data: Partial<JobFormData>): Promise<Job> => {
    requireHr();
    if (USE_MOCK) {
      await delay(600);
      const current=mockJobs.find(job=>job.id===id&&job.companyId===activeCompanyId)??domainError("JOB_NOT_FOUND","Job not found in the active Company");
      const updated={...current,...data}; mockJobs=mockJobs.map(job=>job.id===id?updated:job); return updated;
    }
    const r = await httpClient.patch<Job>(
      `${API_ENDPOINTS.recruitment.jobs}${id}/`,
      data,
    );
    return r.data;
  },

  deleteJob: async (id: number): Promise<void> => {
    requireHr();
    if (USE_MOCK) {
      await delay(400);
      const job=mockJobs.find(item=>item.id===id&&item.companyId===activeCompanyId)??domainError("JOB_NOT_FOUND","Job not found in the active Company");
      if(mockApplications.some(application=>application.companyId===activeCompanyId&&application.jobId===job.id))domainError("JOB_HAS_HISTORY","Job cannot be deleted because Application history exists");
      mockJobs = mockJobs.filter((j) => j.id !== id);
      return;
    }
    await httpClient.delete(`${API_ENDPOINTS.recruitment.jobs}${id}/`);
  },

  // CANDIDATES
  getCandidates: async (): Promise<Candidate[]> => {
    requireHr();
    if (USE_MOCK) {
      await delay();
      return mockCandidates.filter((candidate) => candidate.companyId === activeCompanyId);
    }
    const r = await httpClient.get<{ results: Candidate[] }>(
      API_ENDPOINTS.recruitment.candidates,
    );
    return r.data.results.filter((candidate) => candidate.companyId === activeCompanyId);
  },

  getCandidateById: async (id: number): Promise<Candidate> => {
    requireHr();
    if (USE_MOCK) {
      await delay();
      const c = mockCandidates.find((c) => c.id === id && c.companyId === activeCompanyId);
      if (!c) throw new Error("Candidate not found");
      return c;
    }

    const r = await httpClient.get<Candidate>(
      `${API_ENDPOINTS.recruitment.candidates}${id}/`,
    );
    if (r.data.companyId !== activeCompanyId) domainError("COMPANY_SCOPE_MISMATCH", "Candidate belongs to another Company");
    return r.data;
  },

  createCandidate: async (data: CreateCandidateInput): Promise<Candidate> => {
    requireHr();
    const { jobId, allowDuplicate, ...candidateData } = data;
    if (USE_MOCK) {
      await delay(600);
      const duplicates = await recruitmentApi.findCandidateDuplicates(data.email, data.phone);
      if (duplicates.length && !allowDuplicate) domainError("DUPLICATE_CANDIDATE_WARNING", "A Candidate with this email or mobile already exists");
      const job = mockJobs.find((item) => item.id === jobId)
        ?? domainError("JOB_NOT_FOUND", "Job not found");
      if (job.companyId !== activeCompanyId) domainError("COMPANY_SCOPE_MISMATCH", "Job belongs to another Company");
      if (job.status !== "open") domainError("JOB_NOT_OPEN", "Applications can only be created for open Jobs");
      const c: Candidate = {
        ...candidateData,
        id: nextCandId++,
        companyId: activeCompanyId,
        status: "ACTIVE",
        deactivationReason: null,
      };
      mockCandidates = [...mockCandidates, c];
      await recruitmentApi.createApplication({ candidateId: c.id, jobId });
      return c;
    }
    const r = await httpClient.post<Candidate>(
      API_ENDPOINTS.recruitment.candidates,
      candidateData,
    );
    await recruitmentApi.createApplication({ candidateId: r.data.id, jobId });
    return r.data;
  },

 updateCandidate: async (
  id: number,
  data: Partial<Candidate>,
): Promise<Candidate> => {
  requireHr();
  if (USE_MOCK) {
    await delay(400);
    const current = mockCandidates.find((candidate) => candidate.id === id && candidate.companyId === activeCompanyId)
      ?? domainError("CANDIDATE_NOT_FOUND", "Candidate not found in the active Company");
    // job_title is derived from jobId (same as on create) — if jobId
    // changed, recompute it so the display field doesn't go stale.
    const { status: _status, deactivationReason: _deactivationReason, ...patch } = data;
    void _status; void _deactivationReason;
    mockCandidates = mockCandidates.map((c) =>
      c.id === id ? { ...current, ...patch, id: current.id, companyId: current.companyId } : c,
    );
    const updatedCandidate = mockCandidates.find((c) => c.id === id);

    if (!updatedCandidate) {
      throw new Error("Candidate not found");
    }

    return updatedCandidate;
  }

  const r = await httpClient.patch<Candidate>(
    `${API_ENDPOINTS.recruitment.candidates}${id}/`,
    data,
  );
  return r.data;
},

  deleteCandidate: async (id: number): Promise<void> => {
    requireHr();
    if (USE_MOCK) {
      await delay(400);
      const candidate = mockCandidates.find((item) => item.id === id && item.companyId === activeCompanyId)
        ?? domainError("CANDIDATE_NOT_FOUND", "Candidate not found in the active Company");
      const applications = mockApplications.filter((item) => item.candidateId === candidate.id && item.companyId === activeCompanyId);
      const applicationIds = new Set(applications.map((item) => item.id));
      const hasHistory = applications.length > 0 || mockInterviews.some((item) => applicationIds.has(item.applicationId)) || mockOffers.some((item) => applicationIds.has(item.applicationId));
      if (hasHistory) domainError("CANDIDATE_HAS_HISTORY", "Candidate cannot be deleted because recruitment history exists. Deactivate the candidate instead.");
      mockCandidates = mockCandidates.filter((c) => c.id !== id);
      mockRecruitmentDocuments = mockRecruitmentDocuments.filter((document) => document.candidateId !== id);
      return;
    }
    await httpClient.delete(`${API_ENDPOINTS.recruitment.candidates}${id}/`);
  },

  findCandidateDuplicates: async (email: string, phone: string): Promise<CandidateDuplicateMatch[]> => {
    requireHr();
    const emailKey = normalizeEmail(email); const phoneKey = normalizePhone(phone);
    if (USE_MOCK) {
      await delay(150);
      return mockCandidates.filter((item) => item.companyId === activeCompanyId).flatMap((item) => {
        const matchedBy: ("EMAIL" | "MOBILE")[] = [];
        if (emailKey && normalizeEmail(item.email) === emailKey) matchedBy.push("EMAIL");
        if (phoneKey && normalizePhone(item.phone) === phoneKey) matchedBy.push("MOBILE");
        return matchedBy.length ? [{ id: item.id, first_name: item.first_name, last_name: item.last_name, email: item.email, phone: item.phone, status: item.status, matchedBy }] : [];
      });
    }
    const r = await httpClient.get<{ results: CandidateDuplicateMatch[] }>(`${API_ENDPOINTS.recruitment.candidates}duplicates/`, { params: { email, phone } });
    return r.data.results;
  },

  activateCandidate: async (id: number): Promise<Candidate> => {
    requireHr();
    const candidate = await recruitmentApi.getCandidateById(id);
    if (USE_MOCK) {
      const updated = { ...candidate, status: "ACTIVE" as const, deactivationReason: null };
      mockCandidates = mockCandidates.map((item) => item.id === id ? updated : item); return updated;
    }
    const r = await httpClient.post<Candidate>(`${API_ENDPOINTS.recruitment.candidates}${id}/activate/`); return r.data;
  },

  deactivateCandidate: async (id: number, reason: string): Promise<Candidate> => {
    requireHr();
    if (!reason.trim()) domainError("DEACTIVATION_REASON_REQUIRED", "A deactivation reason is required");
    const candidate = await recruitmentApi.getCandidateById(id);
    const applications = USE_MOCK ? mockApplications.filter((item) => item.companyId === activeCompanyId && item.candidateId === id) : await recruitmentApi.listApplications();
    if (applications.some((item) => item.candidateId === id && !["REJECTED", "CONVERTED"].includes(item.status))) domainError("ACTIVE_APPLICATION_EXISTS", "Candidate cannot be deactivated while an active application exists.");
    if (USE_MOCK) {
      const updated = { ...candidate, status: "INACTIVE" as const, deactivationReason: reason.trim() };
      mockCandidates = mockCandidates.map((item) => item.id === id ? updated : item); return updated;
    }
    const r = await httpClient.post<Candidate>(`${API_ENDPOINTS.recruitment.candidates}${id}/deactivate/`, { reason: reason.trim() }); return r.data;
  },

  listRecruitmentDocuments: async (candidateId: number, applicationId?: number): Promise<RecruitmentDocument[]> => {
    requireHr();
    await recruitmentApi.getCandidateById(candidateId);
    if (applicationId !== undefined) {
      const application = await recruitmentApi.getApplication(applicationId);
      if (application.candidateId !== candidateId) domainError("DOCUMENT_OWNER_MISMATCH", "Application does not belong to this Candidate");
    }
    if (USE_MOCK) {
      await delay(200);
      return mockRecruitmentDocuments.filter((document) => document.companyId === activeCompanyId && document.candidateId === candidateId && (applicationId === undefined || document.applicationId === applicationId));
    }
    const r = await httpClient.get<{ results: RecruitmentDocument[] }>(API_ENDPOINTS.recruitment.documents, { params: { candidateId, applicationId } });
    return r.data.results.filter((document) => document.companyId === activeCompanyId);
  },

  uploadRecruitmentDocument: async (input: UploadRecruitmentDocumentInput): Promise<RecruitmentDocument> => {
    requireHr();
    await recruitmentApi.getCandidateById(input.candidateId);
    const applicationId = input.documentType === "RESUME" ? null : input.applicationId;
    const documentKey = input.documentType === "RESUME" ? "RESUME" : input.documentKey.trim().toUpperCase();
    const displayName = input.documentType === "RESUME" ? "Resume" : input.displayName.trim();
    if (input.documentType === "OTHER" && !applicationId) domainError("APPLICATION_REQUIRED", "Select an Application for this document");
    if (!documentKey || !displayName) domainError("DOCUMENT_IDENTITY_REQUIRED", "Select a logical document name");
    if (applicationId) {
      const application = await recruitmentApi.getApplication(applicationId);
      if (application.candidateId !== input.candidateId) domainError("DOCUMENT_OWNER_MISMATCH", "Application does not belong to this Candidate");
    }
    const extension = input.file.name.split(".").pop()?.toLowerCase();
    if (!extension || !["pdf", "doc", "docx", "odt", "jpg", "jpeg", "png"].includes(extension)) domainError("INVALID_DOCUMENT_TYPE", "Upload PDF, DOC, DOCX, ODT, JPG, JPEG, or PNG");
    if (input.file.size > 10 * 1024 * 1024) domainError("DOCUMENT_TOO_LARGE", "File size must not exceed 10 MB");
    if (USE_MOCK) {
      await delay(300);
      const logicalVersions = mockRecruitmentDocuments.filter((document) => document.companyId === activeCompanyId && document.candidateId === input.candidateId && document.applicationId === applicationId && document.documentType === input.documentType && document.documentKey === documentKey);
      const version = Math.max(0, ...logicalVersions.map((document) => document.version)) + 1;
      mockRecruitmentDocuments = mockRecruitmentDocuments.map((document) => logicalVersions.some((item) => item.id === document.id) ? { ...document, isCurrent: false } : document);
      const createdAt = new Date().toISOString();
      const document: RecruitmentDocument = { id: `recruitment-document-${input.candidateId}-${applicationId ?? "candidate"}-${documentKey.toLowerCase()}-v${version}`, companyId: activeCompanyId, candidateId: input.candidateId, applicationId, documentType: input.documentType, documentKey, displayName, fileName: input.file.name, fileUrl: "", fileSize: input.file.size, mimeType: input.file.type || "application/octet-stream", version, isCurrent: true, createdAt, createdBy: activeActorName };
      mockRecruitmentDocuments = [...mockRecruitmentDocuments, document]; return document;
    }
    const form = new FormData(); form.append("candidateId", String(input.candidateId)); if (applicationId) form.append("applicationId", String(applicationId)); form.append("documentType", input.documentType); form.append("documentKey", documentKey); form.append("displayName", displayName); form.append("file", input.file);
    const r = await httpClient.post<RecruitmentDocument>(API_ENDPOINTS.recruitment.documents, form); return r.data;
  },

  deleteRecruitmentDocument: async (id: string): Promise<void> => {
    requireHr();
    if (USE_MOCK) {
      await delay(250);
      const document = mockRecruitmentDocuments.find((item) => item.id === id && item.companyId === activeCompanyId) ?? domainError("DOCUMENT_NOT_FOUND", "Recruitment document not found in the active Company");
      await recruitmentApi.getCandidateById(document.candidateId); if (document.applicationId) await recruitmentApi.getApplication(document.applicationId);
      recruitmentDocumentDeletions = [...recruitmentDocumentDeletions, { id: `recruitment-document-deletion-${Date.now()}`, companyId: activeCompanyId, documentId: document.id, candidateId: document.candidateId, applicationId: document.applicationId, documentKey: document.documentKey, displayName: document.displayName, version: document.version, fileName: document.fileName, action: "RECRUITMENT_DOCUMENT_DELETED", actor: activeActorName, createdAt: new Date().toISOString() }];
      mockRecruitmentDocuments = mockRecruitmentDocuments.filter((item) => item.id !== id);
      if (document.isCurrent) {
        const remaining = mockRecruitmentDocuments.filter((item) => item.companyId === document.companyId && item.candidateId === document.candidateId && item.applicationId === document.applicationId && item.documentType === document.documentType && item.documentKey === document.documentKey);
        const nextCurrent = remaining.sort((a, b) => b.version - a.version)[0];
        if (nextCurrent) mockRecruitmentDocuments = mockRecruitmentDocuments.map((item) => item.id === nextCurrent.id ? { ...item, isCurrent: true } : item);
      }
      return;
    }
    await httpClient.delete(`${API_ENDPOINTS.recruitment.documents}${id}/`);
  },

  // APPLICATIONS
  listApplications: async (): Promise<Application[]> => {
    requireHr();
    if (USE_MOCK) {
      await delay();
      return mockApplications.filter((application) => application.companyId === activeCompanyId);
    }
    const r = await httpClient.get<{ results: Application[] }>(API_ENDPOINTS.recruitment.applications);
    return r.data.results;
  },

  getApplication: async (id: number): Promise<Application> => {
    requireHr();
    if (USE_MOCK) {
      await delay(300);
      return mockApplications.find((application) => application.id === id && application.companyId === activeCompanyId)
        ?? domainError("APPLICATION_NOT_FOUND", "Application not found in the active Company");
    }
    const r = await httpClient.get<Application>(`${API_ENDPOINTS.recruitment.applications}${id}/`);
    if (r.data.companyId !== activeCompanyId) domainError("COMPANY_SCOPE_MISMATCH", "Application belongs to another Company");
    return r.data;
  },

  createApplication: async (input: CreateApplicationInput): Promise<Application> => {
    requireHr();
    if (USE_MOCK) {
      await delay(300);
      const candidate = mockCandidates.find((item) => item.id === input.candidateId)
        ?? domainError("CANDIDATE_NOT_FOUND", "Candidate not found");
      const job = mockJobs.find((item) => item.id === input.jobId)
        ?? domainError("JOB_NOT_FOUND", "Job not found");
      if (candidate.companyId !== activeCompanyId || job.companyId !== activeCompanyId) {
        domainError("COMPANY_SCOPE_MISMATCH", "Candidate and Job must belong to the active Company");
      }
      if (job.status !== "open") domainError("JOB_NOT_OPEN", "Applications can only be created for open Jobs");
      if (mockApplications.some((item) => item.companyId === activeCompanyId && item.candidateId === input.candidateId && item.jobId === input.jobId)) {
        domainError("DUPLICATE_APPLICATION", "This Candidate already has an Application for this Job");
      }
      const now = new Date().toISOString();
      const application: Application = { id: nextApplicationId++, companyId: activeCompanyId, ...input, status: "APPLIED", appliedAt: now, rejectionReason: null, createdAt: now, updatedAt: now };
      mockApplications = [...mockApplications, application];
      return application;
    }
    const r = await httpClient.post<Application>(API_ENDPOINTS.recruitment.applications, input);
    return r.data;
  },

  updateApplicationStatus: async (id: number, status: ApplicationStatus): Promise<Application> => {
    requireHr();
    if (status === "REJECTED") domainError("USE_REJECT_COMMAND", "Use rejectApplication to reject an Application");
    const application = await recruitmentApi.getApplication(id);
    if (!(application.status === "APPLIED" && status === "SCREENING")) domainError("INVALID_APPLICATION_TRANSITION", "Use the approved Recruitment workflow action for this status change");
    if (USE_MOCK) {
      const updated = { ...application, status, rejectionReason: null, updatedAt: new Date().toISOString() };
      mockApplications = mockApplications.map((item) => item.id === id ? updated : item);
      return updated;
    }
    const r = await httpClient.patch<Application>(`${API_ENDPOINTS.recruitment.applications}${id}/`, { status });
    return r.data;
  },

  rejectApplication: async (id: number, rejectionReason: string): Promise<Application> => {
    requireHr();
    if (!rejectionReason.trim()) domainError("REJECTION_REASON_REQUIRED", "A rejection reason is required");
    const application = await recruitmentApi.getApplication(id);
    if (["REJECTED", "CONVERTED"].includes(application.status)) domainError("FINAL_APPLICATION", "A final Application cannot be rejected again");
    if (USE_MOCK) {
      const updated = { ...application, status: "REJECTED" as const, rejectionReason: rejectionReason.trim(), updatedAt: new Date().toISOString() };
      mockApplications = mockApplications.map((item) => item.id === id ? updated : item);
      return updated;
    }
    const r = await httpClient.post<Application>(`${API_ENDPOINTS.recruitment.applications}${id}/reject/`, { rejectionReason });
    return r.data;
  },

  // INTERVIEWS
  getInterviews: async (): Promise<Interview[]> => {
    if (activeActorRole !== "hr") domainError("FORBIDDEN", "Only HR can view the full Interview register");
    if (!USE_MOCK) return (await httpClient.get<{ results: Interview[] }>(API_ENDPOINTS.recruitment.interviews)).data.results;
    await delay(); return mockInterviews.filter((item) => item.companyId === activeCompanyId);
  },
  createInterview: async (data: ScheduleInterviewInput): Promise<Interview> => {
    if (activeActorRole !== "hr") domainError("FORBIDDEN", "Only HR can schedule Interviews");
    if (!USE_MOCK) return (await httpClient.post<Interview>(API_ENDPOINTS.recruitment.interviews, data)).data;
    const application = mockApplications.find((item) => item.id === data.applicationId && item.companyId === activeCompanyId)
      ?? domainError("APPLICATION_NOT_FOUND", "Interview Application not found in the active Company");
    if (!["SCREENING", "INTERVIEW"].includes(application.status)) domainError("INTERVIEW_NOT_ALLOWED", "Interviews can only be scheduled for an Application in Screening or Interview");
    const reviewer = await employeeService.get(data.reviewerEmployeeId);
    if (reviewer.companyId !== activeCompanyId || reviewer.lifecycleStatus === "resigned") domainError("INVALID_REVIEWER", "Reviewer must be an active Employee of this Company");
    const now = new Date().toISOString();
    const roundNumber = Math.max(0, ...mockInterviews.filter((item) => item.applicationId === data.applicationId).map((item) => item.roundNumber)) + 1;
    const interview: Interview = { ...data, meetingLink: data.mode === "ONLINE" ? data.meetingLink : null, locationDetails: data.mode === "OFFLINE" ? data.locationDetails : null, id: nextIntId++, companyId: activeCompanyId, roundNumber, status: "SCHEDULED", feedback: "", createdAt: now, updatedAt: now };
    mockInterviews = [...mockInterviews, interview];
    mockApplications = mockApplications.map((item) => item.id === data.applicationId ? { ...item, status: "INTERVIEW" } : item);
    return interview;
  },
  // Used for both "Add Response" (status/result/feedback) and "Reschedule"
  // (scheduled_at/interviewer/mode + status reset to 'scheduled') — same
  // interview record, never a new one, so round history stays accurate.
  submitInterview: async (id: number, data: NextRoundInput): Promise<Interview> => {
    if (activeActorRole !== "hr") domainError("FORBIDDEN", "Only HR can update Interviews");
    const current = mockInterviews.find((item) => item.id === id && item.companyId === activeCompanyId);
    if (!current) throw new Error("Interview not found");
    if (current.status !== "SCHEDULED") domainError("INVALID_STATUS", "Only a scheduled Interview can be submitted");
    const reviewer = await employeeService.get(data.reviewerEmployeeId);
    if (reviewer.companyId !== activeCompanyId || reviewer.lifecycleStatus === "resigned") domainError("INVALID_REVIEWER", "Reviewer must be an active Employee of this Company");
    const updated: Interview = { ...current, ...data, meetingLink: data.mode === "ONLINE" ? data.meetingLink : null, locationDetails: data.mode === "OFFLINE" ? data.locationDetails : null, updatedAt: new Date().toISOString() };
    mockInterviews = mockInterviews.map((item) => item.id === id ? updated : item); return updated;
  },
  rescheduleInterview: async (id: number, data: RescheduleInterviewInput): Promise<Interview> => {
    if (activeActorRole !== "hr") domainError("FORBIDDEN", "Only HR can reschedule Interviews");
    const current = mockInterviews.find((item) => item.id === id && item.companyId === activeCompanyId);
    if (!current) throw new Error("Interview not found");
    if (current.status !== "SCHEDULED") domainError("INVALID_STATUS", "Only a scheduled Interview can be rescheduled");
    const updated: Interview = { ...current, ...data, meetingLink: data.mode === "ONLINE" ? data.meetingLink : null, locationDetails: data.mode === "OFFLINE" ? data.locationDetails : null, status: "SCHEDULED", updatedAt: new Date().toISOString() };
    mockInterviews = mockInterviews.map((item) => item.id === id ? updated : item); return updated;
  },
  cancelInterview: async (id: number, reason: string): Promise<Interview> => {
    if (activeActorRole !== "hr") domainError("FORBIDDEN", "Only HR can cancel Interviews");
    if (!reason.trim()) domainError("REASON_REQUIRED", "Cancellation reason is required");
    const current = mockInterviews.find((item) => item.id === id && item.companyId === activeCompanyId);
    if (!current) throw new Error("Interview not found");
    if (current.status !== "SCHEDULED") domainError("INVALID_STATUS", "Only a scheduled Interview can be cancelled");
    const updated = { ...current, status: "CANCELLED" as const, cancellationReason: reason.trim(), updatedAt: new Date().toISOString() };
    mockInterviews = mockInterviews.map((item) => item.id === id ? updated : item); return updated;
  },
  markInterviewNoShow: async (id: number, attribution: NoShowAttribution, reason: string): Promise<Interview> => {
    if (activeActorRole !== "hr") domainError("FORBIDDEN", "Only HR can mark No Show");
    const current = mockInterviews.find((item) => item.id === id && item.companyId === activeCompanyId);
    if (!current) throw new Error("Interview not found");
    if (current.status !== "SCHEDULED") domainError("INVALID_STATUS", "Only a scheduled Interview can be marked No Show");
    const updated = { ...current, status: "NO_SHOW" as const, noShowAttribution: attribution, noShowReason: reason.trim(), updatedAt: new Date().toISOString() };
    mockInterviews = mockInterviews.map((item) => item.id === id ? updated : item); return updated;
  },
  nextInterviewRound: async (id: number, data: NextRoundInput): Promise<Interview> => {
    if (activeActorRole !== "hr") domainError("FORBIDDEN", "Only HR can advance Interviews");
    const current = mockInterviews.find((item) => item.id === id && item.companyId === activeCompanyId);
    if (!current) throw new Error("Interview not found");
    if (current.status !== "SCHEDULED") domainError("INVALID_STATUS", "Only a scheduled Interview can advance to the next round");
    const next = await recruitmentApi.createInterview({ applicationId: current.applicationId, ...data });
    mockInterviews = mockInterviews.map((item) => item.id === id ? { ...item, status: "COMPLETED", updatedAt: new Date().toISOString() } : item);
    return next;
  },
  passAndCompleteInterview: async (id: number): Promise<Interview> => {
    if (activeActorRole !== "hr") domainError("FORBIDDEN", "Only HR can complete Interviews");
    const current = mockInterviews.find((item) => item.id === id && item.companyId === activeCompanyId);
    if (!current) throw new Error("Interview not found");
    if (!["SCHEDULED", "NO_SHOW"].includes(current.status)) domainError("INVALID_STATUS", "Only a scheduled or No Show Interview can be passed and completed");
    const application=mockApplications.find(item=>item.id===current.applicationId&&item.companyId===activeCompanyId)??domainError("APPLICATION_NOT_FOUND","Interview Application not found in the active Company");
    const updated = current.status === "NO_SHOW" ? current : { ...current, status: "COMPLETED" as const, updatedAt: new Date().toISOString() };
    mockInterviews = mockInterviews.map((item) => item.id === id ? updated : item);
    mockApplications = mockApplications.map((item) => item.id === application.id ? { ...item, status: "OFFERED", updatedAt:new Date().toISOString() } : item); return updated;
  },
  getReviewerInterviews: async (): Promise<ReviewerInterviewProjection[]> => {
    if (activeActorRole === "hr") domainError("FORBIDDEN", "Use the HR Interview register");
    const reviewerId = `emp-${activeActorUserId}`; await delay();
    return mockInterviews.filter((item) => item.companyId === activeCompanyId && item.reviewerEmployeeId === reviewerId && item.status === "SCHEDULED").map((item) => {
      const application = mockApplications.find((row) => row.id === item.applicationId)!; const candidate = mockCandidates.find((row) => row.id === application.candidateId)!; const job = mockJobs.find((row) => row.id === application.jobId)!;
      const resume = mockRecruitmentDocuments.find((row) => row.companyId === activeCompanyId && row.candidateId === candidate.id && row.documentType === "RESUME" && row.isCurrent);
      return { id: item.id, candidateName: `${candidate.first_name} ${candidate.last_name}`, jobTitle: job.title, roundNumber: item.roundNumber, roundName: item.roundName, scheduledAt: item.scheduledAt, mode: item.mode, meetingLink: item.meetingLink, locationDetails: item.locationDetails, notes: item.notes, feedback: item.feedback, resume: resume ? { fileName: resume.fileName, fileUrl: resume.fileUrl } : null };
    });
  },
  updateReviewerFeedback: async (id: number, feedback: string): Promise<ReviewerInterviewProjection> => {
    const permitted = (await recruitmentApi.getReviewerInterviews()).find((item) => item.id === id);
    if (!permitted) throw new Error("This active Interview is not assigned to you");
    mockInterviews = mockInterviews.map((item) => item.id === id ? { ...item, feedback: feedback.trim(), updatedAt: new Date().toISOString() } : item);
    return { ...permitted, feedback: feedback.trim() };
  },

  // OFFERS
  getOffers: async (): Promise<Offer[]> => {
    if (activeActorRole !== "hr") domainError("FORBIDDEN", "Only HR can view Offers");
    if (USE_MOCK) { await delay(); return mockOffers.filter((item) => item.companyId === activeCompanyId); }
    const r = await httpClient.get<{ results: Offer[] }>(
      API_ENDPOINTS.recruitment.offers,
    );
    return r.data.results;
  },
  createOffer: async (data: CreateOfferInput): Promise<Offer> => {
    if (activeActorRole !== "hr") domainError("FORBIDDEN", "Only HR can create Offers");
    if (USE_MOCK) {
      await delay(400);
      const application = mockApplications.find((item) => item.id === data.applicationId && item.companyId === activeCompanyId);
      if (!application) throw new Error("Offer Application not found in the active Company");
      if (application.status !== "OFFERED") domainError("OFFER_NOT_ELIGIBLE", "Pass & Complete the final Interview before creating an Offer");
      if (!mockInterviews.some((item) => item.companyId === activeCompanyId && item.applicationId === data.applicationId && item.status === "COMPLETED")) domainError("INTERVIEW_NOT_COMPLETED", "A completed Interview is required before creating an Offer");
      if (mockOffers.some((item) => item.applicationId === data.applicationId && ["OFFERED", "ACCEPTED"].includes(item.status))) domainError("ACTIVE_OFFER_EXISTS", "This Application already has an active Offer");
      const candidate = mockCandidates.find((item) => item.id === application.candidateId && item.companyId === activeCompanyId);
      const job = mockJobs.find((item) => item.id === application.jobId && item.companyId === activeCompanyId);
      if (!candidate || !job) domainError("OWNERSHIP_MISMATCH", "Application Candidate and Job must belong to the active Company");
      const now = new Date().toISOString(); const offer: Offer = { ...data, expiryDate: data.expiryDate || null, id: nextOffId++, companyId: activeCompanyId, status: "OFFERED", offeredAt: now, acceptedAt: null, declinedAt: null, createdAt: now, updatedAt: now };
      mockOffers = [...mockOffers, offer]; return offer;
    }
    const r = await httpClient.post<Offer>(
      API_ENDPOINTS.recruitment.offers,
      data,
    );
    return r.data;
  },
  acceptOffer: async (id: number): Promise<Offer> => {
    if (activeActorRole !== "hr") domainError("FORBIDDEN", "Only HR can accept Offers");
    const {offer,application}=getScopedOffer(id);
    if (offer.status !== "OFFERED") domainError("INVALID_OFFER_TRANSITION", "Only an offered Offer can be accepted");
    if (application.status !== "OFFERED") domainError("INVALID_APPLICATION_STATUS", "The Application must be OFFERED before accepting its Offer");
    const now = new Date().toISOString(); const updated={...offer,status:"ACCEPTED" as const,acceptedAt:now,updatedAt:now}; mockOffers=mockOffers.map(item=>item.id===id?updated:item); mockApplications=mockApplications.map(item=>item.id===application.id?{...item,status:"OFFER_ACCEPTED",updatedAt:now}:item); return updated;
  },
  declineOffer: async (id: number): Promise<Offer> => {
    if (activeActorRole !== "hr") domainError("FORBIDDEN", "Only HR can decline Offers");
    const {offer}=getScopedOffer(id); if(offer.status!=="OFFERED") domainError("INVALID_OFFER_TRANSITION","Only an offered Offer can be declined");
    const now=new Date().toISOString(); const updated={...offer,status:"DECLINED" as const,declinedAt:now,updatedAt:now}; mockOffers=mockOffers.map(item=>item.id===id?updated:item); return updated;
  },
  expireOffer: async (id: number): Promise<Offer> => {
    if (activeActorRole !== "hr") domainError("FORBIDDEN", "Only HR can expire Offers");
    const {offer}=getScopedOffer(id); if(offer.status!=="OFFERED") domainError("INVALID_OFFER_TRANSITION","Only an offered Offer can expire"); if(!offer.expiryDate||new Date(offer.expiryDate)>new Date()) domainError("OFFER_NOT_EXPIRED","The Offer expiry date has not been reached");
    const updated={...offer,status:"EXPIRED" as const,updatedAt:new Date().toISOString()}; mockOffers=mockOffers.map(item=>item.id===id?updated:item); return updated;
  },
  getRecruitmentConversionContext: async (applicationId: number, offerId: number): Promise<RecruitmentConversionContext> => {
    if (activeActorRole !== "hr") domainError("FORBIDDEN", "Only HR can convert a Candidate to Employee");
    if (!USE_MOCK) return (await httpClient.get<RecruitmentConversionContext>(`${API_ENDPOINTS.recruitment.applications}${applicationId}/conversion-context/`, { params: { offerId } })).data;
    const application=mockApplications.find(item=>item.id===applicationId&&item.companyId===activeCompanyId); if(!application) throw new Error("Application not found in the active Company");
    const candidate=mockCandidates.find(item=>item.id===application.candidateId&&item.companyId===activeCompanyId); if(!candidate) throw new Error("Candidate not found in the active Company");
    const offer=mockOffers.find(item=>item.id===offerId&&item.applicationId===applicationId&&item.companyId===activeCompanyId); if(!offer) throw new Error("Accepted Offer not found for this Application");
    const existing=await employeeService.findByRecruitmentApplication(String(applicationId),activeCompanyId);
    if(!existing&&(offer.status!=="ACCEPTED"||application.status!=="OFFER_ACCEPTED")) domainError("CONVERSION_NOT_ELIGIBLE","Conversion requires an ACCEPTED Offer and OFFER_ACCEPTED Application");
    return {applicationId,candidateId:candidate.id,offerId,companyId:activeCompanyId,firstName:candidate.first_name,lastName:candidate.last_name,personalEmail:candidate.email,phone:candidate.phone,dob:candidate.dob??"",joiningDate:offer.joiningDate,alreadyConverted:Boolean(existing),employeeId:existing?.id};
  },
  convertApplicationToEmployee: async (input: ConvertApplicationInput): Promise<RecruitmentConversionResult> => {
    if (activeActorRole !== "hr") domainError("FORBIDDEN", "Only HR can convert a Candidate to Employee");
    if (!USE_MOCK) return (await httpClient.post<RecruitmentConversionResult>(`${API_ENDPOINTS.recruitment.applications}${input.applicationId}/convert-to-employee/`, input)).data;
    const locked=conversionLocks.get(input.applicationId); if(locked) return locked;
    const operation=(async()=>{
      const application=mockApplications.find(item=>item.id===input.applicationId&&item.companyId===activeCompanyId); if(!application) throw new Error("Application not found in the active Company");
      const candidate=mockCandidates.find(item=>item.id===application.candidateId&&item.companyId===activeCompanyId); if(!candidate) throw new Error("Candidate not found in the active Company");
      const offer=mockOffers.find(item=>item.id===input.offerId&&item.applicationId===application.id&&item.companyId===activeCompanyId); if(!offer) throw new Error("Offer does not belong to this Application and Company");
      const existing=await employeeService.findByRecruitmentApplication(String(application.id),activeCompanyId);
      if(existing) return {employeeId:existing.id,applicationId:application.id,candidateId:candidate.id,convertedAt:existing.recruitmentProvenance?.convertedAt??application.updatedAt,alreadyConverted:true};
      if(application.status!=="OFFER_ACCEPTED"||offer.status!=="ACCEPTED") domainError("CONVERSION_NOT_ELIGIBLE","Conversion requires an ACCEPTED Offer and OFFER_ACCEPTED Application");
      if(input.employee.companyId!==activeCompanyId) domainError("COMPANY_MISMATCH","Employee must be created in the active Company");
      const convertedAt=new Date().toISOString(); const previousApplication={...application}; let employee:Awaited<ReturnType<typeof employeeService.create>>|undefined;
      try { employee=await employeeService.create({...input.employee,recruitmentProvenance:{source:"RECRUITMENT",candidateId:String(candidate.id),applicationId:String(application.id),offerId:String(offer.id),convertedAt,convertedBy:activeActorName}}); mockApplications=mockApplications.map(item=>item.id===application.id?{...item,status:"CONVERTED",updatedAt:convertedAt}:item); return {employeeId:employee.id,applicationId:application.id,candidateId:candidate.id,convertedAt,alreadyConverted:false}; }
      catch(error){if(employee)await employeeService.rollbackRecruitmentCreation(employee.id,String(application.id));mockApplications=mockApplications.map(item=>item.id===application.id?previousApplication:item);throw error;}
    })(); conversionLocks.set(input.applicationId,operation); try{return await operation;}finally{conversionLocks.delete(input.applicationId);}
  },
};
