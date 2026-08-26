import type { AuthSession, LoginCredentials } from "../types/auth.types";

const MOCK_PASSWORD = "password";

const mockSessions: Record<string, AuthSession> = {
  "hr@peoplepulse.test": {
  user: {
    id: 1,
    name: "HR Administrator",
    email: "hr@peoplepulse.test",
    role: "hr",
    permissions: [
      "employee.view",
      "employee.write",
      "payroll.view",
      "payroll.run",
      "leave.approve",
      "settings.manage",
      "recruitment.read",
      "dashboard.view",
      "attendance.read",
    ],
  },
  availableCompanies: [
    { id: 1, name: "PeoplePulse Technologies" },
    { id: 2, name: "Northstar Services" },
    { id: 3, name: "Bluehaven Healthcare" },
  ],
  activeCompanyId: 1,
  },
  "manager@peoplepulse.test": {
    user: {
      id: 2,
      name: "People Manager",
      email: "manager@peoplepulse.test",
      role: "manager",
      permissions: ["employee.view", "leave.approve", "recruitment.read", "dashboard.view", "attendance.read"],
    },
    availableCompanies: [{ id: 1, name: "PeoplePulse Technologies" }],
    activeCompanyId: 1,
  },
  "employee@peoplepulse.test": {
    user: {
      id: 3,
      name: "Employee User",
      email: "employee@peoplepulse.test",
      role: "employee",
      permissions: ["attendance.read"],
    },
    availableCompanies: [{ id: 1, name: "PeoplePulse Technologies" }],
    activeCompanyId: 1,
  },
};

const cloneSession = (session: AuthSession): AuthSession => ({
  ...session,
  user: { ...session.user, permissions: [...session.user.permissions] },
  availableCompanies: session.availableCompanies.map((company) => ({ ...company })),
});

export const authMock = {
  login: async (credentials: LoginCredentials): Promise<AuthSession> => {
    const session = mockSessions[credentials.email.toLowerCase()];
    if (!session || credentials.password !== MOCK_PASSWORD) {
      throw new Error("Invalid email or password");
    }
    return cloneSession(session);
  },
};
