import {
  Briefcase,
  GitBranch,
  Globe,
  GraduationCap,
  MapPin,
  Pencil,
  User,
} from "lucide-react";

import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui";
import { Card, CardContent } from "@/components/ui/card";
import { useCandidate } from "../../hooks/useCandidates";
import { InterviewRoundsCard } from "../../components/InterviewRoundsCard";
import {
  CITY_OPTIONS,
  STATE_OPTIONS,
} from "../../constant/candidate";
import { useLocation } from "@/shared/hooks/useLocation";
import { useCandidateApplications } from "../../hooks/useApplications";
import { useJobs } from "../../hooks/useJobs";
import { CandidateStatusBadge } from "../../components/CandidateStatusBadge";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { RecruitmentDocumentsCard } from "../../components/RecruitmentDocumentsCard";

const InfoItem = ({
  label,
  value,
  lookupOptions,
}: {
  label: string;
  value?: string | number | null;
  lookupOptions?: readonly { value: string | number; label: string }[];
}) => {
  const displayValue = lookupOptions
    ? lookupOptions.find((option) => String(option.value) === String(value))
      ?.label || "-"
    : value || "-";

  return (
    <div>
      <p className="font-inter text-xs uppercase tracking-wide text-slate-400 dark:text-navy-300">{label}</p>

      <p className="mt-1 font-medium text-slate-700 dark:text-navy-50">
        {displayValue}
      </p>
    </div>
  );
};

