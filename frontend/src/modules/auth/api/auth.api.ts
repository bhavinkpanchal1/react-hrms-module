import { authMock } from "./auth.mock";
import { createAuthService } from "./auth.service";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";
const mockService = createAuthService(authMock, localStorage);
const backendTbd = async (): Promise<never> => {
  throw new Error("Auth backend endpoint TBD");
};

export const authApi = {
  login: USE_MOCK ? mockService.login : backendTbd,
  restoreSession: USE_MOCK ? mockService.restoreSession : backendTbd,
  selectCompany: USE_MOCK ? mockService.selectCompany : backendTbd,
  logout: USE_MOCK ? mockService.logout : backendTbd,
};
