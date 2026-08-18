import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@/shared/ui";
import {
  assetTypeSchema,
  type AssetTypeFormData,
} from "../schema/company.schema";
import type { AssetType } from "../types/company.types";

interface AssetTypeFormProps {
  assetType?: AssetType | null;
  onSubmit: (data: AssetTypeFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submissionError?: string;
}

export const AssetTypeForm = ({
  assetType,
  onSubmit,
  onCancel,
  isSubmitting,
  submissionError,
}: AssetTypeFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssetTypeFormData>({
    resolver: zodResolver(assetTypeSchema),
    defaultValues: { name: assetType?.name ?? "" },
  });

  useEffect(() => {
    reset({ name: assetType?.name ?? "" });
  }, [assetType, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        label="Asset Type Name"
        required
        error={errors.name?.message}
        {...register("name")}
      />
      {submissionError && (
        <div className="mt-5 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {submissionError}
        </div>
      )}
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {assetType ? "Update Asset Type" : "Create Asset Type"}
        </Button>
      </div>
    </form>
  );
};
