import { useState } from "react";
import { DownloadCloudIcon, Loader2, UserPlus } from "lucide-react";
import { Badge, Button, Input, Modal, Select, Textarea } from "@/shared/ui";
import EmptyState from "@/shared/ui/empty-state/EmptyState";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  DOCUMENT_CATEGORY_OPTIONS,
  DOCUMENT_TYPE_OPTIONS,
} from "../types/document.type";
import {
  useEmployeeDocuments,
  useUploadEmployeeDocument,
  useDeleteEmployeeDocument,
} from "../hooks/useEmployeeDocuments";

interface EmployeeDocumentStepProps {
  employeeId: number;
}

const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/png"];

const UploadDocumentModal = ({
  isOpen, onClose, employeeId,
}: { isOpen: boolean; onClose: () => void; employeeId: number }) => {
  const upload = useUploadEmployeeDocument(employeeId);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedCategory = DOCUMENT_CATEGORY_OPTIONS.find((item) => item.value === category);
  const availableTypes = DOCUMENT_TYPE_OPTIONS.filter(
    (type) => !selectedCategory || type.category_id === selectedCategory.category_id,
  );

  const reset = () => {
    setCategory(""); setName(""); setDescription(""); setFile(null); setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};
    if (!category) nextErrors.category = "Select a document category";
    if (!name) nextErrors.name = "Select a document type";
    if (!file) nextErrors.file = "Please choose a file to upload";
    else if (!ACCEPTED_DOCUMENT_TYPES.includes(file.type)) {
      nextErrors.file = "Upload a PDF, JPG, or PNG file";
    } else if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
      nextErrors.file = "File size must not exceed 10 MB";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !file) return;

    upload.mutate(
      { document_category: category, document_name: name, document_description: description, file },
      { onSuccess: handleClose },
    );
  };

  return (
    <Modal isOpen={isOpen} title="Upload Document" onClose={handleClose}>
      <div className="space-y-4">
        <Select
          options={DOCUMENT_CATEGORY_OPTIONS.map((c) => ({ value: c.value, label: c.label }))}
          label="Document Category"
          required
          placeholder="Select Document Category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setName("");
            setErrors((current) => ({ ...current, category: "", name: "" }));
          }}
          error={errors.category}
        />
        <Select
          options={availableTypes.map((t) => ({ value: t.value, label: t.label }))}
          label="Document Name"
          required
          placeholder="Select Document Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((current) => ({ ...current, name: "" }));
          }}
          error={errors.name}
        />
        <Textarea
          label="Description"
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div>
          <label className="text-xs font-medium text-slate-700 dark:text-navy-100">
            Upload a file <span className="text-error">*</span>
          </label>
          <Input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setErrors((current) => ({ ...current, file: "" }));
            }}
            className="form-input mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-primary dark:border-navy-500 dark:bg-navy-700 dark:text-navy-100"
          />
          {errors.file && <p className="mt-1 text-xs text-error">{errors.file}</p>}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        {upload.error && (
          <p className="mr-auto self-center text-sm text-error">
            {(upload.error as Error).message || "Unable to upload the document."}
          </p>
        )}
        <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button type="button" onClick={handleSubmit} isLoading={upload.isPending}>Upload</Button>
      </div>
    </Modal>
  );
};

export const EmployeeDocumentStep = ({ employeeId }: EmployeeDocumentStepProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: documents = [], isLoading, error } = useEmployeeDocuments(employeeId);
  const deleteDoc = useDeleteEmployeeDocument(employeeId);

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
  };

  const handleDelete = (documentId: number) => {
    if (window.confirm("Delete this document? This can't be undone.")) {
      deleteDoc.mutate(documentId);
    }
  };

  if (isLoading) {
    return (
      <section className="card flex items-center justify-center p-12">
        <Loader2 className="size-5 animate-spin text-slate-400" />
      </section>
    );
  }

  const documentError = error ?? deleteDoc.error;

  return (
    <section className="card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-navy-100">Employee Documents</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-navy-300">
            Upload and manage all employee documents.
          </p>
        </div>
        <Button leftIcon={<UserPlus className="size-4" />} onClick={() => setIsOpen(true)}>
          Upload Document
        </Button>
      </div>

      {documentError && (
        <div className="mb-4 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {(documentError as Error).message || "Unable to load or update employee documents."}
        </div>
      )}

      <Accordion defaultValue={["resume"]} className="space-y-4">
        {DOCUMENT_CATEGORY_OPTIONS.map((category) => {
          const categoryDocs = documents.filter((doc) => doc.document_category === category.value);

          return (
            <AccordionItem key={category.value} value={category.value} className="overflow-hidden rounded-xl border border-slate-200 dark:border-navy-600">
              <AccordionTrigger className="bg-slate-50 px-5 py-4 hover:no-underline dark:bg-navy-700/40">
                <div className="flex w-full items-center justify-between pr-4">
                  <div className="text-left">
                    <h4 className="font-semibold text-slate-800 dark:text-navy-100">{category.label}</h4>
                    <p className="text-xs text-slate-500">
                      {categoryDocs.length} {categoryDocs.length === 1 ? "Document" : "Documents"}
                    </p>
                  </div>
                  <Badge label={categoryDocs.length ? "Completed" : "Pending"} variant={categoryDocs.length ? "success" : "warning"} />
                </div>
              </AccordionTrigger>

              <AccordionContent className="p-0">
                {categoryDocs.length === 0 ? (
                  <div className="py-8">
                    <EmptyState icon={DownloadCloudIcon} title={`No ${category.label} Documents`} description="Uploaded documents will appear here." />
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-navy-600">
                    {categoryDocs.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between px-5 py-4">
                        <div>
                          <h5 className="font-medium">{doc.document_name}</h5>
                          <p className="mt-1 text-xs text-slate-500">{doc.file_name}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {doc.file_size} • {new Date(doc.uploaded_at).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" onClick={() => window.open(doc.file_url, "_blank", "noopener,noreferrer")}>
                            View
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDownload(doc.file_url, doc.file_name)}>
                            Download
                          </Button>
                          <Button size="sm" variant="ghost" className="text-error hover:bg-error/10" onClick={() => handleDelete(doc.id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <UploadDocumentModal isOpen={isOpen} onClose={() => setIsOpen(false)} employeeId={employeeId} />
    </section>
  );
};

export default EmployeeDocumentStep;
