import type { SelectOption } from "@/shared/ui";

export const STATE_OPTIONS: readonly (SelectOption<number> & {
  countryId: number;
})[] = [
  { countryId: 1, value: 1, label: "Gujarat" },
  { countryId: 1, value: 2, label: "Maharatshtra" },
] as const;
