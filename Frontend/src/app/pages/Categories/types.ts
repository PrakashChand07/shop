import * as z from "zod";

export interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  isActive: z.boolean(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
