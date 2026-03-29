import * as z from "zod";
import { IModulePermission } from "../../common/enums/module.enum";

// ─── Data shape returned by API ───────────────────────────────────────────────
export interface IRole {
  _id: string;
  roleName: string;
  email: string;
  department: string;
  isActive: boolean;
  permissions: IModulePermission[];
}

// ─── Zod Schema ───────────────────────────────────────────────────────────────
export const roleSchema = z.object({
  roleName: z.string().min(1, "Role name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().optional(),
  department: z.string().min(1, "Department is required"),
  permissions: z.array(
    z.object({
      module: z.string(),
      canRead: z.boolean(),
      canCreate: z.boolean(),
      canUpdate: z.boolean(),
      canDelete: z.boolean(),
      isVisible: z.boolean(),
    })
  ),
});

export type IRoleFormData = z.infer<typeof roleSchema>;
