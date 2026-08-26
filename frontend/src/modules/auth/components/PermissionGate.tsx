import type { ReactNode } from "react";
import { usePermission } from "../hooks/usePermission";
import type { Permission } from "../types/auth.types";

interface PermissionGateProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGate = ({
  permission,
  children,
  fallback = null,
}: PermissionGateProps) => {
  const { hasPermission } = usePermission();
  return hasPermission(permission) ? children : fallback;
};
