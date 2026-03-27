import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { ActionButton } from "@/app/components/common/ActionButton";
import { Category } from "../types";

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  category: Category | null;
}

export function DeleteCategoryDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  category,
}: DeleteCategoryDialogProps) {
  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-gray-600">
          Are you sure you want to delete the category
        </div>
        <div className="text-sm text-gray-600 font-semibold">Category Name: {category.name}</div>
        <div className="text-sm text-gray-600 font-semibold">Description: {category.description}</div>
        <div className="flex justify-end gap-3 pt-4">
          <ActionButton type="button" preset="secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </ActionButton>
          <ActionButton type="button" preset="danger" isLoading={isDeleting} onClick={onConfirm}>
            Delete
          </ActionButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
