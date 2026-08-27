import { useState } from "react";
import {
  AlertTriangle,
  GitBranch,
  MapPin,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
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
import { BranchForm } from "./BranchForm";
import {
  useBranches,
  useCreateBranch,
  useDeleteBranch,
  useUpdateBranch,
} from "../hooks/useBranches";
import type { Branch, CompanyEntityId, EntityStatus } from "../types/company.types";
import type { BranchFormData } from "../schema/company.schema";

interface BranchListTabProps {
  companyId: CompanyEntityId;
}

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;

export const BranchListTab = ({ companyId }: BranchListTabProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<EntityStatus | undefined>();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);
  const pageSize = 5;

  const branchesQuery = useBranches(companyId, {
    page,
    page_size: pageSize,
    search: search || undefined,
    status,
  });
  const createBranch = useCreateBranch(companyId);
  const updateBranch = useUpdateBranch(companyId);
  const deleteBranch = useDeleteBranch(companyId);
  const branches = branchesQuery.data?.items ?? [];
  const total = branchesQuery.data?.total ?? 0;

  const openCreate = () => {
    createBranch.reset();
    updateBranch.reset();
    setSelectedBranch(null);
    setFormOpen(true);
  };

  const openEdit = (branch: Branch) => {
    createBranch.reset();
    updateBranch.reset();
    setSelectedBranch(branch);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (createBranch.isPending || updateBranch.isPending) return;
    setFormOpen(false);
    setSelectedBranch(null);
  };

  const submitBranch = (data: BranchFormData) => {
    if (selectedBranch) {
      updateBranch.mutate(
        { branchId: selectedBranch.id, data },
        {
          onSuccess: () => {
            toast.success("Branch updated successfully");
            setFormOpen(false);
            setSelectedBranch(null);
          },
        },
      );
      return;
    }
    createBranch.mutate(data, {
      onSuccess: () => {
        toast.success("Branch created successfully");
        setPage(1);
        setFormOpen(false);
      },
    });
  };

  const confirmDelete = () => {
    if (!branchToDelete) return;
    deleteBranch.mutate(branchToDelete.id, {
      onSuccess: () => {
        toast.success("Branch deleted successfully");
        if (branches.length === 1 && page > 1) setPage(page - 1);
        setBranchToDelete(null);
      },
      onError: (error) =>
        toast.error(getErrorMessage(error, "Unable to delete branch")),
    });
  };

  const formError = selectedBranch ? updateBranch.error : createBranch.error;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-800 dark:text-navy-100">Branches</h2>
          <p className="text-sm text-slate-500 dark:text-navy-300">
            Manage Company work locations and their geofence configuration.
          </p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus className="size-4" />}>
          Add Branch
        </Button>
      </div>

      <div className="card p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
          <Input
            aria-label="Search branches"
            placeholder="Search name, address or contact"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            leftIcon={<Search className="size-4" />}
          />
          <Select
            aria-label="Filter branches by status"
            options={STATUS_OPTIONS}
            value={status ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              setStatus(value ? (value as EntityStatus) : undefined);
              setPage(1);
            }}
          />
        </div>
      </div>

      {branchesQuery.isError ? (
        <div className="card flex flex-col items-center gap-3 border border-error/30 p-8 text-center">
          <AlertTriangle className="size-9 text-error" />
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-navy-100">
              Unable to load branches
            </h3>
            <p className="mt-1 text-sm text-error">
              {getErrorMessage(branchesQuery.error, "Something went wrong")}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => branchesQuery.refetch()}
            leftIcon={<RotateCcw className="size-4" />}
            isLoading={branchesQuery.isFetching}
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
                  {["Branch Name", "Location", "Contact", "Employee ID Series", "Status", "Actions"].map((heading) => (
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
                {branchesQuery.isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRowSkeleton key={index} cols={6} />
                  ))
                ) : branches.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState
                        icon={GitBranch}
                        title="No branches found"
                        description={
                          search || status
                            ? "Try changing or clearing the current filters."
                            : "Add the first Branch work location for this Company."
                        }
                        action={
                          search || status ? (
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSearch("");
                                setStatus(undefined);
                                setPage(1);
                              }}
                            >
                              Clear filters
                            </Button>
                          ) : (
                            <Button onClick={openCreate} leftIcon={<Plus className="size-4" />}>
                              Add Branch
                            </Button>
                          )
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  branches.map((branch) => (
                    <tr key={branch.id}>
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-navy-100">
                        <div>{branch.branch_name}</div>
                        <div className="mt-1 text-xs font-normal text-slate-400">
                          {branch.latitude}, {branch.longitude} · {branch.radius_meters} m
                        </div>
                      </td>
                      <td className="min-w-64 px-4 py-3 text-slate-600 dark:text-navy-300">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="mt-0.5 size-3.5 shrink-0" />
                          <span>{branch.address} – {branch.pincode}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-navy-300">
                        <div>{branch.email}</div>
                        <div className="text-xs text-slate-400">{branch.contact_number}</div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-navy-300">
                        {branch.employee_id_series}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          label={branch.status === "active" ? "Active" : "Inactive"}
                          variant={branch.status === "active" ? "success" : "default"}
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(branch)}
                          leftIcon={<Pencil className="size-3.5" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-error hover:bg-error/10"
                          onClick={() => {
                            deleteBranch.reset();
                            setBranchToDelete(branch);
                          }}
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
          {!branchesQuery.isLoading && total > 0 && (
            <Pagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              disabled={branchesQuery.isFetching}
            />
          )}
        </div>
      )}

      <Modal
        isOpen={formOpen}
        onClose={closeForm}
        title={selectedBranch ? "Edit Branch" : "Add Branch"}
        size="xl"
      >
        <BranchForm
          branch={selectedBranch}
          onSubmit={submitBranch}
          onCancel={closeForm}
          isSubmitting={createBranch.isPending || updateBranch.isPending}
          submissionError={
            formError
              ? getErrorMessage(formError, "Unable to save branch")
              : undefined
          }
        />
      </Modal>

      <ConfirmationDialog
        isOpen={Boolean(branchToDelete)}
        onCancel={() => {
          if (!deleteBranch.isPending) setBranchToDelete(null);
        }}
        title="Delete Branch"
        description={<>Delete <strong>{branchToDelete?.branch_name}</strong>? This removes the Branch from the current mock session.</>}
        onConfirm={confirmDelete}
        isConfirming={deleteBranch.isPending}
        error={deleteBranch.error}
        errorFallback="Unable to delete branch"
        confirmLabel="Delete Branch"
      />
    </div>
  );
};
