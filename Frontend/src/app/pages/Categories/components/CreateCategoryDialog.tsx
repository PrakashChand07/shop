import { useEffect } from "react";
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
import { Switch } from "@/app/components/ui/switch";
import { ActionButton } from "@/app/components/common/ActionButton";
import { CategoryFormData, categorySchema } from "../types";

interface CreateCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  isLoading: boolean;
}

export function CreateCategoryDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CreateCategoryDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      reset({
        name: "",
        description: "",
        isActive: true,
      });
    }
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="create-name">
              Category Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="create-name"
              placeholder="e.g. Men's Footwear"
              {...register("name")}
              error={errors.name?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-description">Description (Optional)</Label>
            <Input
              id="create-description"
              placeholder="A brief description of this category"
              {...register("description")}
            />
          </div>

          <div className="flex items-center justify-between py-2 rounded-lg border border-gray-100 p-3 shadow-sm bg-gray-50/50">
            <div className="space-y-0.5">
              <Label className="text-base cursor-pointer">Active Status</Label>
              <p className="text-sm text-gray-500">
                Inactive categories won't appear as options in products
              </p>
            </div>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <ActionButton type="button" preset="secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </ActionButton>
            <ActionButton type="submit" preset="primary" isLoading={isLoading}>
              Create Category
            </ActionButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
