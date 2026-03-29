import api from "@/app/api/axios";
import { IModulePermission } from "@/app/common/enums/module.enum";
import { IRoleFormData } from "./types";

// ─── Departments (static defaults + custom ones created in DB) ──────────────
export const fetchDepartmentsApi = async (): Promise<string[]> => {
  const res = await api.get("/roles/departments");
  return res.data.data as string[];
};

// ─── Department-level default permissions ────────────────────────────────────
export const fetchDeptDefaultApi = async (department: string): Promise<IModulePermission[]> => {
  const res = await api.get(`/roles/department-default/${encodeURIComponent(department)}`);
  return res.data.data.permissions as IModulePermission[];
};

export const saveDeptDefaultApi = async (department: string, permissions: IModulePermission[]) => {
  const res = await api.put(`/roles/department-default/${encodeURIComponent(department)}`, { permissions });
  return res.data;
};

// ─── Role (staff accounts with login) ────────────────────────────────────────
export const fetchRolesApi = async () => {
  const res = await api.get("/roles");
  return res.data;
};

export const createRoleApi = async (data: IRoleFormData) => {
  const res = await api.post("/roles", data);
  return res.data;
};

export const updateRoleApi = async (id: string, data: Partial<IRoleFormData>) => {
  const res = await api.put(`/roles/${id}`, data);
  return res.data;
};

export const updateRolePermissionsApi = async (id: string, permissions: IModulePermission[]) => {
  const res = await api.patch(`/roles/${id}/permissions`, { permissions });
  return res.data;
};

export const deleteRoleApi = async (id: string) => {
  const res = await api.delete(`/roles/${id}`);
  return res.data;
};

