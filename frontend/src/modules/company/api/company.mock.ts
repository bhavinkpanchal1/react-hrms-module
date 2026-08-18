import type {
  AssetType,
  AssetTypeParams,
  Branch,
  BranchListParams,
  Company,
  CompanyEntityId,
  CompanyListParams,
  CreateBranchInput,
  CreateAssetTypeInput,
  CreateCompanyInput,
  CreateDepartmentInput,
  CreateDesignationInput,
  CreateHolidayListInput,
  CreateHolidayInput,
  CreatePolicyInput,
  CreateWeekOffInput,
  Department,
  DepartmentListParams,
  Designation,
  DesignationListParams,
  HolidayList,
  HolidayListParams,
  Holiday,
  HolidayParams,
  PagedResult,
  Policy,
  PolicyFileAccess,
  PolicyFileDownload,
  PolicyListParams,
  UpdateCompanyInput,
  UpdateAssetTypeInput,
  UpdateBranchInput,
  UpdateDepartmentInput,
  UpdateDesignationInput,
  UpdateHolidayListInput,
  UpdateHolidayInput,
  UpdateWeekOffInput,
  WeekOff,
} from "../types/company.types";
import { createWeekOffGrid } from "../lib/week-off-grid";

const MOCK_LIST_DELAY_MS = 500;
const MOCK_DETAIL_DELAY_MS = 300;
const MOCK_MUTATION_DELAY_MS = 500;

type CompanyMockScenario =
  | "default"
  | "empty"
  | "list_error"
  | "detail_error"
  | "create_error"
  | "update_error"
  | "delete_error";

const MOCK_SCENARIO =
  (import.meta.env.VITE_COMPANY_MOCK_SCENARIO as CompanyMockScenario | undefined) ??
  "default";
let remainingListFailures = MOCK_SCENARIO === "list_error" ? 3 : 0;
let remainingBranchListFailures = MOCK_SCENARIO === "list_error" ? 3 : 0;
let remainingDepartmentListFailures = MOCK_SCENARIO === "list_error" ? 3 : 0;
let remainingDesignationListFailures = MOCK_SCENARIO === "list_error" ? 3 : 0;
let remainingWeekOffListFailures = MOCK_SCENARIO === "list_error" ? 3 : 0;
let remainingHolidayListFailures = MOCK_SCENARIO === "list_error" ? 3 : 0;
let remainingHolidayFailures = MOCK_SCENARIO === "list_error" ? 3 : 0;
let remainingAssetTypeFailures = MOCK_SCENARIO === "list_error" ? 3 : 0;
let remainingPolicyFailures = MOCK_SCENARIO === "list_error" ? 3 : 0;

export const mockDelay = (ms = MOCK_LIST_DELAY_MS) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const now = "2026-08-01T09:00:00.000Z";

let mockCompanies: Company[] = [
  {
    id: 1,
    company_name: "PeoplePulse Technologies",
    industry_type: "Information Technology",
    company_start_date: "2018-04-01",
    status: "active",
    contact_email: "people@peoplepulse.example",
    contact_number: "+91 90000 00001",
    website: "https://peoplepulse.example",
    smtp: {
      host: "smtp.peoplepulse.example",
      port: 587,
      username: "notifications",
      from_email: "notifications@peoplepulse.example",
      use_tls: true,
      password_configured: true,
    },
    registered_office: {
      address_line_1: "12 Technology Park",
      address_line_2: "North Wing",
      country: "India",
      state: "Karnataka",
      city: "Bengaluru",
      pincode: "560001",
    },
    corporate_office: {
      address_line_1: "84 Business Avenue",
      address_line_2: "Floor 4",
      country: "India",
      state: "Maharashtra",
      city: "Pune",
      pincode: "411001",
    },
    bank_information: {
      bank_name: "Example Commercial Bank",
      branch_name: "Central Branch",
      account_holder_name: "PeoplePulse Technologies",
      account_number: "000012340001",
      ifsc_code: "EXAM0000001",
    },
    created_at: now,
    updated_at: now,
  },
  { id: 2, company_name: "Northstar Services", industry_type: "Business Services", company_start_date: "2020-07-15", status: "active", created_at: now, updated_at: now },
  { id: 3, company_name: "Bluehaven Healthcare", industry_type: "Healthcare", company_start_date: "2016-11-20", status: "active", created_at: now, updated_at: now },
  { id: 4, company_name: "Greenfield Foods", industry_type: "Food and Beverage", company_start_date: "2014-02-10", status: "inactive", created_at: now, updated_at: now },
  { id: 5, company_name: "Silverline Finance", industry_type: "Financial Services", company_start_date: "2019-09-05", status: "active", created_at: now, updated_at: now },
  { id: 6, company_name: "Orbit Learning Labs", industry_type: "Education", company_start_date: "2021-01-12", status: "active", created_at: now, updated_at: now },
  { id: 7, company_name: "Harbor Retail Group", industry_type: "Retail", company_start_date: "2013-06-18", status: "inactive", created_at: now, updated_at: now },
  { id: 8, company_name: "Aster Manufacturing", industry_type: "Manufacturing", company_start_date: "2011-03-25", status: "active", created_at: now, updated_at: now },
  { id: 9, company_name: "Cloudbridge Consulting", industry_type: "Consulting", company_start_date: "2022-05-09", status: "active", created_at: now, updated_at: now },
  { id: 10, company_name: "Cedar Logistics", industry_type: "Logistics", company_start_date: "2017-08-14", status: "inactive", created_at: now, updated_at: now },
  { id: 11, company_name: "Suncrest Energy", industry_type: "Renewable Energy", company_start_date: "2015-12-01", status: "active", created_at: now, updated_at: now },
  { id: 12, company_name: "Meadow Media House", industry_type: "Media", company_start_date: "2023-02-16", status: "active", created_at: now, updated_at: now },
  { id: 13, company_name: "Granite Construction", industry_type: "Construction", company_start_date: "2012-10-30", status: "inactive", created_at: now, updated_at: now },
  { id: 14, company_name: "Brightpath Analytics", industry_type: "Data Analytics", company_start_date: "2024-01-08", status: "active", created_at: now, updated_at: now },
  { id: 15, company_name: "Willow Hospitality", industry_type: "Hospitality", company_start_date: "2010-04-22", status: "active", created_at: now, updated_at: now },
];

let nextCompanyId = Math.max(...mockCompanies.map((company) => company.id)) + 1;

