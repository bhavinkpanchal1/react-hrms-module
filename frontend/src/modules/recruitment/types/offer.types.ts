export type OfferStatus = "OFFERED" | "ACCEPTED" | "DECLINED" | "EXPIRED";

export interface Offer {
  id: number;
  companyId: number;
  applicationId: number;
  salary: number;
  joiningDate: string;
  status: OfferStatus;
  offeredAt: string;
  acceptedAt?: string | null;
  declinedAt?: string | null;
  expiryDate?: string | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateOfferInput = Pick<Offer, "applicationId" | "salary" | "joiningDate" | "expiryDate" | "notes">;
export interface RecruitmentConversionContext { applicationId: number; candidateId: number; offerId: number; companyId: number; firstName: string; lastName: string; personalEmail: string; phone: string; dob: string; joiningDate: string; alreadyConverted: boolean; employeeId?: string }
export interface ConvertApplicationInput { applicationId: number; offerId: number; employee: CreateEmployeeInput }
export interface RecruitmentConversionResult { employeeId: string; applicationId: number; candidateId: number; convertedAt: string; alreadyConverted: boolean }
import type { CreateEmployeeInput } from "@/modules/employee/types/employee.type";
