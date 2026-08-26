import type { AppRole, Permission } from "@/shared/types/access.types";
export type { AppRole, Permission } from "@/shared/types/access.types";

export interface AvailableCompany {
  id: number;
  name: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: AppRole;
  permissions: Permission[];
}

export interface AuthSession {
  user: AuthUser;
  availableCompanies: AvailableCompany[];
  activeCompanyId: number | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "error";
