import { useEffect, useRef, type ReactNode } from "react";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../stores/auth.store";

export const AuthSessionProvider = ({ children }: { children: ReactNode }) => {
  const restoreStarted = useRef(false);

  useEffect(() => {
    if (restoreStarted.current) return;
    restoreStarted.current = true;

    void authApi.restoreSession()
      .then((session) => {
        if (session) useAuthStore.getState().setSession(session);
        else useAuthStore.getState().setUnauthenticated();
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Unable to restore session";
        useAuthStore.getState().setError(message);
      });
  }, []);

  return children;
};
