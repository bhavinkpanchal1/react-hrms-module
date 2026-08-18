import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Textarea } from "@/shared/ui";
import { policySchema, type PolicyFormData } from "../schema/company.schema";

interface PolicyFormProps {
  onSubmit: (data: PolicyFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submissionError?: string;
}

export const PolicyForm = ({
  onSubmit,
  onCancel,
  isSubmitting,
  submissionError,
}: PolicyFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PolicyFormData>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      policy_name: "",
      description: "",
      file: undefined,
    },
  });
  const selectedFile = useWatch({ control, name: "file" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Input
        label="Policy Name"
        required
        error={errors.policy_name?.message}
        {...register("policy_name")}
      />
      <Textarea
        label="Description"
        error={errors.description?.message}
        {...register("description")}
      />
      <Controller
        control={control}
        name="file"
        render={({ field: { onChange, ref }, fieldState }) => (
          <Input
            ref={ref}
            type="file"
            label="Policy File"
            required
            error={fieldState.error?.message}
            onChange={(event) => onChange(event.target.files?.[0])}
          />
        )}
      />
      {selectedFile && (
        <p className="text-xs text-slate-500 dark:text-navy-300">
          Selected: {selectedFile.name}
        </p>
      )}
      {submissionError && (
        <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {submissionError}
        </div>
      )}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Upload Policy
        </Button>
      </div>
    </form>
  );
};
