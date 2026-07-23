import type { SelectOption } from "@/shared/ui";

export const CITY_OPTIONS: readonly (SelectOption<number> & {
  stateValue: number;
})[] = [
  {
    value: 1,
    label: "Vadodara",
    stateValue: 1,
  },
  {
    value: 2,
    label: "Ahmedabad",
    stateValue: 1,
  },
  {
    value: 3,
    label: "Surat",
    stateValue: 1,
  },
  {
    value: 1,
    label: "Mumbai",
    stateValue: 2,
  },
  {
    value: 2,
    label: "Navi Mumbai",
    stateValue: 2,
  },
  {
    value: 3,
    label: "Palghar",
    stateValue: 2,
  },
] as const;