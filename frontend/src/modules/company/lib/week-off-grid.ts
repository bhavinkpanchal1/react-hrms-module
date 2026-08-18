import {
  WEEKDAYS,
  WEEK_OFF_OCCURRENCES,
  type Weekday,
  type WeekOffGrid,
  type WeekOffOccurrence,
  type WeekOffState,
} from "../types/company.types";

type WeekOffStateResolver = (
  occurrence: WeekOffOccurrence,
  weekday: Weekday,
) => WeekOffState;

export const createWeekOffGrid = (
  resolveState: WeekOffStateResolver = () => "working",
): WeekOffGrid =>
  WEEK_OFF_OCCURRENCES.flatMap((occurrence) =>
    WEEKDAYS.map(({ value: weekday }) => ({
      occurrence,
      weekday,
      state: resolveState(occurrence, weekday),
    })),
  );
