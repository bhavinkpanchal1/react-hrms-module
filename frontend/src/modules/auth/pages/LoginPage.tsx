import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Input } from "@/shared/ui";
import { useAuth } from "../hooks/useAuth";

interface LoginLocationState {
  from?: string;
  reason?: "company-required";
}

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, status, error } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("hr@peoplepulse.test");
  const [password, setPassword] = useState("password");
  const state = location.state as LoginLocationState | null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigate(state?.from ?? "/", { replace: true });
    } catch {
      // The hook exposes the deterministic service error for rendering.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {state?.reason === "company-required" && (
        <p className="rounded-lg bg-warning/10 px-3 py-2 text-sm text-warning">
          Select an available company before continuing.
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error" role="alert">
          {error}
        </p>
      )}
      <Input
        label="Email"
        type="email"
        autoComplete="username"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      <Button type="submit" className="w-full justify-center" isLoading={isSubmitting || status === "loading"}>
        Sign In
      </Button>
      <p className="text-center text-xs text-slate-400 dark:text-navy-400">
        Mock access: hr@peoplepulse.test / password
      </p>
    </form>
  );
};

export default LoginPage;
