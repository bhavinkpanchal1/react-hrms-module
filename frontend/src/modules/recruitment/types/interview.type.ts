export const INTERVIEW_MODES = [
  {
    value: "online",
    label: "Online",
  },
  {
    value: "in_person",
    label: "In Person",
  },
] as const;

export type InterviewMode   = typeof INTERVIEW_MODES[number]["value"];

export const INTERVIEW_ROUND = [
  {value: "hr_round", label: "HR Round"},
  {value: "technical_round", label: "Technical round"},
  {value: "managerial_round", label: "Managerial round"},
] as const;

export type InterviewRound = typeof INTERVIEW_ROUND[number]["value"];

export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

// Outcome of a completed round — separate from `status`, which only tracks
// whether the interview took place. `result` drives whether a candidate can
// move to the next round or to the Offer stage.
export type InterviewResult = 'pending' | 'pass' | 'fail';

export const INTERVIEW_RESULT_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "pass",    label: "Pass"    },
  { value: "fail",    label: "Fail"    },
] as const;

export interface Interview {
  id:               number;
  candidateId:      number;
  round:            InterviewRound;
  candidate_name:   string;
  job_title:        string;
  interviewer:      string;
  scheduled_at:     string;
  duration_minutes: number;
  mode:             InterviewMode;
  status:           InterviewStatus;
  result:           InterviewResult;
  feedback:         string;
}

// Fields collected when scheduling or rescheduling an interview round.
export type ScheduleInterviewInput = Pick<
  Interview,
  'candidateId' | 'round' | 'candidate_name' | 'job_title' | 'interviewer' | 'scheduled_at' | 'duration_minutes' | 'mode'
>;

// Fields collected when recording an outcome for a scheduled interview.
export interface InterviewResponseInput {
  status:   InterviewStatus;
  result:   InterviewResult;
  feedback: string;
}