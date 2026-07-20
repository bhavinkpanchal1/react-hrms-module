import { useState } from "react";
import { CalendarClock, Plus, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/shared/ui";
import { Badge, type BadgeVariant } from "@/shared/ui/badge/Badge";
import EmptyState from "@/shared/ui/empty-state/EmptyState";
import { useCandidateInterviews } from "../hooks/useInterviews";
import { INTERVIEW_ROUND, type Interview, type InterviewStatus, type InterviewResult } from "../types/interview.type";
import type { Candidate } from "../types";
import ScheduleInterviewPage from "../pages/Interview/scheduleInterviewPage";
import RecordInterviewResponsePage from "../pages/Interview/RecordInterviewResponsePage";
import CreateOfferPage from "../pages/offer/CreateOfferPage";

const STATUS_VARIANT: Record<InterviewStatus, BadgeVariant> = {
  scheduled: "info",
  completed: "success",
  cancelled: "error",
  no_show: "warning",
};

const RESULT_VARIANT: Record<InterviewResult, BadgeVariant> = {
  pending: "default",
  pass: "success",
  fail: "error",
};

const roundLabel = (round: Interview["round"]) =>
  INTERVIEW_ROUND.find((r) => r.value === round)?.label ?? round;

interface InterviewRoundsCardProps {
  candidate: Candidate;
}

export const InterviewRoundsCard = ({ candidate }: InterviewRoundsCardProps) => {
  const { data: rounds = [] } = useCandidateInterviews(candidate.id);
  const [scheduleTarget, setScheduleTarget] = useState<Interview | "new" | null>(null);
  const [responseTarget, setResponseTarget] = useState<Interview | null>(null);
  const [offerModalOpen, setOfferModalOpen] = useState(false);

  const latest = rounds[rounds.length - 1];
  const canScheduleNext = !latest || latest.result === "pass";
  const canMoveToOffer = candidate.status === "interview" && latest?.result === "pass";

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarClock className="size-5 text-primary" />
              <h3 className="text-lg font-semibold">Interview Rounds</h3>
            </div>
            <div className="flex items-center gap-2">
              {canMoveToOffer && (
                <Button
                  size="sm"
                  variant="outline"
                  rightIcon={<ArrowRight className="size-3.5" />}
                  onClick={() => setOfferModalOpen(true)}
                >
                  Create Offer
                </Button>
              )}
              <Button
                size="sm"
                leftIcon={<Plus className="size-3.5" />}
                disabled={!canScheduleNext}
                onClick={() => setScheduleTarget("new")}
              >
                {rounds.length === 0 ? "Schedule Interview" : "Schedule Next Round"}
              </Button>
            </div>
          </div>

          {rounds.length === 0 ? (
            <EmptyState
              icon={CalendarClock}
              title="No interviews scheduled"
              description="Schedule the first round to begin the interview process."
            />
          ) : (
            <div className="flex flex-col divide-y divide-slate-100 dark:divide-navy-600">
              {rounds.map((iv, idx) => (
                <div key={iv.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-navy-100">
                      Round {idx + 1} — {roundLabel(iv.round)}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400 dark:text-navy-400">
                      {new Date(iv.scheduled_at).toLocaleString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                      {" · "}{iv.interviewer}
                      {" · "}{iv.mode === "online" ? "Online" : "In Person"}
                    </p>
                    {iv.feedback && (
                      <p className="mt-1 max-w-md text-xs text-slate-500 dark:text-navy-300">{iv.feedback}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge label={iv.status.replace("_", " ")} variant={STATUS_VARIANT[iv.status]} />
                    <Badge label={iv.result} variant={RESULT_VARIANT[iv.result]} />
                    {iv.status === "scheduled" && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => setScheduleTarget(iv)}>
                          Reschedule
                        </Button>
                        <Button variant="primary" size="sm" onClick={() => setResponseTarget(iv)}>
                          Add Response
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ScheduleInterviewPage
        isOpen={scheduleTarget !== null}
        close={() => setScheduleTarget(null)}
        title={scheduleTarget === "new" ? "Schedule Interview" : "Reschedule Interview"}
        candidate={candidate}
        editingInterview={scheduleTarget !== "new" ? scheduleTarget : null}
      />

      <RecordInterviewResponsePage
        isOpen={responseTarget !== null}
        close={() => setResponseTarget(null)}
        interview={responseTarget}
      />

      <CreateOfferPage
        isOpen={offerModalOpen}
        close={() => setOfferModalOpen(false)}
        candidate={candidate}
      />
    </>
  );
};