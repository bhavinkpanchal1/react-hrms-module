import { httpClient } from "@/shared/services/http/client";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";
import type { Employee } from "../types/employee.type";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";
const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

let mockEmployees: Employee[] = [];
let nextEmpId = 1;

export const employeeApi = {
  getEmployees: async (): Promise<Employee[]> => {
    if (USE_MOCK) {
      await delay();
      return [...mockEmployees];
    }
    const r = await httpClient.get<{ results: Employee[] }>(API_ENDPOINTS.employees);
    return r.data.results;
  },

  getEmployeeById: async (id: number): Promise<Employee> => {
    if (USE_MOCK) {
      await delay(300);
      const e = mockEmployees.find((e) => e.id === id);
      if (!e) throw new Error("Employee not found");
      return e;
    }
    const r = await httpClient.get<Employee>(`${API_ENDPOINTS.employees}${id}/`);
    return r.data;
  },

  createEmployee: async (
    data: Omit<Employee, "id" | "employee_code" | "created_at">,
  ): Promise<Employee> => {
    if (USE_MOCK) {
      await delay(600);
      const e: Employee = {
        ...data,
        id: nextEmpId,
        employee_code: `EMP-${String(nextEmpId).padStart(4, "0")}`,
        created_at: new Date().toISOString(),
      };
      nextEmpId += 1;
      mockEmployees = [...mockEmployees, e];
      return e;
    }
    const r = await httpClient.post<Employee>(API_ENDPOINTS.employees, data);
    return r.data;
  },
};
