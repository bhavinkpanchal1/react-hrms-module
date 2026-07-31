import { Button } from "@base-ui/react";
import type { EmployeeStepProps } from "../types/employeeStep.type";
import { UserPlus } from "lucide-react";
import { Input, Modal, Select } from "@/shared/ui";
import { useState } from "react";
import { DOCUMENT_CATEGORY_OPTIONS, DOCUMENT_TYPE_OPTIONS } from "../types/document.type";

const EmployeeDocumentStep = ({ register, errors }: EmployeeStepProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    alert("UPload clicked");
    setIsOpen(true);
  }

  const handleOnClose = () => {
    setIsOpen(false);
  }

  return (
    <section className="card p-6">

      <div className="flex justify-between align-middle">
        <h3 className="mb-4 text-base font-semibold text-slate-800 dark:text-navy-100">
          Documents
        </h3>
        <Button onClick={handleClick}>
          <UserPlus />Upload New
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        
      </div>
      <Modal isOpen={isOpen} title="Upload Document" onClose={handleOnClose}>
        <Select options={DOCUMENT_CATEGORY_OPTIONS} label="Document Category" placeholder="Select Document Category" error={errors.document_category?.message}/>
        <Select options={DOCUMENT_TYPE_OPTIONS} label="Document Name" placeholder="Select Document Name" />
        <Input type="textarea" label="Description" placeholder="Enter Description" />
        <Input type="upload" label="Upload a file" />
      </Modal>
    </section>
  )
}

export default EmployeeDocumentStep;