let mockBranches: Branch[] = [
  {
    id: 101,
    company_id: 1,
    branch_name: "Vadodara Head Office",
    email: "vadodara@peoplepulse.example",
    contact_number: "+91 98765 41001",
    address: "K-PLEX, Gotri Road, Vadodara, Gujarat",
    pincode: "390021",
    latitude: 22.3072,
    longitude: 73.1812,
    radius_meters: 100,
    employee_id_series: "VAD-EMP",
    start_date: "2018-04-01",
    status: "active",
    created_at: now,
    updated_at: now,
  },
  {
    id: 102,
    company_id: 1,
    branch_name: "Ahmedabad Office",
    email: "ahmedabad@peoplepulse.example",
    contact_number: "+91 98765 41002",
    address: "Riverfront Business Centre, Ahmedabad, Gujarat",
    pincode: "380009",
    latitude: 23.0225,
    longitude: 72.5714,
    radius_meters: 175,
    employee_id_series: "AMD-EMP",
    start_date: "2020-06-15",
    status: "active",
    created_at: now,
    updated_at: now,
  },
  {
    id: 103,
    company_id: 1,
    branch_name: "Surat Support Centre",
    email: "surat@peoplepulse.example",
    contact_number: "+91 98765 41003",
    address: "Textile Market Road, Surat, Gujarat",
    pincode: "395002",
    latitude: 21.1702,
    longitude: 72.8311,
    radius_meters: 80,
    employee_id_series: "SRT-EMP",
    start_date: "2021-09-01",
    status: "inactive",
    created_at: now,
    updated_at: now,
  },
  {
    id: 104,
    company_id: 2,
    branch_name: "Mumbai Operations Office",
    email: "mumbai@northstar.example",
    contact_number: "+91 98765 42001",
    address: "Harbour Commerce Park, Mumbai, Maharashtra",
    pincode: "400001",
    latitude: 18.9388,
    longitude: 72.8354,
    radius_meters: 250,
    employee_id_series: "MUM-OPS",
    start_date: "2020-07-15",
    status: "active",
    created_at: now,
    updated_at: now,
  },
  {
    id: 105,
    company_id: 2,
    branch_name: "Navi Mumbai Service Centre",
    email: "navimumbai@northstar.example",
    contact_number: "+91 98765 42002",
    address: "Palm Business District, Navi Mumbai, Maharashtra",
    pincode: "400705",
    latitude: 19.033,
    longitude: 73.0297,
    radius_meters: 120,
    employee_id_series: "NVM-SVC",
    start_date: "2022-03-10",
    status: "inactive",
    created_at: now,
    updated_at: now,
  },
  {
    id: 106,
    company_id: 4,
    branch_name: "Pune Distribution Office",
    email: "pune@greenfield.example",
    contact_number: "+91 98765 44001",
    address: "Market Yard Annex, Pune, Maharashtra",
    pincode: "411037",
    latitude: 18.5018,
    longitude: 73.8636,
    radius_meters: 60,
    employee_id_series: "PUN-DST",
    start_date: "2017-01-12",
    status: "active",
    created_at: now,
    updated_at: now,
  },
];

let nextBranchId = Math.max(...mockBranches.map((branch) => branch.id)) + 1;

let mockDepartments: Department[] = [
  { id: 201, company_id: 1, name: "Engineering", created_at: now, updated_at: now },
  { id: 202, company_id: 1, name: "Human Resources", created_at: now, updated_at: now },
  { id: 203, company_id: 1, name: "Finance", created_at: now, updated_at: now },
  { id: 204, company_id: 1, name: "Operations", created_at: now, updated_at: now },
  { id: 205, company_id: 2, name: "Customer Support", created_at: now, updated_at: now },
  { id: 206, company_id: 2, name: "Service Delivery", created_at: now, updated_at: now },
  { id: 207, company_id: 4, name: "Quality Assurance", created_at: now, updated_at: now },
  { id: 208, company_id: 4, name: "Supply Chain", created_at: now, updated_at: now },
];

let nextDepartmentId =
  Math.max(...mockDepartments.map((department) => department.id)) + 1;

let mockDesignations: Designation[] = [
  { id: 301, company_id: 1, name: "Software Engineer", department_id: 201, created_at: now, updated_at: now },
  { id: 302, company_id: 1, name: "Senior Software Engineer", department_id: 201, created_at: now, updated_at: now },
  { id: 303, company_id: 1, name: "HR Executive", department_id: 202, created_at: now, updated_at: now },
  { id: 304, company_id: 1, name: "Finance Analyst", department_id: 203, created_at: now, updated_at: now },
  { id: 305, company_id: 1, name: "Operations Coordinator", department_id: 204, created_at: now, updated_at: now },
  { id: 306, company_id: 1, name: "Company Secretary", department_id: null, created_at: now, updated_at: now },
  { id: 307, company_id: 2, name: "Support Executive", department_id: 205, created_at: now, updated_at: now },
  { id: 308, company_id: 2, name: "Service Delivery Manager", department_id: 206, created_at: now, updated_at: now },
  { id: 309, company_id: 4, name: "Quality Inspector", department_id: 207, created_at: now, updated_at: now },
  { id: 310, company_id: 4, name: "Supply Chain Planner", department_id: 208, created_at: now, updated_at: now },
];

let nextDesignationId =
  Math.max(...mockDesignations.map((designation) => designation.id)) + 1;

let mockWeekOffs: WeekOff[] = [
  {
    id: 401,
    company_id: 1,
    policy_name: "Standard Office Week",
    grid: createWeekOffGrid((occurrence, weekday) => {
      if (weekday === "sunday") return "week_off";
      if (weekday === "saturday" && (occurrence === 2 || occurrence === 4)) {
        return "week_off";
      }
      return "working";
    }),
    created_at: now,
    updated_at: now,
  },
  {
    id: 402,
    company_id: 1,
    policy_name: "Customer Support Rotation",
    grid: createWeekOffGrid((occurrence, weekday) => {
      if (weekday === "sunday") return "week_off";
      if (weekday === "saturday" && occurrence === 1) return "half_day";
      return "working";
    }),
    created_at: now,
    updated_at: now,
  },
  {
    id: 403,
    company_id: 2,
    policy_name: "Northstar Service Week",
    grid: createWeekOffGrid((_occurrence, weekday) =>
      weekday === "saturday" || weekday === "sunday" ? "week_off" : "working",
    ),
    created_at: now,
    updated_at: now,
  },
];

let nextWeekOffId = Math.max(...mockWeekOffs.map((weekOff) => weekOff.id)) + 1;

let mockHolidayLists: HolidayList[] = [
  { id: 501, company_id: 1, name: "India Holidays", year: 2026, remarks: "National and regional holidays", created_at: now, updated_at: now },
  { id: 502, company_id: 1, name: "Gujarat Optional Holidays", year: 2026, remarks: "Optional calendar for the Gujarat offices", created_at: now, updated_at: now },
  { id: 503, company_id: 1, name: "India Holidays", year: 2027, created_at: now, updated_at: now },
  { id: 504, company_id: 2, name: "Maharashtra Holidays", year: 2026, remarks: "Mumbai operations calendar", created_at: now, updated_at: now },
  { id: 505, company_id: 4, name: "Manufacturing Holidays", year: 2026, created_at: now, updated_at: now },
];

let nextHolidayListId =
  Math.max(...mockHolidayLists.map((holidayList) => holidayList.id)) + 1;

