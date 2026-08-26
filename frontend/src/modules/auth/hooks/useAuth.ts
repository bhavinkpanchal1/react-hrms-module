import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../stores/auth.store";
import type { LoginCredentials } from "../types/auth.types";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const session = useAuthStore((state) => state.session);
  const status = useAuthStore((state) => state.status);
  const error = useAuthStore((state) => state.error);
  const setSession = useAuthStore((state) => state.setSession);
  const setUnauthenticated = useAuthStore((state) => state.setUnauthenticated);
  const setError = useAuthStore((state) => state.setError);

  const login = async (credentials: LoginCredentials) => {
    try {
      const nextSession = await authApi.login(credentials);
      setSession(nextSession);
      return nextSession;
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : "Unable to sign in";
      setError(message);
      throw loginError;
    }
  };

  const logout = async () => {
    await authApi.logout();
    queryClient.clear();
    setUnauthenticated();
  };

  const selectCompany = async (companyId: number) => {
    if (!session) throw new Error("No authenticated session");
    const nextSession = await authApi.selectCompany(session, companyId);
    setSession(nextSession);
  };

  return {
    session,
    user: session?.user ?? null,
    status,
    error,
    isAuthenticated: status === "authenticated",
    activeCompanyId: session?.activeCompanyId ?? null,
    activeCompany: session?.availableCompanies.find(
      (company) => company.id === session.activeCompanyId,
    ) ?? null,
    availableCompanies: session?.availableCompanies ?? [],
    login,
    logout,
    selectCompany,
  };
};
