export const queryKeys = {
  recruitment: {
    all: ['recruitment'] as const,
    jobs: () => [...queryKeys.recruitment.all, 'jobs'] as const,
    jobDetail: (id: number) => [...queryKeys.recruitment.jobs(), id] as const,
    candidates: () => [...queryKeys.recruitment.all, 'candidates'] as const,
    candidate: (id: number) => [...queryKeys.recruitment.candidates(), id] as const,
    pipeline: () => [...queryKeys.recruitment.all, 'pipeline'] as const,
    interviews: () => [...queryKeys.recruitment.all, 'interviews'] as const,
    offers: () => [...queryKeys.recruitment.all, 'offers'] as const,
  },
  employee: {
    all: ['employee'] as const,
    list: () => [...queryKeys.employee.all, 'list'] as const,
    details: (id: number) => [...queryKeys.employee.all, id] as const,
  }
} as const;