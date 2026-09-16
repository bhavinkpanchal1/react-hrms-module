export type RecruitmentDocumentType = "RESUME" | "OTHER";

export interface RecruitmentDocument {
  id: string;
  companyId: number;
  candidateId: number;
  applicationId?: number | null;
  documentType: RecruitmentDocumentType;
  documentKey: string;
  displayName: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  version: number;
  isCurrent: boolean;
  createdAt: string;
  createdBy: string;
}

export interface UploadRecruitmentDocumentInput {
  candidateId: number;
  applicationId?: number | null;
  documentType: RecruitmentDocumentType;
  documentKey: string;
  displayName: string;
  file: File;
}

export interface RecruitmentDocumentDeletion {
  id: string;
  companyId: number;
  documentId: string;
  candidateId: number;
  applicationId?: number | null;
  documentKey: string;
  displayName: string;
  version: number;
  fileName: string;
  action: "RECRUITMENT_DOCUMENT_DELETED";
  actor: string;
  createdAt: string;
}
