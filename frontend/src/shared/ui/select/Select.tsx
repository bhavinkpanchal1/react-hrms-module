import { forwardRef, useState, type SelectHTMLAttributes } from "react";
import { Combobox } from "@base-ui/react/combobox";
import { Check, ChevronDown, Loader2, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export type SelectMode =
  | "single"
  | "searchable"
  | "multiple"
  | "async"
  | "grouped";

export interface SelectOption<T = string | number> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SelectOptionGroup<T = string | number> {
  label: string;
  options: SelectOption<T>[];
}

// ─── mode: 'single' — plain native <select> ───────────────────────────────
// Unchanged contract from the original Select.tsx: forwardRef + spread
// props, so {...register('field')} keeps working exactly as before —
// register's event-based onChange and real ref both need to reach the
// actual DOM <select>, which only a native element (not a Combobox
// wrapper) can do without extra plumbing.
export interface NativeSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: readonly SelectOption[];
  placeholder?: string;
}

const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  (
    { label, error, hint, options, placeholder, required, className, ...props },
    ref,
  ) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-slate-700 dark:text-navy-100">
          {label}
          {required && <span className="ml-0.5 text-error">*</span>}
        </label>
      )}
      <select
        ref={ref}
        {...props}
        className={cn(
          "form-input w-full cursor-pointer rounded-lg border bg-white px-3 py-2 text-sm text-slate-800",
          "dark:bg-navy-700 dark:text-navy-100",
          error
            ? "border-error focus:border-error focus:ring-1 focus:ring-error/30"
            : "border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary/30 dark:border-navy-500",
          className,
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={String(o.value)} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-error">{error}</p>}
      {!error && hint && (
        <p className="text-xs text-slate-400 dark:text-navy-400">{hint}</p>
      )}
    </div>
  ),
);
NativeSelect.displayName = "NativeSelect";

// ─── modes: 'searchable' | 'multiple' | 'async' | 'grouped' ───────────────
// One Combobox-based implementation shared across all four — they differ
// only in a few booleans (multiple selection, grouping, external/async
// data), not in the underlying interaction model. All four are CONTROLLED
// (value / onChange(value)) — use these with RHF's <Controller>, same
// pattern as DatePicker, not with register().

type ComboboxValue = string | number;

interface ComboboxSelectProps<T extends ComboboxValue = ComboboxValue> {
  mode: "searchable" | "multiple" | "async" | "grouped";
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;

  options?: readonly SelectOption<T>[]; // searchable / multiple / async
  groups?: readonly SelectOptionGroup<T>[]; // grouped

  value?: T | T[] | null;
  onChange: (value: T | T[] | null) => void;

  // async — caller owns fetching/debouncing; this just renders whatever is
  // passed and shows a loading row. Internal client-side filtering is
  // disabled here since results are assumed already filtered server-side.
  onSearch?: (query: string) => void;
  isLoading?: boolean;
}

const labelFor = (opts: readonly SelectOption[], v: ComboboxValue) =>
  opts.find((o) => o.value === v)?.label ?? String(v);

