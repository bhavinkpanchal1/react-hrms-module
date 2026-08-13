import { httpClient } from "@/shared/services/http/client";
import type { EmployeeDocument } from "../types/document.type";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";
const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

let mockDocuments: EmployeeDocument[] = [
  {
    id: 1,
    employee_id: 1,
    document_category: "resume",
    document_name: "resume",
    document_description: "Latest Resume",
    file_name: "Bhavin_Panchal_Resume.pdf",
    file_url: "/mock/documents/resume.pdf",
    file_size: "1.8 MB",
    file_type: "pdf",
    uploaded_at: "2026-08-03T10:00:00",
    uploaded_by: "Employee",
  },
  {
    id: 2,
    employee_id: 1,
    document_category: "kyc",
    document_name: "aadhaar_card",
    document_description: "Front & Back Copy",
    file_name: "Aadhaar_Card.pdf",
    file_url: "/mock/documents/aadhaar.pdf",
    file_size: "650 KB",
    file_type: "pdf",
    uploaded_at: "2026-08-03T10:05:00",
    uploaded_by: "Employee",
  },
  {
    id: 3,
    employee_id: 1,
    document_category: "kyc",
    document_name: "pan_card",
    document_description: "PAN Card",
    file_name: "PAN_Card.pdf",
    file_url: "/mock/documents/pan.pdf",
    file_size: "420 KB",
    file_type: "pdf",
    uploaded_at: "2026-08-03T10:06:00",
    uploaded_by: "Employee",
  },
];

let nextDocId = mockDocuments.length + 1;

export const empDocumentApi = {
  // Was previously fetching ALL documents with no employeeId at all — now
  // properly scoped, so switching between employees actually shows
  // different documents instead of the same hardcoded list every time.
  getDocuments: async (employeeId: number): Promise<EmployeeDocument[]> => {
    if (USE_MOCK) {
      await delay();
      return mockDocuments.filter((d) => d.employee_id === employeeId);
    }
    const r = await httpClient.get<EmployeeDocument[]>(
      API_ENDPOINTS.employees.documents(employeeId),
    );
    return r.data;
  },

  uploadDocument: async (
    employeeId: number,
    data: {
      document_category: string;
      document_name: string;
      document_description?: string;
      file: File;
    },
  ): Promise<EmployeeDocument> => {
    if (USE_MOCK) {
      await delay(600);
      const doc: EmployeeDocument = {
        id: nextDocId++,
        employee_id: employeeId,
        document_category: data.document_category as EmployeeDocument["document_category"],
        document_name: data.document_name as EmployeeDocument["document_name"],
        document_description: data.document_description,
        file_name: data.file.name,
        file_url: URL.createObjectURL(data.file),
        file_size: `${(data.file.size / 1024).toFixed(0)} KB`,
        file_type: data.file.type || "unknown",
        uploaded_at: new Date().toISOString(),
        uploaded_by: "Employee",
      };
      mockDocuments = [...mockDocuments, doc];
      return doc;
    }

    const formData = new FormData();
    formData.append("document_category", data.document_category);
    formData.append("document_name", data.document_name);
    if (data.document_description) formData.append("document_description", data.document_description);
    formData.append("file", data.file);

    const r = await httpClient.post<EmployeeDocument>(
      API_ENDPOINTS.employees.documents(employeeId),
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return r.data;
  },

  deleteDocument: async (employeeId: number, documentId: number): Promise<void> => {
    if (USE_MOCK) {
      await delay(400);
      mockDocuments = mockDocuments.filter((d) => d.id !== documentId);
      return;
    }
    await httpClient.delete(API_ENDPOINTS.employees.document(employeeId, documentId));
  },
};
