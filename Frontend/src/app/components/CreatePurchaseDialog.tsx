import { useState } from "react";
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
import { ShoppingCart } from "lucide-react";
import { suppliers } from "../lib/mockData";

interface CreatePurchaseDialogProps {
  onCreatePurchase?: (purchase: any) => void;
}

export function CreatePurchaseDialog({ onCreatePurchase }: CreatePurchaseDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    supplier: "",
    orderDate: new Date().toISOString().split("T")[0],
    expectedDelivery: "",
    items: "",
    amount: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPurchase = {
      id: Date.now().toString(),
      poNumber: `PO-${Date.now().toString().slice(-6)}`,
      supplierId: formData.supplier,
      orderDate: formData.orderDate,
      expectedDelivery: formData.expectedDelivery,
      amount: parseFloat(formData.amount),
      status: "pending",
      notes: formData.notes,
    };

    if (onCreatePurchase) {
      onCreatePurchase(newPurchase);
    }

    alert(`Purchase Order ${newPurchase.poNumber} created successfully!`);
    
    setFormData({
      supplier: "",
      orderDate: new Date().toISOString().split("T")[0],
      expectedDelivery: "",
      items: "",
      amount: "",
      notes: "",
    });
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <ShoppingCart className="h-4 w-4" />
          Create Purchase Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
          <DialogDescription>
            Create a new purchase order for your supplier
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier *</Label>
              <select
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderDate">Order Date *</Label>
              <Input
                id="orderDate"
                type="date"
                value={formData.orderDate}
                onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedDelivery">Expected Delivery</Label>
              <Input
                id="expectedDelivery"
                type="date"
                value={formData.expectedDelivery}
                onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Total Amount (₹) *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="e.g., 50000"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="items">Items Description</Label>
              <Input
                id="items"
                value={formData.items}
                onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                placeholder="e.g., 50 pairs of Bata Formal Shoes"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes or instructions..."
                className="flex min-h-20 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Purchase Order
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