function ComboboxSelect<T extends ComboboxValue = ComboboxValue>({
  mode,
  label,
  error,
  hint,
  required,
  placeholder = "Select...",
  disabled,
  className,
  options = [],
  groups = [],
  value,
  onChange,
  onSearch,
  isLoading,
}: ComboboxSelectProps<T>) {
  const [query, setQuery] = useState("");

  const isMultiple = mode === "multiple";
  const isGrouped = mode === "grouped";
  const isAsync = mode === "async";

  const flatOptions: readonly SelectOption<T>[] = isGrouped
    ? groups.flatMap((g) => g.options)
    : options;

  console.log("Current value:", value);
  console.log("Current value type:", typeof value);

  flatOptions.forEach((o) => console.log(o.value, typeof o.value));
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label className="text-xs font-medium text-slate-700 dark:text-navy-100">
          {label}
          {required && <span className="ml-0.5 text-error">*</span>}
        </label>
      )}

      <Combobox.Root<T, boolean>
        multiple={isMultiple}
        value={value ?? (isMultiple ? [] : null)}
        onValueChange={(v) => onChange(v as T | T[] | null)}
        items={
          isGrouped
            ? groups.map((g) => ({ label: g.label, items: g.options }))
            : flatOptions
        }
        itemToStringLabel={(item: SelectOption<T>) => item?.label ?? ""}
        isItemEqualToValue={(item: SelectOption<T>, v: T) => item?.value === v}
        filter={isAsync ? null : undefined}
        onInputValueChange={(v) => {
          setQuery(v);
          if (isAsync) onSearch?.(v);
        }}
        disabled={disabled}
      >
        <Combobox.InputGroup
          className={cn(
            "form-input flex w-full flex-wrap items-center gap-1 rounded-lg border bg-white px-3 py-2 text-sm text-slate-800",
            "dark:bg-navy-700 dark:text-navy-100",
            error
              ? "border-error focus-within:border-error focus-within:ring-1 focus-within:ring-error/30"
              : "border-slate-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 dark:border-navy-500",
            disabled && "cursor-not-allowed opacity-60",
          )}
        >
          {isMultiple && Array.isArray(value) && value.length > 0 && (
            <Combobox.Chips className="flex flex-wrap gap-1">
              {value.map((v) => (
                <Combobox.Chip
                  key={String(v)}
                  className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                >
                  {labelFor(flatOptions as readonly SelectOption[], v)}
                  <Combobox.ChipRemove
                    className="rounded-full hover:bg-primary/20"
                    onClick={() =>
                      onChange((value as T[]).filter((x) => x !== v))
                    }
                  >
                    <X className="size-3" />
                  </Combobox.ChipRemove>
                </Combobox.Chip>
              ))}
            </Combobox.Chips>
          )}
          <Combobox.Input
            value={
              isMultiple
                ? ""
                : value != null
                  ? labelFor(flatOptions as readonly SelectOption[], value as T)
                  : ""
            }
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400 dark:placeholder:text-navy-400"
          />
          {isLoading ? (
            <Loader2 className="size-4 shrink-0 animate-spin text-slate-400" />
          ) : (
            <ChevronDown className="size-4 shrink-0 text-slate-400" />
          )}
        </Combobox.InputGroup>

        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4} align="start" className="z-[100]">
            <Combobox.Popup className="max-h-64 w-(--anchor-width) overflow-y-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg outline-none dark:border-navy-600 dark:bg-navy-750">
              <Combobox.Empty className="px-3 py-4 text-center text-sm text-slate-400 dark:text-navy-400">
                {isAsync && isLoading
                  ? "Searching..."
                  : query
                    ? "No results found"
                    : "No options"}
              </Combobox.Empty>

              {isGrouped ? (
                <Combobox.Collection>
                  {(group: { label: string; items: SelectOption<T>[] }) => (
                    <Combobox.Group key={group.label} items={group.items}>
                      <Combobox.GroupLabel className="px-2 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-navy-400">
                        {group.label}
                      </Combobox.GroupLabel>
                      <Combobox.Collection>
                        {(item: SelectOption<T>) => (
                          <Combobox.Item
                            key={String(item.value)}
                            value={item.value}
                            disabled={item.disabled}
                            className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm text-slate-700 data-[highlighted]:bg-primary/10 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 dark:text-navy-100"
                          >
                            {item.label}
                            <Combobox.ItemIndicator>
                              <Check className="size-3.5 text-primary" />
                            </Combobox.ItemIndicator>
                          </Combobox.Item>
                        )}
                      </Combobox.Collection>
                    </Combobox.Group>
                  )}
                </Combobox.Collection>
              ) : (
                <Combobox.List>
                  {(item: SelectOption<T>) => (
                    <Combobox.Item
                      key={String(item.value)}
                      value={item.value}
                      disabled={item.disabled}
                      className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm text-slate-700 data-[highlighted]:bg-primary/10 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 dark:text-navy-100"
                    >
                      {item.label}
                      <Combobox.ItemIndicator>
                        <Check className="size-3.5 text-primary" />
                      </Combobox.ItemIndicator>
                    </Combobox.Item>
                  )}
                </Combobox.List>
              )}
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>

      {error && <p className="text-xs text-error">{error}</p>}
      {!error && hint && (
        <p className="text-xs text-slate-400 dark:text-navy-400">{hint}</p>
      )}
    </div>
  );
}

// ─── Public API — one component, mode picks the contract ──────────────────
// mode="single" (default): behaves exactly like the original Select.tsx —
//   pass DOM/register() props via spread, forwardRef works, use with
//   {...register('field')}.
// mode="searchable" | "multiple" | "async" | "grouped": controlled —
//   pass value / onChange(value), use with RHF's <Controller>.

export type SelectProps<T extends ComboboxValue = ComboboxValue> =
  | ({ mode?: "single" } & NativeSelectProps)
  | ({
      mode: "searchable" | "multiple" | "async" | "grouped";
    } & ComboboxSelectProps<T>);

function SelectImpl<T extends ComboboxValue = ComboboxValue>(
  props: SelectProps<T>,
  ref: React.Ref<HTMLSelectElement>,
) {
  if (!props.mode || props.mode === "single") {
    const { mode: _mode, ...rest } = props;
    return <NativeSelect ref={ref} {...(rest as NativeSelectProps)} />;
  }
  const { mode: _mode, ...rest } = props;
  return <ComboboxSelect {...(rest as ComboboxSelectProps<T>)} />;
}

export const Select = forwardRef(SelectImpl) as (<
  T extends ComboboxValue = ComboboxValue,
>(
  props: SelectProps<T> & { ref?: React.Ref<HTMLSelectElement> },
) => React.ReactElement) & { displayName?: string };

Select.displayName = "Select";



// how to use

/**
 * // searchable — single select, type to filter
<Controller control={control} name="jobId" render={({ field, fieldState }) => (
  <Select mode="searchable" label="Applying For" options={jobOptions}
    value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
)} />

// multiple — chips + type to filter (this is what replaces the skills/
// certifications CSV-in-a-Textarea workaround)
<Controller control={control} name="skills" render={({ field, fieldState }) => (
  <Select mode="multiple" label="Skills" options={skillOptions}
    value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
)} />

// grouped
<Select mode="grouped" label="Job" groups={[
  { label: "Engineering", options: [...] },
  { label: "Product", options: [...] },
]} value={value} onChange={onChange} />

// async — you own the fetching/debouncing, Select just renders what you give it
<Select mode="async" label="Employee" options={searchResults}
  isLoading={isFetching} onSearch={(q) => debouncedFetch(q)}
  value={value} onChange={onChange} />
 */