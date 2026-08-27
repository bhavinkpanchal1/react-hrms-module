export const queryKeys = {
  company: {
    all: ["company"] as const,
    lists: () => [...queryKeys.company.all, "list"] as const,
    list: (params: {
      page: number;
      page_size: number;
      search?: string;
      status?: "active" | "inactive";
      industry_type?: string;
    }) => [...queryKeys.company.lists(), params] as const,
    details: () => [...queryKeys.company.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.company.details(), id] as const,
    branchLists: (companyId: number) =>
      [...queryKeys.company.all, companyId, "branches"] as const,
    branches: (
      companyId: number,
      params: {
        page: number;
        page_size: number;
        search?: string;
        status?: "active" | "inactive";
      },
    ) => [...queryKeys.company.branchLists(companyId), "list", params] as const,
    branch: (companyId: number, branchId: number) =>
      [...queryKeys.company.branchLists(companyId), "detail", branchId] as const,
    departmentLists: (companyId: number) =>
      [...queryKeys.company.all, companyId, "departments"] as const,
    departments: (
      companyId: number,
      params: { page: number; page_size: number; search?: string },
    ) => [...queryKeys.company.departmentLists(companyId), "list", params] as const,
    department: (companyId: number, departmentId: number) =>
      [
        ...queryKeys.company.departmentLists(companyId),
        "detail",
        departmentId,
      ] as const,
    designationLists: (companyId: number) =>
      [...queryKeys.company.all, companyId, "designations"] as const,
    designations: (
      companyId: number,
      params: {
        page: number;
        page_size: number;
        search?: string;
        department_id?: number;
      },
    ) => [...queryKeys.company.designationLists(companyId), "list", params] as const,
    designation: (companyId: number, designationId: number) =>
      [
        ...queryKeys.company.designationLists(companyId),
        "detail",
        designationId,
      ] as const,
    weekOffs: (companyId: number) =>
      [...queryKeys.company.all, companyId, "week-offs"] as const,
    weekOff: (companyId: number, weekOffId: number) =>
      [...queryKeys.company.weekOffs(companyId), weekOffId] as const,
    holidayListLists: (companyId: number) =>
      [...queryKeys.company.all, companyId, "holiday-lists"] as const,
    holidayLists: (
      companyId: number,
      params: {
        page: number;
        page_size: number;
        search?: string;
        year?: number;
      },
    ) => [...queryKeys.company.holidayListLists(companyId), "list", params] as const,
    holidayList: (companyId: number, holidayListId: number) =>
      [
        ...queryKeys.company.holidayListLists(companyId),
        "detail",
        holidayListId,
      ] as const,
    holidayListsHolidays: (companyId: number, holidayListId: number) =>
      [
        ...queryKeys.company.holidayListLists(companyId),
        holidayListId,
        "holidays",
      ] as const,
    holidays: (
      companyId: number,
      holidayListId: number,
      params: { page: number; page_size: number; search?: string },
    ) =>
      [
        ...queryKeys.company.holidayListsHolidays(companyId, holidayListId),
        "list",
        params,
      ] as const,
    holiday: (companyId: number, holidayListId: number, holidayId: number) =>
      [
        ...queryKeys.company.holidayListsHolidays(companyId, holidayListId),
        "detail",
        holidayId,
      ] as const,
    assetTypeLists: (companyId: number) =>
      [...queryKeys.company.all, companyId, "asset-types"] as const,
    assetTypes: (
      companyId: number,
      params: { page: number; page_size: number; search?: string },
    ) => [...queryKeys.company.assetTypeLists(companyId), "list", params] as const,
    assetType: (companyId: number, assetTypeId: number) =>
      [
        ...queryKeys.company.assetTypeLists(companyId),
        "detail",
        assetTypeId,
      ] as const,
    policyLists: (companyId: number) =>
      [...queryKeys.company.all, companyId, "policies"] as const,
    policies: (
      companyId: number,
      params: { page: number; page_size: number; search?: string },
    ) => [...queryKeys.company.policyLists(companyId), "list", params] as const,
    policy: (companyId: number, policyId: number) =>
      [...queryKeys.company.policyLists(companyId), "detail", policyId] as const,
  },

  recruitment: {
    all: ["recruitment"] as const,
    jobs: () => [...queryKeys.recruitment.all, "jobs"] as const,
    jobDetail: (id: number) => [...queryKeys.recruitment.jobs(), id] as const,
    candidates: () => [...queryKeys.recruitment.all, "candidates"] as const,
    candidate: (id: number) =>
      [...queryKeys.recruitment.candidates(), id] as const,
    pipeline: () => [...queryKeys.recruitment.all, "pipeline"] as const,
    interviews: () => [...queryKeys.recruitment.all, "interviews"] as const,
    offers: () => [...queryKeys.recruitment.all, "offers"] as const,
  },

  employee: {
    all: ["employee"] as const,
    list: (params?: unknown) => [...queryKeys.employee.all, "list", params] as const,
    details: (id: string | number) => [...queryKeys.employee.all, id] as const,
    detail: (id: string) => [...queryKeys.employee.all, "detail", id] as const,
    masters: () => [...queryKeys.employee.all, "masters"] as const,
    bank: (id: string) => [...queryKeys.employee.all, "bank", id] as const,
    statutory: (id: string) => [...queryKeys.employee.all, "statutory", id] as const,
    documents: (employeeId: string | number) =>
      [...queryKeys.employee.details(employeeId), "documents"] as const,
    document: (employeeId: number, documentId: number) =>
      [...queryKeys.employee.documents(employeeId), documentId] as const,
  },

  attendance: {
    all: ["attendance"] as const,
    today: (companyId = 1, employeeId: string | number = "current") => [...queryKeys.attendance.all, companyId, "today", employeeId] as const,
    list: (companyId: number, params: object) => [...queryKeys.attendance.all, companyId, "list", params] as const,
    detail: (companyId: number, id: string) => [...queryKeys.attendance.all, companyId, "detail", id] as const,
    audit: (companyId: number, id: string) => [...queryKeys.attendance.all, companyId, "audit", id] as const,
    history: (companyId: number, employeeId: string, month: number, year: number) => [...queryKeys.attendance.all, companyId, "history", employeeId, month, year] as const,
    calendar: (companyId: number, employeeId: string, month: number, year: number) => [...queryKeys.attendance.all, companyId, "calendar", employeeId, month, year] as const,
    regularizations: (companyId = 1) => [...queryKeys.attendance.all, companyId, "regularizations"] as const,
    regularization: (id: number) => [...queryKeys.attendance.regularizations(), id] as const,
    monthly: (companyId:number,employeeId:string,year:number,month:number)=>[...queryKeys.attendance.all,companyId,"monthly",employeeId,year,month] as const,
    configuration: (companyId:number)=>[...queryKeys.attendance.all,companyId,"configuration"] as const,
    pendingRegularizations: () =>
      [...queryKeys.attendance.all, "pending-regularizations"] as const,
  },
} as const;
