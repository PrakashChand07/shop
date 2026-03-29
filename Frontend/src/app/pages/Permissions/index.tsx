import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { ActionButton } from "@/app/components/common/ActionButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { ShieldCheck, User2, Building2, Info } from "lucide-react";
import { toast } from "sonner";
import {
  fetchRolesApi,
  updateRolePermissionsApi,
  fetchDepartmentsApi,
  fetchDeptDefaultApi,
  saveDeptDefaultApi,
} from "../Roles/api";
import { IRole } from "../Roles/types";
import { ModuleName, IModulePermission, generateDefaultPermissions } from "@/app/common/enums/module.enum";

type PermissionField = "canRead" | "canCreate" | "canUpdate" | "canDelete" | "isVisible";

const PERMISSION_COLS: { key: PermissionField; label: string; color: string }[] = [
  { key: "canRead",   label: "Read",    color: "text-blue-600"   },
  { key: "canCreate", label: "Create",  color: "text-green-600"  },
  { key: "canUpdate", label: "Update",  color: "text-amber-600"  },
  { key: "canDelete", label: "Delete",  color: "text-red-600"    },
  { key: "isVisible", label: "Visible", color: "text-purple-600" },
];

export function Permissions() {
  const [allRoles, setAllRoles]             = useState<IRole[]>([]);
  const [departments, setDepartments]       = useState<string[]>([]);
  const [selectedDept, setSelectedDept]     = useState<string>("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");

  // permissions shown in table — either dept-default or a specific staff's
  const [permissions, setPermissions]       = useState<IModulePermission[]>([]);
  const [isSaving, setIsSaving]             = useState(false);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isLoadingPerms, setIsLoadingPerms] = useState(false);

  // ─── Fetch all roles + departments on mount ───────────────────────────────
  useEffect(() => {
    const load = async () => {
      setIsLoadingRoles(true);
      try {
        const [rolesData, depts] = await Promise.all([
          fetchRolesApi(),
          fetchDepartmentsApi(),
        ]);
        if (rolesData.success) setAllRoles(rolesData.data);
        else toast.error("Failed to load roles.");
        setDepartments(depts);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Could not connect to server.");
      } finally {
        setIsLoadingRoles(false);
      }
    };
    load();
  }, []);

  // ─── When dept changes → reset staff, load dept defaults ─────────────────
  useEffect(() => {
    setSelectedRoleId("");
    setPermissions([]);

    if (!selectedDept) return;

    const loadDeptDefault = async () => {
      setIsLoadingPerms(true);
      try {
        const perms = await fetchDeptDefaultApi(selectedDept);
        const fallbackMap: Record<string, string> = {
          [ModuleName.STAFF]: "User",
          [ModuleName.ROLE]: "Role",
          [ModuleName.SALES]: "Order",
          [ModuleName.INVOICE]: "Order",
          [ModuleName.PURCHASE]: "Order",
          [ModuleName.INVENTORY]: "Product",
        };
        // Merge so all modules are represented
        const defaults = generateDefaultPermissions();
        const merged = defaults.map((def) => {
          let saved = perms.find((p) => p.module === def.module);
          if (!saved && fallbackMap[def.module as string]) {
            saved = perms.find((p) => p.module === fallbackMap[def.module as string]);
            if (saved) saved = { ...saved, module: def.module };
          }
          return saved ?? def;
        });
        setPermissions(merged);
      } catch {
        // If error, show all-true defaults
        setPermissions(generateDefaultPermissions());
      } finally {
        setIsLoadingPerms(false);
      }
    };
    loadDeptDefault();
  }, [selectedDept]);

  // ─── When a specific staff is selected → load their permissions ────────────
  useEffect(() => {
    if (!selectedRoleId) {
      // revert to dept defaults if dept is still selected
      if (selectedDept) {
        const loadDeptDefault = async () => {
          setIsLoadingPerms(true);
          try {
            const perms = await fetchDeptDefaultApi(selectedDept);
            const fallbackMap: Record<string, string> = {
              [ModuleName.STAFF]: "User",
              [ModuleName.ROLE]: "Role",
              [ModuleName.SALES]: "Order",
              [ModuleName.INVOICE]: "Order",
              [ModuleName.PURCHASE]: "Order",
              [ModuleName.INVENTORY]: "Product",
            };
            const defaults = generateDefaultPermissions();
            const merged = defaults.map((def) => {
              let saved = perms.find((p) => p.module === def.module);
              if (!saved && fallbackMap[def.module as string]) {
                saved = perms.find((p) => p.module === fallbackMap[def.module as string]);
                if (saved) saved = { ...saved, module: def.module };
              }
              return saved ?? def;
            });
            setPermissions(merged);
          } catch {
            setPermissions(generateDefaultPermissions());
          } finally {
            setIsLoadingPerms(false);
          }
        };
        loadDeptDefault();
      }
      return;
    }

    // Load the individual staff's permissions
    const role = allRoles.find((r) => r._id === selectedRoleId);
    if (!role) return;

    const fallbackMap: Record<string, string> = {
      [ModuleName.STAFF]: "User",
      [ModuleName.ROLE]: "Role",
      [ModuleName.SALES]: "Order",
      [ModuleName.INVOICE]: "Order",
      [ModuleName.PURCHASE]: "Order",
      [ModuleName.INVENTORY]: "Product",
    };

    const defaults = generateDefaultPermissions();
    const merged = defaults.map((def) => {
      let existing = role.permissions?.find((p) => p.module === def.module);
      if (!existing && fallbackMap[def.module as string]) {
        existing = role.permissions?.find((p) => p.module === fallbackMap[def.module as string]);
        if (existing) {
          // Clone it so we map it to the new name without modifying the old object reference
          existing = { ...existing, module: def.module };
        }
      }
      return existing ?? def;
    });
    setPermissions(merged);
  }, [selectedRoleId]);  // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Toggle helpers ───────────────────────────────────────────────────────
  const handleToggle = (module: string, field: PermissionField) => {
    setPermissions((prev) =>
      prev.map((p) => (p.module === module ? { ...p, [field]: !p[field] } : p))
    );
  };

  const handleToggleRow = (module: string, enable: boolean) => {
    setPermissions((prev) =>
      prev.map((p) =>
        p.module === module
          ? { ...p, canRead: enable, canCreate: enable, canUpdate: enable, canDelete: enable, isVisible: enable }
          : p
      )
    );
  };

  const handleToggleAll = (enable: boolean) => {
    setPermissions((prev) =>
      prev.map((p) => ({
        ...p,
        canRead: enable,
        canCreate: enable,
        canUpdate: enable,
        canDelete: enable,
        isVisible: enable,
      }))
    );
  };

  // ─── Save ─────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!selectedDept) return;
    setIsSaving(true);
    try {
      if (selectedRoleId) {
        // Save individual staff permissions
        await updateRolePermissionsApi(selectedRoleId, permissions);
        toast.success("Staff permissions saved!");
        const data = await fetchRolesApi();
        if (data.success) setAllRoles(data.data);
      } else {
        // Save department default permissions
        await saveDeptDefaultApi(selectedDept, permissions);
        toast.success(`Default permissions for "${selectedDept}" saved! New staff in this department will use these settings.`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save permissions.");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Computed ─────────────────────────────────────────────────────────────
  const filteredRoles = selectedDept
    ? allRoles.filter((r) => r.department === selectedDept)
    : allRoles;

  const selectedRole = allRoles.find((r) => r._id === selectedRoleId) ?? null;
  const allChecked =
    permissions.length > 0 &&
    permissions.every((p) => p.canRead && p.canCreate && p.canUpdate && p.canDelete && p.isVisible);

  const isDeptDefaultMode = selectedDept && !selectedRoleId;
  const isStaffMode       = selectedDept && !!selectedRoleId;
  const showTable         = (isDeptDefaultMode || isStaffMode) && permissions.length > 0;

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-purple-600" />
            Permissions
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Department → Staff select karo → module-wise permissions manage karo
          </p>
        </div>
        {selectedDept && !isLoadingPerms && permissions.length > 0 && (
          <ActionButton
            onClick={handleSave}
            isLoading={isSaving}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isDeptDefaultMode ? "Save Dept Defaults" : "Save Staff Permissions"}
          </ActionButton>
        )}
      </div>

      {/* ── Filters Card ─────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Step 1 — Department */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" /> Step 1: Department
              </p>
              <Select value={selectedDept} onValueChange={setSelectedDept} disabled={isLoadingRoles}>
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingRoles ? "Loading…" : "Select a department…"} />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Step 2 — Staff (optional) */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                <User2 className="h-3.5 w-3.5" /> Step 2: Select Staff (optional)
              </p>
              <Select
                value={selectedRoleId}
                onValueChange={(val) => setSelectedRoleId(val === "__none__" ? "" : val)}
                disabled={!selectedDept || isLoadingRoles}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !selectedDept
                        ? "Select a department first"
                        : filteredRoles.length === 0
                        ? "No staff in this department"
                        : "Choose a staff account…"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {/* Allow deselecting to go back to dept defaults */}
                  {selectedRoleId && (
                    <SelectItem value="__none__">
                      <span className="text-gray-400 italic">← Back to dept defaults</span>
                    </SelectItem>
                  )}
                  {filteredRoles.map((r) => (
                    <SelectItem key={r._id} value={r._id}>
                      <span className="flex items-center gap-2">
                        {r.roleName}
                        <span className="text-xs text-gray-400">({r.email})</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Context info banner */}
          {selectedDept && (
            <div className={`mt-3 pt-3 border-t border-gray-100`}>
              {isDeptDefaultMode ? (
                <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 rounded-md px-3 py-2">
                  <Info className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    Viewing <strong>{selectedDept}</strong> department defaults.
                    Changes here apply only to <strong>new</strong> staff added to this department.
                    Existing staff are NOT affected.
                  </span>
                </div>
              ) : isStaffMode && selectedRole ? (
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                    <User2 className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{selectedRole.roleName}</p>
                    <p className="text-xs text-gray-500">{selectedRole.email}</p>
                  </div>
                  <Badge className="ml-auto bg-blue-50 text-blue-700 hover:bg-blue-50 text-xs">
                    {selectedRole.department}
                  </Badge>
                  <Badge
                    className={`text-xs ${
                      selectedRole.isActive
                        ? "bg-green-50 text-green-700 hover:bg-green-50"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {selectedRole.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Permissions Table ────────────────────────────────────────────── */}
      {isLoadingPerms ? (
        <Card>
          <CardContent className="py-14 text-center">
            <ShieldCheck className="h-12 w-12 text-gray-200 mx-auto mb-3 animate-pulse" />
            <p className="text-gray-400 text-sm">Loading permissions…</p>
          </CardContent>
        </Card>
      ) : showTable ? (
        <Card>
          <CardHeader className="pb-0 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {isDeptDefaultMode ? (
                  <>
                    Default Permissions
                    <span className="font-normal text-amber-600 ml-2 text-sm">— {selectedDept} (department defaults)</span>
                  </>
                ) : (
                  <>
                    Staff Permissions
                    {selectedRole && (
                      <span className="font-normal text-gray-500 ml-2 text-sm">— {selectedRole.roleName}</span>
                    )}
                  </>
                )}
              </CardTitle>
              {/* Toggle ALL */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>All</span>
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={() => handleToggleAll(!allChecked)}
                  className="h-4 w-4 rounded border-gray-300 accent-purple-600 cursor-pointer"
                  title="Toggle ALL modules and permissions"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-y border-gray-200">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700 w-44">Module</th>
                    {PERMISSION_COLS.map((col) => (
                      <th key={col.key} className={`py-3 px-3 text-center font-semibold ${col.color}`}>
                        {col.label}
                      </th>
                    ))}
                    <th className="py-3 px-3 text-center font-semibold text-gray-500 text-xs">All</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {permissions.map((perm) => {
                    const rowAllOn =
                      perm.canRead &&
                      perm.canCreate &&
                      perm.canUpdate &&
                      perm.canDelete &&
                      perm.isVisible;
                    return (
                      <tr
                        key={perm.module as string}
                        className="hover:bg-purple-50/30 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium text-gray-800">{perm.module as string}</td>
                        {PERMISSION_COLS.map((col) => (
                          <td key={col.key} className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={perm[col.key] as boolean}
                              onChange={() => handleToggle(perm.module as string, col.key)}
                              className="h-4 w-4 rounded border-gray-300 accent-purple-600 cursor-pointer"
                            />
                          </td>
                        ))}
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={rowAllOn}
                            onChange={() => handleToggleRow(perm.module as string, !rowAllOn)}
                            className="h-4 w-4 rounded border-gray-300 accent-purple-600 cursor-pointer"
                            title="Toggle all for this module"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end p-4 border-t border-gray-100">
              <ActionButton
                onClick={handleSave}
                isLoading={isSaving}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isDeptDefaultMode ? "Save Dept Defaults" : "Save Staff Permissions"}
              </ActionButton>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-14 text-center">
            <ShieldCheck className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              {!selectedDept
                ? "Department select karo upar se"
                : "Loading…"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Permissions;
