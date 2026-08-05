import { httpClient } from "@/shared/services/http/client";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";
import type { Employee } from "../types/employee.type";
import { COUNTRY_OPTIONS } from "@/shared/constants/locations/country";
import { STATE_OPTIONS } from "@/shared/constants/locations/state";
import { CITY_OPTIONS } from "@/shared/constants/locations/city";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";
const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

const mockEmployees: Employee[] = [
  {
    id: 1,

    // Personal Information
    first_name: "Bhavin",
    middle_name: "K",
    last_name: "Panchal",
    name_as_per_aadhar: "Bhavin K Panchal",
    email: "bhavin.panchal@example.com",
    phone: "9876543210",
    dob: "1998-04-15",
    gender: "male",
    marital_status: "single",
    aadhar_card_number: "123456789012",
    pan_card_number: "ABCDE1234F",

    // Correspondence Address
    corresponding_address_line1: "21 Shree Residency",
    corresponding_address_line2: "Near Railway Station",
    corresponding_country: COUNTRY_OPTIONS[0],
    corresponding_state: STATE_OPTIONS[1],
    corresponding_city: CITY_OPTIONS[0],
    corresponding_pincode: "390001",

    // Permanent Address
    same_as_above: true,
    permanent_address_line1: "21 Shree Residency",
    permanent_address_line2: "Near Railway Station",
    permanent_country: COUNTRY_OPTIONS[0],
    permanent_state: COUNTRY_OPTIONS[0],
    permanent_city: COUNTRY_OPTIONS[0],
    permanent_pincode: "390001",

    // Employment
    employee_id: "EMP001",
    date_of_joining: "2025-01-10",
    work_location: "Vadodara",
    company: "Odysseus Solutions",
    department: "Engineering",
    designation: "Frontend Developer",
    reporting_manager: "EMP010",
    job_role: "React Developer",
    employment_type: "full_time",
    annual_salary: 650000,
    week_off: "Sunday",
    holiday_master: "India",
    clockin_remotely: true,

    // PF / ESIC
    uan_number: "100200300400",
    pf_number: "GJVAD123456",
    pf_joining_date: "2025-01-10",
    esic_number: "2100456789",
    esic_joining_date: "2025-01-10",

    // Bank
    ifsc_code: "SBIN0001234",
    bank_name: "State Bank of India",
    branch_name: "Vadodara",
    account_number: "123456789012",
    account_holder_name: "Bhavin K Panchal",

    // Emergency
    emergency_contact_name: "Kiran Panchal",
    emergency_contact_number: "9898989898",
    emergency_contact_relation: "Father",
  },

  {
    id: 2,
    first_name: "Priya",
    middle_name: "",
    last_name: "Shah",
    name_as_per_aadhar: "Priya Shah",
    email: "priya.shah@example.com",
    phone: "9823456789",
    dob: "1996-09-20",
    gender: "female",
    marital_status: "married",
    aadhar_card_number: "234567890123",
    pan_card_number: "PQRSX1234L",

    corresponding_address_line1: "Sun Avenue",
    corresponding_address_line2: "",
    corresponding_country: 1,
    corresponding_state: 12,
    corresponding_city: 102,
    corresponding_pincode: "380015",

    same_as_above: true,
    permanent_address_line1: "Sun Avenue",
    permanent_address_line2: "",
    permanent_country: 1,
    permanent_state: 12,
    permanent_city: 102,
    permanent_pincode: "380015",

    employee_id: "EMP002",
    date_of_joining: "2024-07-15",
    work_location: "Ahmedabad",
    company: "Odysseus Solutions",
    department: "HR",
    designation: "HR Executive",
    reporting_manager: "EMP011",
    job_role: "Human Resource",
    employment_type: "full_time",
    annual_salary: 480000,
    week_off: "Sunday",
    holiday_master: "India",
    clockin_remotely: false,

    uan_number: "100200300401",
    pf_number: "GJAMD987654",
    pf_joining_date: "2024-07-15",
    esic_number: "2100456790",
    esic_joining_date: "2024-07-15",

    ifsc_code: "HDFC0001234",
    bank_name: "HDFC Bank",
    branch_name: "Ahmedabad",
    account_number: "234567890123",
    account_holder_name: "Priya Shah",

    emergency_contact_name: "Raj Shah",
    emergency_contact_number: "9876501234",
    emergency_contact_relation: "Husband",
  },
];
let nextEmpId = 1;

export const employeeApi = {
  getEmployees: async (): Promise<Employee[]> => {
    if (USE_MOCK) {
      await delay();
      return [...mockEmployees];
    }
    const r = await httpClient.get<{ results: Employee[] }>(API_ENDPOINTS.employees.list);
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

  updateEmployee: async (id: number, data: Partial<Employee>): Promise<Employee> => {
    if (USE_MOCK) {
      await delay(400);
      mockEmployees = mockEmployees.map((e) => (e.id === id ? { ...e, ...data } : e));
      const updated = mockEmployees.find((e) => e.id === id);
      if (!updated) throw new Error("Employee not found");
      return updated;
    }
    const r = await httpClient.patch<Employee>(`${API_ENDPOINTS.employees}${id}/`, data);
    return r.data;
  },
};