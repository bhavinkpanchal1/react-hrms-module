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
import { companyMockApi } from "./company.mock";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";

const backendEndpointTbd = (): never => {
  throw new Error("Company backend endpoint TBD");
};

export const companyApi = {
  getCompanies: async (
    params: CompanyListParams,
  ): Promise<PagedResult<Company>> => {
    if (USE_MOCK) return companyMockApi.getCompanies(params);
    return backendEndpointTbd();
  },

  getCompanyById: async (id: CompanyEntityId): Promise<Company> => {
    if (USE_MOCK) return companyMockApi.getCompanyById(id);
    return backendEndpointTbd();
  },

  createCompany: async (data: CreateCompanyInput): Promise<Company> => {
    if (USE_MOCK) return companyMockApi.createCompany(data);
    return backendEndpointTbd();
  },

  updateCompany: async (
    id: CompanyEntityId,
    data: UpdateCompanyInput,
  ): Promise<Company> => {
    if (USE_MOCK) return companyMockApi.updateCompany(id, data);
    return backendEndpointTbd();
  },

  deleteCompany: async (id: CompanyEntityId): Promise<void> => {
    if (USE_MOCK) return companyMockApi.deleteCompany(id);
    return backendEndpointTbd();
  },

  getBranches: async (
    companyId: CompanyEntityId,
    params: BranchListParams,
  ): Promise<PagedResult<Branch>> => {
    if (USE_MOCK) return companyMockApi.getBranches(companyId, params);
    return backendEndpointTbd();
  },

  getBranchById: async (
    companyId: CompanyEntityId,
    branchId: CompanyEntityId,
  ): Promise<Branch> => {
    if (USE_MOCK) return companyMockApi.getBranchById(companyId, branchId);
    return backendEndpointTbd();
  },

  createBranch: async (
    companyId: CompanyEntityId,
    data: CreateBranchInput,
  ): Promise<Branch> => {
    if (USE_MOCK) return companyMockApi.createBranch(companyId, data);
    return backendEndpointTbd();
  },

  updateBranch: async (
    companyId: CompanyEntityId,
    branchId: CompanyEntityId,
    data: UpdateBranchInput,
  ): Promise<Branch> => {
    if (USE_MOCK) return companyMockApi.updateBranch(companyId, branchId, data);
    return backendEndpointTbd();
  },

  deleteBranch: async (
    companyId: CompanyEntityId,
    branchId: CompanyEntityId,
  ): Promise<void> => {
    if (USE_MOCK) return companyMockApi.deleteBranch(companyId, branchId);
    return backendEndpointTbd();
  },

  getDepartments: async (
    companyId: CompanyEntityId,
    params: DepartmentListParams,
  ): Promise<PagedResult<Department>> => {
    if (USE_MOCK) return companyMockApi.getDepartments(companyId, params);
    return backendEndpointTbd();
  },

  getDepartmentById: async (
    companyId: CompanyEntityId,
    departmentId: CompanyEntityId,
  ): Promise<Department> => {
    if (USE_MOCK) {
      return companyMockApi.getDepartmentById(companyId, departmentId);
    }
    return backendEndpointTbd();
  },

  createDepartment: async (
    companyId: CompanyEntityId,
    data: CreateDepartmentInput,
  ): Promise<Department> => {
    if (USE_MOCK) return companyMockApi.createDepartment(companyId, data);
    return backendEndpointTbd();
  },

  updateDepartment: async (
    companyId: CompanyEntityId,
    departmentId: CompanyEntityId,
    data: UpdateDepartmentInput,
  ): Promise<Department> => {
    if (USE_MOCK) {
      return companyMockApi.updateDepartment(companyId, departmentId, data);
    }
    return backendEndpointTbd();
  },

  deleteDepartment: async (
    companyId: CompanyEntityId,
    departmentId: CompanyEntityId,
  ): Promise<void> => {
    if (USE_MOCK) {
      return companyMockApi.deleteDepartment(companyId, departmentId);
    }
    return backendEndpointTbd();
  },

  getDesignations: async (
    companyId: CompanyEntityId,
    params: DesignationListParams,
  ): Promise<PagedResult<Designation>> => {
    if (USE_MOCK) return companyMockApi.getDesignations(companyId, params);
    return backendEndpointTbd();
  },

  getDesignationById: async (
    companyId: CompanyEntityId,
    designationId: CompanyEntityId,
  ): Promise<Designation> => {
    if (USE_MOCK) {
      return companyMockApi.getDesignationById(companyId, designationId);
    }
    return backendEndpointTbd();
  },

  createDesignation: async (
    companyId: CompanyEntityId,
    data: CreateDesignationInput,
  ): Promise<Designation> => {
    if (USE_MOCK) return companyMockApi.createDesignation(companyId, data);
    return backendEndpointTbd();
  },

  updateDesignation: async (
    companyId: CompanyEntityId,
    designationId: CompanyEntityId,
    data: UpdateDesignationInput,
  ): Promise<Designation> => {
    if (USE_MOCK) {
      return companyMockApi.updateDesignation(companyId, designationId, data);
    }
    return backendEndpointTbd();
  },

  deleteDesignation: async (
    companyId: CompanyEntityId,
    designationId: CompanyEntityId,
  ): Promise<void> => {
    if (USE_MOCK) {
      return companyMockApi.deleteDesignation(companyId, designationId);
    }
    return backendEndpointTbd();
  },

  getWeekOffs: async (companyId: CompanyEntityId): Promise<WeekOff[]> => {
    if (USE_MOCK) return companyMockApi.getWeekOffs(companyId);
    return backendEndpointTbd();
  },

  getWeekOffById: async (
    companyId: CompanyEntityId,
    weekOffId: CompanyEntityId,
  ): Promise<WeekOff> => {
    if (USE_MOCK) return companyMockApi.getWeekOffById(companyId, weekOffId);
    return backendEndpointTbd();
  },

  createWeekOff: async (
    companyId: CompanyEntityId,
    data: CreateWeekOffInput,
  ): Promise<WeekOff> => {
    if (USE_MOCK) return companyMockApi.createWeekOff(companyId, data);
    return backendEndpointTbd();
  },

  updateWeekOff: async (
    companyId: CompanyEntityId,
    weekOffId: CompanyEntityId,
    data: UpdateWeekOffInput,
  ): Promise<WeekOff> => {
    if (USE_MOCK) return companyMockApi.updateWeekOff(companyId, weekOffId, data);
    return backendEndpointTbd();
  },

  deleteWeekOff: async (
    companyId: CompanyEntityId,
    weekOffId: CompanyEntityId,
  ): Promise<void> => {
    if (USE_MOCK) return companyMockApi.deleteWeekOff(companyId, weekOffId);
    return backendEndpointTbd();
  },

  getHolidayLists: async (
    companyId: CompanyEntityId,
    params: HolidayListParams,
  ): Promise<PagedResult<HolidayList>> => {
    if (USE_MOCK) return companyMockApi.getHolidayLists(companyId, params);
    return backendEndpointTbd();
  },

  getHolidayListById: async (
    companyId: CompanyEntityId,
    holidayListId: CompanyEntityId,
  ): Promise<HolidayList> => {
    if (USE_MOCK) {
      return companyMockApi.getHolidayListById(companyId, holidayListId);
    }
    return backendEndpointTbd();
  },

  createHolidayList: async (
    companyId: CompanyEntityId,
    data: CreateHolidayListInput,
  ): Promise<HolidayList> => {
    if (USE_MOCK) return companyMockApi.createHolidayList(companyId, data);
    return backendEndpointTbd();
  },

  updateHolidayList: async (
    companyId: CompanyEntityId,
    holidayListId: CompanyEntityId,
    data: UpdateHolidayListInput,
  ): Promise<HolidayList> => {
    if (USE_MOCK) {
      return companyMockApi.updateHolidayList(companyId, holidayListId, data);
    }
    return backendEndpointTbd();
  },

  deleteHolidayList: async (
    companyId: CompanyEntityId,
    holidayListId: CompanyEntityId,
  ): Promise<void> => {
    if (USE_MOCK) {
      return companyMockApi.deleteHolidayList(companyId, holidayListId);
    }
    return backendEndpointTbd();
  },

  getHolidays: async (
    companyId: CompanyEntityId,
    holidayListId: CompanyEntityId,
    params: HolidayParams,
  ): Promise<PagedResult<Holiday>> => {
    if (USE_MOCK) {
      return companyMockApi.getHolidays(companyId, holidayListId, params);
    }
    return backendEndpointTbd();
  },

  getHolidayById: async (
    companyId: CompanyEntityId,
    holidayListId: CompanyEntityId,
    holidayId: CompanyEntityId,
  ): Promise<Holiday> => {
    if (USE_MOCK) {
      return companyMockApi.getHolidayById(
        companyId,
        holidayListId,
        holidayId,
      );
    }
    return backendEndpointTbd();
  },

  createHoliday: async (
    companyId: CompanyEntityId,
    holidayListId: CompanyEntityId,
    data: CreateHolidayInput,
  ): Promise<Holiday> => {
    if (USE_MOCK) {
      return companyMockApi.createHoliday(companyId, holidayListId, data);
    }
    return backendEndpointTbd();
  },

  updateHoliday: async (
    companyId: CompanyEntityId,
    holidayListId: CompanyEntityId,
    holidayId: CompanyEntityId,
    data: UpdateHolidayInput,
  ): Promise<Holiday> => {
    if (USE_MOCK) {
      return companyMockApi.updateHoliday(
        companyId,
        holidayListId,
        holidayId,
        data,
      );
    }
    return backendEndpointTbd();
  },

  deleteHoliday: async (
    companyId: CompanyEntityId,
    holidayListId: CompanyEntityId,
    holidayId: CompanyEntityId,
  ): Promise<void> => {
    if (USE_MOCK) {
      return companyMockApi.deleteHoliday(companyId, holidayListId, holidayId);
    }
    return backendEndpointTbd();
  },

  getAssetTypes: async (
    companyId: CompanyEntityId,
    params: AssetTypeParams,
  ): Promise<PagedResult<AssetType>> => {
    if (USE_MOCK) return companyMockApi.getAssetTypes(companyId, params);
    return backendEndpointTbd();
  },

  getAssetTypeById: async (
    companyId: CompanyEntityId,
    assetTypeId: CompanyEntityId,
  ): Promise<AssetType> => {
    if (USE_MOCK) return companyMockApi.getAssetTypeById(companyId, assetTypeId);
    return backendEndpointTbd();
  },

  createAssetType: async (
    companyId: CompanyEntityId,
    data: CreateAssetTypeInput,
  ): Promise<AssetType> => {
    if (USE_MOCK) return companyMockApi.createAssetType(companyId, data);
    return backendEndpointTbd();
  },

  updateAssetType: async (
    companyId: CompanyEntityId,
    assetTypeId: CompanyEntityId,
    data: UpdateAssetTypeInput,
  ): Promise<AssetType> => {
    if (USE_MOCK) {
      return companyMockApi.updateAssetType(companyId, assetTypeId, data);
    }
    return backendEndpointTbd();
  },

  deleteAssetType: async (
    companyId: CompanyEntityId,
    assetTypeId: CompanyEntityId,
  ): Promise<void> => {
    if (USE_MOCK) return companyMockApi.deleteAssetType(companyId, assetTypeId);
    return backendEndpointTbd();
  },

  getPolicies: async (
    companyId: CompanyEntityId,
    params: PolicyListParams,
  ): Promise<PagedResult<Policy>> => {
    if (USE_MOCK) return companyMockApi.getPolicies(companyId, params);
    return backendEndpointTbd();
  },

  getPolicyById: async (
    companyId: CompanyEntityId,
    policyId: CompanyEntityId,
  ): Promise<Policy> => {
    if (USE_MOCK) return companyMockApi.getPolicyById(companyId, policyId);
    return backendEndpointTbd();
  },

  createPolicy: async (
    companyId: CompanyEntityId,
    data: CreatePolicyInput,
  ): Promise<Policy> => {
    if (USE_MOCK) return companyMockApi.createPolicy(companyId, data);
    return backendEndpointTbd();
  },

  deletePolicy: async (
    companyId: CompanyEntityId,
    policyId: CompanyEntityId,
  ): Promise<void> => {
    if (USE_MOCK) return companyMockApi.deletePolicy(companyId, policyId);
    return backendEndpointTbd();
  },

  viewPolicyFile: async (
    companyId: CompanyEntityId,
    policyId: CompanyEntityId,
  ): Promise<PolicyFileAccess> => {
    if (USE_MOCK) return companyMockApi.viewPolicyFile(companyId, policyId);
    return backendEndpointTbd();
  },

  downloadPolicyFile: async (
    companyId: CompanyEntityId,
    policyId: CompanyEntityId,
  ): Promise<PolicyFileDownload> => {
    if (USE_MOCK) return companyMockApi.downloadPolicyFile(companyId, policyId);
    return backendEndpointTbd();
  },
};
