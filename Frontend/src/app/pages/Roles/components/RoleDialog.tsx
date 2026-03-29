import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { IRole, IRoleFormData } from "../types";
import { RoleForm } from "./RoleForm";

interface RoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IRoleFormData) => Promise<void>;
  isLoading: boolean;
  editingRole?: IRole | null;
}

export function RoleDialog({ isOpen, onClose, onSubmit, isLoading, editingRole }: RoleDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingRole ? "Edit Role / Account" : "Create Role / Account"}</DialogTitle>
        </DialogHeader>
        <RoleForm initialData={editingRole} onSubmit={onSubmit} onCancel={onClose} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
}