let mockHolidays: Holiday[] = [
  { id: 601, company_id: 1, holiday_list_id: 501, date: "2026-01-26", name: "Republic Day", description: "National holiday", created_at: now, updated_at: now },
  { id: 602, company_id: 1, holiday_list_id: 501, date: "2026-08-15", name: "Independence Day", created_at: now, updated_at: now },
  { id: 603, company_id: 1, holiday_list_id: 501, date: "2026-10-02", name: "Gandhi Jayanti", created_at: now, updated_at: now },
  { id: 604, company_id: 1, holiday_list_id: 502, date: "2026-01-14", name: "Uttarayan", description: "Optional regional holiday", created_at: now, updated_at: now },
  { id: 605, company_id: 1, holiday_list_id: 502, date: "2026-10-31", name: "Sardar Patel Jayanti", created_at: now, updated_at: now },
  { id: 606, company_id: 2, holiday_list_id: 504, date: "2026-05-01", name: "Maharashtra Day", created_at: now, updated_at: now },
];

let nextHolidayId = Math.max(...mockHolidays.map((holiday) => holiday.id)) + 1;

let mockAssetTypes: AssetType[] = [
  { id: 701, company_id: 1, name: "Laptop", created_at: now, updated_at: now },
  { id: 702, company_id: 1, name: "Desktop", created_at: now, updated_at: now },
  { id: 703, company_id: 1, name: "Monitor", created_at: now, updated_at: now },
  { id: 704, company_id: 1, name: "Mobile Phone", created_at: now, updated_at: now },
  { id: 705, company_id: 1, name: "Keyboard", created_at: now, updated_at: now },
  { id: 706, company_id: 1, name: "Headset", created_at: now, updated_at: now },
  { id: 707, company_id: 2, name: "Tablet", created_at: now, updated_at: now },
  { id: 708, company_id: 2, name: "Printer", created_at: now, updated_at: now },
  { id: 709, company_id: 4, name: "Office Chair", created_at: now, updated_at: now },
];

let nextAssetTypeId =
  Math.max(...mockAssetTypes.map((assetType) => assetType.id)) + 1;

let mockPolicies: Policy[] = [
  { id: 801, company_id: 1, policy_name: "Remote Work Policy", description: "Guidelines for approved remote work.", file: { file_name: "remote-work-policy.txt", mime_type: "text/plain", size_bytes: 47, uploaded_at: now }, created_at: now, updated_at: now },
  { id: 802, company_id: 1, policy_name: "Information Security Policy", description: "Information handling and security expectations.", file: { file_name: "information-security.json", mime_type: "application/json", size_bytes: 55, uploaded_at: now }, created_at: now, updated_at: now },
  { id: 803, company_id: 1, policy_name: "Workplace Conduct Policy", file: { file_name: "workplace-conduct.txt", mime_type: "text/plain", size_bytes: 44, uploaded_at: now }, created_at: now, updated_at: now },
  { id: 804, company_id: 1, policy_name: "Travel Policy", description: "Business travel guidance.", file: { file_name: "travel-policy.svg", mime_type: "image/svg+xml", size_bytes: 170, uploaded_at: now }, created_at: now, updated_at: now },
  { id: 805, company_id: 2, policy_name: "Customer Data Policy", description: "Customer data handling guidance.", file: { file_name: "customer-data-policy.txt", mime_type: "text/plain", size_bytes: 43, uploaded_at: now }, created_at: now, updated_at: now },
  { id: 806, company_id: 1, policy_name: "Service Conduct Policy", file: { file_name: "service-conduct.json", mime_type: "application/json", size_bytes: 42, uploaded_at: now }, created_at: now, updated_at: now },
  { id: 807, company_id: 1, policy_name: "Health and Safety Policy", description: "Workplace health and safety guidance.", file: { file_name: "health-and-safety.txt", mime_type: "text/plain", size_bytes: 45, uploaded_at: now }, created_at: now, updated_at: now },
];

let nextPolicyId = Math.max(...mockPolicies.map((policy) => policy.id)) + 1;

const mockPolicyFiles = new Map<CompanyEntityId, Blob>([
  [801, new Blob(["Remote work requires manager approval and secure access."], { type: "text/plain" })],
  [802, new Blob(['{"policy":"Protect confidential information and credentials."}'], { type: "application/json" })],
  [803, new Blob(["Treat colleagues and customers with respect."], { type: "text/plain" })],
  [804, new Blob(['<svg xmlns="http://www.w3.org/2000/svg" width="480" height="120"><rect width="100%" height="100%" fill="white"/><text x="20" y="65" font-size="24">Travel Policy Fixture</text></svg>'], { type: "image/svg+xml" })],
  [805, new Blob(["Handle customer data only for approved purposes."], { type: "text/plain" })],
  [806, new Blob(['{"policy":"Maintain professional service conduct."}'], { type: "application/json" })],
  [807, new Blob(["Follow approved workplace health and safety guidance."], { type: "text/plain" })],
]);
const mockPolicyObjectUrls = new Map<CompanyEntityId, string>();

const copyCompany = (company: Company): Company => ({
  ...company,
  logo: company.logo ? { ...company.logo } : company.logo,
  smtp: company.smtp ? { ...company.smtp } : undefined,
  registered_office: company.registered_office
    ? { ...company.registered_office }
    : undefined,
  corporate_office: company.corporate_office
    ? { ...company.corporate_office }
    : undefined,
  bank_information: company.bank_information
    ? { ...company.bank_information }
    : undefined,
});

const copyBranch = (branch: Branch): Branch => ({ ...branch });
const copyDepartment = (department: Department): Department => ({ ...department });
const copyDesignation = (designation: Designation): Designation => ({ ...designation });
const copyWeekOff = (weekOff: WeekOff): WeekOff => ({
  ...weekOff,
  grid: weekOff.grid.map((cell) => ({ ...cell })),
});
const copyHolidayList = (holidayList: HolidayList): HolidayList => ({
  ...holidayList,
});
const copyHoliday = (holiday: Holiday): Holiday => ({ ...holiday });
const copyAssetType = (assetType: AssetType): AssetType => ({ ...assetType });
const copyPolicy = (policy: Policy): Policy => ({
  ...policy,
  file: { ...policy.file },
});

const revokePolicyObjectUrl = (policyId: CompanyEntityId) => {
  const objectUrl = mockPolicyObjectUrls.get(policyId);
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  mockPolicyObjectUrls.delete(policyId);
};

const getOwnedPolicy = (
  companyId: CompanyEntityId,
  policyId: CompanyEntityId,
): Policy => {
  ensureCompanyExists(companyId);
  const policy = mockPolicies.find(
    (item) => item.company_id === companyId && item.id === policyId,
  );
  if (!policy) throw new Error("Policy not found");
  return policy;
};

const ensureCompanyExists = (companyId: CompanyEntityId) => {
  if (!mockCompanies.some((company) => company.id === companyId)) {
    throw new Error("Company not found");
  }
};

const ensureHolidayListOwnership = (
  companyId: CompanyEntityId,
  holidayListId: CompanyEntityId,
): HolidayList => {
  ensureCompanyExists(companyId);
  const holidayList = mockHolidayLists.find(
    (item) => item.id === holidayListId && item.company_id === companyId,
  );
  if (!holidayList) throw new Error("Holiday List not found for this Company");
  return holidayList;
};

