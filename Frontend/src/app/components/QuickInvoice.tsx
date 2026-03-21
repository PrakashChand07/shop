import { useState, useEffect } from "react";
import api from "../api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Search, Barcode, Plus, Minus, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { PaymentCollectionDialog } from "./PaymentCollectionDialog";
import { InvoicePreviewDialog } from "./InvoicePreviewDialog";

interface QuickCartItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  discount: number;
  hsnCode: string;
  gst: number; // Always 0 for quick invoice
}

export function QuickInvoice() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [cartItems, setCartItems] = useState<QuickCartItem[]>([]);
  const [additionalDiscount, setAdditionalDiscount] = useState(0);
  const [showInvoice, setShowInvoice] = useState(false);
  
  // Custom customer fields
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);

  // Payment popup & recorded backend invoice
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [recordedInvoice, setRecordedInvoice] = useState<any>(null);

  const [apiProducts, setApiProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        if (res.data.success) {
          setApiProducts(res.data.data);
        }
      } catch (error) {
        toast.error("Failed to fetch products");
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = apiProducts.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (productId: string) => {
    const product = apiProducts.find((p) => p._id === productId);
    if (!product) return;

    const existingItem = cartItems.find((item) => item.productId === productId);

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      const newItem: QuickCartItem = {
        id: Date.now().toString(),
        productId: product._id,
        name: product.name,
        quantity: 1,
        price: product.sellingPrice,
        gst: 0, // No GST
        discount: 0,
        hsnCode: product.hsnCode || "",
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const updateQuantity = (itemId: string, change: number) => {
    setCartItems(
      cartItems
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const updateDiscount = (itemId: string, discount: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId
          ? { ...item, discount: Math.max(0, Math.min(100, discount)) }
          : item
      )
    );
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemTotal = item.quantity * item.price;
      const discountAmount = (itemTotal * item.discount) / 100;
      return total + (itemTotal - discountAmount);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const additionalDiscountAmount = (subtotal * additionalDiscount) / 100;
    return subtotal - additionalDiscountAmount;
  };

  const handlePhoneChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomerPhone(val);
    if (val.length >= 10) {
      setIsSearchingCustomer(true);
      try {
        const res = await api.get(`/customers?search=${val}`);
        if (res.data.success && res.data.data.length > 0) {
          const found = res.data.data[0];
          setSelectedCustomer(found._id);
          setCustomerName(found.name);
          setCustomerAddress(found.address?.street || found.address || "");
        } else {
          setSelectedCustomer("");
        }
      } catch (error) {
        console.error("Error fetching customer", error);
      } finally {
        setIsSearchingCustomer(false);
      }
    } else {
      setSelectedCustomer("");
      setCustomerName("");
      setCustomerAddress("");
    }
  };

  const handleGenerateInvoice = async () => {
    if (!customerPhone && !customerName) {
      toast.error("Please enter customer phone or name");
      return;
    }
    if (!customerName) {
      toast.error("Customer name is required");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Please add items to cart before generating invoice");
      return;
    }

    if (!selectedCustomer) {
      try {
        const res = await api.post('/customers', {
          name: customerName,
          phone: customerPhone,
          address: { street: customerAddress },
          email: `${Date.now()}@example.com`
        });
        if (res.data.success) {
          setSelectedCustomer(res.data.data._id);
        } else {
          return toast.error("Failed to capture customer details");
        }
      } catch (error) {
        toast.error("Failed to create customer record");
        return;
      }
    }

    setIsPaymentDialogOpen(true);
  };

  const handlePaymentSuccess = (invoiceData: any) => {
    setRecordedInvoice(invoiceData);
    setShowInvoice(true);
  };

  const handleNewInvoice = () => {
    setCartItems([]);
    setCustomerPhone("");
    setCustomerName("");
    setCustomerAddress("");
    setSelectedCustomer("");
    setAdditionalDiscount(0);
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Side - Product Search and List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Search (No GST)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name, SKU, or scan barcode..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Barcode className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>

              <div className="max-h-[600px] space-y-2 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        SKU: {product.sku || 'N/A'} | Stock: {product.stock || 0}
                      </p>
                      <p className="mt-1 text-sm font-medium text-blue-600">
                        ₹{product.sellingPrice}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addToCart(product._id)}
                      disabled={(product.stock || 0) <= 0 && product.trackInventory}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Invoice Preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Bill Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Details */}
              <div className="space-y-3">
                <Label>Customer Details</Label>
                <div className="space-y-2">
                   <Input
                     type="text"
                     placeholder="Phone Number (auto-fetches data)"
                     value={customerPhone}
                     onChange={handlePhoneChange}
                   />
                   {isSearchingCustomer && <p className="text-xs text-blue-500">Searching...</p>}
                   <Input
                     type="text"
                     placeholder="Customer Name *"
                     required
                     value={customerName}
                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)}
                     disabled={!!selectedCustomer}
                   />
                   <Input
                     type="text"
                     placeholder="Address"
                     value={customerAddress}
                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerAddress(e.target.value)}
                     disabled={!!selectedCustomer}
                   />
                </div>
              </div>

              <Separator />

              {/* Cart Items */}
              <div className="space-y-3">
                <Label>Items</Label>
                <div className="max-h-[300px] space-y-2 overflow-y-auto">
                  {cartItems.length === 0 ? (
                    <p className="py-8 text-center text-sm text-gray-500">
                      No items added. Search and add products.
                    </p>
                  ) : (
                    cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg border border-gray-200 p-3 space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              ₹{item.price} × {item.quantity} = ₹
                              {(item.price * item.quantity).toLocaleString("en-IN")}
                            </p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-12 text-center text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex-1">
                            <Input
                              type="number"
                              placeholder="Discount %"
                              value={item.discount}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateDiscount(item.id, parseFloat(e.target.value) || 0)
                              }
                              className="h-8"
                              min="0"
                              max="100"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <Separator />

              {/* Additional Discount */}
              <div className="space-y-2">
                <Label>Additional Discount (%)</Label>
                <Input
                  type="number"
                  value={additionalDiscount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAdditionalDiscount(parseFloat(e.target.value) || 0)
                  }
                  min="0"
                  max="100"
                />
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-semibold text-gray-900">
                    ₹{calculateSubtotal().toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {additionalDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      Additional Discount ({additionalDiscount}%):
                    </span>
                    <span className="font-semibold text-red-600">
                      -₹
                      {((calculateSubtotal() * additionalDiscount) / 100).toLocaleString(
                        "en-IN",
                        { minimumFractionDigits: 2 }
                      )}
                    </span>
                  </div>
                )}
                
                <Separator className="my-2" />
                
                <div className="flex justify-between text-lg lg:text-xl">
                  <span className="font-bold text-gray-900">Grand Total:</span>
                  <span className="font-bold text-blue-600">
                    ₹{calculateTotal().toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 gap-2">
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleGenerateInvoice}>
                  Generate Bill
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Dialog */}
      <PaymentCollectionDialog 
         open={isPaymentDialogOpen}
         onOpenChange={setIsPaymentDialogOpen}
         customerId={selectedCustomer}
         cartItems={cartItems}
         subtotal={calculateSubtotal()}
         totalGst={0}
         additionalDiscount={additionalDiscount}
         grandTotal={calculateTotal()}
         globalGstRate="0"
         onSuccess={handlePaymentSuccess}
      />

      {/* Invoice Document Preview Modal */}
      {showInvoice && selectedCustomer && cartItems.length > 0 && (
        <InvoicePreviewDialog
          open={showInvoice}
          onOpenChange={(open: boolean) => {
             setShowInvoice(open);
             if (!open) {
                handleNewInvoice();
             }
          }}
          invoiceNumber={recordedInvoice?.invoiceNumber || `BILL-${Date.now().toString().slice(-6)}`}
          date={new Date().toISOString().split("T")[0]}
          customerName={customerName}
          customerPhone={customerPhone}
          customerAddress={customerAddress}
          customerGST={""}
          items={cartItems}
          subtotal={calculateSubtotal()}
          gstAmount={0}
          total={calculateTotal()}
        />
      )}
    </div>
  );
}
