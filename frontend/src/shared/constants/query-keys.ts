export const queryKeys = {
  recruitment: {
    all: ["recruitment"] as const,
    jobs: () => [...queryKeys.recruitment.all, "jobs"] as const,
    jobDetail: (id: string) => [...queryKeys.recruitment.jobs(), id] as const,
  }
}