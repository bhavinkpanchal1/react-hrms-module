// shared/utils/date.ts

export interface DateFormatOptions {
  locale?: string;
  timeZone?: string;
  hour12?: boolean;
}

export const formatDate = (
  value: string | Date | null | undefined,
  options: DateFormatOptions = {},
) => {
  if (!value) return "--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "--";

  return new Intl.DateTimeFormat(
    options.locale ?? navigator.language,
    {
      year: "numeric",
      month: "short",
      day: "2-digit",
      timeZone: options.timeZone,
    },
  ).format(date);
};

export const formatTime = (
  value: string | Date | null | undefined,
  options: DateFormatOptions = {},
) => {
  if (!value) return "--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "--";

  return new Intl.DateTimeFormat(
    options.locale ?? navigator.language,
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: options.hour12,
      timeZone: options.timeZone,
    },
  ).format(date);
};

export const formatDateTime = (
  value: string | Date | null | undefined,
  options: DateFormatOptions = {},
) => {
  if (!value) return "--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "--";

  return new Intl.DateTimeFormat(
    options.locale ?? navigator.language,
    {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: options.timeZone,
    },
  ).format(date);
};

export const getToday = () => {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

export const getDateYearsAgo = (years: number) => {
  const date = new Date();

  date.setFullYear(date.getFullYear() - years);

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};