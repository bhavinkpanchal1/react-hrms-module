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
  COUNTRY_OPTIONS,
  STATE_OPTIONS,
} from "../../constant/candidate";

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
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>

      <p className="mt-1 font-medium text-slate-700 dark:text-navy-50">
        {displayValue}
      </p>
    </div>
  );
};

const CandidateDetailsPage = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const candidateId = Number(id);

  const { data: candidate, isLoading, error } = useCandidate(candidateId);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-navy-50">
            Candidate Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-navy-300">
            Complete candidate information and recruitment details.
          </p>
        </div>

        <Button
          onClick={() =>
            navigate(`/recruitment/candidates/${candidate.id}/edit`)
          }
          leftIcon={<Pencil size={16} />}
        >
          Edit Candidate
        </Button>
      </div>

      {/* Hero Card */}
      <Card className="overflow-hidden">
        <div className="bg-linear-to-r from-primary/10 to-primary/5 p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary text-3xl font-bold text-white">
                {candidate.first_name[0]}
                {candidate.last_name[0]}
              </div>

              <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-navy-50">
                  {candidate.first_name} {candidate.last_name}
                </h2>

                <p className="mt-1 text-slate-500 dark:text-navy-300">
                  {candidate.current_position || "Candidate"}
                </p>

                <p className="text-sm text-slate-400">
                  Applied for {candidate.job_title}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                    {candidate.status}
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 dark:bg-navy-700 dark:text-navy-100">
                    {candidate.source}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoItem label="Candidate ID" value={candidate.id} />

              <InfoItem
                label="Applied On"
                value={new Date(candidate.applied_at).toLocaleDateString()}
              />

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

      {/* Personal Information */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-2">
            <User className="size-5 text-primary" />
            <h3 className="text-lg font-semibold">Personal Information</h3>
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
      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-2">
            <MapPin className="size-5 text-primary" />
            <h3 className="text-lg font-semibold">Address Information</h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <InfoItem label="Address Line 1" value={candidate.address_line1} />

            <InfoItem label="Address Line 2" value={candidate.address_line2} />

            <InfoItem label="Pincode" value={candidate.pincode} />

            <InfoItem
              label="Country"
              value={candidate.country_id}
              lookupOptions={COUNTRY_OPTIONS}
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
      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-2">
            <Briefcase className="size-5 text-primary" />
            <h3 className="text-lg font-semibold">Professional Information</h3>
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

      {/* Interview Rounds */}
      <InterviewRoundsCard candidate={candidate} />

      {/* Education */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-2">
            <GraduationCap className="size-5 text-primary" />
            <h3 className="text-lg font-semibold">Education Information</h3>
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
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-6 text-lg font-semibold">Links & Profiles</h3>

          <div className="flex flex-wrap gap-3">
            {candidate.linkedin_url && (
              <a
                href={candidate.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="btn"
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
                className="btn"
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
                className="btn"
              >
                <Globe size={16} />
                Portfolio
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {candidate.skills && candidate.skills.length > 0 ? (
              candidate.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
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

          <h3 className="mt-6 mb-4 text-lg font-semibold">Certifications</h3>
          <div className="flex flex-wrap gap-2">
            {candidate.certifications && candidate.certifications.length > 0 ? (
              candidate.certifications.map((cert) => (
                <span
                  key={cert}
                  className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 dark:bg-navy-700 dark:text-navy-100"
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
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Recruiter Notes</h3>

          <p className="leading-7 text-slate-600 dark:text-navy-200">
            {candidate.notes || "No notes available"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateDetailsPage;
