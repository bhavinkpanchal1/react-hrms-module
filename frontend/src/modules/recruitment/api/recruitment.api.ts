// recruitment.api.ts
// Opt into the in-memory data only when explicitly requested.
import { httpClient } from "@/shared/services/http/client";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";
import type { Job, Candidate, Interview, Offer } from "../types";
import type { JobFormData } from "../schema/job.schema";
import type { CreateCandidateInput } from "../types/candidate.types";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";
const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

// ── Mock DB (lives in module scope — resets on page refresh) ─────────
let mockJobs: Job[] = [
  {
    id: 1,
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

  resume_url: null,

  referenced_by: "",

  linkedin_url: null,
  github_url: null,
  portfolio_url: null,

  skills: [],
  certifications: [],
};

let mockCandidates: Candidate[] = [
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

    resume_url: null,
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

    resume_url: null,
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

    resume_url: null,
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

    resume_url: null,
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

    resume_url: null,
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

    resume_url: null,
    applied_at: "2025-01-15",

    notes: "Joining 1st March.",

    gender: "female",

    current_position: "Senior HR Executive",
    current_company: "TalentSphere",

    total_experience: 7,

    skills: ["Recruitment", "Compliance", "Employee Engagement"],
  },
];
let mockInterviews: Interview[] = [
  {
    id: 1,
    candidateId: 1,
    round: "technical_round",
    candidate_name: "Ravi Sharma",
    job_title: "Frontend Developer",
    interviewer: "Bhavin Panchal",
    scheduled_at: "2025-03-15T10:00:00",
    duration_minutes: 60,
    mode: "online",
    status: "scheduled",
    result: "pending",
    feedback: "",
  },
  {
    id: 2,
    candidateId: 3,
    round: "hr_round",
    candidate_name: "Amit Shah",
    job_title: "HR Executive",
    interviewer: "HR Manager",
    scheduled_at: "2025-03-16T14:00:00",
    duration_minutes: 45,
    mode: "in_person",
    status: "scheduled",
    result: "pending",
    feedback: "",
  },
  {
    id: 3,
    candidateId: 6,
    round: "hr_round",
    candidate_name: "Nisha Verma",
    job_title: "HR Executive",
    interviewer: "HR Manager",
    scheduled_at: "2025-02-20T11:00:00",
    duration_minutes: 45,
    mode: "online",
    status: "completed",
    result: "pass",
    feedback:
      "Excellent communication. Strong HR knowledge. Recommended for hire.",
  },
];

let mockOffers: Offer[] = [
  {
    id: 1,
    candidateId: 4,
    candidate_name: "Sneha Mehta",
    job_title: "Frontend Developer",
    offered_salary: 600000,
    joining_date: "2025-04-01",
    status: "pending",
    issued_at: "2025-03-10",
  },
  {
    id: 2,
    candidateId: 6,
    candidate_name: "Nisha Verma",
    job_title: "HR Executive",
    offered_salary: 480000,
    joining_date: "2025-03-01",
    status: "accepted",
    issued_at: "2025-02-25",
  },
];

let nextJobId = 5,
  nextCandId = 7,
  nextIntId = 4,
  nextOffId = 3;

