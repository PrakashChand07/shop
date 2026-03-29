import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { ActionButton } from "@/app/components/common/ActionButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { IRole, IRoleFormData } from "../types";
import { Department } from "../../../common/enums/department.enum";
import { generateDefaultPermissions } from "../../../common/enums/module.enum";

interface RoleFormProps {
  initialData?: IRole | null;
  onSubmit: (data: IRoleFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function RoleForm({ initialData, onSubmit, onCancel, isLoading }: RoleFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IRoleFormData>({
    defaultValues: {
      roleName: "",
      email: "",
      password: "",
      department: "",
      permissions: generateDefaultPermissions(),
    },
  });

  const permissions = watch("permissions") || [];

  useEffect(() => {
    if (initialData) {
      reset({
        roleName: initialData.roleName,
        email: initialData.email,
        password: "", // intentionally empty so it won't trigger update unless user types
        department: initialData.department,
        permissions: initialData.permissions?.length 
          ? initialData.permissions 
          : generateDefaultPermissions(),
      });
    } else {
      reset({
        roleName: "",
        email: "",
        password: "",
        department: "",
        permissions: generateDefaultPermissions(),
      });
    }
  }, [initialData, reset]);

  const handlePermissionChange = (index: number, field: string, value: boolean) => {
    const updated = [...permissions];
    updated[index] = { ...updated[index], [field]: value };
    setValue("permissions", updated);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Role Name *</Label>
          <Input placeholder="e.g. Sales Manager" {...register("roleName", { required: "Role Name is required" })} error={errors.roleName?.message} />
        </div>
        <div className="space-y-2">
          <Label>Email *</Label>
          <Input type="email" placeholder="manager@example.com" {...register("email", { required: "Email is required" })} error={errors.email?.message} />
        </div>
        <div className="space-y-2">
          <Label>Password {initialData ? "(Leave empty to keep current)" : "*"}</Label>
          <Input type="password" placeholder="Password" {...register("password", { required: initialData ? false : "Password is required" })} error={errors.password?.message} />
        </div>
        <div className="space-y-2">
          <Label>Department *</Label>
          <Controller
            name="department"
            control={control}
            rules={{ required: "Department is required" }}
            render={({ field }) => (
              <div>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Department).map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-[0.8rem] text-red-500 mt-1.5">{errors.department.message}</p>}
              </div>
            )}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="font-semibold text-gray-800">Module Permissions</Label>
        <div className="rounded-md border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Module</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700">Read</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700">Create</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700">Update</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700">Delete</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700">Visible</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {permissions.map((perm, index) => (
                <tr key={perm.module} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{perm.module}</td>
                  <td className="py-3 px-4 text-center">
                    <input type="checkbox" checked={perm.canRead} onChange={(e) => handlePermissionChange(index, "canRead", e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <input type="checkbox" checked={perm.canCreate} onChange={(e) => handlePermissionChange(index, "canCreate", e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <input type="checkbox" checked={perm.canUpdate} onChange={(e) => handlePermissionChange(index, "canUpdate", e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <input type="checkbox" checked={perm.canDelete} onChange={(e) => handlePermissionChange(index, "canDelete", e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <input type="checkbox" checked={perm.isVisible} onChange={(e) => handlePermissionChange(index, "isVisible", e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <ActionButton type="button" preset="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </ActionButton>
        <ActionButton type="submit" preset="primary" isLoading={isLoading}>
          {initialData ? "Save Changes" : "Create Role"}
        </ActionButton>
      </div>
    </form>
  );
}
