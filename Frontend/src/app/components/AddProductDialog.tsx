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
import { Plus } from "lucide-react";

interface AddProductDialogProps {
  onAddProduct?: (product: any) => void;
}

export function AddProductDialog({ onAddProduct }: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    category: "",
    hsnCode: "",
    purchasePrice: "",
    sellingPrice: "",
    gst: "5",
    stock: "",
    lowStockAlert: "",
    unit: "Pair",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProduct = {
      id: Date.now().toString(),
      name: formData.name,
      sku: formData.sku,
      barcode: formData.barcode,
      category: formData.category,
      hsnCode: formData.hsnCode,
      purchasePrice: parseFloat(formData.purchasePrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      gst: parseFloat(formData.gst),
      stock: parseInt(formData.stock),
      lowStockAlert: parseInt(formData.lowStockAlert),
      unit: formData.unit,
    };

    if (onAddProduct) {
      onAddProduct(newProduct);
    }

    // Show success message
    alert(`Product "${formData.name}" added successfully!`);
    
    // Reset form
    setFormData({
      name: "",
      sku: "",
      barcode: "",
      category: "",
      hsnCode: "",
      purchasePrice: "",
      sellingPrice: "",
      gst: "5",
      stock: "",
      lowStockAlert: "",
      unit: "Pair",
    });
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Add a new product to your inventory
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Bata Men's Formal Shoes"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                required
              >
                <option value="">Select Category</option>
                <option value="Men's Formal Shoes">Men's Formal Shoes</option>
                <option value="Women's Sandals & Flats">Women's Sandals & Flats</option>
                <option value="Casual Slippers">Casual Slippers</option>
                <option value="Sports Shoes">Sports Shoes</option>
                <option value="Kids Footwear">Kids Footwear</option>
                <option value="Boots & Heels">Boots & Heels</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g., BTA-MFS-001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                placeholder="e.g., 8901234567890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hsnCode">HSN Code *</Label>
              <Input
                id="hsnCode"
                value={formData.hsnCode}
                onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
                placeholder="e.g., 6403"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gst">GST Rate (%) *</Label>
              <select
                id="gst"
                value={formData.gst}
                onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                required
              >
                <option value="0">0%</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price (₹) *</Label>
              <Input
                id="purchasePrice"
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                placeholder="e.g., 950"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Selling Price (₹) *</Label>
              <Input
                id="sellingPrice"
                type="number"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                placeholder="e.g., 1299"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="e.g., 50"
                required
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lowStockAlert">Low Stock Alert *</Label>
              <Input
                id="lowStockAlert"
                type="number"
                value={formData.lowStockAlert}
                onChange={(e) => setFormData({ ...formData, lowStockAlert: e.target.value })}
                placeholder="e.g., 10"
                required
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <select
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="Pair">Pair</option>
                <option value="Piece">Piece</option>
                <option value="Box">Box</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Add Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
