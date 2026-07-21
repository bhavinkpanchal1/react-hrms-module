import axios from 'axios';

const getApiErrorMessage = (data: unknown): string | undefined => {
  if (!data || typeof data !== 'object') return undefined;

  const payload = data as Record<string, unknown>;
  if (typeof payload.detail === 'string') return payload.detail;
  if (typeof payload.message === 'string') return payload.message;

  const validationError = Object.entries(payload).find(([, value]) =>
    typeof value === 'string' || Array.isArray(value),
  );
  if (!validationError) return undefined;

  const [field, value] = validationError;
  const message = Array.isArray(value) ? value[0] : value;
  return `${field}: ${String(message)}`;
};

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

//Request interceptor - attach token
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

httpClient.interceptors.response.use((response) => response,
  (error) => {
    const message =
      getApiErrorMessage(error.response?.data) ??
      error.message ??
      'Something went wrong';
    return Promise.reject(new Error(message));
  });
