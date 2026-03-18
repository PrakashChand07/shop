import { useState, useEffect } from "react";
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
import { Plus, Trash2 } from "lucide-react";
import api from "../api/axios";
import { useIndustry } from "../context/IndustryContext";
import { toast } from "sonner";

interface AddProductDialogProps {
  onAddProduct?: () => void;
  categories?: any[];
  productToEdit?: any; // To support update later
}

export function AddProductDialog({ onAddProduct, categories: externalCategories, productToEdit }: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [localCategories, setLocalCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: productToEdit?.name || "",
    sku: productToEdit?.sku || "",
    category: productToEdit?.category || "",
    hsnCode: productToEdit?.hsnCode || "",
    purchasePrice: productToEdit?.purchasePrice || "",
    sellingPrice: productToEdit?.sellingPrice || "",
    gst: productToEdit?.taxRate || "18",
    stock: productToEdit?.stock || "",
    lowStockAlert: productToEdit?.lowStockAlert || "10",
    unit: productToEdit?.unit || "pcs",
  });
  
  const { isPharmacy, isFootwear } = useIndustry();

  // Dynamic state
  const [mg, setMg] = useState(
    productToEdit?.attributes?.find((a: any) => a.key === 'mg')?.value || ""
  );
  const [batches, setBatches] = useState<{batchNo: string, expiryDate: string, quantity: string}[]>(
    productToEdit?.batches?.length 
      ? productToEdit.batches.map((b: any) => ({...b, expiryDate: b.expiryDate ? new Date(b.expiryDate).toISOString().split('T')[0] : ''})) 
      : []
  );
  const [variants, setVariants] = useState<{size: string, color: string, stock: string}[]>(
    productToEdit?.variants || []
  );

  const addBatch = () => setBatches([...batches, { batchNo: "", expiryDate: "", quantity: "" }]);
  const removeBatch = (index: number) => setBatches(batches.filter((_, i) => i !== index));

  const addVariant = () => setVariants([...variants, { size: "", color: "", stock: "" }]);
  const removeVariant = (index: number) => setVariants(variants.filter((_, i) => i !== index));

  const updateBatch = (index: number, field: string, value: string) => {
    const newBatches = [...batches];
    (newBatches[index] as any)[field] = value;
    setBatches(newBatches);
  };

  const updateVariant = (index: number, field: string, value: string) => {
    const newVariants = [...variants];
    (newVariants[index] as any)[field] = value;
    setVariants(newVariants);
  };

  const fetchCategories = async () => {
    try {
      const catRes = await api.get('/categories');
      if (catRes.data.success) {
        setLocalCategories(catRes.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  // Fetch local categories when dialog opens and external categories are not provided
  useEffect(() => {
    if (open && !externalCategories && localCategories.length === 0) {
      fetchCategories();
    }
  }, [open, externalCategories, localCategories.length]);

  // Use external categories if provided, else use local
  const categoriesToUse = externalCategories || localCategories;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        hsnCode: formData.hsnCode,
        purchasePrice: Number(formData.purchasePrice),
        sellingPrice: Number(formData.sellingPrice),
        taxRate: Number(formData.gst),
        stock: isFootwear && variants.length > 0 
            ? variants.reduce((acc, v) => acc + (Number(v.stock) || 0), 0)
            : isPharmacy && batches.length > 0
            ? batches.reduce((acc, b) => acc + (Number(b.quantity) || 0), 0)
            : Number(formData.stock),
        lowStockAlert: Number(formData.lowStockAlert),
        unit: formData.unit,
        attributes: isPharmacy && mg ? [{ key: 'mg', value: mg }] : [],
        batches: isPharmacy ? batches.map(b => ({ ...b, quantity: Number(b.quantity) })) : [],
        variants: isFootwear ? variants.map(v => ({ ...v, stock: Number(v.stock) })) : [],
      };

      let res;
      if (productToEdit) {
        res = await api.put(`/products/${productToEdit._id}`, payload);
      } else {
        res = await api.post('/products', payload);
      }

      if (res.data.success) {
        toast.success(productToEdit ? "Product updated successfully" : "Product added successfully");
        if (onAddProduct) onAddProduct();
        setOpen(false);
        if (!productToEdit) {
            setFormData({
            name: "",
            sku: "",
            category: "",
            hsnCode: "",
            purchasePrice: "",
            sellingPrice: "",
            gst: "18",
            stock: "",
            lowStockAlert: "10",
            unit: "pcs",
            });
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to save product");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {productToEdit ? (
           <Button size="sm" variant="ghost">Edit</Button>
        ) : (
           <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
             <Plus className="h-4 w-4" />
             Add Product
           </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{productToEdit ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {productToEdit ? "Update your product details" : "Add a new product to your inventory"}
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
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">Select Category</option>
                {(categoriesToUse || []).filter((c: any) => c?.isActive).map((cat: any) => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g., BTA-MFS-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hsnCode">HSN Code</Label>
              <Input
                id="hsnCode"
                value={formData.hsnCode}
                onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
                placeholder="e.g., 6403"
              />
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
              <Label htmlFor="gst">GST Rate (%)</Label>
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
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="e.g., 50"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lowStockAlert">Low Stock Alert</Label>
              <Input
                id="lowStockAlert"
                type="number"
                value={formData.lowStockAlert}
                onChange={(e) => setFormData({ ...formData, lowStockAlert: e.target.value })}
                placeholder="e.g., 10"
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
                <option value="pcs">pcs</option>
                <option value="kg">kg</option>
                <option value="box">box</option>
                <option value="set">set</option>
                <option value="other">other</option>
              </select>
            </div>
            {isPharmacy && (
              <div className="space-y-2">
                <Label htmlFor="mg">MG (Strength)</Label>
                <Input
                  id="mg"
                  value={mg}
                  onChange={(e) => setMg(e.target.value)}
                  placeholder="e.g., 500"
                />
              </div>
            )}
          </div>
          
          {isPharmacy && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <Label className="text-base font-semibold">Batches & Expiry</Label>
                <Button type="button" size="sm" variant="outline" onClick={addBatch}>
                  <Plus className="h-4 w-4 mr-2" /> Add Batch
                </Button>
              </div>
              <div className="space-y-3">
                {batches.map((batch, index) => (
                  <div key={index} className="flex gap-3 items-end p-3 border rounded-md relative">
                    <div className="flex-1 space-y-2">
                      <Label>Batch No</Label>
                      <Input value={batch.batchNo} onChange={(e) => updateBatch(index, 'batchNo', e.target.value)} placeholder="Batch number" required />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Expiry Date</Label>
                      <Input type="date" value={batch.expiryDate} onChange={(e) => updateBatch(index, 'expiryDate', e.target.value)} required />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Quantity</Label>
                      <Input type="number" min="0" value={batch.quantity} onChange={(e) => updateBatch(index, 'quantity', e.target.value)} placeholder="Qty" required />
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="text-red-500 mb-0.5" onClick={() => removeBatch(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {batches.length === 0 && <p className="text-sm text-gray-500 italic">No batches added. Total stock will be used.</p>}
              </div>
            </div>
          )}

          {isFootwear && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <Label className="text-base font-semibold">Product Variants</Label>
                <Button type="button" size="sm" variant="outline" onClick={addVariant}>
                  <Plus className="h-4 w-4 mr-2" /> Add Variant
                </Button>
              </div>
              <div className="space-y-3">
                {variants.map((variant, index) => (
                  <div key={index} className="flex gap-3 items-end p-3 border rounded-md relative">
                    <div className="flex-1 space-y-2">
                      <Label>Size</Label>
                      <Input value={variant.size} onChange={(e) => updateVariant(index, 'size', e.target.value)} placeholder="e.g. 8" required />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Color</Label>
                      <Input value={variant.color} onChange={(e) => updateVariant(index, 'color', e.target.value)} placeholder="e.g. Black" required />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Stock</Label>
                      <Input type="number" min="0" value={variant.stock} onChange={(e) => updateVariant(index, 'stock', e.target.value)} placeholder="Qty" required />
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="text-red-500 mb-0.5" onClick={() => removeVariant(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {variants.length === 0 && <p className="text-sm text-gray-500 italic">No variants added. Total stock will be used.</p>}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {productToEdit ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
