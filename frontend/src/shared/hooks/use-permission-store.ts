import { create } from 'zustand';

export type Permission = 
  | 'employee.view' | 'employee.write'
  | 'payroll.view' | 'payroll.run'
  | 'leave.approve' | 'settings.manage'
  | 'recruitment.read' | 'dashboard.view'
  | 'attendance.read';

interface PermissionState {
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  // Mock function to set permissions
  setPermissions: (permissions: Permission[]) => void;
}

export const usePermissionStore = create<PermissionState>((set, get) => ({
  // Mock initial permissions (Admin like)
  permissions: [
    'employee.view', 'employee.write', 
    'payroll.view', 'payroll.run', 
    'leave.approve', 'settings.manage',
    'recruitment.read', 'dashboard.view',
    // 'attendance.read'
  ],
  
  hasPermission: (permission) => get().permissions.includes(permission),
  hasAnyPermission: (permissions) => permissions.some(p => get().permissions.includes(p)),
  hasAllPermissions: (permissions) => permissions.every(p => get().permissions.includes(p)),
  
  setPermissions: (permissions) => set({ permissions })
}));
