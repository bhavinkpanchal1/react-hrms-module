import { create } from "zustand";
import type { AuthSession, AuthStatus } from "../types/auth.types";

interface AuthState {
  session: AuthSession | null;
  status: AuthStatus;
  error: string | null;
  setLoading: () => void;
  setSession: (session: AuthSession) => void;
  setUnauthenticated: () => void;
  setError: (message: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  status: "loading",
  error: null,
  setLoading: () => set({ status: "loading", error: null }),
  setSession: (session) => set({ session, status: "authenticated", error: null }),
  setUnauthenticated: () => set({ session: null, status: "unauthenticated", error: null }),
  setError: (error) => set({ session: null, status: "error", error }),
}));
