export const queryKeys = {
  recruitment: {
    all: ["recruitment"] as const,
    jobs: () => [...queryKeys.recruitment.all, "jobs"] as const,
    jobDetail: (id: number) => [...queryKeys.recruitment.jobs(), id] as const,
  }
}