import { useMemo, useState } from "react";
import { AlertTriangle, CalendarDays, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/shared/lib/get-error-message";
import { Button, ConfirmationDialog, Modal, Select } from "@/shared/ui";
import EmptyState from "@/shared/ui/empty-state/EmptyState";
import { formatDisplayDate } from "@/shared/lib/date-utils";
import { HolidayForm } from "./HolidayForm";
import { SimpleMasterList } from "./SimpleMasterList";
import { useHolidayLists } from "../hooks/useHolidayLists";
import {
  useCreateHoliday,
  useDeleteHoliday,
  useHolidays,
  useUpdateHoliday,
} from "../hooks/useHolidays";
import type { HolidayFormData } from "../schema/company.schema";
import type {
  CompanyEntityId,
  Holiday,
} from "../types/company.types";

interface HolidayTabProps {
  companyId: CompanyEntityId;
}

export const HolidayTab = ({ companyId }: HolidayTabProps) => {
  const [holidayListId, setHolidayListId] = useState<CompanyEntityId>(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [holidayToDelete, setHolidayToDelete] = useState<Holiday | null>(null);
  const pageSize = 5;

  const holidayListsQuery = useHolidayLists(companyId, {
    page: 1,
    page_size: 100,
  });
  const holidayLists = useMemo(
    () => holidayListsQuery.data?.items ?? [],
    [holidayListsQuery.data?.items],
  );
  const effectiveHolidayListId = holidayListId || holidayLists[0]?.id || 0;
  const selectedHolidayList =
    holidayLists.find(
      (holidayList) => holidayList.id === effectiveHolidayListId,
    ) ?? null;

  const holidaysQuery = useHolidays(companyId, effectiveHolidayListId, {
    page,
    page_size: pageSize,
    search: search || undefined,
  });
  const createHoliday = useCreateHoliday(companyId, effectiveHolidayListId);
  const updateHoliday = useUpdateHoliday(companyId, effectiveHolidayListId);
  const deleteHoliday = useDeleteHoliday(companyId, effectiveHolidayListId);

  const openCreate = () => {
    createHoliday.reset();
    updateHoliday.reset();
    setSelectedHoliday(null);
    setFormOpen(true);
  };

  const openEdit = (holiday: Holiday) => {
    createHoliday.reset();
    updateHoliday.reset();
    setSelectedHoliday(holiday);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (createHoliday.isPending || updateHoliday.isPending) return;
    setSelectedHoliday(null);
    setFormOpen(false);
  };

  const submitHoliday = (data: HolidayFormData) => {
    if (selectedHoliday) {
      updateHoliday.mutate(
        { holidayId: selectedHoliday.id, data },
        {
          onSuccess: () => {
            toast.success("Holiday updated successfully");
            setSelectedHoliday(null);
            setFormOpen(false);
          },
        },
      );
      return;
    }
    createHoliday.mutate(data, {
      onSuccess: () => {
        toast.success("Holiday created successfully");
        setPage(1);
        setFormOpen(false);
      },
    });
  };

  const confirmDelete = () => {
    if (!holidayToDelete) return;
    deleteHoliday.mutate(holidayToDelete.id, {
      onSuccess: () => {
        toast.success("Holiday deleted successfully");
        if ((holidaysQuery.data?.items.length ?? 0) === 1 && page > 1) {
          setPage(page - 1);
        }
        setHolidayToDelete(null);
      },
      onError: (error) =>
        toast.error(getErrorMessage(error, "Unable to delete Holiday")),
    });
  };

  if (holidayListsQuery.isLoading) {
    return <div className="card h-48 animate-pulse bg-slate-100 dark:bg-navy-700" />;
  }

  if (holidayListsQuery.isError) {
    return (
      <div className="card flex flex-col items-center gap-3 border border-error/30 p-8 text-center">
        <AlertTriangle className="size-9 text-error" />
        <p className="text-sm text-error">
          {getErrorMessage(holidayListsQuery.error, "Unable to load Holiday Lists")}
        </p>
        <Button
          variant="outline"
          leftIcon={<RotateCcw className="size-4" />}
          onClick={() => holidayListsQuery.refetch()}
          isLoading={holidayListsQuery.isFetching}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (holidayLists.length === 0) {
    return (
      <div className="card p-6">
        <EmptyState
          icon={CalendarDays}
          title="No Holiday Lists found"
          description="Create a Holiday List before adding individual Holidays."
        />
      </div>
    );
  }

  const formError = selectedHoliday ? updateHoliday.error : createHoliday.error;

  return (
    <>
      <div className="card mb-4 p-4">
        <Select
          label="Holiday List"
          required
          options={holidayLists.map((holidayList) => ({
            value: holidayList.id,
            label: `${holidayList.name} (${holidayList.year})`,
          }))}
          value={effectiveHolidayListId}
          onChange={(event) => {
            setHolidayListId(Number(event.target.value));
            setPage(1);
            setSearch("");
          }}
        />
      </div>

      <SimpleMasterList
        title="Holidays"
        description={`Manage dates inside ${selectedHolidayList?.name ?? "the selected Holiday List"}.`}
        singularLabel="Holiday"
        items={holidaysQuery.data?.items ?? []}
        total={holidaysQuery.data?.total ?? 0}
        page={page}
        pageSize={pageSize}
        search={search}
        isLoading={holidaysQuery.isLoading}
        isFetching={holidaysQuery.isFetching}
        error={holidaysQuery.error}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onPageChange={setPage}
        onRetry={() => holidaysQuery.refetch()}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={(holiday) => {
          deleteHoliday.reset();
          setHolidayToDelete(holiday);
        }}
        secondaryContent={(holiday) => (
          <>
            {formatDisplayDate(holiday.date)}
            {holiday.description ? ` · ${holiday.description}` : ""}
          </>
        )}
      />

      {selectedHolidayList && (
        <Modal
          isOpen={formOpen}
          onClose={closeForm}
          title={selectedHoliday ? "Edit Holiday" : "Add Holiday"}
          size="sm"
        >
          <HolidayForm
            holidayList={selectedHolidayList}
            holiday={selectedHoliday}
            onSubmit={submitHoliday}
            onCancel={closeForm}
            isSubmitting={createHoliday.isPending || updateHoliday.isPending}
            submissionError={
              formError
                ? getErrorMessage(formError, "Unable to save Holiday")
                : undefined
            }
          />
        </Modal>
      )}

      <ConfirmationDialog
        isOpen={Boolean(holidayToDelete)}
        onCancel={() => {
          if (!deleteHoliday.isPending) setHolidayToDelete(null);
        }}
        title="Delete Holiday"
        description={<>Delete <strong>{holidayToDelete?.name}</strong> from the selected Holiday List?</>}
        onConfirm={confirmDelete}
        isConfirming={deleteHoliday.isPending}
        error={deleteHoliday.error}
        errorFallback="Unable to delete Holiday"
        confirmLabel="Delete Holiday"
      />
    </>
  );
};
