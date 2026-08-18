import { useState } from "react";
import toast from "react-hot-toast";
import { Button, Input, Modal } from "@/shared/ui";
import { HolidayListForm } from "./HolidayListForm";
import { SimpleMasterList } from "./SimpleMasterList";
import {
  useCreateHolidayList,
  useDeleteHolidayList,
  useHolidayLists,
  useUpdateHolidayList,
} from "../hooks/useHolidayLists";
import type { HolidayListFormData } from "../schema/company.schema";
import type { CompanyEntityId, HolidayList } from "../types/company.types";

interface HolidayListTabProps {
  companyId: CompanyEntityId;
}

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export const HolidayListTab = ({ companyId }: HolidayListTabProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedHolidayList, setSelectedHolidayList] =
    useState<HolidayList | null>(null);
  const [holidayListToDelete, setHolidayListToDelete] =
    useState<HolidayList | null>(null);
  const pageSize = 5;
  const year = /^\d{4}$/.test(yearFilter) ? Number(yearFilter) : undefined;

  const holidayListsQuery = useHolidayLists(companyId, {
    page,
    page_size: pageSize,
    search: search || undefined,
    year,
  });
  const createHolidayList = useCreateHolidayList(companyId);
  const updateHolidayList = useUpdateHolidayList(companyId);
  const deleteHolidayList = useDeleteHolidayList(companyId);

  const openCreate = () => {
    createHolidayList.reset();
    updateHolidayList.reset();
    setSelectedHolidayList(null);
    setFormOpen(true);
  };

  const openEdit = (holidayList: HolidayList) => {
    createHolidayList.reset();
    updateHolidayList.reset();
    setSelectedHolidayList(holidayList);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (createHolidayList.isPending || updateHolidayList.isPending) return;
    setSelectedHolidayList(null);
    setFormOpen(false);
  };

  const submitHolidayList = (data: HolidayListFormData) => {
    if (selectedHolidayList) {
      updateHolidayList.mutate(
        { holidayListId: selectedHolidayList.id, data },
        {
          onSuccess: () => {
            toast.success("Holiday List updated successfully");
            setSelectedHolidayList(null);
            setFormOpen(false);
          },
        },
      );
      return;
    }
    createHolidayList.mutate(data, {
      onSuccess: () => {
        toast.success("Holiday List created successfully");
        setPage(1);
        setFormOpen(false);
      },
    });
  };

  const confirmDelete = () => {
    if (!holidayListToDelete) return;
    deleteHolidayList.mutate(holidayListToDelete.id, {
      onSuccess: () => {
        toast.success("Holiday List deleted successfully");
        if ((holidayListsQuery.data?.items.length ?? 0) === 1 && page > 1) {
          setPage(page - 1);
        }
        setHolidayListToDelete(null);
      },
      onError: (error) =>
        toast.error(getErrorMessage(error, "Unable to delete Holiday List")),
    });
  };

  const formError = selectedHolidayList
    ? updateHolidayList.error
    : createHolidayList.error;

  return (
    <>
      <SimpleMasterList
        title="Holiday Lists"
        description="Manage yearly Holiday List masters for this Company."
        singularLabel="Holiday List"
        items={holidayListsQuery.data?.items ?? []}
        total={holidayListsQuery.data?.total ?? 0}
        page={page}
        pageSize={pageSize}
        search={search}
        isLoading={holidayListsQuery.isLoading}
        isFetching={holidayListsQuery.isFetching}
        error={holidayListsQuery.error}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onPageChange={setPage}
        onRetry={() => holidayListsQuery.refetch()}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={(holidayList) => {
          deleteHolidayList.reset();
          setHolidayListToDelete(holidayList);
        }}
        filters={
          <Input
            aria-label="Filter Holiday Lists by year"
            type="number"
            min={1000}
            max={9999}
            placeholder="Filter by year"
            value={yearFilter}
            onChange={(event) => {
              setYearFilter(event.target.value);
              setPage(1);
            }}
          />
        }
        hasActiveFilters={Boolean(yearFilter)}
        onClearFilters={() => setYearFilter("")}
        secondaryContent={(holidayList) => (
          <>
            Year {holidayList.year}
            {holidayList.remarks ? ` · ${holidayList.remarks}` : ""}
          </>
        )}
      />

      <Modal
        isOpen={formOpen}
        onClose={closeForm}
        title={selectedHolidayList ? "Edit Holiday List" : "Add Holiday List"}
        size="sm"
      >
        <HolidayListForm
          holidayList={selectedHolidayList}
          onSubmit={submitHolidayList}
          onCancel={closeForm}
          isSubmitting={createHolidayList.isPending || updateHolidayList.isPending}
          submissionError={
            formError
              ? getErrorMessage(formError, "Unable to save Holiday List")
              : undefined
          }
        />
      </Modal>

      <Modal
        isOpen={Boolean(holidayListToDelete)}
        onClose={() => {
          if (!deleteHolidayList.isPending) setHolidayListToDelete(null);
        }}
        title="Delete Holiday List"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setHolidayListToDelete(null)}
              disabled={deleteHolidayList.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              isLoading={deleteHolidayList.isPending}
            >
              Delete Holiday List
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-navy-200">
          Delete <strong>{holidayListToDelete?.name}</strong> for {holidayListToDelete?.year}? This removes the Holiday List from the current mock session.
        </p>
        {deleteHolidayList.error && (
          <div className="mt-4 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
            {getErrorMessage(deleteHolidayList.error, "Unable to delete Holiday List")}
          </div>
        )}
      </Modal>
    </>
  );
};
