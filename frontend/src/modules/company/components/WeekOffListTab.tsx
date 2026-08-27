import { useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/shared/lib/get-error-message";
import { Badge, Button, ConfirmationDialog, Modal, TableRowSkeleton } from "@/shared/ui";
import EmptyState from "@/shared/ui/empty-state/EmptyState";
import { WeekOffForm } from "./WeekOffForm";
import {
  useCreateWeekOff,
  useDeleteWeekOff,
  useUpdateWeekOff,
  useWeekOffs,
} from "../hooks/useWeekOffs";
import type { WeekOffFormData } from "../schema/company.schema";
import type { CompanyEntityId, WeekOff } from "../types/company.types";

interface WeekOffListTabProps {
  companyId: CompanyEntityId;
}

export const WeekOffListTab = ({ companyId }: WeekOffListTabProps) => {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedWeekOff, setSelectedWeekOff] = useState<WeekOff | null>(null);
  const [weekOffToDelete, setWeekOffToDelete] = useState<WeekOff | null>(null);
  const weekOffsQuery = useWeekOffs(companyId);
  const createWeekOff = useCreateWeekOff(companyId);
  const updateWeekOff = useUpdateWeekOff(companyId);
  const deleteWeekOff = useDeleteWeekOff(companyId);

  const openCreate = () => {
    createWeekOff.reset();
    updateWeekOff.reset();
    setSelectedWeekOff(null);
    setFormOpen(true);
  };

  const openEdit = (weekOff: WeekOff) => {
    createWeekOff.reset();
    updateWeekOff.reset();
    setSelectedWeekOff(weekOff);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (createWeekOff.isPending || updateWeekOff.isPending) return;
    setSelectedWeekOff(null);
    setFormOpen(false);
  };

  const submitWeekOff = (data: WeekOffFormData) => {
    if (selectedWeekOff) {
      updateWeekOff.mutate(
        { weekOffId: selectedWeekOff.id, data },
        {
          onSuccess: () => {
            toast.success("Week Off policy updated successfully");
            setSelectedWeekOff(null);
            setFormOpen(false);
          },
        },
      );
      return;
    }
    createWeekOff.mutate(data, {
      onSuccess: () => {
        toast.success("Week Off policy created successfully");
        setFormOpen(false);
      },
    });
  };

  const confirmDelete = () => {
    if (!weekOffToDelete) return;
    deleteWeekOff.mutate(weekOffToDelete.id, {
      onSuccess: () => {
        toast.success("Week Off policy deleted successfully");
        setWeekOffToDelete(null);
      },
      onError: (error) =>
        toast.error(getErrorMessage(error, "Unable to delete Week Off policy")),
    });
  };

  const formError = selectedWeekOff ? updateWeekOff.error : createWeekOff.error;
  const weekOffs = weekOffsQuery.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-800 dark:text-navy-100">
            Week Off Policies
          </h2>
          <p className="text-sm text-slate-500 dark:text-navy-300">
            Configure monthly weekday occurrence patterns for this Company.
          </p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus className="size-4" />}>
          Add Week Off
        </Button>
      </div>

      {weekOffsQuery.isError ? (
        <div className="card flex flex-col items-center gap-3 border border-error/30 p-8 text-center">
          <AlertTriangle className="size-9 text-error" />
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-navy-100">
              Unable to load Week Off policies
            </h3>
            <p className="mt-1 text-sm text-error">
              {getErrorMessage(weekOffsQuery.error, "Something went wrong")}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => weekOffsQuery.refetch()}
            leftIcon={<RotateCcw className="size-4" />}
            isLoading={weekOffsQuery.isFetching}
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
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-navy-300">
                    Policy Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-navy-300">
                    Grid Summary
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-navy-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-600">
                {weekOffsQuery.isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRowSkeleton key={index} cols={3} />
                  ))
                ) : weekOffs.length === 0 ? (
                  <tr>
                    <td colSpan={3}>
                      <EmptyState
                        icon={CalendarDays}
                        title="No Week Off policies found"
                        description="Add the first Week Off grid for this Company."
                        action={
                          <Button onClick={openCreate} leftIcon={<Plus className="size-4" />}>
                            Add Week Off
                          </Button>
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  weekOffs.map((weekOff) => {
                    const halfDays = weekOff.grid.filter(
                      (cell) => cell.state === "half_day",
                    ).length;
                    const daysOff = weekOff.grid.filter(
                      (cell) => cell.state === "week_off",
                    ).length;
                    return (
                      <tr key={weekOff.id}>
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-navy-100">
                          {weekOff.policy_name}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Badge label={`${daysOff} Week Off`} variant="primary" />
                            <Badge label={`${halfDays} Half Day`} variant="warning" />
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(weekOff)}
                            leftIcon={<Pencil className="size-3.5" />}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-error hover:bg-error/10"
                            onClick={() => {
                              deleteWeekOff.reset();
                              setWeekOffToDelete(weekOff);
                            }}
                            leftIcon={<Trash2 className="size-3.5" />}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={formOpen}
        onClose={closeForm}
        title={selectedWeekOff ? "Edit Week Off" : "Add Week Off"}
        size="xl"
      >
        <WeekOffForm
          weekOff={selectedWeekOff}
          onSubmit={submitWeekOff}
          onCancel={closeForm}
          isSubmitting={createWeekOff.isPending || updateWeekOff.isPending}
          submissionError={
            formError
              ? getErrorMessage(formError, "Unable to save Week Off policy")
              : undefined
          }
        />
      </Modal>

      <ConfirmationDialog
        isOpen={Boolean(weekOffToDelete)}
        onCancel={() => {
          if (!deleteWeekOff.isPending) setWeekOffToDelete(null);
        }}
        title="Delete Week Off"
        description={<>Delete <strong>{weekOffToDelete?.policy_name}</strong>? This removes the policy from the current mock session.</>}
        onConfirm={confirmDelete}
        isConfirming={deleteWeekOff.isPending}
        error={deleteWeekOff.error}
        errorFallback="Unable to delete Week Off policy"
        confirmLabel="Delete Week Off"
      />
    </div>
  );
};
