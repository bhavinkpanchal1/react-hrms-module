import { useEffect, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Badge, Button, Checkbox, DatePicker, Input, Select } from "@/shared/ui";
import { useUpdateCompany } from "../hooks/useCompanies";
import {
  companyOverviewSchema,
  type CompanyOverviewFormData,
} from "../schema/company.schema";
import type { Company } from "../types/company.types";

interface CompanyOverviewTabProps {
  company: Company;
}

interface OverviewSectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

const emptyAddress = {
  address_line_1: "",
  address_line_2: "",
  country: "",
  state: "",
  city: "",
  pincode: "",
};

const getFormValues = (company: Company): CompanyOverviewFormData => ({
  company_name: company.company_name,
  industry_type: company.industry_type,
  company_start_date: company.company_start_date,
  status: company.status,
  contact_email: company.contact_email ?? "",
  contact_number: company.contact_number ?? "",
  website: company.website ?? "",
  smtp: company.smtp ?? {
    host: "",
    port: 0,
    username: "",
    from_email: "",
    use_tls: false,
    password_configured: false,
  },
  registered_office: company.registered_office ?? { ...emptyAddress },
  corporate_office: company.corporate_office ?? { ...emptyAddress },
  bank_information: company.bank_information ?? {
    bank_name: "",
    branch_name: "",
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
  },
});

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unable to update company";

const OverviewSection = ({ title, description, children }: OverviewSectionProps) => (
  <section className="card p-4 sm:p-5">
    <div className="mb-4 border-b border-slate-150 pb-3 dark:border-navy-600">
      <h2 className="font-semibold text-slate-800 dark:text-navy-100">{title}</h2>
      <p className="mt-0.5 text-xs text-slate-500 dark:text-navy-300">
        {description}
      </p>
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
  </section>
);

export const CompanyOverviewTab = ({ company }: CompanyOverviewTabProps) => {
  const updateCompany = useUpdateCompany();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CompanyOverviewFormData>({
    resolver: zodResolver(companyOverviewSchema),
    defaultValues: getFormValues(company),
  });

  useEffect(() => {
    reset(getFormValues(company));
  }, [company, reset]);

  const onSubmit = (data: CompanyOverviewFormData) => {
    updateCompany.mutate(
      { id: company.id, data },
      {
        onSuccess: (updatedCompany) => {
          reset(getFormValues(updatedCompany));
          toast.success("Company overview updated successfully");
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <OverviewSection
        title="Company Information"
        description="Core identity and operating status for this Company."
      >
        <Input
          label="Company Name"
          required
          error={errors.company_name?.message}
          {...register("company_name")}
        />
        <Input
          label="Industry Type"
          required
          error={errors.industry_type?.message}
          {...register("industry_type")}
        />
        <Controller
          control={control}
          name="company_start_date"
          render={({ field, fieldState }) => (
            <DatePicker
              label="Company Start Date"
              required
              value={field.value}
              onChange={(value) => field.onChange(typeof value === "string" ? value : "")}
              error={fieldState.error?.message}
            />
          )}
        />
        <Select
          label="Status"
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
          error={errors.status?.message}
          {...register("status")}
        />
      </OverviewSection>

      <OverviewSection
        title="Contact Information"
        description="Public contact details used for Company communication."
      >
        <Input label="Contact Email" type="email" {...register("contact_email")} />
        <Input label="Contact Number" {...register("contact_number")} />
        <Input label="Website" type="url" className="md:col-span-2" {...register("website")} />
      </OverviewSection>

      <OverviewSection
        title="Email Configuration"
        description="Non-secret SMTP settings. Password values are never displayed or stored here."
      >
        <Input label="SMTP Host" {...register("smtp.host")} />
        <Input
          label="SMTP Port"
          type="number"
          min={0}
          error={errors.smtp?.port?.message}
          {...register("smtp.port", { valueAsNumber: true })}
        />
        <Input label="SMTP Username" {...register("smtp.username")} />
        <Input label="From Email" type="email" {...register("smtp.from_email")} />
        <Checkbox label="Use TLS" {...register("smtp.use_tls")} />
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-700 dark:text-navy-100">
            SMTP Password
          </span>
          <div>
            <Badge
              label={company.smtp?.password_configured ? "Configured" : "Not configured"}
              variant={company.smtp?.password_configured ? "success" : "default"}
            />
          </div>
        </div>
      </OverviewSection>

      <OverviewSection
        title="Registered Office"
        description="The Company's registered address. Location values remain free text until the backend contract is confirmed."
      >
        <Input label="Address Line 1" {...register("registered_office.address_line_1")} />
        <Input label="Address Line 2" {...register("registered_office.address_line_2")} />
        <Input label="Country" {...register("registered_office.country")} />
        <Input label="State" {...register("registered_office.state")} />
        <Input label="City" {...register("registered_office.city")} />
        <Input label="Pincode" {...register("registered_office.pincode")} />
      </OverviewSection>

      <OverviewSection
        title="Corporate Office"
        description="The Company's primary corporate operating address."
      >
        <Input label="Address Line 1" {...register("corporate_office.address_line_1")} />
        <Input label="Address Line 2" {...register("corporate_office.address_line_2")} />
        <Input label="Country" {...register("corporate_office.country")} />
        <Input label="State" {...register("corporate_office.state")} />
        <Input label="City" {...register("corporate_office.city")} />
        <Input label="Pincode" {...register("corporate_office.pincode")} />
      </OverviewSection>

      <OverviewSection
        title="Bank Information"
        description="Company bank account details from the approved frontend mock contract."
      >
        <Input label="Bank Name" {...register("bank_information.bank_name")} />
        <Input label="Branch Name" {...register("bank_information.branch_name")} />
        <Input label="Account Holder Name" {...register("bank_information.account_holder_name")} />
        <Input label="Account Number" {...register("bank_information.account_number")} />
        <Input label="IFSC Code" {...register("bank_information.ifsc_code")} />
      </OverviewSection>

      {updateCompany.error && (
        <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {getErrorMessage(updateCompany.error)}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" isLoading={updateCompany.isPending} disabled={!isDirty}>
          Save Overview
        </Button>
      </div>
    </form>
  );
};