// ── Jobs ─────────────────────────────────────────────────────────────
export const recruitmentApi = {
  // JOBS
  getJobs: async (): Promise<Job[]> => {
    if (USE_MOCK) {
      await delay();
      return [...mockJobs];
    }
    const r = await httpClient.get<{ results: Job[] }>(
      API_ENDPOINTS.recruitment.jobs,
    );
    return r.data.results;
  },

  getJobById: async (id: number): Promise<Job> => {
    if (USE_MOCK) {
      await delay(300);
      const j = mockJobs.find((j) => j.id === id);
      if (!j) throw new Error("Job not found");
      return j;
    }
    const r = await httpClient.get<Job>(
      `${API_ENDPOINTS.recruitment.jobs}${id}/`,
    );
    return r.data;
  },

  createJob: async (data: JobFormData): Promise<Job> => {
    if (USE_MOCK) {
      await delay(600);
      const j: Job = {
        ...data,
        id: nextJobId++,
        created_at: new Date().toISOString(),
      };
      mockJobs = [...mockJobs, j];
      return j;
    }
    const r = await httpClient.post<Job>(API_ENDPOINTS.recruitment.jobs, data);
    return r.data;
  },

  updateJob: async (id: number, data: Partial<JobFormData>): Promise<Job> => {
    if (USE_MOCK) {
      await delay(600);
      mockJobs = mockJobs.map((j) => (j.id === id ? { ...j, ...data } : j));
      return mockJobs.find((j) => j.id === id)!;
    }
    const r = await httpClient.patch<Job>(
      `${API_ENDPOINTS.recruitment.jobs}${id}/`,
      data,
    );
    return r.data;
  },

  deleteJob: async (id: number): Promise<void> => {
    if (USE_MOCK) {
      await delay(400);
      mockJobs = mockJobs.filter((j) => j.id !== id);
      return;
    }
    await httpClient.delete(`${API_ENDPOINTS.recruitment.jobs}${id}/`);
  },

  // CANDIDATES
  getCandidates: async (): Promise<Candidate[]> => {
    if (USE_MOCK) {
      await delay();
      return [...mockCandidates];
    }
    const r = await httpClient.get<{ results: Candidate[] }>(
      API_ENDPOINTS.recruitment.candidates,
    );
    return r.data.results;
  },

  getCandidateById: async (id: number): Promise<Candidate> => {
    if (USE_MOCK) {
      await delay();
      const c = mockCandidates.find((c) => c.id === id);
      if (!c) throw new Error("Job not found");
      return c;
    }

    const r = await httpClient.get<Candidate>(
      `${API_ENDPOINTS.recruitment.candidates}${id}/`,
    );
    return r.data;
  },

  createCandidate: async (data: CreateCandidateInput): Promise<Candidate> => {
    if (USE_MOCK) {
      await delay(600);
      const job = mockJobs.find((j) => j.id === data.jobId);
      const c: Candidate = {
        ...data,
        id: nextCandId++,
        job_title: job?.title ?? "",
        status: "applied",
        resume_url: null,
        applied_at: new Date().toISOString(),
      };
      mockCandidates = [...mockCandidates, c];
      return c;
    }
    const r = await httpClient.post<Candidate>(
      API_ENDPOINTS.recruitment.candidates,
      data,
    );
    return r.data;
  },

 updateCandidate: async (
  id: number,
  data: Partial<Candidate>,
): Promise<Candidate> => {
  if (USE_MOCK) {
    await delay(400);
    // job_title is derived from jobId (same as on create) — if jobId
    // changed, recompute it so the display field doesn't go stale.
    const patch = { ...data };
    if (patch.jobId !== undefined) {
      const job = mockJobs.find((j) => j.id === patch.jobId);
      patch.job_title = job?.title ?? "";
    }
    mockCandidates = mockCandidates.map((c) =>
      c.id === id ? { ...c, ...patch } : c,
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

  updateCandidateStatus: async (
    id: number,
    status: Candidate["status"],
  ): Promise<Candidate> => {
    if (USE_MOCK) {
      await delay(400);
      mockCandidates = mockCandidates.map((c) =>
        c.id === id ? { ...c, status } : c,
      );
      return mockCandidates.find((c) => c.id === id)!;
    }
    const r = await httpClient.patch<Candidate>(
      `${API_ENDPOINTS.recruitment.candidates}${id}/`,
      { status },
    );
    return r.data;
  },

  deleteCandidate: async (id: number): Promise<void> => {
    if (USE_MOCK) {
      await delay(400);
      mockCandidates = mockCandidates.filter((c) => c.id !== id);
      return;
    }
    await httpClient.delete(`${API_ENDPOINTS.recruitment.candidates}${id}/`);
  },

  // INTERVIEWS
  getInterviews: async (): Promise<Interview[]> => {
    if (USE_MOCK) {
      await delay();
      return [...mockInterviews];
    }
    const r = await httpClient.get<{ results: Interview[] }>(
      API_ENDPOINTS.recruitment.interviews,
    );
    return r.data.results;
  },
  createInterview: async (data: Omit<Interview, "id">): Promise<Interview> => {
    if (USE_MOCK) {
      await delay(600);
      const i = { ...data, id: nextIntId++ };
      mockInterviews = [...mockInterviews, i];
      return i;
    }
    const r = await httpClient.post<Interview>(
      API_ENDPOINTS.recruitment.interviews,
      data,
    );
    return r.data;
  },
  // Used for both "Add Response" (status/result/feedback) and "Reschedule"
  // (scheduled_at/interviewer/mode + status reset to 'scheduled') — same
  // interview record, never a new one, so round history stays accurate.
  updateInterview: async (
    id: number,
    data: Partial<Interview>,
  ): Promise<Interview> => {
    if (USE_MOCK) {
      await delay(400);
      mockInterviews = mockInterviews.map((iv) =>
        iv.id === id ? { ...iv, ...data } : iv,
      );
      const updated = mockInterviews.find((iv) => iv.id === id);
      if (!updated) throw new Error("Interview not found");
      return updated;
    }
    const r = await httpClient.patch<Interview>(
      `${API_ENDPOINTS.recruitment.interviews}${id}/`,
      data,
    );
    return r.data;
  },

  // OFFERS
  getOffers: async (): Promise<Offer[]> => {
    if (USE_MOCK) {
      await delay();
      return [...mockOffers];
    }
    const r = await httpClient.get<{ results: Offer[] }>(
      API_ENDPOINTS.recruitment.offers,
    );
    return r.data.results;
  },
  createOffer: async (
    data: Omit<Offer, "id" | "issued_at">,
  ): Promise<Offer> => {
    if (USE_MOCK) {
      await delay(600);
      const o = {
        ...data,
        id: nextOffId++,
        issued_at: new Date().toISOString(),
      };
      mockOffers = [...mockOffers, o];
      return o;
    }
    const r = await httpClient.post<Offer>(
      API_ENDPOINTS.recruitment.offers,
      data,
    );
    return r.data;
  },
  updateOfferStatus: async (
    id: number,
    status: Offer["status"],
  ): Promise<Offer> => {
    if (USE_MOCK) {
      await delay(400);
      mockOffers = mockOffers.map((o) => (o.id === id ? { ...o, status } : o));
      return mockOffers.find((o) => o.id === id)!;
    }
    const r = await httpClient.patch<Offer>(
      `${API_ENDPOINTS.recruitment.offers}${id}/`,
      { status },
    );
    return r.data;
  },
};
