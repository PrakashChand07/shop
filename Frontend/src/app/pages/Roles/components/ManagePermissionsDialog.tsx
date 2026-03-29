import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import { ActionButton } from "@/app/components/common/ActionButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import { ShieldCheck } from "lucide-react";
import { IRole } from "../types";
import { ModuleName, IModulePermission, generateDefaultPermissions } from "@/app/common/enums/module.enum";

interface ManagePermissionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (permissions: IModulePermission[]) => Promise<void>;
  isLoading: boolean;
  role: IRole | null;
}

type PermissionField = "canRead" | "canCreate" | "canUpdate" | "canDelete" | "isVisible";

const PERMISSION_FIELDS: { key: PermissionField; label: string; color: string }[] = [
  { key: "canRead",   label: "Read",    color: "text-blue-600" },
  { key: "canCreate", label: "Create",  color: "text-green-600" },
  { key: "canUpdate", label: "Update",  color: "text-amber-600" },
  { key: "canDelete", label: "Delete",  color: "text-red-600" },
  { key: "isVisible", label: "Visible", color: "text-purple-600" },
];

export function ManagePermissionsDialog({
  isOpen,
  onClose,
  onSave,
  isLoading,
  role,
}: ManagePermissionsDialogProps) {
  // All module permissions for this role
  const [permissions, setPermissions] = useState<IModulePermission[]>([]);
  // Which module is currently selected in dropdown
  const [selectedModule, setSelectedModule] = useState<string>("");

  // Load permissions from role when dialog opens
  useEffect(() => {
    if (role) {
      // Merge: if role has some modules missing, fill with defaults
      const defaults = generateDefaultPermissions();
      const merged = defaults.map((def) => {
        const existing = role.permissions?.find((p) => p.module === def.module);
        return existing ?? def;
      });
      setPermissions(merged);
      setSelectedModule(""); // reset selection
    }
  }, [role, isOpen]);

  // Current module's permission object
  const currentPerm = permissions.find((p) => p.module === selectedModule);

  const handleToggle = (field: PermissionField) => {
    setPermissions((prev) =>
      prev.map((p) =>
        p.module === selectedModule ? { ...p, [field]: !p[field] } : p
      )
    );
  };

  const handleSave = async () => {
    await onSave(permissions);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            Manage Permissions
            {role && (
              <Badge variant="outline" className="ml-1 text-xs font-normal">
                {role.roleName}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Module Dropdown */}
          <div className="space-y-2">
            <Label>Select Module</Label>
            <Select value={selectedModule} onValueChange={setSelectedModule}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a module to manage..." />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ModuleName).map((mod) => (
                  <SelectItem key={mod} value={mod}>
                    {mod}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Permissions Checkboxes — only show after module selected */}
          {selectedModule && currentPerm ? (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-700">
                  Permissions for: <span className="text-blue-600">{selectedModule}</span>
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {PERMISSION_FIELDS.map(({ key, label, color }) => (
                  <label
                    key={key}
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium ${color}`}>{label}</span>
                      <span className="text-xs text-gray-400">
                        {key === "canRead"   && "View records"}
                        {key === "canCreate" && "Add new records"}
                        {key === "canUpdate" && "Modify records"}
                        {key === "canDelete" && "Remove records"}
                        {key === "isVisible" && "Menu item shown"}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={currentPerm[key] as boolean}
                      onChange={() => handleToggle(key)}
                      className="h-4 w-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center">
              <ShieldCheck className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Select a module above to configure permissions</p>
            </div>
          )}

          {/* All Permissions Summary */}
          {permissions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Quick Overview</p>
              <div className="flex flex-wrap gap-1.5">
                {permissions.map((p) => {
                  const activeCount = [p.canRead, p.canCreate, p.canUpdate, p.canDelete].filter(Boolean).length;
                  return (
                    <button
                      key={p.module}
                      type="button"
                      onClick={() => setSelectedModule(p.module as string)}
                      className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                        p.module === selectedModule
                          ? "bg-blue-600 text-white border-blue-600"
                          : activeCount > 0
                          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                          : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {p.module} {activeCount > 0 && `(${activeCount})`}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
          <ActionButton type="button" preset="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </ActionButton>
          <ActionButton type="button" preset="primary" isLoading={isLoading} onClick={handleSave}>
            Save Permissions
          </ActionButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
