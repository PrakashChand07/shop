import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/app/components/ui/input";
import { Switch } from "@/app/components/ui/switch";
import { ActionButton } from "@/app/components/common/ActionButton";
import { Category, CategoryFormData } from "../types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";

interface CategoryFormProps {
  initialData?: Category | null;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function CategoryForm({ initialData, onSubmit, onCancel, isLoading }: CategoryFormProps) {
  const form = useForm<CategoryFormData>({
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description || "",
        isActive: initialData.isActive,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        isActive: true,
      });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "Category name is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="e.g. Men's Footwear" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="A brief description of this category" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center cursor-pointer justify-between py-2 rounded-lg border border-gray-100 p-3 shadow-sm bg-gray-50/50">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <FormDescription>
                  Inactive categories won't appear as options in products
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <ActionButton type="button" preset="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </ActionButton>
          <ActionButton type="submit" preset="primary" isLoading={isLoading}>
            {initialData ? "Save Changes" : "Create Category"}
          </ActionButton>
        </div>
      </form>
    </Form>
  );
}
