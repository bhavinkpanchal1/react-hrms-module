import type { ReactNode } from "react";
import { getErrorMessage } from "@/shared/lib/get-error-message";
import { Button } from "../button/Button";
import { Modal } from "../modal/Modal";

export interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  isConfirming?: boolean;
  error?: unknown;
  errorFallback?: string;
  cancelLabel?: string;
  confirmLabel?: string;
}

export const ConfirmationDialog = ({
  isOpen,
  title,
  description,
  onCancel,
  onConfirm,
  isConfirming = false,
  error,
  errorFallback = "Unable to complete this action.",
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
}: ConfirmationDialogProps) => (
  <Modal
    isOpen={isOpen}
    onClose={onCancel}
    title={title}
    size="sm"
    closeDisabled={isConfirming}
    footer={
      <>
        <Button variant="outline" onClick={onCancel} disabled={isConfirming}>
          {cancelLabel}
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isConfirming}>
          {confirmLabel}
        </Button>
      </>
    }
  >
    <div className="text-sm text-slate-600 dark:text-navy-200">{description}</div>
    {error !== undefined && error !== null && (
      <div
        className="mt-4 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error"
        role="alert"
      >
        {getErrorMessage(error, errorFallback)}
      </div>
    )}
  </Modal>
);
