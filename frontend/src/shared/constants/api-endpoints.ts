export const API_ENDPOINTS = {
  recruitment: {
    jobs: "/recruitment/jobs/",
    candidates: "/recruitment/candidates/",
    interviews: "/recruitment/interviews/",
    offers: "/recruitment/offers/",
    pipeline: "/recruitment/pipeline/",
  },
  employees: {
    list: "/employees/list",
  },
  attendance: {
    today: "/attendance/today/",
    clockIn: "/attendance/clock-in/",
    clockOut: "/attendance/clock-out/",
    history: "/attendance/history/",
    calendar: "/attendance/calendar/",
    regularization: "/attendance/regularizations/",
  },
} as const;
