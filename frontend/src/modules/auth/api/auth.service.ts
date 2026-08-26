import type { AuthSession, LoginCredentials } from "../types/auth.types";

export interface AuthAdapter {
  login: (credentials: LoginCredentials) => Promise<AuthSession>;
}

export interface AuthStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

const SESSION_STORAGE_KEY = "hrms-auth-session";

const isAuthSession = (value: unknown): value is AuthSession => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  const user = candidate.user;
  const companies = candidate.availableCompanies;
  if (!user || typeof user !== "object" || !Array.isArray(companies)) return false;
  const identity = user as Record<string, unknown>;
  return (
    typeof identity.id === "number" &&
    typeof identity.name === "string" &&
    typeof identity.email === "string" &&
    (identity.role === "hr" || identity.role === "manager" || identity.role === "employee") &&
    Array.isArray(identity.permissions) &&
    (candidate.activeCompanyId === null || typeof candidate.activeCompanyId === "number") &&
    companies.every((company: unknown) => {
      if (!company || typeof company !== "object") return false;
      const membership = company as Record<string, unknown>;
      return typeof membership.id === "number" && typeof membership.name === "string";
    })
  );
};

export const createAuthService = (adapter: AuthAdapter, storage: AuthStorage) => {
  const persistSession = (session: AuthSession) => {
    storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  };

  return {
    login: async (credentials: LoginCredentials): Promise<AuthSession> => {
      const session = await adapter.login(credentials);
      persistSession(session);
      return session;
    },

    restoreSession: async (): Promise<AuthSession | null> => {
      const value = storage.getItem(SESSION_STORAGE_KEY);
      if (!value) return null;
      try {
        const session: unknown = JSON.parse(value);
        if (!isAuthSession(session)) throw new Error("Saved session is invalid");
        if (
          session.activeCompanyId !== null &&
          !session.availableCompanies.some((company) => company.id === session.activeCompanyId)
        ) {
          throw new Error("Saved active company is invalid");
        }
        return session;
      } catch {
        storage.removeItem(SESSION_STORAGE_KEY);
        throw new Error("Unable to restore the saved session");
      }
    },

    selectCompany: async (session: AuthSession, companyId: number): Promise<AuthSession> => {
      if (!session.availableCompanies.some((company) => company.id === companyId)) {
        throw new Error("This company is not available to the current user");
      }
      const nextSession = { ...session, activeCompanyId: companyId };
      persistSession(nextSession);
      return nextSession;
    },

    logout: async (): Promise<void> => {
      storage.removeItem(SESSION_STORAGE_KEY);
      storage.removeItem("access_token");
    },
  };
};
