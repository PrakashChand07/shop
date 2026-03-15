import { useState, useEffect, useRef } from "react";
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
import { ShoppingCart, Plus, Trash2, Search } from "lucide-react";
import api from "../api/axios";
import { toast } from "sonner";

interface CreatePurchaseDialogProps {
  onCreatePurchase?: () => void;
}

export function CreatePurchaseDialog({ onCreatePurchase }: CreatePurchaseDialogProps) {
  const [open, setOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  // PO Form state
  const [supplier, setSupplier] = useState("");
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split("T")[0]);
  const [expectedDelivery, setExpectedDelivery] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<any[]>([]);
  
  // Ref to close dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch initial data
  useEffect(() => {
    if (open) {
      fetchSuppliers();
    }
  }, [open]);

  // Handle Debounce for Product Search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        fetchProducts(searchQuery);
      } else {
        setProducts([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/suppliers');
      if (res.data.success) {
        setSuppliers(res.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load suppliers");
    }
  };

  const fetchProducts = async (query: string) => {
    try {
      setIsSearching(true);
      // Fetches max 40 products as requested
      const res = await api.get(`/products?search=${query}&limit=40`);
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const addProductToItems = (product: any) => {
    if (items.find(item => item.product === product._id)) {
      toast.error("Product already added");
      return;
    }
    setItems([...items, { product: product._id, name: product.name, quantity: 1, unit: product.unit || "pcs" }]);
    setSearchQuery("");
    setProducts([]);
  };

  const updateItemQuantity = (id: string, qty: number) => {
    setItems(items.map(item => item.product === id ? { ...item, quantity: qty } : item));
  };
  
  const updateItemUnit = (id: string, unit: string) => {
    setItems(items.map(item => item.product === id ? { ...item, unit } : item));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.product !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Please add at least one item to the purchase order");
      return;
    }

    try {
      const payload = {
        supplier,
        orderDate,
        expectedDelivery: expectedDelivery || undefined,
        amount: parseFloat(amount),
        notes,
        items: items.map(item => ({ product: item.product, quantity: item.quantity, unit: item.unit })),
      };

      const res = await api.post('/purchase-orders', payload);

      if (res.data.success) {
        toast.success(`Purchase Order created successfully!`);
        if (onCreatePurchase) {
          onCreatePurchase();
        }
        
        // Reset form
        setSupplier("");
        setOrderDate(new Date().toISOString().split("T")[0]);
        setExpectedDelivery("");
        setAmount("");
        setNotes("");
        setItems([]);
        setSearchQuery("");
        setOpen(false);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to create purchase order");
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProducts([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <ShoppingCart className="h-4 w-4" />
          Create Purchase Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
          <DialogDescription>
            Create a new purchase order for your supplier
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier *</Label>
              <select
                id="supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="orderDate">Order Date *</Label>
              <Input
                id="orderDate"
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expectedDelivery">Expected Delivery</Label>
              <Input
                id="expectedDelivery"
                type="date"
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Total Amount (₹) *</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 50000"
                required
                min="0"
                step="0.01"
              />
            </div>
            
            {/* Dynamic Items section replacing items description */}
            <div className="md:col-span-2 space-y-4 rounded-lg border p-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">Inventory Products Array</Label>
              </div>

              {/* Product Search Box */}
              <div className="relative" ref={dropdownRef}>
                <Label className="text-sm mb-1 block">Search & Add Product</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type product name or SKU..."
                    className="pl-10 bg-white"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-900 border-t-transparent"></div>
                    </div>
                  )}
                </div>
                
                {products.length > 0 && searchQuery.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                    {/* The UI shows max 10 but data has up to 40 max mapped by API limit  */}
                    <ul className="max-h-[300px] overflow-y-auto">
                      {products.map((product) => {
                        const isAdded = items.some(item => item.product === product._id);
                        return (
                          <li 
                            key={product._id} 
                            onClick={() => !isAdded && addProductToItems(product)}
                            className={`p-2 hover:bg-gray-100 flex justify-between items-center ${isAdded ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <span className="font-medium text-sm">{product.name} {product.sku ? `(${product.sku})` : ''}</span>
                            {isAdded ? (
                                <span className="text-xs text-red-500 font-medium">Already selected</span>
                            ) : (
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" type="button">
                                  <Plus className="h-4 w-4 text-green-600" />
                                </Button>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </div>

              {/* Added Items List */}
              {items.length > 0 && (
                <div className="space-y-3 mt-4">
                  <Label>Selected Products</Label>
                  <div className="space-y-2">
                    {items.map((item, idx) => (
                      <div key={item.product} className="flex flex-wrap md:flex-nowrap items-center gap-3 bg-white p-3 rounded-md border shadow-sm">
                        <div className="flex-1 min-w-[150px]">
                          <span className="text-sm font-medium">{idx + 1}. {item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-gray-500">Qty:</Label>
                          <Input 
                            type="number" 
                            min="1"
                            value={item.quantity} 
                            onChange={(e) => updateItemQuantity(item.product, parseInt(e.target.value) || 1)}
                            className="w-20 h-8"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-gray-500">Unit:</Label>
                          <select
                            value={item.unit}
                            onChange={(e) => updateItemUnit(item.product, e.target.value)}
                            className="h-8 rounded-md border border-gray-300 text-sm px-2"
                          >
                            <option value="pcs">pcs</option>
                            <option value="kg">kg</option>
                            <option value="box">box</option>
                            <option value="set">set</option>
                            <option value="other">other</option>
                          </select>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeItem(item.product)}
                          className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes or instructions..."
                className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-2 border-t mt-6">
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
