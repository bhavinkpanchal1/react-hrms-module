import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { empDocumentApi } from "../api/employee-document.api";

export const useEmployeeDocuments = (employeeId: number) =>
  useQuery({
    queryKey: queryKeys.employee.documents(employeeId),
    queryFn: () => empDocumentApi.getDocuments(employeeId),
    enabled: !!employeeId,
  });

export const useUploadEmployeeDocument = (employeeId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      document_category: string;
      document_name: string;
      document_description?: string;
      file: File;
    }) => empDocumentApi.uploadDocument(employeeId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.employee.documents(employeeId) });
    },
  });
};

export const useDeleteEmployeeDocument = (employeeId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (documentId: number) => empDocumentApi.deleteDocument(employeeId, documentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.employee.documents(employeeId) });
    },
  });
};