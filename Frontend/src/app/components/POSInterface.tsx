import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  User,
  ShoppingCart,
  CreditCard,
  Banknote,
  Calculator,
  X,
  Percent,
  ReceiptText,
} from "lucide-react";
import { products, customers } from "../lib/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { InvoicePreviewDialog } from "./InvoicePreviewDialog";
import { Switch } from "./ui/switch";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  gst: number;
  hsnCode: string;
}

export function POSInterface() {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [gstDiscount, setGstDiscount] = useState(0);
  const [globalGstRate, setGlobalGstRate] = useState<string>("default");
  const [includeGST, setIncludeGST] = useState(true);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
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
      const newItem: CartItem = {
        id: Date.now().toString(),
        productId: product.id,
        name: product.name,
        quantity: 1,
        price: product.sellingPrice,
        gst: product.gst,
        hsnCode: product.hsnCode,
      };
      setCartItems([...cartItems, newItem]);
    }
    setSearchTerm("");
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

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);
  };

  const calculateGST = () => {
    const gst = cartItems.reduce((total, item) => {
      const itemTotal = item.quantity * item.price;
      const gstRate = globalGstRate === "default" ? item.gst : parseFloat(globalGstRate);
      return total + (itemTotal * gstRate) / 100;
    }, 0);
    return gst - (gst * gstDiscount) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + (includeGST ? calculateGST() : 0);
  };

  const handleCheckout = () => {
    if (!selectedCustomer) {
      alert("Please select a customer");
      return;
    }
    if (cartItems.length === 0) {
      alert("Please add items to cart");
      return;
    }
    setShowPayment(true);
  };

  const handlePayment = (method: "cash" | "card" | "upi") => {
    setShowPayment(false);
    setPreviewOpen(true);
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear the cart?")) {
      setCartItems([]);
      setSelectedCustomer("");
      setSearchTerm("");
    }
  };

  const selectedCustomerData = customers.find((c) => c.id === selectedCustomer);
  const invoiceNumber = `POS-${Date.now().toString().slice(-6)}`;
  const invoiceDate = new Date().toLocaleDateString("en-IN");
  const total = calculateTotal();

  // Quick amount buttons for cash payment
  const quickAmounts = [100, 200, 500, 1000, 2000];

  return (
    <div className="grid lg:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
      {/* Left Side - Product Grid (POS Style) */}
      <div className="lg:col-span-2 space-y-4 overflow-y-auto">
        {/* Search Bar */}
        <div className="bg-white rounded-lg p-4 shadow-sm sticky top-0 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Scan barcode or search product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
              autoFocus
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {(searchTerm ? filteredProducts : products.slice(0, 12)).map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product.id)}
              disabled={product.stock === 0}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-left border-2 border-transparent hover:border-blue-500"
            >
              <div className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg mb-3 flex items-center justify-center">
                <ShoppingCart className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 mb-2">Stock: {product.stock}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-blue-600">₹{product.sellingPrice}</span>
                <span className="text-xs text-gray-500">+{product.gst}%</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Side - Cart & Checkout */}
      <div className="bg-white rounded-lg shadow-lg flex flex-col max-h-full">
        {/* Customer Selection */}
        <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <Label className="text-white text-sm mb-2 block">Customer</Label>
          <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
            <SelectTrigger className="bg-white text-gray-900 border-0">
              <SelectValue placeholder="Select customer..." />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {customer.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
              <ShoppingCart className="h-16 w-16 mb-3" />
              <p className="font-medium">Cart is empty</p>
              <p className="text-sm">Scan or select products to add</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">₹{item.price} × {item.quantity}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 -mt-1 -mr-1"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-10 text-center font-semibold text-sm">
                      {item.quantity}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="font-bold text-gray-900">
                    ₹{((item.price * item.quantity) + ((item.price * item.quantity * item.gst) / 100)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="space-y-2 mb-3">
              {/* GST Toggle Switch */}
              <div className="flex items-center justify-between bg-white border-2 border-blue-200 rounded-lg p-2 mb-3">
                <div className="flex items-center gap-2">
                  <ReceiptText className="h-4 w-4 text-blue-600" />
                  <Label htmlFor="pos-gst-toggle" className="text-xs font-semibold cursor-pointer">
                    Include GST
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${includeGST ? 'text-gray-400' : 'text-green-600'}`}>
                    No
                  </span>
                  <Switch
                    id="pos-gst-toggle"
                    checked={includeGST}
                    onCheckedChange={setIncludeGST}
                  />
                  <span className={`text-xs font-medium ${includeGST ? 'text-blue-600' : 'text-gray-400'}`}>
                    Yes
                  </span>
                </div>
              </div>

              {/* GST Rate Selector - Only show when GST is enabled */}
              {includeGST && (
                <div className="pb-2 mb-2 border-b border-gray-300">
                  <Label className="text-xs text-gray-700 mb-1 block">GST Rate</Label>
                  <Select value={globalGstRate} onValueChange={setGlobalGstRate}>
                    <SelectTrigger className="bg-white h-8 text-xs">
                      <SelectValue placeholder="GST" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="12">12%</SelectItem>
                      <SelectItem value="18">18%</SelectItem>
                      <SelectItem value="28">28%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  ₹{calculateSubtotal().toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              {includeGST && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      GST{globalGstRate !== "default" && <span className="text-xs"> ({globalGstRate}%)</span>}
                    </span>
                    <span className="font-medium text-gray-900">
                      ₹{calculateGST().toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* GST Discount */}
                  <div className="pt-1">
                    <Label className="text-xs text-gray-700 mb-1 block">GST Discount (%)</Label>
                    <Input
                      type="number"
                      value={gstDiscount}
                      onChange={(e) => setGstDiscount(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                      placeholder="0"
                      className="h-8 text-xs bg-white"
                      min="0"
                      max="100"
                    />
                  </div>
                </>
              )}

              <Separator />
              <div className="flex justify-between text-xl font-bold">
                <span className="text-gray-900">Total {!includeGST && <span className="text-xs text-gray-600 font-normal">(Non-GST)</span>}</span>
                <span className="text-blue-600">
                  ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Payment Options */}
            {showPayment ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Cash Amount</Label>
                  <Input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter amount..."
                    className="h-12 text-lg"
                  />
                  <div className="grid grid-cols-5 gap-1">
                    {quickAmounts.map((amount) => (
                      <Button
                        key={amount}
                        size="sm"
                        variant="outline"
                        onClick={() => setPaymentAmount(amount.toString())}
                        className="text-xs"
                      >
                        ₹{amount}
                      </Button>
                    ))}
                  </div>
                  {paymentAmount && parseFloat(paymentAmount) >= total && (
                    <p className="text-sm text-green-600 font-medium">
                      Change: ₹{(parseFloat(paymentAmount) - total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={() => handlePayment("cash")}
                    className="bg-green-600 hover:bg-green-700 flex-col h-16"
                    disabled={!paymentAmount || parseFloat(paymentAmount) < total}
                  >
                    <Banknote className="h-5 w-5 mb-1" />
                    <span className="text-xs">Cash</span>
                  </Button>
                  <Button
                    onClick={() => handlePayment("card")}
                    className="bg-blue-600 hover:bg-blue-700 flex-col h-16"
                  >
                    <CreditCard className="h-5 w-5 mb-1" />
                    <span className="text-xs">Card</span>
                  </Button>
                  <Button
                    onClick={() => handlePayment("upi")}
                    className="bg-purple-600 hover:bg-purple-700 flex-col h-16"
                  >
                    <Calculator className="h-5 w-5 mb-1" />
                    <span className="text-xs">UPI</span>
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setShowPayment(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  className="gap-2"
                  disabled={cartItems.length === 0}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={!selectedCustomer || cartItems.length === 0}
                  className="bg-blue-600 hover:bg-blue-700 gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Checkout
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Invoice Preview Dialog */}
      <InvoicePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        invoiceNumber={invoiceNumber}
        date={invoiceDate}
        customerName={selectedCustomerData?.name || ""}
        customerPhone={selectedCustomerData?.phone}
        customerAddress={selectedCustomerData?.address}
        customerGST={selectedCustomerData?.gstNumber}
        items={cartItems}
        subtotal={calculateSubtotal()}
        gstAmount={calculateGST()}
        total={total}
      />
    </div>
  );
}