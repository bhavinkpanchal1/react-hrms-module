import { useState } from "react";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/shared/lib/get-error-message";
import { ConfirmationDialog, Modal } from "@/shared/ui";
import { DepartmentForm } from "./DepartmentForm";
import { SimpleMasterList } from "./SimpleMasterList";
import {
  useCreateDepartment,
  useDeleteDepartment,
  useDepartments,
  useUpdateDepartment,
} from "../hooks/useDepartments";
import type { DepartmentFormData } from "../schema/company.schema";
import type { CompanyEntityId, Department } from "../types/company.types";

interface DepartmentListTabProps {
  companyId: CompanyEntityId;
}

export const DepartmentListTab = ({ companyId }: DepartmentListTabProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
  const pageSize = 5;

  const departmentsQuery = useDepartments(companyId, {
    page,
    page_size: pageSize,
    search: search || undefined,
  });
  const createDepartment = useCreateDepartment(companyId);
  const updateDepartment = useUpdateDepartment(companyId);
  const deleteDepartment = useDeleteDepartment(companyId);

  const openCreate = () => {
    createDepartment.reset();
    updateDepartment.reset();
    setSelectedDepartment(null);
    setFormOpen(true);
  };

  const openEdit = (department: Department) => {
    createDepartment.reset();
    updateDepartment.reset();
    setSelectedDepartment(department);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (createDepartment.isPending || updateDepartment.isPending) return;
    setSelectedDepartment(null);
    setFormOpen(false);
  };

  const submitDepartment = (data: DepartmentFormData) => {
    if (selectedDepartment) {
      updateDepartment.mutate(
        { departmentId: selectedDepartment.id, data },
        {
          onSuccess: () => {
            toast.success("Department updated successfully");
            setSelectedDepartment(null);
            setFormOpen(false);
          },
        },
      );
      return;
    }
    createDepartment.mutate(data, {
      onSuccess: () => {
        toast.success("Department created successfully");
        setPage(1);
        setFormOpen(false);
      },
    });
  };

  const confirmDelete = () => {
    if (!departmentToDelete) return;
    deleteDepartment.mutate(departmentToDelete.id, {
      onSuccess: () => {
        toast.success("Department deleted successfully");
        if ((departmentsQuery.data?.items.length ?? 0) === 1 && page > 1) {
          setPage(page - 1);
        }
        setDepartmentToDelete(null);
      },
      onError: (error) =>
        toast.error(getErrorMessage(error, "Unable to delete department")),
    });
  };

  const formError = selectedDepartment
    ? updateDepartment.error
    : createDepartment.error;

  return (
    <>
      <SimpleMasterList
        title="Departments"
        description="Manage Department masters for this Company."
        singularLabel="Department"
        items={departmentsQuery.data?.items ?? []}
        total={departmentsQuery.data?.total ?? 0}
        page={page}
        pageSize={pageSize}
        search={search}
        isLoading={departmentsQuery.isLoading}
        isFetching={departmentsQuery.isFetching}
        error={departmentsQuery.error}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onPageChange={setPage}
        onRetry={() => departmentsQuery.refetch()}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={(department) => {
          deleteDepartment.reset();
          setDepartmentToDelete(department);
        }}
      />

      <Modal
        isOpen={formOpen}
        onClose={closeForm}
        title={selectedDepartment ? "Edit Department" : "Add Department"}
        size="sm"
      >
        <DepartmentForm
          department={selectedDepartment}
          onSubmit={submitDepartment}
          onCancel={closeForm}
          isSubmitting={createDepartment.isPending || updateDepartment.isPending}
          submissionError={
            formError
              ? getErrorMessage(formError, "Unable to save department")
              : undefined
          }
        />
      </Modal>

      <ConfirmationDialog
        isOpen={Boolean(departmentToDelete)}
        onCancel={() => {
          if (!deleteDepartment.isPending) setDepartmentToDelete(null);
        }}
        title="Delete Department"
        description={<>Delete <strong>{departmentToDelete?.name}</strong>? This removes the Department from the current mock session.</>}
        onConfirm={confirmDelete}
        isConfirming={deleteDepartment.isPending}
        error={deleteDepartment.error}
        errorFallback="Unable to delete department"
        confirmLabel="Delete Department"
      />
    </>
  );
};
