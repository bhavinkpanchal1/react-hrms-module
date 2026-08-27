import { useState } from "react";
import { Download, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/shared/lib/get-error-message";
import { Button, ConfirmationDialog, Modal } from "@/shared/ui";
import { formatDateTime } from "@/shared/utils/date";
import { PolicyForm } from "./PolicyForm";
import { SimpleMasterList } from "./SimpleMasterList";
import {
  useCreatePolicy,
  useDeletePolicy,
  useDownloadPolicyFile,
  usePolicies,
  useViewPolicyFile,
} from "../hooks/usePolicies";
import type { PolicyFormData } from "../schema/company.schema";
import type { CompanyEntityId, Policy } from "../types/company.types";

interface PolicyListTabProps {
  companyId: CompanyEntityId;
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const PolicyListTab = ({ companyId }: PolicyListTabProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState<Policy | null>(null);
  const pageSize = 5;

  const policiesQuery = usePolicies(companyId, {
    page,
    page_size: pageSize,
    search: search || undefined,
  });
  const createPolicy = useCreatePolicy(companyId);
  const deletePolicy = useDeletePolicy(companyId);
  const viewPolicyFile = useViewPolicyFile(companyId);
  const downloadPolicyFile = useDownloadPolicyFile(companyId);

  const submitPolicy = (data: PolicyFormData) => {
    createPolicy.mutate(data, {
      onSuccess: () => {
        toast.success("Policy uploaded successfully");
        setPage(1);
        setFormOpen(false);
      },
    });
  };

  const viewPolicy = (policy: Policy) => {
    viewPolicyFile.mutate(policy.id, {
      onSuccess: (access) => {
        if (!access.can_preview) {
          toast.error("Preview is unavailable for this file type. Download the file instead.");
          return;
        }
        const opened = window.open(access.url, "_blank", "noopener,noreferrer");
        if (!opened) toast.error("The browser blocked the Policy preview window");
      },
      onError: (error) =>
        toast.error(getErrorMessage(error, "Unable to view Policy file")),
    });
  };

  const downloadPolicy = (policy: Policy) => {
    downloadPolicyFile.mutate(policy.id, {
      onSuccess: ({ blob, file_name }) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file_name;
        link.click();
        URL.revokeObjectURL(url);
      },
      onError: (error) =>
        toast.error(getErrorMessage(error, "Unable to download Policy file")),
    });
  };

  const confirmDelete = () => {
    if (!policyToDelete) return;
    deletePolicy.mutate(policyToDelete.id, {
      onSuccess: () => {
        toast.success("Policy deleted successfully");
        if ((policiesQuery.data?.items.length ?? 0) === 1 && page > 1) {
          setPage(page - 1);
        }
        setPolicyToDelete(null);
      },
      onError: (error) =>
        toast.error(getErrorMessage(error, "Unable to delete Policy")),
    });
  };

  const policyItems = (policiesQuery.data?.items ?? []).map((policy) => ({
    ...policy,
    name: policy.policy_name,
  }));

  return (
    <>
      <SimpleMasterList
        title="Policies"
        description="Upload and manage Policy files for this Company."
        singularLabel="Policy"
        items={policyItems}
        total={policiesQuery.data?.total ?? 0}
        page={page}
        pageSize={pageSize}
        search={search}
        isLoading={policiesQuery.isLoading}
        isFetching={policiesQuery.isFetching}
        error={policiesQuery.error}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onPageChange={setPage}
        onRetry={() => policiesQuery.refetch()}
        onAdd={() => {
          createPolicy.reset();
          setFormOpen(true);
        }}
        onDelete={(policy) => {
          deletePolicy.reset();
          setPolicyToDelete(policy);
        }}
        renderActions={(policy) => (
          <>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Eye className="size-3.5" />}
              onClick={() => viewPolicy(policy)}
              disabled={viewPolicyFile.isPending}
            >
              View
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Download className="size-3.5" />}
              onClick={() => downloadPolicy(policy)}
              disabled={downloadPolicyFile.isPending}
            >
              Download
            </Button>
          </>
        )}
        secondaryContent={(policy) => (
          <div className="space-y-0.5">
            {policy.description && <div>{policy.description}</div>}
            <div>
              {policy.file.file_name} · {policy.file.mime_type} · {formatBytes(policy.file.size_bytes)} · Uploaded {formatDateTime(policy.file.uploaded_at)}
            </div>
          </div>
        )}
      />

      <Modal
        isOpen={formOpen}
        onClose={() => {
          if (!createPolicy.isPending) setFormOpen(false);
        }}
        title="Upload Policy"
        size="sm"
      >
        <PolicyForm
          onSubmit={submitPolicy}
          onCancel={() => setFormOpen(false)}
          isSubmitting={createPolicy.isPending}
          submissionError={
            createPolicy.error
              ? getErrorMessage(createPolicy.error, "Unable to upload Policy")
              : undefined
          }
        />
      </Modal>

      <ConfirmationDialog
        isOpen={Boolean(policyToDelete)}
        onCancel={() => {
          if (!deletePolicy.isPending) setPolicyToDelete(null);
        }}
        title="Delete Policy"
        description={<>Delete <strong>{policyToDelete?.policy_name}</strong>? This removes the Policy and its mock file from the current session.</>}
        onConfirm={confirmDelete}
        isConfirming={deletePolicy.isPending}
        error={deletePolicy.error}
        errorFallback="Unable to delete Policy"
        confirmLabel="Delete Policy"
      />
    </>
  );
};
