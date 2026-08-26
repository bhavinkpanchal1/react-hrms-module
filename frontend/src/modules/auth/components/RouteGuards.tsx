import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button, Select } from "@/shared/ui";
import { useState } from "react";

const SessionLoader = () => (
  <div className="grid min-h-screen place-items-center bg-slate-50 dark:bg-navy-900">
    <div className="size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const CompanyRequired = () => {
  const { availableCompanies, selectCompany, logout } = useAuth();
  const [companyId, setCompanyId] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (companyId === "") {
      setError("Select a company to continue");
      return;
    }
    try {
      await selectCompany(companyId);
    } catch (selectionError) {
      setError(selectionError instanceof Error ? selectionError.message : "Unable to select company");
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-4 dark:bg-navy-900">
      <div className="card w-full max-w-md space-y-4 p-6">
        <div>
          <h1 className="text-lg font-semibold text-slate-800 dark:text-navy-100">Select a company</h1>
          <p className="text-sm text-slate-500 dark:text-navy-300">Choose an available company to continue.</p>
        </div>
        {error && <p className="text-sm text-error" role="alert">{error}</p>}
        <Select
          aria-label="Company"
          value={companyId}
          placeholder="Select company"
          options={availableCompanies.map((company) => ({ value: company.id, label: company.name }))}
          onChange={(event) => setCompanyId(event.target.value ? Number(event.target.value) : "")}
        />
        <div className="flex justify-between gap-3">
          <Button variant="ghost" onClick={() => void logout()}>Logout</Button>
          <Button onClick={() => void handleContinue()}>Continue</Button>
        </div>
      </div>
    </main>
  );
};

export const AuthenticatedRoute = () => {
  const { status, activeCompanyId } = useAuth();
  const location = useLocation();

  if (status === "loading") return <SessionLoader />;
  if (status !== "authenticated") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (activeCompanyId === null) return <CompanyRequired />;
  return <Outlet />;
};

export const UnauthenticatedRoute = () => {
  const { status } = useAuth();
  if (status === "loading") return <SessionLoader />;
  if (status === "authenticated") return <Navigate to="/" replace />;
  return <Outlet />;
};