const validateHolidayMockConstraints = (
  holidayList: HolidayList,
  data: Pick<Holiday, "date">,
  ignoredHolidayId?: CompanyEntityId,
) => {
  if (!data.date.startsWith(`${holidayList.year}-`)) {
    throw new Error("Holiday date must be within the Holiday List year");
  }
  if (
    mockHolidays.some(
      (holiday) =>
        holiday.holiday_list_id === holidayList.id &&
        holiday.date === data.date &&
        holiday.id !== ignoredHolidayId,
    )
  ) {
    throw new Error("A Holiday already exists on this date");
  }
};

const ensureDepartmentOwnership = (
  companyId: CompanyEntityId,
  departmentId: CompanyEntityId | null,
) => {
  if (departmentId === null) return;
  if (
    !mockDepartments.some(
      (department) =>
        department.id === departmentId && department.company_id === companyId,
    )
  ) {
    throw new Error("Department not found for this Company");
  }
};

export const companyMockApi = {
  getCompanies: async (
    params: CompanyListParams,
  ): Promise<PagedResult<Company>> => {
    await mockDelay(MOCK_LIST_DELAY_MS);

    if (remainingListFailures > 0) {
      remainingListFailures -= 1;
      throw new Error("Unable to load companies");
    }
    if (MOCK_SCENARIO === "empty") {
      return {
        items: [],
        total: 0,
        page: Math.max(1, params.page),
        page_size: Math.max(1, params.page_size),
      };
    }

    const search = params.search?.trim().toLocaleLowerCase() ?? "";
    let results = mockCompanies.filter((company) => {
      const matchesSearch =
        !search || company.company_name.toLocaleLowerCase().includes(search);
      const matchesStatus = !params.status || company.status === params.status;
      const matchesIndustry =
        !params.industry_type || company.industry_type === params.industry_type;
      return matchesSearch && matchesStatus && matchesIndustry;
    });

    results = [...results].sort((a, b) =>
      a.company_name.localeCompare(b.company_name),
    );

    const pageSize = Math.max(1, params.page_size);
    const page = Math.max(1, params.page);
    const start = (page - 1) * pageSize;

    return {
      items: results.slice(start, start + pageSize).map(copyCompany),
      total: results.length,
      page,
      page_size: pageSize,
    };
  },

  getCompanyById: async (id: CompanyEntityId): Promise<Company> => {
    await mockDelay(MOCK_DETAIL_DELAY_MS);
    if (MOCK_SCENARIO === "detail_error") {
      throw new Error("Unable to load company");
    }
    const company = mockCompanies.find((item) => item.id === id);
    if (!company) throw new Error("Company not found");
    return copyCompany(company);
  },

  createCompany: async (data: CreateCompanyInput): Promise<Company> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    if (MOCK_SCENARIO === "create_error") {
      throw new Error("Unable to create company");
    }
    const timestamp = new Date().toISOString();
    const company: Company = {
      ...data,
      id: nextCompanyId++,
      status: "active",
      created_at: timestamp,
      updated_at: timestamp,
    };
    mockCompanies = [...mockCompanies, company];
    return copyCompany(company);
  },

  updateCompany: async (
    id: CompanyEntityId,
    data: UpdateCompanyInput,
  ): Promise<Company> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    if (MOCK_SCENARIO === "update_error") {
      throw new Error("Unable to update company");
    }
    const index = mockCompanies.findIndex((company) => company.id === id);
    if (index < 0) throw new Error("Company not found");

    const updated: Company = {
      ...mockCompanies[index],
      ...data,
      id,
      updated_at: new Date().toISOString(),
    };
    mockCompanies = mockCompanies.map((company) =>
      company.id === id ? updated : company,
    );
    return copyCompany(updated);
  },

  deleteCompany: async (id: CompanyEntityId): Promise<void> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    if (MOCK_SCENARIO === "delete_error") {
      throw new Error("Unable to delete company");
    }
    if (!mockCompanies.some((company) => company.id === id)) {
      throw new Error("Company not found");
    }
    mockCompanies = mockCompanies.filter((company) => company.id !== id);
    mockBranches = mockBranches.filter((branch) => branch.company_id !== id);
    mockDepartments = mockDepartments.filter(
      (department) => department.company_id !== id,
    );
    mockDesignations = mockDesignations.filter(
      (designation) => designation.company_id !== id,
    );
    mockWeekOffs = mockWeekOffs.filter((weekOff) => weekOff.company_id !== id);
    mockHolidays = mockHolidays.filter((holiday) => holiday.company_id !== id);
    mockHolidayLists = mockHolidayLists.filter(
      (holidayList) => holidayList.company_id !== id,
    );
    mockAssetTypes = mockAssetTypes.filter(
      (assetType) => assetType.company_id !== id,
    );
    mockPolicies
      .filter((policy) => policy.company_id === id)
      .forEach((policy) => {
        revokePolicyObjectUrl(policy.id);
        mockPolicyFiles.delete(policy.id);
      });
    mockPolicies = mockPolicies.filter((policy) => policy.company_id !== id);
  },

  getBranches: async (
    companyId: CompanyEntityId,
    params: BranchListParams,
  ): Promise<PagedResult<Branch>> => {
    await mockDelay(MOCK_LIST_DELAY_MS);
    ensureCompanyExists(companyId);
    if (remainingBranchListFailures > 0) {
      remainingBranchListFailures -= 1;
      throw new Error("Unable to load branches");
    }

    const search = params.search?.trim().toLocaleLowerCase() ?? "";
    let results = mockBranches.filter((branch) => {
      if (branch.company_id !== companyId) return false;
      const searchable = [
        branch.branch_name,
        branch.address,
        branch.email,
        branch.contact_number,
      ].join(" ").toLocaleLowerCase();
      const matchesSearch = !search || searchable.includes(search);
      const matchesStatus = !params.status || branch.status === params.status;
      return matchesSearch && matchesStatus;
    });
    results = [...results].sort((a, b) =>
      a.branch_name.localeCompare(b.branch_name),
    );
    const page = Math.max(1, params.page);
    const pageSize = Math.max(1, params.page_size);
    const start = (page - 1) * pageSize;

    return {
      items: results.slice(start, start + pageSize).map(copyBranch),
      total: results.length,
      page,
      page_size: pageSize,
    };
  },

  getBranchById: async (
    companyId: CompanyEntityId,
    branchId: CompanyEntityId,
  ): Promise<Branch> => {
    await mockDelay(MOCK_DETAIL_DELAY_MS);
    ensureCompanyExists(companyId);
    if (MOCK_SCENARIO === "detail_error") {
      throw new Error("Unable to load branch");
    }
    const branch = mockBranches.find(
      (item) => item.company_id === companyId && item.id === branchId,
    );
    if (!branch) throw new Error("Branch not found");
    return copyBranch(branch);
  },

  createBranch: async (
    companyId: CompanyEntityId,
    data: CreateBranchInput,
  ): Promise<Branch> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    ensureCompanyExists(companyId);
    if (MOCK_SCENARIO === "create_error") {
      throw new Error("Unable to create branch");
    }
    const timestamp = new Date().toISOString();
    const branch: Branch = {
      ...data,
      id: nextBranchId++,
      company_id: companyId,
      created_at: timestamp,
      updated_at: timestamp,
    };
    mockBranches = [...mockBranches, branch];
    return copyBranch(branch);
  },

  updateBranch: async (
    companyId: CompanyEntityId,
    branchId: CompanyEntityId,
    data: UpdateBranchInput,
  ): Promise<Branch> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    ensureCompanyExists(companyId);
    if (MOCK_SCENARIO === "update_error") {
      throw new Error("Unable to update branch");
    }
    const index = mockBranches.findIndex(
      (branch) => branch.company_id === companyId && branch.id === branchId,
    );
    if (index < 0) throw new Error("Branch not found");
    const updated: Branch = {
      ...mockBranches[index],
      ...data,
      id: branchId,
      company_id: companyId,
      updated_at: new Date().toISOString(),
    };
    mockBranches = mockBranches.map((branch) =>
      branch.id === branchId && branch.company_id === companyId ? updated : branch,
    );
    return copyBranch(updated);
  },

  deleteBranch: async (
    companyId: CompanyEntityId,
    branchId: CompanyEntityId,
  ): Promise<void> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    ensureCompanyExists(companyId);
    if (MOCK_SCENARIO === "delete_error") {
      throw new Error("Unable to delete branch");
    }
    const exists = mockBranches.some(
      (branch) => branch.company_id === companyId && branch.id === branchId,
    );
    if (!exists) throw new Error("Branch not found");
    mockBranches = mockBranches.filter(
      (branch) => branch.company_id !== companyId || branch.id !== branchId,
    );
  },

  getDepartments: async (
    companyId: CompanyEntityId,
    params: DepartmentListParams,
  ): Promise<PagedResult<Department>> => {
    await mockDelay(MOCK_LIST_DELAY_MS);
    ensureCompanyExists(companyId);
    if (remainingDepartmentListFailures > 0) {
      remainingDepartmentListFailures -= 1;
      throw new Error("Unable to load departments");
    }
    const search = params.search?.trim().toLocaleLowerCase() ?? "";
    const results = mockDepartments
      .filter(
        (department) =>
          department.company_id === companyId &&
          (!search || department.name.toLocaleLowerCase().includes(search)),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
    const page = Math.max(1, params.page);
    const pageSize = Math.max(1, params.page_size);
    const start = (page - 1) * pageSize;
    return {
      items: results.slice(start, start + pageSize).map(copyDepartment),
      total: results.length,
      page,
      page_size: pageSize,
    };
  },

  getDepartmentById: async (
    companyId: CompanyEntityId,
    departmentId: CompanyEntityId,
  ): Promise<Department> => {
    await mockDelay(MOCK_DETAIL_DELAY_MS);
    ensureCompanyExists(companyId);
    if (MOCK_SCENARIO === "detail_error") {
      throw new Error("Unable to load department");
    }
    const department = mockDepartments.find(
      (item) => item.company_id === companyId && item.id === departmentId,
    );
    if (!department) throw new Error("Department not found");
    return copyDepartment(department);
  },

  createDepartment: async (
    companyId: CompanyEntityId,
    data: CreateDepartmentInput,
  ): Promise<Department> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    ensureCompanyExists(companyId);
    if (MOCK_SCENARIO === "create_error") {
      throw new Error("Unable to create department");
    }
    const timestamp = new Date().toISOString();
    const department: Department = {
      ...data,
      id: nextDepartmentId++,
      company_id: companyId,
      created_at: timestamp,
      updated_at: timestamp,
    };
    mockDepartments = [...mockDepartments, department];
    return copyDepartment(department);
  },

  updateDepartment: async (
    companyId: CompanyEntityId,
    departmentId: CompanyEntityId,
    data: UpdateDepartmentInput,
  ): Promise<Department> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    ensureCompanyExists(companyId);
    if (MOCK_SCENARIO === "update_error") {
      throw new Error("Unable to update department");
    }
    const index = mockDepartments.findIndex(
      (department) =>
        department.company_id === companyId && department.id === departmentId,
    );
    if (index < 0) throw new Error("Department not found");
    const updated: Department = {
      ...mockDepartments[index],
      ...data,
      id: departmentId,
      company_id: companyId,
      updated_at: new Date().toISOString(),
    };
    mockDepartments = mockDepartments.map((department) =>
      department.company_id === companyId && department.id === departmentId
        ? updated
        : department,
    );
    return copyDepartment(updated);
  },

  deleteDepartment: async (
    companyId: CompanyEntityId,
    departmentId: CompanyEntityId,
  ): Promise<void> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    ensureCompanyExists(companyId);
    if (MOCK_SCENARIO === "delete_error") {
      throw new Error("Unable to delete department");
    }
    const exists = mockDepartments.some(
      (department) =>
        department.company_id === companyId && department.id === departmentId,
    );
    if (!exists) throw new Error("Department not found");
    if (
      mockDesignations.some(
        (designation) =>
          designation.company_id === companyId &&
          designation.department_id === departmentId,
      )
    ) {
      throw new Error("Department is assigned to one or more Designations");
    }
    mockDepartments = mockDepartments.filter(
      (department) =>
        department.company_id !== companyId || department.id !== departmentId,
    );
  },

  getDesignations: async (
    companyId: CompanyEntityId,
    params: DesignationListParams,
  ): Promise<PagedResult<Designation>> => {
    await mockDelay(MOCK_LIST_DELAY_MS);
    ensureCompanyExists(companyId);
    if (remainingDesignationListFailures > 0) {
      remainingDesignationListFailures -= 1;
      throw new Error("Unable to load designations");
    }
    const search = params.search?.trim().toLocaleLowerCase() ?? "";
    const results = mockDesignations
      .filter(
        (designation) =>
          designation.company_id === companyId &&
          (!search || designation.name.toLocaleLowerCase().includes(search)) &&
          (!params.department_id ||
            designation.department_id === params.department_id),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
    const page = Math.max(1, params.page);
    const pageSize = Math.max(1, params.page_size);
    const start = (page - 1) * pageSize;
    return {
      items: results.slice(start, start + pageSize).map(copyDesignation),
      total: results.length,
      page,
      page_size: pageSize,
    };
  },

  getDesignationById: async (
    companyId: CompanyEntityId,
    designationId: CompanyEntityId,
  ): Promise<Designation> => {
    await mockDelay(MOCK_DETAIL_DELAY_MS);
    ensureCompanyExists(companyId);
    if (MOCK_SCENARIO === "detail_error") {
      throw new Error("Unable to load designation");
    }
    const designation = mockDesignations.find(
      (item) => item.company_id === companyId && item.id === designationId,
    );
    if (!designation) throw new Error("Designation not found");
    return copyDesignation(designation);
  },

  createDesignation: async (
    companyId: CompanyEntityId,
    data: CreateDesignationInput,
  ): Promise<Designation> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    ensureCompanyExists(companyId);
    ensureDepartmentOwnership(companyId, data.department_id);
    if (MOCK_SCENARIO === "create_error") {
      throw new Error("Unable to create designation");
    }
    const timestamp = new Date().toISOString();
    const designation: Designation = {
      ...data,
      id: nextDesignationId++,
      company_id: companyId,
      created_at: timestamp,
      updated_at: timestamp,
    };
    mockDesignations = [...mockDesignations, designation];
    return copyDesignation(designation);
  },

  updateDesignation: async (
    companyId: CompanyEntityId,
    designationId: CompanyEntityId,
    data: UpdateDesignationInput,
  ): Promise<Designation> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    ensureCompanyExists(companyId);
    if (MOCK_SCENARIO === "update_error") {
      throw new Error("Unable to update designation");
    }
    const index = mockDesignations.findIndex(
      (designation) =>
        designation.company_id === companyId && designation.id === designationId,
    );
    if (index < 0) throw new Error("Designation not found");
    const departmentId =
      data.department_id === undefined
        ? mockDesignations[index].department_id
        : data.department_id;
    ensureDepartmentOwnership(companyId, departmentId);
    const updated: Designation = {
      ...mockDesignations[index],
      ...data,
      id: designationId,
      company_id: companyId,
      updated_at: new Date().toISOString(),
    };
    mockDesignations = mockDesignations.map((designation) =>
      designation.company_id === companyId && designation.id === designationId
        ? updated
        : designation,
    );
    return copyDesignation(updated);
  },

  deleteDesignation: async (
    companyId: CompanyEntityId,
    designationId: CompanyEntityId,
  ): Promise<void> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    ensureCompanyExists(companyId);
    if (MOCK_SCENARIO === "delete_error") {
      throw new Error("Unable to delete designation");
    }
    const exists = mockDesignations.some(
      (designation) =>
        designation.company_id === companyId && designation.id === designationId,
    );
    if (!exists) throw new Error("Designation not found");
    mockDesignations = mockDesignations.filter(
      (designation) =>
        designation.company_id !== companyId || designation.id !== designationId,
    );
  },

  getWeekOffs: async (companyId: CompanyEntityId): Promise<WeekOff[]> => {
    await mockDelay(MOCK_LIST_DELAY_MS);
    ensureCompanyExists(companyId);
    if (remainingWeekOffListFailures > 0) {
      remainingWeekOffListFailures -= 1;
      throw new Error("Unable to load Week Off policies");
    }
    return mockWeekOffs
      .filter((weekOff) => weekOff.company_id === companyId)
      .sort((a, b) => a.policy_name.localeCompare(b.policy_name))
      .map(copyWeekOff);
  },

  getWeekOffById: async (
    companyId: CompanyEntityId,
    weekOffId: CompanyEntityId,
  ): Promise<WeekOff> => {
    await mockDelay(MOCK_DETAIL_DELAY_MS);
    ensureCompanyExists(companyId);
    if (MOCK_SCENARIO === "detail_error") {
      throw new Error("Unable to load Week Off policy");
    }
    const weekOff = mockWeekOffs.find(
      (item) => item.company_id === companyId && item.id === weekOffId,
    );
    if (!weekOff) throw new Error("Week Off policy not found");
    return copyWeekOff(weekOff);
  },

  createWeekOff: async (
    companyId: CompanyEntityId,
    data: CreateWeekOffInput,
  ): Promise<WeekOff> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    ensureCompanyExists(companyId);
    if (MOCK_SCENARIO === "create_error") {
      throw new Error("Unable to create Week Off policy");
    }
    const timestamp = new Date().toISOString();
    const weekOff: WeekOff = {
      ...data,
      grid: data.grid.map((cell) => ({ ...cell })),
      id: nextWeekOffId++,
      company_id: companyId,
      created_at: timestamp,
      updated_at: timestamp,
    };
    mockWeekOffs = [...mockWeekOffs, weekOff];
    return copyWeekOff(weekOff);
  },

  updateWeekOff: async (
    companyId: CompanyEntityId,
    weekOffId: CompanyEntityId,
    data: UpdateWeekOffInput,
  ): Promise<WeekOff> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    ensureCompanyExists(companyId);
    if (MOCK_SCENARIO === "update_error") {
      throw new Error("Unable to update Week Off policy");
    }
    const index = mockWeekOffs.findIndex(
      (weekOff) => weekOff.company_id === companyId && weekOff.id === weekOffId,
    );
    if (index < 0) throw new Error("Week Off policy not found");
    const updated: WeekOff = {
      ...mockWeekOffs[index],
      ...data,
      grid: data.grid
        ? data.grid.map((cell) => ({ ...cell }))
        : mockWeekOffs[index].grid,
      id: weekOffId,
      company_id: companyId,
      updated_at: new Date().toISOString(),
    };
    mockWeekOffs = mockWeekOffs.map((weekOff) =>
      weekOff.company_id === companyId && weekOff.id === weekOffId
        ? updated
        : weekOff,
    );
    return copyWeekOff(updated);
  },

  deleteWeekOff: async (
    companyId: CompanyEntityId,
    weekOffId: CompanyEntityId,
  ): Promise<void> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    ensureCompanyExists(companyId);
    if (MOCK_SCENARIO === "delete_error") {
      throw new Error("Unable to delete Week Off policy");
    }
    const exists = mockWeekOffs.some(
      (weekOff) => weekOff.company_id === companyId && weekOff.id === weekOffId,
    );
    if (!exists) throw new Error("Week Off policy not found");
    mockWeekOffs = mockWeekOffs.filter(
      (weekOff) => weekOff.company_id !== companyId || weekOff.id !== weekOffId,
    );
  },

  getHolidayLists: async (
    companyId: CompanyEntityId,
    params: HolidayListParams,
  ): Promise<PagedResult<HolidayList>> => {
    await mockDelay(MOCK_LIST_DELAY_MS);
    ensureCompanyExists(companyId);
    if (remainingHolidayListFailures > 0) {
      remainingHolidayListFailures -= 1;
      throw new Error("Unable to load Holiday Lists");
    }
    const search = params.search?.trim().toLocaleLowerCase();
    const filtered = mockHolidayLists
      .filter((holidayList) => holidayList.company_id === companyId)
      .filter(
        (holidayList) =>
          !search || holidayList.name.toLocaleLowerCase().includes(search),
      )
      .filter(
        (holidayList) =>
          params.year === undefined || holidayList.year === params.year,
      )
      .sort((a, b) => a.year - b.year || a.name.localeCompare(b.name));
    const start = (params.page - 1) * params.page_size;
    return {
      items: filtered.slice(start, start + params.page_size).map(copyHolidayList),
      total: filtered.length,
      page: params.page,
      page_size: params.page_size,
    };
  },

  getHolidayListById: async (
    companyId: CompanyEntityId,
    holidayListId: CompanyEntityId,
  ): Promise<HolidayList> => {
    await mockDelay(MOCK_DETAIL_DELAY_MS);
    ensureCompanyExists(companyId);
    if (MOCK_SCENARIO === "detail_error") {
      throw new Error("Unable to load Holiday List");
    }
    const holidayList = mockHolidayLists.find(
      (item) => item.company_id === companyId && item.id === holidayListId,
    );
    if (!holidayList) throw new Error("Holiday List not found");
    return copyHolidayList(holidayList);
  },

  createHolidayList: async (
    companyId: CompanyEntityId,
    data: CreateHolidayListInput,
  ): Promise<HolidayList> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    ensureCompanyExists(companyId);
    if (MOCK_SCENARIO === "create_error") {
      throw new Error("Unable to create Holiday List");
    }
    const timestamp = new Date().toISOString();
    const holidayList: HolidayList = {
      ...data,
      id: nextHolidayListId++,
      company_id: companyId,
      created_at: timestamp,
      updated_at: timestamp,
    };
    mockHolidayLists = [...mockHolidayLists, holidayList];
    return copyHolidayList(holidayList);
  },

  updateHolidayList: async (
    companyId: CompanyEntityId,
    holidayListId: CompanyEntityId,
    data: UpdateHolidayListInput,
  ): Promise<HolidayList> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    ensureCompanyExists(companyId);
    if (MOCK_SCENARIO === "update_error") {
      throw new Error("Unable to update Holiday List");
    }
    const index = mockHolidayLists.findIndex(
      (item) => item.company_id === companyId && item.id === holidayListId,
    );
    if (index < 0) throw new Error("Holiday List not found");
    const updated: HolidayList = {
      ...mockHolidayLists[index],
      ...data,
      id: holidayListId,
      company_id: companyId,
      updated_at: new Date().toISOString(),
    };
    mockHolidayLists = mockHolidayLists.map((holidayList) =>
      holidayList.company_id === companyId && holidayList.id === holidayListId
        ? updated
        : holidayList,
    );
    return copyHolidayList(updated);
  },

  deleteHolidayList: async (
    companyId: CompanyEntityId,
    holidayListId: CompanyEntityId,
  ): Promise<void> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    ensureCompanyExists(companyId);
    if (MOCK_SCENARIO === "delete_error") {
      throw new Error("Unable to delete Holiday List");
    }
    const exists = mockHolidayLists.some(
      (item) => item.company_id === companyId && item.id === holidayListId,
    );
    if (!exists) throw new Error("Holiday List not found");
    if (
      mockHolidays.some(
        (holiday) => holiday.holiday_list_id === holidayListId,
      )
    ) {
      throw new Error("Holiday List cannot be deleted while it contains Holidays");
    }
    mockHolidayLists = mockHolidayLists.filter(
      (item) => item.company_id !== companyId || item.id !== holidayListId,
    );
  },

  getHolidays: async (
    companyId: CompanyEntityId,
    holidayListId: CompanyEntityId,
    params: HolidayParams,
  ): Promise<PagedResult<Holiday>> => {
    await mockDelay(MOCK_LIST_DELAY_MS);
    ensureHolidayListOwnership(companyId, holidayListId);
    if (remainingHolidayFailures > 0) {
      remainingHolidayFailures -= 1;
      throw new Error("Unable to load Holidays");
    }
    const search = params.search?.trim().toLocaleLowerCase();
    const filtered = mockHolidays
      .filter(
        (holiday) =>
          holiday.company_id === companyId &&
          holiday.holiday_list_id === holidayListId,
      )
      .filter(
        (holiday) =>
          !search || holiday.name.toLocaleLowerCase().includes(search),
      )
      .sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name));
    const start = (params.page - 1) * params.page_size;
    return {
      items: filtered.slice(start, start + params.page_size).map(copyHoliday),
      total: filtered.length,
      page: params.page,
      page_size: params.page_size,
    };
  },

  getHolidayById: async (
    companyId: CompanyEntityId,
    holidayListId: CompanyEntityId,
    holidayId: CompanyEntityId,
  ): Promise<Holiday> => {
    await mockDelay(MOCK_DETAIL_DELAY_MS);
    ensureHolidayListOwnership(companyId, holidayListId);
    if (MOCK_SCENARIO === "detail_error") {
      throw new Error("Unable to load Holiday");
    }
    const holiday = mockHolidays.find(
      (item) =>
        item.id === holidayId &&
        item.company_id === companyId &&
        item.holiday_list_id === holidayListId,
    );
    if (!holiday) throw new Error("Holiday not found");
    return copyHoliday(holiday);
  },

  createHoliday: async (
    companyId: CompanyEntityId,
    holidayListId: CompanyEntityId,
    data: CreateHolidayInput,
  ): Promise<Holiday> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    const holidayList = ensureHolidayListOwnership(companyId, holidayListId);
    if (MOCK_SCENARIO === "create_error") {
      throw new Error("Unable to create Holiday");
    }
    validateHolidayMockConstraints(holidayList, data);
    const timestamp = new Date().toISOString();
    const holiday: Holiday = {
      ...data,
      id: nextHolidayId++,
      company_id: companyId,
      holiday_list_id: holidayListId,
      created_at: timestamp,
      updated_at: timestamp,
    };
    mockHolidays = [...mockHolidays, holiday];
    return copyHoliday(holiday);
  },

  updateHoliday: async (
    companyId: CompanyEntityId,
    holidayListId: CompanyEntityId,
    holidayId: CompanyEntityId,
    data: UpdateHolidayInput,
  ): Promise<Holiday> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    const holidayList = ensureHolidayListOwnership(companyId, holidayListId);
    if (MOCK_SCENARIO === "update_error") {
      throw new Error("Unable to update Holiday");
    }
    const index = mockHolidays.findIndex(
      (item) =>
        item.id === holidayId &&
        item.company_id === companyId &&
        item.holiday_list_id === holidayListId,
    );
    if (index < 0) throw new Error("Holiday not found");
    const date = data.date ?? mockHolidays[index].date;
    validateHolidayMockConstraints(holidayList, { date }, holidayId);
    const updated: Holiday = {
      ...mockHolidays[index],
      ...data,
      id: holidayId,
      company_id: companyId,
      holiday_list_id: holidayListId,
      updated_at: new Date().toISOString(),
    };
    mockHolidays = mockHolidays.map((holiday) =>
      holiday.id === holidayId ? updated : holiday,
    );
    return copyHoliday(updated);
  },

  deleteHoliday: async (
    companyId: CompanyEntityId,
    holidayListId: CompanyEntityId,
    holidayId: CompanyEntityId,
  ): Promise<void> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    ensureHolidayListOwnership(companyId, holidayListId);
    if (MOCK_SCENARIO === "delete_error") {
      throw new Error("Unable to delete Holiday");
    }
    const exists = mockHolidays.some(
      (item) =>
        item.id === holidayId &&
        item.company_id === companyId &&
        item.holiday_list_id === holidayListId,
    );
    if (!exists) throw new Error("Holiday not found");
    mockHolidays = mockHolidays.filter((holiday) => holiday.id !== holidayId);
  },

  getAssetTypes: async (
    companyId: CompanyEntityId,
    params: AssetTypeParams,
  ): Promise<PagedResult<AssetType>> => {
    await mockDelay(MOCK_LIST_DELAY_MS);
    ensureCompanyExists(companyId);
    if (remainingAssetTypeFailures > 0) {
      remainingAssetTypeFailures -= 1;
      throw new Error("Unable to load Asset Types");
    }
    const search = params.search?.trim().toLocaleLowerCase();
    const filtered = mockAssetTypes
      .filter((assetType) => assetType.company_id === companyId)
      .filter(
        (assetType) =>
          !search || assetType.name.toLocaleLowerCase().includes(search),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
    const start = (params.page - 1) * params.page_size;
    return {
      items: filtered.slice(start, start + params.page_size).map(copyAssetType),
      total: filtered.length,
      page: params.page,
      page_size: params.page_size,
    };
  },

  getAssetTypeById: async (
    companyId: CompanyEntityId,
    assetTypeId: CompanyEntityId,
  ): Promise<AssetType> => {
    await mockDelay(MOCK_DETAIL_DELAY_MS);
    ensureCompanyExists(companyId);
    if (MOCK_SCENARIO === "detail_error") {
      throw new Error("Unable to load Asset Type");
    }
    const assetType = mockAssetTypes.find(
      (item) => item.company_id === companyId && item.id === assetTypeId,
    );
    if (!assetType) throw new Error("Asset Type not found");
    return copyAssetType(assetType);
  },

  createAssetType: async (
    companyId: CompanyEntityId,
    data: CreateAssetTypeInput,
  ): Promise<AssetType> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    ensureCompanyExists(companyId);
    if (MOCK_SCENARIO === "create_error") {
      throw new Error("Unable to create Asset Type");
    }
    const timestamp = new Date().toISOString();
    const assetType: AssetType = {
      ...data,
      id: nextAssetTypeId++,
      company_id: companyId,
      created_at: timestamp,
      updated_at: timestamp,
    };
    mockAssetTypes = [...mockAssetTypes, assetType];
    return copyAssetType(assetType);
  },

  updateAssetType: async (
    companyId: CompanyEntityId,
    assetTypeId: CompanyEntityId,
    data: UpdateAssetTypeInput,
  ): Promise<AssetType> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    ensureCompanyExists(companyId);
    if (MOCK_SCENARIO === "update_error") {
      throw new Error("Unable to update Asset Type");
    }
    const index = mockAssetTypes.findIndex(
      (item) => item.company_id === companyId && item.id === assetTypeId,
    );
    if (index < 0) throw new Error("Asset Type not found");
    const updated: AssetType = {
      ...mockAssetTypes[index],
      ...data,
      id: assetTypeId,
      company_id: companyId,
      updated_at: new Date().toISOString(),
    };
    mockAssetTypes = mockAssetTypes.map((assetType) =>
      assetType.company_id === companyId && assetType.id === assetTypeId
        ? updated
        : assetType,
    );
    return copyAssetType(updated);
  },

  deleteAssetType: async (
    companyId: CompanyEntityId,
    assetTypeId: CompanyEntityId,
  ): Promise<void> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    ensureCompanyExists(companyId);
    if (MOCK_SCENARIO === "delete_error") {
      throw new Error("Unable to delete Asset Type");
    }
    const exists = mockAssetTypes.some(
      (item) => item.company_id === companyId && item.id === assetTypeId,
    );
    if (!exists) throw new Error("Asset Type not found");
    mockAssetTypes = mockAssetTypes.filter(
      (item) => item.company_id !== companyId || item.id !== assetTypeId,
    );
  },

  getPolicies: async (
    companyId: CompanyEntityId,
    params: PolicyListParams,
  ): Promise<PagedResult<Policy>> => {
    await mockDelay(MOCK_LIST_DELAY_MS);
    ensureCompanyExists(companyId);
    if (remainingPolicyFailures > 0) {
      remainingPolicyFailures -= 1;
      throw new Error("Unable to load Policies");
    }
    const search = params.search?.trim().toLocaleLowerCase();
    const filtered = mockPolicies
      .filter((policy) => policy.company_id === companyId)
      .filter(
        (policy) =>
          !search ||
          policy.policy_name.toLocaleLowerCase().includes(search) ||
          policy.description?.toLocaleLowerCase().includes(search),
      )
      .sort((a, b) => a.policy_name.localeCompare(b.policy_name));
    const start = (params.page - 1) * params.page_size;
    return {
      items: filtered.slice(start, start + params.page_size).map(copyPolicy),
      total: filtered.length,
      page: params.page,
      page_size: params.page_size,
    };
  },

  getPolicyById: async (
    companyId: CompanyEntityId,
    policyId: CompanyEntityId,
  ): Promise<Policy> => {
    await mockDelay(MOCK_DETAIL_DELAY_MS);
    if (MOCK_SCENARIO === "detail_error") {
      throw new Error("Unable to load Policy");
    }
    return copyPolicy(getOwnedPolicy(companyId, policyId));
  },

  createPolicy: async (
    companyId: CompanyEntityId,
    data: CreatePolicyInput,
  ): Promise<Policy> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    ensureCompanyExists(companyId);
    if (MOCK_SCENARIO === "create_error") {
      throw new Error("Unable to create Policy");
    }
    const timestamp = new Date().toISOString();
    const policy: Policy = {
      id: nextPolicyId++,
      company_id: companyId,
      policy_name: data.policy_name,
      description: data.description,
      file: {
        file_name: data.file.name,
        mime_type: data.file.type || "application/octet-stream",
        size_bytes: data.file.size,
        uploaded_at: timestamp,
      },
      created_at: timestamp,
      updated_at: timestamp,
    };
    mockPolicyFiles.set(policy.id, data.file);
    mockPolicies = [...mockPolicies, policy];
    return copyPolicy(policy);
  },

  deletePolicy: async (
    companyId: CompanyEntityId,
    policyId: CompanyEntityId,
  ): Promise<void> => {
    await mockDelay(MOCK_MUTATION_DELAY_MS);
    getOwnedPolicy(companyId, policyId);
    if (MOCK_SCENARIO === "delete_error") {
      throw new Error("Unable to delete Policy");
    }
    revokePolicyObjectUrl(policyId);
    mockPolicyFiles.delete(policyId);
    mockPolicies = mockPolicies.filter((policy) => policy.id !== policyId);
  },

  viewPolicyFile: async (
    companyId: CompanyEntityId,
    policyId: CompanyEntityId,
  ): Promise<PolicyFileAccess> => {
    await mockDelay(MOCK_DETAIL_DELAY_MS);
    const policy = getOwnedPolicy(companyId, policyId);
    const blob = mockPolicyFiles.get(policyId);
    if (!blob) throw new Error("Policy file is unavailable");
    let url = mockPolicyObjectUrls.get(policyId);
    if (!url) {
      url = URL.createObjectURL(blob);
      mockPolicyObjectUrls.set(policyId, url);
    }
    const mimeType = policy.file.mime_type;
    return {
      url,
      file_name: policy.file.file_name,
      mime_type: mimeType,
      can_preview:
        mimeType.startsWith("text/") ||
        mimeType.startsWith("image/") ||
        mimeType === "application/pdf" ||
        mimeType === "application/json",
    };
  },

  downloadPolicyFile: async (
    companyId: CompanyEntityId,
    policyId: CompanyEntityId,
  ): Promise<PolicyFileDownload> => {
    await mockDelay(MOCK_DETAIL_DELAY_MS);
    const policy = getOwnedPolicy(companyId, policyId);
    const blob = mockPolicyFiles.get(policyId);
    if (!blob) throw new Error("Policy file is unavailable");
    return {
      blob: blob.slice(0, blob.size, blob.type),
      file_name: policy.file.file_name,
    };
  },
};
