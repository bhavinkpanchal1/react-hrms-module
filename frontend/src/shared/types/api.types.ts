export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginationResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  result: T[];
}

export interface ApiError {
  message: string;
  status: number;
}

export type SortOrder = | "asc" | "desc"