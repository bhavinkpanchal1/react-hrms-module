export const queryKeys = {
  recruitment: {
    all: ["recruitment"] as const,
    jobs: () => [...queryKeys.recruitment.all, "jobs"] as const,
    jobDetail: (id: number) => [...queryKeys.recruitment.jobs(), id] as const,
    candidates: () => [...queryKeys.recruitment.all, "candidates"] as const,
    candidate: (id: number) =>
      [...queryKeys.recruitment.candidates(), id] as const,
    pipeline: () => [...queryKeys.recruitment.all, "pipeline"] as const,
    interviews: () => [...queryKeys.recruitment.all, "interviews"] as const,
    offers: () => [...queryKeys.recruitment.all, "offers"] as const,
  },

  employee: {
    all: ["employee"] as const,
    list: () => [...queryKeys.employee.all, "list"] as const,
    details: (id: number) => [...queryKeys.employee.all, id] as const,
    documents: (employeeId: number) =>
      [...queryKeys.employee.details(employeeId), "documents"] as const,
    document: (employeeId: number, documentId: number) =>
      [...queryKeys.employee.documents(employeeId), documentId] as const,
  },

  attendance: {
    all: ["attendance"] as const,
    today: () => [...queryKeys.attendance.all, "today"] as const,
    history: (month: number, year: number) =>
      [...queryKeys.attendance.all, "history", month, year] as const,
    calendar: (month: number, year: number) =>
      [...queryKeys.attendance.all, "calendar", month, year] as const,
    regularizations: () =>
      [...queryKeys.attendance.all, "regularizations"] as const,
    regularization: (id: number) =>
      [...queryKeys.attendance.regularizations(), id] as const,
    pendingRegularizations: () =>
      [...queryKeys.attendance.all, "pending-regularizations"] as const,
  },
} as const;
