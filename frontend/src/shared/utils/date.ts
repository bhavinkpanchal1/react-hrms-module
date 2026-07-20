export const getDateYearsAgo = (years: number): string => {
  const date = new Date();

  date.setFullYear(date.getFullYear() - years);

  return date.toISOString().split("T")[0];
};

