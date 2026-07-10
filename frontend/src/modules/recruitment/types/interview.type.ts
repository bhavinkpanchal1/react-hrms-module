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

export interface Interview {
  id:               number;
  candidateId:      number;
  candidate_name:   string;
  job_title:        string;
  interviewer:      string;
  scheduled_at:     string;
  duration_minutes: number;
  mode:             InterviewMode;
  status:           InterviewStatus;
  feedback:         string;
}