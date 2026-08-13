export const API_ENDPOINTS = {
  recruitment: {
    jobs: "/recruitment/jobs/",
    candidates: "/recruitment/candidates/",
    interviews: "/recruitment/interviews/",
    offers: "/recruitment/offers/",
    pipeline: "/recruitment/pipeline/",
  },
  employees: {
    base: "/employees/",
    list: "/employees/list",
    detail: (id: number) => `/employees/${id}/`,
    documents: (employeeId: number) => `/employees/${employeeId}/documents/`,
    document: (employeeId: number, documentId: number) =>
      `/employees/${employeeId}/documents/${documentId}/`,
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
