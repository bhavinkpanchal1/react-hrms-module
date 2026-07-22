import type { LucideIcon } from "lucide-react";
import type { FieldPath, FieldValues } from "react-hook-form";

export type StepNavigationMode = "create" | "edit";
export type StepStatus = "completed" |"pending" | "current" | "error";

export interface StepDefinition <TFieldValues extends FieldValues = FieldValues>{
  key: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  fields?: FieldPath<TFieldValues>[];
}