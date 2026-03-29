import React from "react";
import { useAuth } from "../context/AuthContext";

interface Props {
  module: string;
  action: "canRead" | "canCreate" | "canUpdate" | "canDelete";
  /** Optional: override permissions (defaults to logged-in user's permissions) */
  permissions?: any[];
  children: React.ReactNode;
}

const BYPASS_ROLES = ["admin", "superadmin", "manager", "accountant"];

const PermissionGuard = ({
  module,
  action,
  permissions: permissionsProp,
  children,
}: Props) => {
  const { user } = useAuth();

  // Admin/superadmin always bypass
  if (user && BYPASS_ROLES.includes(user.role)) {
    return <>{children}</>;
  }

  const permissions = permissionsProp ?? user?.permissions ?? [];

  if (!permissions || !Array.isArray(permissions)) return null;

  const permission = permissions.find((p) => p.module === module);

  if (!permission) return null;
  if (!permission[action]) return null;

  return <>{children}</>;
};

export default PermissionGuard;
