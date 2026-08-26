import { useAuthStore } from "../stores/auth.store";
import type { Permission } from "../types/auth.types";

export const usePermission = () => {
  const permissions = useAuthStore((state) => state.session?.user.permissions ?? []);
  const hasPermission = (permission: Permission) => permissions.includes(permission);
  const hasAnyPermission = (required: readonly Permission[]) =>
    required.some((permission) => permissions.includes(permission));
  const hasAllPermissions = (required: readonly Permission[]) =>
    required.every((permission) => permissions.includes(permission));

  return { permissions, hasPermission, hasAnyPermission, hasAllPermissions };
};
