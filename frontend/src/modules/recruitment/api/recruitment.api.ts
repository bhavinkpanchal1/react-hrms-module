import { httpClient } from "@/shared/services/http/client";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";
import type { Job } from '../types';

export const recruitmentApi = {
  getJobs: async (): Promise<Job[]> => {
    const response = await httpClient.get<Job[]>(
      API_ENDPOINTS.recruitment.jobs
    );

    return response.data;
  },

  getJobById: async(id: number):Promise<Job> => {
    const response = await httpClient.get<Job>(
      `${API_ENDPOINTS.recruitment.jobs}${id}/`
    );
    return response.data;
  },

  createJob: async (data: Omit<Job, "id">): Promise<Job> => {
    const response = await httpClient.post<Job>(API_ENDPOINTS.recruitment.jobs, data);
    return response.data;
  },

  updateJob: async (id: number, data: Partial<Job>): Promise<Job>  => {
    const response = await httpClient.patch<Job>(
      `${API_ENDPOINTS.recruitment.jobs}${id}/`, data
    );
    return response.data;
  },

  deleteJob: async (id: number):Promise<void> => {
    await httpClient.delete(
      `${API_ENDPOINTS.recruitment.jobs}${id}/`
    );
  },
};