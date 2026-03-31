import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { ActionButton } from "@/app/components/common/ActionButton";
import { ChevronDown, Plus, Eye, EyeOff } from "lucide-react";
import { IRole, IRoleFormData, roleSchema } from "../types";
import { fetchDepartmentsApi } from "../api";

interface EditRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IRoleFormData) => Promise<void>;
  isLoading: boolean;
  role: IRole | null;
}

export function EditRoleDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  role,
}: EditRoleDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IRoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      roleName: "",
      email: "",
      password: "",
      department: "",
      permissions: [],
    },
  });

  const [departments, setDepartments] = useState<string[]>([]);
  const [deptInput, setDeptInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (role) {
      reset({
        roleName: role.roleName,
        email: role.email,
        password: "",
        department: role.department,
        permissions: role.permissions,
      });
      setDeptInput(role.department || "");
    }
    if (isOpen) {
      fetchDepartmentsApi()
        .then(setDepartments)
        .catch(() => {});
    }
  }, [role, isOpen, reset]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentDept = watch("department");
  const filteredDepts = deptInput
    ? departments.filter((d) => d.toLowerCase().includes(deptInput.toLowerCase()))
    : departments;

  const handleSelectDept = (dept: string) => {
    setValue("department", dept, { shouldValidate: true });
    setDeptInput(dept);
    setShowDropdown(false);
  };

  const handleDeptInputChange = (val: string) => {
    setDeptInput(val);
    setValue("department", val, { shouldValidate: true });
    setShowDropdown(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Staff Account</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-roleName">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-roleName"
              placeholder="e.g. Rahul Kumar"
              {...register("roleName")}
              error={errors.roleName?.message}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="edit-email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-email"
              type="email"
              {...register("email")}
              error={errors.email?.message}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="edit-password">
              New Password
              <span className="text-xs text-gray-400"> (leave empty to keep current)</span>
            </Label>
            <Input
              id="edit-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••"
              {...register("password")}
              suffix={
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
          </div>

          {/* Department — same smart combo as Create */}
          <Controller
            name="department"
            control={control}
            render={() => (
              <div className="space-y-2">
                <Label>
                  Department / Role <span className="text-red-500">*</span>
                </Label>
                <div className="relative" ref={dropdownRef}>
                  <div className="relative">
                    <Input
                      placeholder="Select or type department…"
                      value={deptInput}
                      onChange={(e) => handleDeptInputChange(e.target.value)}
                      onFocus={() => setShowDropdown(true)}
                      className={`pr-8 ${errors.department ? "border-red-500" : ""}`}
                      autoComplete="off"
                    />
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>

                  {showDropdown && (
                    <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-52 overflow-y-auto">
                      {filteredDepts.map((dept) => (
                        <button
                          key={dept}
                          type="button"
                          onClick={() => handleSelectDept(dept)}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-blue-50 transition-colors ${
                            currentDept === dept ? "bg-blue-50 font-semibold text-blue-700" : "text-gray-800"
                          }`}
                        >
                          {dept}
                        </button>
                      ))}
                      {deptInput &&
                        !departments.some((d) => d.toLowerCase() === deptInput.toLowerCase()) && (
                          <button
                            type="button"
                            onClick={() => handleSelectDept(deptInput)}
                            className="w-full px-3 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 border-t border-gray-100 flex items-center gap-1.5"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Create new: <strong>&quot;{deptInput}&quot;</strong>
                          </button>
                        )}
                    </div>
                  )}
                </div>
                {errors.department && (
                  <p className="text-[0.8rem] text-red-500">{errors.department.message}</p>
                )}
              </div>
            )}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <ActionButton type="button" preset="secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </ActionButton>
            <ActionButton type="submit" preset="primary" isLoading={isLoading}>
              Save Changes
            </ActionButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
