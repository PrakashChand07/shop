import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { ActionButton } from "@/app/components/common/ActionButton";
import { IRole } from "../types";
import { AlertTriangle } from "lucide-react";

interface DeleteRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
  role: IRole | null;
}

export function DeleteRoleDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  role,
}: DeleteRoleDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Role
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-700">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900">"{role?.roleName}"</span>?
          </p>
          <p className="text-sm text-gray-500 mt-1">
            This will remove the account and all associated permissions. This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <ActionButton type="button" preset="secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </ActionButton>
          <ActionButton
            type="button"
            preset="danger"
            isLoading={isDeleting}
            onClick={onConfirm}
          >
            Delete Role
          </ActionButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
