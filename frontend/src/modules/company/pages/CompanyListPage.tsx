import { useState } from "react";
import {
  AlertTriangle,
  Building2,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "@/shared/lib/get-error-message";
import {
  Badge,
  Button,
  ConfirmationDialog,
  Input,
  Modal,
  Pagination,
  Select,
  TableRowSkeleton,
} from "@/shared/ui";
import EmptyState from "@/shared/ui/empty-state/EmptyState";
import { CompanyForm } from "../components/CompanyForm";
import {
  useCompanies,
  useCreateCompany,
  useDeleteCompany,
  useUpdateCompany,
} from "../hooks/useCompanies";
import type { Company, EntityStatus } from "../types/company.types";
import type { CompanyFormData } from "../schema/company.schema";

const PAGE_SIZE_OPTIONS = [
  { value: "5", label: "5 per page" },
  { value: "10", label: "10 per page" },
  { value: "20", label: "20 per page" },
] as const;

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const CompanyListPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<EntityStatus | undefined>();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);

  const params = {
    page,
    page_size: pageSize,
    search: search || undefined,
    status,
  };
  const companiesQuery = useCompanies(params);
  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();
  const deleteCompany = useDeleteCompany();

  const result = companiesQuery.data;
  const companies = result?.items ?? [];
  const total = result?.total ?? 0;

  const openCreate = () => {
    createCompany.reset();
    updateCompany.reset();
    setSelectedCompany(null);
    setFormOpen(true);
  };

  const openEdit = (company: Company) => {
    createCompany.reset();
    updateCompany.reset();
    setSelectedCompany(company);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (createCompany.isPending || updateCompany.isPending) return;
    setFormOpen(false);
    setSelectedCompany(null);
  };

  const handleFormSubmit = (data: CompanyFormData) => {
    if (selectedCompany) {
      updateCompany.mutate(
        { id: selectedCompany.id, data },
        {
          onSuccess: (updatedCompany) => {
            toast.success("Company updated successfully");
            setSearch(updatedCompany.company_name);
            setStatus(undefined);
            setPage(1);
            setFormOpen(false);
            setSelectedCompany(null);
          },
        },
      );
      return;
    }

    createCompany.mutate(data, {
      onSuccess: (createdCompany) => {
        toast.success("Company created successfully");
        setSearch(createdCompany.company_name);
        setStatus(undefined);
        setPage(1);
        setFormOpen(false);
      },
    });
  };

  const requestDelete = (company: Company) => {
    deleteCompany.reset();
    setCompanyToDelete(company);
  };

  const closeDelete = () => {
    if (deleteCompany.isPending) return;
    setCompanyToDelete(null);
  };

  const confirmDelete = () => {
    if (!companyToDelete) return;
    deleteCompany.mutate(companyToDelete.id, {
      onSuccess: () => {
        toast.success("Company deleted successfully");
        if (companies.length === 1 && page > 1) setPage(page - 1);
        setCompanyToDelete(null);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error, "Unable to delete company"));
      },
    });
  };

  const clearFilters = () => {
    setSearch("");
    setStatus(undefined);
    setPage(1);
  };

  const formError = selectedCompany ? updateCompany.error : createCompany.error;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 dark:text-navy-100">
            Companies
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-navy-300">
            Manage Company records and organization-level configuration.
          </p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus className="size-4" />}>
          Add Company
        </Button>
      </div>

      <div className="card p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_12rem_10rem]">
          <Input
            aria-label="Search companies"
            placeholder="Search by company name"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            leftIcon={<Search className="size-4" />}
          />
          <Select
            aria-label="Filter companies by status"
            options={STATUS_OPTIONS}
            value={status ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              setStatus(value ? (value as EntityStatus) : undefined);
              setPage(1);
            }}
          />
          <Select
            aria-label="Companies per page"
            options={PAGE_SIZE_OPTIONS}
            value={String(pageSize)}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
          />
        </div>
      </div>

      {companiesQuery.isError ? (
        <div className="card items-center gap-3 border border-error/30 p-8 text-center">
          <AlertTriangle className="size-9 text-error" />
          <div>
            <h2 className="font-semibold text-slate-800 dark:text-navy-100">
              Unable to load companies
            </h2>
            <p className="mt-1 text-sm text-error">
              {getErrorMessage(companiesQuery.error, "Something went wrong")}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => companiesQuery.refetch()}
            leftIcon={<RotateCcw className="size-4" />}
            isLoading={companiesQuery.isFetching}
          >
            Retry
          </Button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="is-hoverable w-full text-sm">
              <thead>
                <tr className="border-b border-slate-150 dark:border-navy-600">
                  {[
                    "Company Name",
                    "Industry",
                    "Start Date",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-navy-300 ${heading === "Actions" ? "text-right" : "text-left"}`}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-600">
                {companiesQuery.isLoading ? (
                  Array.from({ length: pageSize }).map((_, index) => (
                    <TableRowSkeleton key={index} cols={5} />
                  ))
                ) : companies.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState
                        icon={Building2}
                        title="No companies found"
                        description={
                          search || status
                            ? "Try changing or clearing the current filters."
                            : "Create the first Company record to get started."
                        }
                        action={
                          search || status ? (
                            <Button variant="outline" onClick={clearFilters}>
                              Clear filters
                            </Button>
                          ) : (
                            <Button onClick={openCreate} leftIcon={<Plus className="size-4" />}>
                              Add Company
                            </Button>
                          )
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  companies.map((company) => (
                    <tr key={company.id}>
                      <td className="px-4 py-3 font-medium">
                        <button
                          type="button"
                          onClick={() => navigate(`/hr/companies/${company.id}`)}
                          className="text-left text-slate-800 hover:text-primary hover:underline dark:text-navy-100"
                        >
                          {company.company_name}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-navy-300">
                        {company.industry_type}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-500 dark:text-navy-400">
                        {formatDate(company.company_start_date)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          label={company.status === "active" ? "Active" : "Inactive"}
                          variant={company.status === "active" ? "success" : "default"}
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(company)}
                          leftIcon={<Pencil className="size-3.5" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-error hover:bg-error/10"
                          onClick={() => requestDelete(company)}
                          leftIcon={<Trash2 className="size-3.5" />}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!companiesQuery.isLoading && total > 0 && (
            <Pagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              disabled={companiesQuery.isFetching}
            />
          )}
        </div>
      )}

      <Modal
        isOpen={formOpen}
        onClose={closeForm}
        title={selectedCompany ? "Edit Company" : "Add Company"}
        size="lg"
      >
        <CompanyForm
          company={selectedCompany}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
          isSubmitting={createCompany.isPending || updateCompany.isPending}
          submissionError={
            formError
              ? getErrorMessage(formError, "Unable to save company")
              : undefined
          }
        />
      </Modal>

      <ConfirmationDialog
        isOpen={Boolean(companyToDelete)}
        onCancel={closeDelete}
        title="Delete Company"
        description={<>Delete <strong>{companyToDelete?.company_name}</strong>? This action cannot be undone in the current mock session.</>}
        onConfirm={confirmDelete}
        isConfirming={deleteCompany.isPending}
        error={deleteCompany.error}
        errorFallback="Unable to delete company"
        confirmLabel="Delete Company"
      />
    </div>
  );
};

export default CompanyListPage;
