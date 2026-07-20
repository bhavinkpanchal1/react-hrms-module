// Pure date helpers for DatePicker. No external date library — plain Date
// math is enough for a month/year/range grid and keeps this dependency-free.

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const MONTH_SHORT = MONTH_NAMES.map((m) => m.slice(0, 3));
export const WEEKDAY_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const pad2 = (n: number) => String(n).padStart(2, "0");

export const toISODate = (year: number, month: number, day: number) =>
  `${year}-${pad2(month + 1)}-${pad2(day)}`;

export const toISOMonth = (year: number, month: number) =>
  `${year}-${pad2(month + 1)}`;

export const parseISODate = (value?: string | null): Date | null => {
  if (!value) return null;
  const [datePart] = value.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

export const parseISOMonth = (
  value?: string | null,
): { year: number; month: number } | null => {
  if (!value) return null;
  const [y, m] = value.split("-").map(Number);
  if (!y || !m) return null;
  return { year: y, month: m - 1 };
};

export const isSameDay = (a: Date | null, b: Date | null) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const isBefore = (a: Date, b: Date) => a.getTime() < b.getTime();
export const isAfter = (a: Date, b: Date) => a.getTime() > b.getTime();

// Days shown in a 6-week calendar grid, including leading/trailing days
// from adjacent months (needed so the grid is always a full 6x7 block).
export const getMonthGrid = (
  year: number,
  month: number,
): { date: Date; inMonth: boolean }[] => {
  const first = new Date(year, month, 1);
  const startOffset = first.getDay(); // 0 = Sunday
  const gridStart = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + i,
    );
    return { date, inMonth: date.getMonth() === month };
  });
};

export const formatDisplayDate = (value?: string | null) => {
  const d = parseISODate(value);
  if (!d) return "";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDisplayMonth = (value?: string | null) => {
  const m = parseISOMonth(value);
  if (!m) return "";
  return `${MONTH_NAMES[m.month]} ${m.year}`;
};