const CandidateDetailsPage = () => {
  const navigate = useNavigate();
  const { countries } = useLocation();
  const { user } = useAuth();

  const { id } = useParams();
  const candidateId = Number(id);

  const { data: candidate, isLoading, error } = useCandidate(candidateId);
  const { data: applications = [] } = useCandidateApplications(candidateId);
  const { data: jobs = [] } = useJobs();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        Loading candidate...
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="flex h-64 items-center justify-center">
        Candidate not found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 pb-8 sm:gap-5 lg:gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between lg:py-6">
        <div>
          <h1 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
            Candidate Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-navy-300">
            Complete candidate information and recruitment details.
          </p>
        </div>

        {user?.role === "hr" && <Button
          onClick={() =>
            navigate(`/recruitment/candidates/${candidate.id}/edit`)
          }
          leftIcon={<Pencil size={16} />}
        >
          Edit Candidate
        </Button>}
      </div>

      {/* Hero Card */}
      <Card className="card gap-0 overflow-hidden rounded-lg py-0 shadow-soft ring-0">
        <div className="bg-primary/10 p-5 dark:bg-accent-light/10 sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-lg bg-primary text-2xl font-semibold text-white dark:bg-accent">
                {candidate.first_name[0]}
                {candidate.last_name[0]}
              </div>

              <div>
                <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 sm:text-2xl">
                  {candidate.first_name} {candidate.last_name}
                </h2>

                <p className="mt-1 text-slate-500 dark:text-navy-300">
                  {candidate.current_position || "Candidate"}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <CandidateStatusBadge status={candidate.status} />
                  <span className="badge rounded-full bg-slate-150 text-slate-600 dark:bg-navy-600 dark:text-navy-200">
                    {candidate.source}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoItem label="Candidate ID" value={candidate.id} />

              <InfoItem
                label="Experience"
                value={`${candidate.total_experience || 0} Years`}
              />

              <InfoItem
                label="Notice Period"
                value={`${candidate.notice_period || 0} Days`}
              />
            </div>
          </div>
        </div>
      </Card>

      <RecruitmentDocumentsCard candidateId={candidate.id} applications={applications} jobs={jobs} />

      {/* Personal Information */}
      <Card className="card gap-0 rounded-lg py-0 shadow-soft ring-0">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-2">
            <User className="size-5 text-primary" />
            <h3 className="text-base font-medium tracking-wide text-slate-700 dark:text-navy-100">Personal Information</h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <InfoItem label="Email" value={candidate.email} />
            <InfoItem label="Phone" value={candidate.phone} />
            <InfoItem label="Date of Birth" value={candidate.dob} />
            <InfoItem label="Gender" value={candidate.gender} />
            <InfoItem label="Marital Status" value={candidate.marital_status} />
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card className="card gap-0 rounded-lg py-0 shadow-soft ring-0">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-2">
            <MapPin className="size-5 text-primary" />
            <h3 className="text-base font-medium tracking-wide text-slate-700 dark:text-navy-100">Address Information</h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <InfoItem label="Address Line 1" value={candidate.address_line1} />

            <InfoItem label="Address Line 2" value={candidate.address_line2} />

            <InfoItem label="Pincode" value={candidate.pincode} />

            <InfoItem
              label="Country"
              value={candidate.country_id}
              lookupOptions={ countries }
            />

            <InfoItem
              label="State"
              value={candidate.state_id}
              lookupOptions={STATE_OPTIONS}
            />

            <InfoItem
              label="City"
              value={candidate.city_id}
              lookupOptions={CITY_OPTIONS}
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional */}
      <Card className="card gap-0 rounded-lg py-0 shadow-soft ring-0">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-2">
            <Briefcase className="size-5 text-primary" />
            <h3 className="text-base font-medium tracking-wide text-slate-700 dark:text-navy-100">Professional Information</h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <InfoItem
              label="Current Position"
              value={candidate.current_position}
            />

            <InfoItem
              label="Current Company"
              value={candidate.current_company}
            />

            <InfoItem label="Current Salary" value={candidate.current_salary} />

            <InfoItem
              label="Expected Salary"
              value={candidate.expected_salary}
            />

            <InfoItem
              label="Notice Period"
              value={`${candidate.notice_period || 0} Days`}
            />

            <InfoItem
              label="Experience"
              value={`${candidate.total_experience || 0} Years`}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="card gap-0 rounded-lg py-0 shadow-soft ring-0"><CardContent className="p-5 sm:p-6"><h3 className="mb-4 text-base font-medium tracking-wide text-slate-700 dark:text-navy-100">Applications</h3><div className="space-y-4">{applications.map((application) => <div key={application.id} className="rounded-lg border border-slate-200 p-4 dark:border-navy-500"><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><p className="font-medium text-slate-700 dark:text-navy-100">{jobs.find((job) => job.id === application.jobId)?.title ?? "Unknown job"}</p><p className="font-inter text-xs text-slate-400 dark:text-navy-300">Applied {new Date(application.appliedAt).toLocaleDateString()}</p></div><CandidateStatusBadge status={application.status} /></div><InterviewRoundsCard candidate={candidate} application={application} /></div>)}</div></CardContent></Card>

      {/* Education */}
      <Card className="card gap-0 rounded-lg py-0 shadow-soft ring-0">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-2">
            <GraduationCap className="size-5 text-primary" />
            <h3 className="text-base font-medium tracking-wide text-slate-700 dark:text-navy-100">Education Information</h3>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <InfoItem
              label="Highest Education"
              value={candidate.highest_education}
            />

            <InfoItem label="Institution" value={candidate.institution} />

            <InfoItem
              label="Graduation Year"
              value={candidate.graduation_year}
            />
          </div>
        </CardContent>
      </Card>

      {/* Links */}
      <Card className="card gap-0 rounded-lg py-0 shadow-soft ring-0">
        <CardContent className="p-6">
          <h3 className="mb-6 text-base font-medium tracking-wide text-slate-700 dark:text-navy-100">Links & Profiles</h3>

          <div className="flex flex-wrap gap-3">
            {candidate.linkedin_url && (
              <a
                href={candidate.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="btn border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500"
              >
                {/* <Linked size={16} /> */}
                LinkedIn
              </a>
            )}

            {candidate.github_url && (
              <a
                href={candidate.github_url}
                target="_blank"
                rel="noreferrer"
                className="btn gap-2 border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500"
              >
                <GitBranch size={16} />
                GitHub
              </a>
            )}

            {candidate.portfolio_url && (
              <a
                href={candidate.portfolio_url}
                target="_blank"
                rel="noreferrer"
                className="btn gap-2 border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500"
              >
                <Globe size={16} />
                Portfolio
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="card gap-0 rounded-lg py-0 shadow-soft ring-0">
        <CardContent className="p-6">
          <h3 className="mb-4 text-base font-medium tracking-wide text-slate-700 dark:text-navy-100">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {candidate.skills && candidate.skills.length > 0 ? (
              candidate.skills.map((skill) => (
                <span
                  key={skill}
                  className="badge rounded-full bg-primary/10 text-primary dark:bg-accent-light/15 dark:text-accent-light"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-400 dark:text-navy-400">
                No skills listed
              </p>
            )}
          </div>

          <h3 className="mb-4 mt-6 text-base font-medium tracking-wide text-slate-700 dark:text-navy-100">Certifications</h3>
          <div className="flex flex-wrap gap-2">
            {candidate.certifications && candidate.certifications.length > 0 ? (
              candidate.certifications.map((cert) => (
                <span
                  key={cert}
                  className="badge rounded-full bg-slate-150 text-slate-600 dark:bg-navy-600 dark:text-navy-200"
                >
                  {cert}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-400 dark:text-navy-400">
                No certifications listed
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="card gap-0 rounded-lg py-0 shadow-soft ring-0">
        <CardContent className="p-6">
          <h3 className="mb-4 text-base font-medium tracking-wide text-slate-700 dark:text-navy-100">Recruiter Notes</h3>

          <p className="leading-7 text-slate-600 dark:text-navy-200">
            {candidate.notes || "No notes available"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateDetailsPage;
