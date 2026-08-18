import { useRef, useState, type KeyboardEvent } from "react";
import { AlertTriangle, ArrowLeft, Building2, RotateCcw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge, Button, PageSpinner } from "@/shared/ui";
import { CompanyOverviewTab } from "../components/CompanyOverviewTab";
import { BranchListTab } from "../components/BranchListTab";
import { DepartmentListTab } from "../components/DepartmentListTab";
import { DesignationListTab } from "../components/DesignationListTab";
import { WeekOffListTab } from "../components/WeekOffListTab";
import { HolidayListTab } from "../components/HolidayListTab";
import { HolidayTab } from "../components/HolidayTab";
import { AssetTypeTab } from "../components/AssetTypeTab";
import { PolicyListTab } from "../components/PolicyListTab";
import { useCompany } from "../hooks/useCompanies";

const COMPANY_TABS = [
  "Overview",
  "Branch",
  "Department",
  "Designation",
  "Week Off",
  "Holiday List",
  "Holiday",
  "Asset Types",
  "Policies",
] as const;

type EnabledCompanyTab =
  | "Overview"
  | "Branch"
  | "Department"
  | "Designation"
  | "Week Off"
  | "Holiday List"
  | "Holiday"
  | "Asset Types"
  | "Policies";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unable to load company";

const CompanyDetailPage = () => {
  const [activeTab, setActiveTab] = useState<EnabledCompanyTab>("Overview");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const companyId = Number(id);
  const validCompanyId = Number.isInteger(companyId) && companyId > 0;
  const companyQuery = useCompany(validCompanyId ? companyId : 0);

  if (!validCompanyId) {
    return (
      <div className="card flex flex-col items-center gap-3 p-8 text-center">
        <AlertTriangle className="size-9 text-error" />
        <h1 className="font-semibold text-slate-800 dark:text-navy-100">
          Invalid Company
        </h1>
        <p className="text-sm text-slate-500 dark:text-navy-300">
          The Company identifier in this URL is not valid.
        </p>
        <Button variant="outline" onClick={() => navigate("/hr/companies")}>
          Back to Companies
        </Button>
      </div>
    );
  }

  if (companyQuery.isLoading) return <PageSpinner />;

  if (companyQuery.isError || !companyQuery.data) {
    return (
      <div className="card flex flex-col items-center gap-3 p-8 text-center">
        <AlertTriangle className="size-9 text-error" />
        <div>
          <h1 className="font-semibold text-slate-800 dark:text-navy-100">
            Unable to load Company
          </h1>
          <p className="mt-1 text-sm text-error">
            {getErrorMessage(companyQuery.error)}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="outline" onClick={() => navigate("/hr/companies")}>
            Back to Companies
          </Button>
          <Button
            variant="outline"
            leftIcon={<RotateCcw className="size-4" />}
            onClick={() => companyQuery.refetch()}
            isLoading={companyQuery.isFetching}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const company = companyQuery.data;

  const selectTab = (index: number) => {
    const tab = COMPANY_TABS[index];
    setActiveTab(tab);
    tabRefs.current[index]?.focus();
  };

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % COMPANY_TABS.length;
    if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + COMPANY_TABS.length) % COMPANY_TABS.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = COMPANY_TABS.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    selectTab(nextIndex);
  };

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => navigate("/hr/companies")}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary dark:text-navy-300"
      >
        <ArrowLeft className="size-4" /> Back to Companies
      </button>

      <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-center gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="size-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-800 dark:text-navy-100">
              {company.company_name}
            </h1>
            <p className="text-sm text-slate-500 dark:text-navy-300">
              {company.industry_type}
            </p>
          </div>
        </div>
        <Badge
          label={company.status === "active" ? "Active" : "Inactive"}
          variant={company.status === "active" ? "success" : "default"}
        />
      </div>

      <nav
        aria-label="Company sections"
        className="overflow-x-auto border-b border-slate-200 dark:border-navy-600"
      >
        <div className="flex min-w-max gap-1" role="tablist">
          {COMPANY_TABS.map((tab, index) => {
            const active = tab === activeTab;
            return (
            <button
              key={tab}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls="company-tab-panel"
              tabIndex={active ? 0 : -1}
              onClick={() => setActiveTab(tab)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={
                active
                  ? "border-b-2 border-primary px-3 py-2.5 text-sm font-medium text-primary"
                  : "px-3 py-2.5 text-sm text-slate-600 hover:text-primary dark:text-navy-200"
              }
            >
              {tab}
            </button>
            );
          })}
        </div>
      </nav>

      <div id="company-tab-panel" role="tabpanel" aria-label={activeTab}>
        {activeTab === "Overview" ? (
          <CompanyOverviewTab company={company} />
        ) : activeTab === "Branch" ? (
          <BranchListTab companyId={company.id} />
        ) : activeTab === "Department" ? (
          <DepartmentListTab companyId={company.id} />
        ) : activeTab === "Designation" ? (
          <DesignationListTab companyId={company.id} />
        ) : activeTab === "Week Off" ? (
          <WeekOffListTab companyId={company.id} />
        ) : activeTab === "Holiday List" ? (
          <HolidayListTab companyId={company.id} />
        ) : activeTab === "Holiday" ? (
          <HolidayTab companyId={company.id} />
        ) : activeTab === "Asset Types" ? (
          <AssetTypeTab companyId={company.id} />
        ) : (
          <PolicyListTab companyId={company.id} />
        )}
      </div>
    </div>
  );
};

export default CompanyDetailPage;
