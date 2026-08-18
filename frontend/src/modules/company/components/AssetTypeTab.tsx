import { useState } from "react";
import toast from "react-hot-toast";
import { Button, Modal } from "@/shared/ui";
import { AssetTypeForm } from "./AssetTypeForm";
import { SimpleMasterList } from "./SimpleMasterList";
import {
  useAssetTypes,
  useCreateAssetType,
  useDeleteAssetType,
  useUpdateAssetType,
} from "../hooks/useAssetTypes";
import type { AssetTypeFormData } from "../schema/company.schema";
import type { AssetType, CompanyEntityId } from "../types/company.types";

interface AssetTypeTabProps {
  companyId: CompanyEntityId;
}

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export const AssetTypeTab = ({ companyId }: AssetTypeTabProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType | null>(null);
  const [assetTypeToDelete, setAssetTypeToDelete] = useState<AssetType | null>(null);
  const pageSize = 5;

  const assetTypesQuery = useAssetTypes(companyId, {
    page,
    page_size: pageSize,
    search: search || undefined,
  });
  const createAssetType = useCreateAssetType(companyId);
  const updateAssetType = useUpdateAssetType(companyId);
  const deleteAssetType = useDeleteAssetType(companyId);

  const openCreate = () => {
    createAssetType.reset();
    updateAssetType.reset();
    setSelectedAssetType(null);
    setFormOpen(true);
  };

  const openEdit = (assetType: AssetType) => {
    createAssetType.reset();
    updateAssetType.reset();
    setSelectedAssetType(assetType);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (createAssetType.isPending || updateAssetType.isPending) return;
    setSelectedAssetType(null);
    setFormOpen(false);
  };

  const submitAssetType = (data: AssetTypeFormData) => {
    if (selectedAssetType) {
      updateAssetType.mutate(
        { assetTypeId: selectedAssetType.id, data },
        {
          onSuccess: () => {
            toast.success("Asset Type updated successfully");
            setSelectedAssetType(null);
            setFormOpen(false);
          },
        },
      );
      return;
    }
    createAssetType.mutate(data, {
      onSuccess: () => {
        toast.success("Asset Type created successfully");
        setPage(1);
        setFormOpen(false);
      },
    });
  };

  const confirmDelete = () => {
    if (!assetTypeToDelete) return;
    deleteAssetType.mutate(assetTypeToDelete.id, {
      onSuccess: () => {
        toast.success("Asset Type deleted successfully");
        if ((assetTypesQuery.data?.items.length ?? 0) === 1 && page > 1) {
          setPage(page - 1);
        }
        setAssetTypeToDelete(null);
      },
      onError: (error) =>
        toast.error(getErrorMessage(error, "Unable to delete Asset Type")),
    });
  };

  const formError = selectedAssetType
    ? updateAssetType.error
    : createAssetType.error;

  return (
    <>
      <SimpleMasterList
        title="Asset Types"
        description="Manage Asset Type masters for this Company."
        singularLabel="Asset Type"
        items={assetTypesQuery.data?.items ?? []}
        total={assetTypesQuery.data?.total ?? 0}
        page={page}
        pageSize={pageSize}
        search={search}
        isLoading={assetTypesQuery.isLoading}
        isFetching={assetTypesQuery.isFetching}
        error={assetTypesQuery.error}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onPageChange={setPage}
        onRetry={() => assetTypesQuery.refetch()}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={(assetType) => {
          deleteAssetType.reset();
          setAssetTypeToDelete(assetType);
        }}
      />

      <Modal
        isOpen={formOpen}
        onClose={closeForm}
        title={selectedAssetType ? "Edit Asset Type" : "Add Asset Type"}
        size="sm"
      >
        <AssetTypeForm
          assetType={selectedAssetType}
          onSubmit={submitAssetType}
          onCancel={closeForm}
          isSubmitting={createAssetType.isPending || updateAssetType.isPending}
          submissionError={
            formError
              ? getErrorMessage(formError, "Unable to save Asset Type")
              : undefined
          }
        />
      </Modal>

      <Modal
        isOpen={Boolean(assetTypeToDelete)}
        onClose={() => {
          if (!deleteAssetType.isPending) setAssetTypeToDelete(null);
        }}
        title="Delete Asset Type"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setAssetTypeToDelete(null)}
              disabled={deleteAssetType.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              isLoading={deleteAssetType.isPending}
            >
              Delete Asset Type
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-navy-200">
          Delete <strong>{assetTypeToDelete?.name}</strong>? This removes the Asset Type from the current mock session.
        </p>
        {deleteAssetType.error && (
          <div className="mt-4 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
            {getErrorMessage(deleteAssetType.error, "Unable to delete Asset Type")}
          </div>
        )}
      </Modal>
    </>
  );
};
