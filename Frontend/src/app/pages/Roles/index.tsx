import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ActionButton } from "@/app/components/common/ActionButton";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Plus, Edit, Trash2, KeyRound, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { IRole, IRoleFormData } from "./types";
import { IModulePermission } from "@/app/common/enums/module.enum";
import {
  fetchRolesApi,
  createRoleApi,
  updateRoleApi,
  updateRolePermissionsApi,
  deleteRoleApi,
} from "./api";
import { CreateRoleDialog } from "./components/CreateRoleDialog";
import { EditRoleDialog } from "./components/EditRoleDialog";
import { DeleteRoleDialog } from "./components/DeleteRoleDialog";
import { ManagePermissionsDialog } from "./components/ManagePermissionsDialog";
import PermissionGuard from "@/app/components/PermissionGuard";

export function Roles() {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Create
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Edit
  const [editingRole, setEditingRole] = useState<IRole | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Permissions
  const [permissionsRole, setPermissionsRole] = useState<IRole | null>(null);
  const [isSavingPermissions, setIsSavingPermissions] = useState(false);

  // Delete
  const [roleToDelete, setRoleToDelete] = useState<IRole | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ─── Fetch ─────────────────────────────────────────────────────────────────
  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const data = await fetchRolesApi();
      if (data.success) setRoles(data.data);
    } catch {
      toast.error("Failed to fetch roles.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // ─── Create ────────────────────────────────────────────────────────────────
  const handleCreateSubmit = async (formData: IRoleFormData) => {
    setIsCreating(true);
    try {
      await createRoleApi(formData);
      toast.success("Role created successfully");
      setIsCreateOpen(false);
      fetchRoles();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create role.");
    } finally {
      setIsCreating(false);
    }
  };

  // ─── Edit ──────────────────────────────────────────────────────────────────
  const handleEditSubmit = async (formData: IRoleFormData) => {
    if (!editingRole) return;
    setIsUpdating(true);
    try {
      await updateRoleApi(editingRole._id, formData);
      toast.success("Role updated successfully");
      setEditingRole(null);
      fetchRoles();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update role.");
    } finally {
      setIsUpdating(false);
    }
  };

  // ─── Permissions ───────────────────────────────────────────────────────────
  const handleSavePermissions = async (permissions: IModulePermission[]) => {
    if (!permissionsRole) return;
    setIsSavingPermissions(true);
    try {
      await updateRolePermissionsApi(permissionsRole._id, permissions);
      toast.success("Permissions updated successfully");
      setPermissionsRole(null);
      fetchRoles();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save permissions.");
    } finally {
      setIsSavingPermissions(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!roleToDelete) return;
    setIsDeleting(true);
    try {
      await deleteRoleApi(roleToDelete._id);
      toast.success("Role deleted successfully.");
      setRoleToDelete(null);
      fetchRoles();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete role.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <KeyRound className="h-6 w-6 text-blue-600" />
            Roles &amp; Permissions
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Create staff accounts and manage module-level access
          </p>
        </div>
        <PermissionGuard module="Role" action="canCreate">
          <ActionButton
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Staff
          </ActionButton>
        </PermissionGuard>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Accounts ({roles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left text-sm font-medium text-gray-600 px-2">Role Name</th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600 px-2">Email</th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600 px-2">Department</th>
                  <th className="pb-3 text-center text-sm font-medium text-gray-600 px-2">Status</th>
                  <th className="pb-3 text-center text-sm font-medium text-gray-600 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-gray-400">
                      Loading staff accounts...
                    </td>
                  </tr>
                ) : roles.length > 0 ? (
                  roles.map((role) => (
                    <tr
                      key={role._id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-2 text-sm font-medium text-gray-900">
                        {role.roleName}
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-600">{role.email}</td>
                      <td className="py-3 px-2">
                        {role.department ? (
                          <Badge variant="outline" className="text-xs">
                            {role.department}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Badge
                          className={
                            role.isActive
                              ? "bg-green-100 text-green-700 hover:bg-green-100 text-xs"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-100 text-xs"
                          }
                        >
                          {role.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex justify-center items-center gap-1">
                          {/* Edit basic info */}
                          <PermissionGuard module="Role" action="canUpdate">
                            <Button
                              size="sm"
                              variant="ghost"
                              title="Edit account"
                              onClick={() => setEditingRole(role)}
                            >
                              <Edit className="h-4 w-4 text-gray-400 hover:text-blue-600" />
                            </Button>
                          </PermissionGuard>

                          {/* Manage Permissions */}
                          <PermissionGuard module="Role" action="canUpdate">
                            <Button
                              size="sm"
                              variant="ghost"
                              title="Manage permissions"
                              onClick={() => setPermissionsRole(role)}
                            >
                              <ShieldCheck className="h-4 w-4 text-gray-400 hover:text-purple-600" />
                            </Button>
                          </PermissionGuard>

                          {/* Delete */}
                          <PermissionGuard module="Role" action="canDelete">
                            <Button
                              size="sm"
                              variant="ghost"
                              title="Delete account"
                              onClick={() => setRoleToDelete(role)}
                            >
                              <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-600" />
                            </Button>
                          </PermissionGuard>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-sm text-gray-400">
                      No staff accounts found. Click &quot;Add Staff&quot; to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Dialogs ────────────────────────────────────────────────────── */}
      <CreateRoleDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
        isLoading={isCreating}
      />

      <EditRoleDialog
        isOpen={!!editingRole}
        onClose={() => setEditingRole(null)}
        onSubmit={handleEditSubmit}
        isLoading={isUpdating}
        role={editingRole}
      />

      <ManagePermissionsDialog
        isOpen={!!permissionsRole}
        onClose={() => setPermissionsRole(null)}
        onSave={handleSavePermissions}
        isLoading={isSavingPermissions}
        role={permissionsRole}
      />

      <DeleteRoleDialog
        isOpen={!!roleToDelete}
        onClose={() => setRoleToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        role={roleToDelete}
      />
    </div>
  );
}

export default Roles;
