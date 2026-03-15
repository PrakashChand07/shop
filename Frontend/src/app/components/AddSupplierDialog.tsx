import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Building2 } from "lucide-react";

interface AddSupplierDialogProps {
  onAddSupplier?: () => void;
  supplierToEdit?: any;
}

export function AddSupplierDialog({ onAddSupplier, supplierToEdit }: AddSupplierDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: supplierToEdit?.name || "",
    contactPerson: supplierToEdit?.contactPerson || "",
    phone: supplierToEdit?.phone || "",
    email: supplierToEdit?.email || "",
    address: supplierToEdit?.address || "",
    gstNumber: supplierToEdit?.gstNumber || "",
  });

  useEffect(() => {
    if (supplierToEdit) {
      setFormData({
        name: supplierToEdit.name || "",
        contactPerson: supplierToEdit.contactPerson || "",
        phone: supplierToEdit.phone || "",
        email: supplierToEdit.email || "",
        address: supplierToEdit.address || "",
        gstNumber: supplierToEdit.gstNumber || "",
      });
    }
  }, [supplierToEdit, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        gstNumber: formData.gstNumber,
      };

      let res;
      if (supplierToEdit) {
        res = await api.put(`/suppliers/${supplierToEdit._id}`, payload);
      } else {
        res = await api.post('/suppliers', payload);
      }

      if (res.data.success) {
        toast.success(supplierToEdit ? "Supplier updated successfully!" : "Supplier added successfully!");
        if (onAddSupplier) {
          onAddSupplier();
        }
        
        if (!supplierToEdit) {
            setFormData({
            name: "",
            contactPerson: "",
            phone: "",
            email: "",
            address: "",
            gstNumber: "",
            });
        }
        
        setOpen(false);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to save supplier");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {supplierToEdit ? (
          <Button size="sm" variant="ghost">Edit</Button>
        ) : (
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Building2 className="h-4 w-4" />
            Add Supplier
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{supplierToEdit ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
          <DialogDescription>
            {supplierToEdit ? "Update supplier details" : "Add a new supplier to your database"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Bata India Ltd"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="e.g., Suresh Kumar"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g., +91 98765 43210"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g., supplier@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gstNumber">GST Number</Label>
              <Input
                id="gstNumber"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                placeholder="e.g., 27AABCB1234C1Z5"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g., 789, Industrial Area, Bangalore - 560001"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {supplierToEdit ? "Save Changes" : "Add Supplier"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
