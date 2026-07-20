import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Textarea } from "@/shared/ui";
import { offerSchema, type OfferFormData } from "../schema/offer.schema";

interface OfferFormProps {
  onSubmit: (data: OfferFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const OfferForm = ({ onSubmit, onCancel, isSubmitting }: OfferFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          type="number"
          label="Offered Salary (Annual)"
          required
          placeholder="600000"
          error={errors.offered_salary?.message}
          {...register("offered_salary", { valueAsNumber: true })}
        />
        <Input
          type="date"
          label="Joining Date"
          required
          error={errors.joining_date?.message}
          {...register("joining_date")}
        />
        <Input
          type="date"
          label="Offer Expires On"
          hint="Leave blank for no deadline"
          error={errors.expires_at?.message}
          {...register("expires_at")}
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