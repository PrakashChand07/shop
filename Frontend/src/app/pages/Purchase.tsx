import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Plus, Trash2, Search } from "lucide-react";
import api from "../api/axios";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { CreatePurchaseDialog } from "../components/CreatePurchaseDialog";

export function Purchase() {
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [apiSuppliers, setApiSuppliers] = useState<any[]>([]);

  // Create PO Form State
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [supplier, setSupplier] = useState("");
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split("T")[0]);
  const [expectedDelivery, setExpectedDelivery] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchPurchaseOrders = async () => {
    try {
      const res = await api.get('/purchase-orders');
      if (res.data.success) {
        setPurchaseOrders(res.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch purchase orders");
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/suppliers');
      if (res.data.success) {
        setApiSuppliers(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
    fetchSuppliers();
  }, []);

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

  const fetchProducts = async (query: string) => {
    try {
      setIsSearching(true);
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

  const handleCreatePO = async (e: React.FormEvent) => {
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
        fetchPurchaseOrders();
        
        // Reset form
        setSupplier("");
        setOrderDate(new Date().toISOString().split("T")[0]);
        setExpectedDelivery("");
        setAmount("");
        setNotes("");
        setItems([]);
        setSearchQuery("");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to create purchase order");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Purchase Management
          </h1>
          <p className="text-gray-600">Create and manage purchase orders</p>
        </div>
        <CreatePurchaseDialog onCreatePurchase={fetchPurchaseOrders} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Create Purchase Order */}
        <Card>
          <CardHeader>
            <CardTitle>Create Purchase Order</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePO} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="supplier-select">Select Supplier *</Label>
                <select
                  id="supplier-select"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  required
                >
                  <option value="">Choose supplier...</option>
                  {apiSuppliers.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Order Date *</Label>
                  <Input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Expected Delivery</Label>
                  <Input type="date" value={expectedDelivery} onChange={(e) => setExpectedDelivery(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Total Amount (₹) *</Label>
                <Input type="number" placeholder="e.g., 50000" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>

              {/* Dynamic Items section replacing items description */}
              <div className="space-y-4 rounded-lg border p-4 bg-gray-50">
                <Label className="text-base font-semibold">Inventory Products Array</Label>

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
                      <ul className="max-h-[200px] overflow-y-auto">
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
                                  <span className="text-xs text-red-500 font-medium whitespace-nowrap ml-2">Already selected</span>
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
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {items.map((item, idx) => (
                        <div key={item.product} className="flex flex-col gap-2 bg-white p-3 rounded-md border shadow-sm">
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-medium">{idx + 1}. {item.name}</span>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeItem(item.product)}
                              className="h-6 w-6 text-red-500 hover:bg-red-50 hover:text-red-700 -mt-1 -mr-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs text-gray-500 w-8">Qty:</Label>
                            <Input 
                              type="number" 
                              min="1"
                              value={item.quantity} 
                              onChange={(e) => updateItemQuantity(item.product, parseInt(e.target.value) || 1)}
                              className="w-20 h-8 text-xs"
                            />
                            <Label className="text-xs text-gray-500 w-8 ml-2">Unit:</Label>
                            <select
                              value={item.unit}
                              onChange={(e) => updateItemUnit(item.product, e.target.value)}
                              className="flex-1 h-8 rounded-md border border-gray-300 text-xs px-2"
                            >
                              <option value="pcs">pcs</option>
                              <option value="kg">kg</option>
                              <option value="box">box</option>
                              <option value="set">set</option>
                              <option value="other">other</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes or instructions..."
                  className="flex min-h-[60px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Create Purchase Order</Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Purchase Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {purchaseOrders.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">No purchase orders found.</p>
              ) : (
                purchaseOrders.map((po) => (
                  <div
                    key={po._id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{po.poNumber}</p>
                      <p className="text-sm text-gray-500">
                        {po.supplier?.name || "Unknown Supplier"}
                      </p>
                      <p className="text-xs text-gray-400">
                        Date: {new Date(po.orderDate).toLocaleDateString("en-IN")}
                        {po.expectedDelivery && ` | Expected: ${new Date(po.expectedDelivery).toLocaleDateString("en-IN")}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ₹{(po.amount || 0).toLocaleString("en-IN")}
                      </p>
                      <div className="flex items-center gap-2 mt-1 justify-end">
                        <span className={`text-xs px-2 py-1 rounded-full ${po.status === 'completed' ? 'bg-green-100 text-green-700' : po.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {po.status}
                        </span>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}