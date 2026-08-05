
import type { EmployeeStepProps } from "../types/employeeStep.type";
import { DownloadCloudIcon, UserPlus } from "lucide-react";
import { Badge, Button, Input, Modal, Select } from "@/shared/ui";
import { useState } from "react";
import { DOCUMENT_CATEGORY_OPTIONS, DOCUMENT_TYPE_OPTIONS } from "../types/document.type";
import EmptyState from "@/shared/ui/empty-state/EmptyState";

import { DOCUMENTS_LIST } from "../constants/document-list";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const EmployeeDocumentStep = ({ register, errors }: EmployeeStepProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOnClose = () => {
    setIsOpen(false);
  }

  const handleDownload = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    link.click();
};

  return (
    <section className="card p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-navy-100">
            Employee Documents
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-navy-300">
            Upload and manage all employee documents.
          </p>
        </div>

        <Button
          leftIcon={<UserPlus className="size-4" />}
          onClick={() => setIsOpen(true)}
        >
          Upload Document
        </Button>
      </div>

      {/* Resume */}
      <Accordion
        type="single"
        collapsible
        defaultValue="resume"
        className="space-y-4"
      >
        {DOCUMENT_CATEGORY_OPTIONS.map((category) => {
          const documents = DOCUMENTS_LIST.filter(
            (doc) => doc.document_category === category.value,
          );

          return (
            <AccordionItem
              key={category.value}
              value={category.value}
              className="overflow-hidden rounded-xl border border-slate-200 dark:border-navy-600"
            >
              <AccordionTrigger className="bg-slate-50 px-5 py-4 hover:no-underline dark:bg-navy-700/40">
                <div className="flex w-full items-center justify-between pr-4">
                  <div className="text-left">
                    <h4 className="font-semibold text-slate-800 dark:text-navy-100">
                      {category.label}
                    </h4>

                    <p className="text-xs text-slate-500">
                      {documents.length}{" "}
                      {documents.length === 1 ? "Document" : "Documents"}
                    </p>
                  </div>

                  <Badge
                    label={documents.length ? "Completed" : "Pending"}
                    variant={documents.length ? "success" : "warning"}
                  />
                </div>
              </AccordionTrigger>

              <AccordionContent className="p-0">
                {documents.length === 0 ? (
                  <div className="py-8">
                    <EmptyState
                      icon={DownloadCloudIcon}
                      title={`No ${category.label} Documents`}
                      description="Uploaded documents will appear here."
                    />
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-navy-600">
                    {documents.map((document) => (
                      <div
                        key={document.id}
                        className="flex items-center justify-between px-5 py-4"
                      >
                        <div>
                          <h5 className="font-medium">
                            {document.document_name}
                          </h5>

                          <p className="mt-1 text-xs text-slate-500">
                            {document.file_name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {document.file_size} • {document.uploaded_at}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">

                          <Button size="sm" variant="ghost">
                            View
                          </Button>

                          <Button size="sm" variant="ghost">
                            Download
                          </Button>

                          <Button size="sm" variant="ghost">
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

      {/* Other */}
      <div className="rounded-xl border border-slate-200 dark:border-navy-600">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-navy-600 dark:bg-navy-700/40">
          <div>
            <h4 className="font-semibold">
              Other Documents
            </h4>
            <p className="text-xs text-slate-500">
              No Documents
            </p>
          </div>
        </div>

        <div className="py-10">
          <EmptyState
            icon={DownloadCloudIcon}
            title="No Documents Uploaded"
            description="Upload additional employee documents such as medical certificates or declarations."
          />
        </div>
      </div>

      <Modal isOpen={isOpen} title="Upload Document" onClose={handleOnClose}>
        <Select options={DOCUMENT_CATEGORY_OPTIONS} label="Document Category" placeholder="Select Document Category" error={errors.document_category?.message} />
        <Select options={DOCUMENT_TYPE_OPTIONS} label="Document Name" placeholder="Select Document Name" />
        <Input type="textarea" label="Description" placeholder="Enter Description" />
        <Input type="upload" label="Upload a file" />
      </Modal>
    </section>
  )
}

export default EmployeeDocumentStep;