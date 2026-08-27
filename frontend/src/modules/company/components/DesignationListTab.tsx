import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/shared/lib/get-error-message";
import { ConfirmationDialog, Modal, Select } from "@/shared/ui";
import { DesignationForm } from "./DesignationForm";
import { SimpleMasterList } from "./SimpleMasterList";
import { useDepartments } from "../hooks/useDepartments";
import {
  useCreateDesignation,
  useDeleteDesignation,
  useDesignations,
  useUpdateDesignation,
} from "../hooks/useDesignations";
import type { DesignationFormData } from "../schema/company.schema";
import type {
  CompanyEntityId,
  Designation,
} from "../types/company.types";

interface DesignationListTabProps {
  companyId: CompanyEntityId;
}

export const DesignationListTab = ({ companyId }: DesignationListTabProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState<CompanyEntityId | undefined>();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
  const [designationToDelete, setDesignationToDelete] = useState<Designation | null>(null);
  const pageSize = 5;

  const designationsQuery = useDesignations(companyId, {
    page,
    page_size: pageSize,
    search: search || undefined,
    department_id: departmentId,
  });
  const departmentsQuery = useDepartments(companyId, {
    page: 1,
    page_size: 100,
  });
  const createDesignation = useCreateDesignation(companyId);
  const updateDesignation = useUpdateDesignation(companyId);
  const deleteDesignation = useDeleteDesignation(companyId);
  const departments = useMemo(
    () => departmentsQuery.data?.items ?? [],
    [departmentsQuery.data?.items],
  );
  const departmentNames = useMemo(
    () => new Map(departments.map((department) => [department.id, department.name])),
    [departments],
  );

  const openCreate = () => {
    createDesignation.reset();
    updateDesignation.reset();
    setSelectedDesignation(null);
    setFormOpen(true);
  };

  const openEdit = (designation: Designation) => {
    createDesignation.reset();
    updateDesignation.reset();
    setSelectedDesignation(designation);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (createDesignation.isPending || updateDesignation.isPending) return;
    setSelectedDesignation(null);
    setFormOpen(false);
  };

  const submitDesignation = (data: DesignationFormData) => {
    if (selectedDesignation) {
      updateDesignation.mutate(
        { designationId: selectedDesignation.id, data },
        {
          onSuccess: () => {
            toast.success("Designation updated successfully");
            setSelectedDesignation(null);
            setFormOpen(false);
          },
        },
      );
      return;
    }
    createDesignation.mutate(data, {
      onSuccess: () => {
        toast.success("Designation created successfully");
        setPage(1);
        setFormOpen(false);
      },
    });
  };

  const confirmDelete = () => {
    if (!designationToDelete) return;
    deleteDesignation.mutate(designationToDelete.id, {
      onSuccess: () => {
        toast.success("Designation deleted successfully");
        if ((designationsQuery.data?.items.length ?? 0) === 1 && page > 1) {
          setPage(page - 1);
        }
        setDesignationToDelete(null);
      },
      onError: (error) =>
        toast.error(getErrorMessage(error, "Unable to delete designation")),
    });
  };

  const formError = selectedDesignation
    ? updateDesignation.error
    : createDesignation.error;

  return (
    <>
      <SimpleMasterList
        title="Designations"
        description="Manage Designation masters for this Company."
        singularLabel="Designation"
        items={designationsQuery.data?.items ?? []}
        total={designationsQuery.data?.total ?? 0}
        page={page}
        pageSize={pageSize}
        search={search}
        isLoading={designationsQuery.isLoading}
        isFetching={designationsQuery.isFetching}
        error={designationsQuery.error}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onPageChange={setPage}
        onRetry={() => designationsQuery.refetch()}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={(designation) => {
          deleteDesignation.reset();
          setDesignationToDelete(designation);
        }}
        filters={
          <Select
            aria-label="Filter designations by Department"
            placeholder="All Departments"
            options={departments.map((department) => ({
              value: department.id,
              label: department.name,
            }))}
            value={departmentId ?? ""}
            onChange={(event) => {
              setDepartmentId(
                event.target.value ? Number(event.target.value) : undefined,
              );
              setPage(1);
            }}
            disabled={departmentsQuery.isLoading || departmentsQuery.isError}
          />
        }
        secondaryContent={(designation) =>
          designation.department_id === null
            ? "No Department"
            : departmentNames.get(designation.department_id) ?? "Department unavailable"
        }
      />

      <Modal
        isOpen={formOpen}
        onClose={closeForm}
        title={selectedDesignation ? "Edit Designation" : "Add Designation"}
        size="sm"
      >
        <DesignationForm
          designation={selectedDesignation}
          departments={departments}
          departmentsLoading={departmentsQuery.isLoading}
          departmentsError={
            departmentsQuery.isError
              ? getErrorMessage(departmentsQuery.error, "Unable to load Departments")
              : undefined
          }
          onSubmit={submitDesignation}
          onCancel={closeForm}
          isSubmitting={createDesignation.isPending || updateDesignation.isPending}
          submissionError={
            formError
              ? getErrorMessage(formError, "Unable to save designation")
              : undefined
          }
        />
      </Modal>

      <ConfirmationDialog
        isOpen={Boolean(designationToDelete)}
        onCancel={() => {
          if (!deleteDesignation.isPending) setDesignationToDelete(null);
        }}
        title="Delete Designation"
        description={<>Delete <strong>{designationToDelete?.name}</strong>? This removes the Designation from the current mock session.</>}
        onConfirm={confirmDelete}
        isConfirming={deleteDesignation.isPending}
        error={deleteDesignation.error}
        errorFallback="Unable to delete designation"
        confirmLabel="Delete Designation"
      />
    </>
  );
};
