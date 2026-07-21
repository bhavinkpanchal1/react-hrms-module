import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Textarea, DatePicker } from "@/shared/ui";
import { offerSchema, type OfferFormData } from "../schema/offer.schema";

interface OfferFormProps {
  onSubmit: (data: OfferFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const OfferForm = ({ onSubmit, onCancel, isSubmitting }: OfferFormProps) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema) as Resolver<OfferFormData>,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          type="number"
          label="Offered Salary (Annual)"
          required
          min={0}
          placeholder="600000"
          error={errors.offered_salary?.message}
          {...register("offered_salary", { valueAsNumber: true })}
        />
        <Controller
          control={control}
          name="joining_date"
          render={({ field, fieldState }) => (
            <DatePicker
              mode="date"
              label="Joining Date"
              required
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="expires_at"
          render={({ field, fieldState }) => (
            <DatePicker
              mode="date"
              label="Offer Expires On"
              hint="Leave blank for no deadline"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
        <div className="sm:col-span-2">
          <Textarea
            label="Notes"
            rows={3}
            placeholder="Any terms or conditions to note internally..."
            error={errors.notes?.message}
            {...register("notes")}
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="secondary" size="md" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>Send Offer</Button>
      </div>
    </form>
  );
};
