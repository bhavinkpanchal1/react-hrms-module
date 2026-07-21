import { useState } from "react";
import { Popover } from "@base-ui/react/popover";
import { CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button/Button";
import {
  MONTH_NAMES,
  MONTH_SHORT,
  WEEKDAY_SHORT,
  toISODate,
  toISOMonth,
  parseISODate,
  isSameDay,
  isBefore,
  isAfter,
  getMonthGrid,
  formatDisplayDate,
  formatDisplayMonth,
} from "@/shared/lib/date-utils";

export type DatePickerMode = "date" | "datetime" | "month" | "year" | "range";
export interface DateRangeValue {
  from: string;
  to: string;
}
type DatePickerValue = string | DateRangeValue | null;

export interface DatePickerProps {
  mode?: DatePickerMode;
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  minDate?: string; // ISO 'YYYY-MM-DD' — applies to date/datetime/range
  maxDate?: string;
  value?: DatePickerValue;
  onChange: (value: DatePickerValue) => void;
}

const YEAR_BLOCK = 12;

export const DatePicker = ({
  mode = "date",
  label,
  error,
  hint,
  required,
  placeholder = "Select...",
  disabled,
  minDate,
  maxDate,
  value,
  onChange,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);

  // The date/time actually being navigated in the popup — separate from
  // the committed `value` so browsing months doesn't change the field
  // until something is actually picked (or Apply is clicked).
  const seedDate =
    mode === "range"
      ? parseISODate((value as DateRangeValue | null)?.from)
      : (parseISODate(value as string) ?? parseISODate(maxDate) ?? new Date());
  const [viewYear, setViewYear] = useState(() =>
    (seedDate ?? new Date()).getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(() =>
    (seedDate ?? new Date()).getMonth(),
  );
  const [timeValue, setTimeValue] = useState(() =>
    typeof value === "string" ? (value.split("T")[1] ?? "09:00") : "09:00",
  );
  const [rangeStart, setRangeStart] = useState<string | null>(
    mode === "range" ? ((value as DateRangeValue | null)?.from ?? null) : null,
  );
  const [rangeEnd, setRangeEnd] = useState<string | null>(
    mode === "range" ? ((value as DateRangeValue | null)?.to ?? null) : null,
  );

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      const seed =
        mode === "range"
          ? parseISODate((value as DateRangeValue | null)?.from)
          : parseISODate(value as string);
      if (seed) {
        setViewYear(seed.getFullYear());
        setViewMonth(seed.getMonth());
      }
      if (mode === "range") {
        setRangeStart((value as DateRangeValue | null)?.from ?? null);
        setRangeEnd((value as DateRangeValue | null)?.to ?? null);
      }
    }
    setOpen(nextOpen);
  };

  const min = parseISODate(minDate);
  const max = parseISODate(maxDate);
  const isDisabledDate = (d: Date) =>
    Boolean((min && isBefore(d, min)) || (max && isAfter(d, max)));

  const displayValue = (() => {
    if (!value) return "";
    if (mode === "range") {
      const r = value as DateRangeValue;
      return r.from && r.to
        ? `${formatDisplayDate(r.from)} — ${formatDisplayDate(r.to)}`
        : "";
    }
    if (mode === "month") return formatDisplayMonth(value as string);
    if (mode === "year") return value as string;
    if (mode === "datetime") {
      const [datePart, timePart] = (value as string).split("T");
      return datePart
        ? `${formatDisplayDate(datePart)}${timePart ? `, ${timePart}` : ""}`
        : "";
    }
    return formatDisplayDate(value as string);
  })();

  const commitAndClose = (v: DatePickerValue) => {
    onChange(v);
    setOpen(false);
  };

  const goMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };
  const goYearBlock = (delta: number) =>
    setViewYear((y) => y + delta * YEAR_BLOCK);
  const goYear = (delta: number) => setViewYear((y) => y + delta);

  const renderDayGrid = () => {
    const grid = getMonthGrid(viewYear, viewMonth);
    const selected = mode === "range" ? null : parseISODate(value as string);
    const start = rangeStart ? parseISODate(rangeStart) : null;
    const end = rangeEnd ? parseISODate(rangeEnd) : null;

    return (
      <div>
        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => goMonth(-1)}
            className="btn size-7 rounded-full p-0 text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-600"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-sm font-medium text-slate-700 dark:text-navy-100">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <button
            type="button"
            onClick={() => goMonth(1)}
            className="btn size-7 rounded-full p-0 text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-600"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400 dark:text-navy-400">
          {WEEKDAY_SHORT.map((d) => (
            <span key={d} className="py-1">
              {d}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {grid.map(({ date, inMonth }) => {
            const iso = toISODate(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
            );
            const isSel =
              mode === "range"
                ? isSameDay(date, start) || isSameDay(date, end)
                : isSameDay(date, selected);
            const inRange =
              mode === "range" && start && end && date >= start && date <= end;
            const disabledDay = isDisabledDate(date);
            return (
              <button
                type="button"
                key={iso}
                disabled={disabledDay}
                onClick={() => handleDayClick(iso)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm transition-colors",
                  !inMonth && "text-slate-300 dark:text-navy-500",
                  inMonth &&
                    !isSel &&
                    "text-slate-700 dark:text-navy-100 hover:bg-slate-100 dark:hover:bg-navy-600",
                  inRange && !isSel && "bg-primary/10 rounded-none",
                  isSel && "bg-primary text-white hover:bg-primary-focus",
                  disabledDay &&
                    "cursor-not-allowed opacity-30 hover:bg-transparent",
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const handleDayClick = (iso: string) => {
    if (mode === "date") {
      commitAndClose(iso);
      return;
    }
    if (mode === "datetime") {
      onChange(`${iso}T${timeValue}`);
      return; // stays open — user confirms via Apply
    }
    if (mode === "range") {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        setRangeStart(iso);
        setRangeEnd(null);
      } else {
        if (iso < rangeStart) {
          setRangeEnd(rangeStart);
          setRangeStart(iso);
        } else {
          setRangeEnd(iso);
        }
      }
    }
  };

  const renderMonthGrid = () => (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => goYear(-1)}
          className="btn size-7 rounded-full p-0 text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-600"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-sm font-medium text-slate-700 dark:text-navy-100">
          {viewYear}
        </span>
        <button
          type="button"
          onClick={() => goYear(1)}
          className="btn size-7 rounded-full p-0 text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-600"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {MONTH_SHORT.map((m, idx) => {
          const iso = toISOMonth(viewYear, idx);
          const isSel = value === iso;
          return (
            <button
              type="button"
              key={m}
              onClick={() => commitAndClose(iso)}
              className={cn(
                "rounded-lg py-2 text-sm transition-colors",
                isSel
                  ? "bg-primary text-white"
                  : "text-slate-700 hover:bg-slate-100 dark:text-navy-100 dark:hover:bg-navy-600",
              )}
            >
              {m}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderYearGrid = () => {
    const blockStart = viewYear - (viewYear % YEAR_BLOCK);
    const years = Array.from({ length: YEAR_BLOCK }, (_, i) => blockStart + i);
    return (
      <div>
        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => goYearBlock(-1)}
            className="btn size-7 rounded-full p-0 text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-600"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-sm font-medium text-slate-700 dark:text-navy-100">
            {blockStart} – {blockStart + YEAR_BLOCK - 1}
          </span>
          <button
            type="button"
            onClick={() => goYearBlock(1)}
            className="btn size-7 rounded-full p-0 text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-600"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {years.map((y) => {
            const isSel = value === String(y);
            return (
              <button
                type="button"
                key={y}
                onClick={() => commitAndClose(String(y))}
                className={cn(
                  "rounded-lg py-2 text-sm transition-colors",
                  isSel
                    ? "bg-primary text-white"
                    : "text-slate-700 hover:bg-slate-100 dark:text-navy-100 dark:hover:bg-navy-600",
                )}
              >
                {y}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-slate-700 dark:text-navy-100">
          {label}
          {required && <span className="ml-0.5 text-error">*</span>}
        </label>
      )}

      <Popover.Root open={open} onOpenChange={handleOpenChange}>
        <Popover.Trigger
          disabled={disabled}
          className={cn(
            "form-input flex w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2 text-left text-sm text-slate-800",
            "dark:bg-navy-700 dark:text-navy-100",
            error
              ? "border-error focus:border-error focus:ring-1 focus:ring-error/30"
              : "border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary/30 dark:border-navy-500",
            disabled && "cursor-not-allowed opacity-60",
          )}
        >
          <span
            className={
              displayValue ? undefined : "text-slate-400 dark:text-navy-400"
            }
          >
            {displayValue || placeholder}
          </span>
          <CalendarIcon className="size-4 shrink-0 text-slate-400 dark:text-navy-400" />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Positioner sideOffset={6} align="start" className="z-100">
            <Popover.Popup className="w-72 rounded-lg border border-slate-200 bg-white p-3 shadow-lg outline-none dark:border-navy-600 dark:bg-navy-750">
              {mode === "date" && renderDayGrid()}
              {mode === "month" && renderMonthGrid()}
              {mode === "year" && renderYearGrid()}

              {mode === "datetime" && (
                <>
                  {renderDayGrid()}
                  <div className="mt-3 flex items-center gap-2 border-t border-slate-150 pt-3 dark:border-navy-600">
                    <input
                      type="time"
                      value={timeValue}
                      onChange={(e) => {
                        setTimeValue(e.target.value);
                        const datePart =
                          typeof value === "string"
                            ? value.split("T")[0]
                            : undefined;
                        if (datePart) onChange(`${datePart}T${e.target.value}`);
                      }}
                      className="form-input flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-navy-500 dark:bg-navy-700 dark:text-navy-100"
                    />
                    <Button size="sm" onClick={() => setOpen(false)}>
                      Apply
                    </Button>
                  </div>
                </>
              )}

              {mode === "range" && (
                <>
                  {renderDayGrid()}
                  <div className="mt-3 flex items-center justify-between border-t border-slate-150 pt-3 dark:border-navy-600">
                    <button
                      type="button"
                      onClick={() => {
                        setRangeStart(null);
                        setRangeEnd(null);
                        onChange(null);
                      }}
                      className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:text-navy-300"
                    >
                      <X className="size-3" /> Clear
                    </button>
                    <Button
                      size="sm"
                      disabled={!rangeStart || !rangeEnd}
                      onClick={() =>
                        rangeStart &&
                        rangeEnd &&
                        commitAndClose({ from: rangeStart, to: rangeEnd })
                      }
                    >
                      Apply Range
                    </Button>
                  </div>
                </>
              )}
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>

      {error && <p className="text-xs text-error">{error}</p>}
      {!error && hint && (
        <p className="text-xs text-slate-400 dark:text-navy-400">{hint}</p>
      )}
    </div>
  );
};
