import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants/query-keys';
import { employeeApi } from '../api/employee.api';
import type { Employee } from '../types/employee.type';

export const useEmployees = () =>
  useQuery({ queryKey: queryKeys.employee.list(), queryFn: employeeApi.getEmployees });

export const useEmployee = (id: number) =>
  useQuery({
    queryKey: queryKeys.employee.details(id),
    queryFn: () => employeeApi.getEmployeeById(id),
    enabled: !!id,
  });

export const useCreateEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Employee, 'id' | 'employee_code' | 'created_at'>) =>
      employeeApi.createEmployee(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.employee.all }),
  });
};

export const useUpdateEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Employee> }) =>
      employeeApi.updateEmployee(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.employee.list() });
      qc.invalidateQueries({ queryKey: queryKeys.employee.details(variables.id) });
    },
  });
};