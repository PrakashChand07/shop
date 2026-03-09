import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Search,
  Barcode,
  Plus,
  Minus,
  Trash2,
  Send,
  Printer,
  Share2,
  User,
  FileText,
  Monitor,
  LayoutGrid,
  FileBarChart,
  ReceiptText,
} from "lucide-react";
import { products, customers } from "../lib/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { useNavigate } from "react-router";
import { InvoiceDocument } from "../components/InvoiceDocument";
import { CreateInvoiceDialog } from "../components/CreateInvoiceDialog";
import { POSInterface } from "../components/POSInterface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { EWayBillDialog } from "../components/EWayBillDialog";
import { toast } from "sonner";
import { Switch } from "../components/ui/switch";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  gst: number;
  discount: number;
  hsnCode: string;
}

export function Sales() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [additionalDiscount, setAdditionalDiscount] = useState(0);
  const [showInvoice, setShowInvoice] = useState(false);
  const [gstDiscount, setGstDiscount] = useState(0);
  const [globalGstRate, setGlobalGstRate] = useState<string>("default");
  const [includeGST, setIncludeGST] = useState(true);
  const navigate = useNavigate();

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
        discount: 0,
        hsnCode: product.hsnCode,
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

  const calculateGST = () => {
    const gst = cartItems.reduce((total, item) => {
      const itemTotal = item.quantity * item.price;
      const discountAmount = (itemTotal * item.discount) / 100;
      const taxableAmount = itemTotal - discountAmount;
      // Use global GST rate if selected, otherwise use product's GST
      const gstRate = globalGstRate === "default" ? item.gst : parseFloat(globalGstRate);
      return total + (taxableAmount * gstRate) / 100;
    }, 0);
    // Apply GST discount
    return gst - (gst * gstDiscount) / 100;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const gst = includeGST ? calculateGST() : 0;
    const additionalDiscountAmount = (subtotal * additionalDiscount) / 100;
    return subtotal + gst - additionalDiscountAmount;
  };

  const handleGenerateInvoice = () => {
    if (!selectedCustomer) {
      alert("Please select a customer before generating invoice");
      return;
    }
    if (cartItems.length === 0) {
      alert("Please add items to cart before generating invoice");
      return;
    }
    setShowInvoice(true);
    // Scroll to invoice
    setTimeout(() => {
      document.getElementById("invoice-document")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleBackToSales = () => {
    setShowInvoice(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewInvoice = () => {
    setShowInvoice(false);
    setCartItems([]);
    setSelectedCustomer("");
    setAdditionalDiscount(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrintInvoice = () => {
    const printContents = document.getElementById("invoice-document")?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
    }
  };

  const handleShareInvoice = () => {
    const invoiceData = {
      customer: customers.find((c) => c.id === selectedCustomer),
      items: cartItems,
      additionalDiscount: additionalDiscount,
      subtotal: calculateSubtotal(),
      gst: calculateGST(),
      total: calculateTotal(),
    };

    const invoiceUrl = new URLSearchParams({
      customerName: invoiceData.customer?.name || "",
      customerPhone: invoiceData.customer?.phone || "",
      items: JSON.stringify(
        invoiceData.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          gst: item.gst,
          discount: item.discount,
          hsnCode: item.hsnCode,
        }))
      ),
      additionalDiscount: invoiceData.additionalDiscount.toString(),
      subtotal: invoiceData.subtotal.toString(),
      gst: invoiceData.gst.toString(),
      total: invoiceData.total.toString(),
    }).toString();

    const shareUrl = `${window.location.origin}/share-invoice?${invoiceUrl}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Invoice link copied to clipboard!");
    });
  };

  const handleWhatsAppInvoice = () => {
    const invoiceData = {
      customer: customers.find((c) => c.id === selectedCustomer),
      items: cartItems,
      additionalDiscount: additionalDiscount,
      subtotal: calculateSubtotal(),
      gst: calculateGST(),
      total: calculateTotal(),
    };

    const invoiceUrl = new URLSearchParams({
      customerName: invoiceData.customer?.name || "",
      customerPhone: invoiceData.customer?.phone || "",
      items: JSON.stringify(
        invoiceData.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          gst: item.gst,
          discount: item.discount,
          hsnCode: item.hsnCode,
        }))
      ),
      additionalDiscount: invoiceData.additionalDiscount.toString(),
      subtotal: invoiceData.subtotal.toString(),
      gst: invoiceData.gst.toString(),
      total: invoiceData.total.toString(),
    }).toString();

    const shareUrl = `${window.location.origin}/share-invoice?${invoiceUrl}`;
    const whatsappUrl = `https://wa.me/${invoiceData.customer?.phone}?text=${encodeURIComponent(
      `Please find your invoice attached: ${shareUrl}`
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Invoice Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Sales / Billing</h1>
          <p className="text-gray-600">Create new invoice and manage sales</p>
        </div>
        <CreateInvoiceDialog />
      </div>

      {/* Tabs for Different Views */}
      <Tabs defaultValue="traditional" className="space-y-6">
        <TabsList className="grid w-full lg:w-auto lg:inline-grid grid-cols-3 gap-4">
          <TabsTrigger value="traditional" className="gap-2">
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Traditional Billing</span>
            <span className="sm:hidden">Traditional</span>
          </TabsTrigger>
          <TabsTrigger value="pos" className="gap-2">
            <Monitor className="h-4 w-4" />
            <span className="hidden sm:inline">POS Machine</span>
            <span className="sm:hidden">POS</span>
          </TabsTrigger>
          <TabsTrigger value="quick" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Quick Invoice</span>
            <span className="sm:hidden">Quick</span>
          </TabsTrigger>
        </TabsList>

        {/* Traditional Billing */}
        <TabsContent value="traditional" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Side - Product Search and List */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Product Search</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search by name, SKU, or scan barcode..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    <Barcode className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  </div>

                  <div className="max-h-[600px] space-y-2 overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">
                            SKU: {product.sku} | Stock: {product.stock}
                          </p>
                          <p className="mt-1 text-sm font-medium text-blue-600">
                            ₹{product.sellingPrice} + {product.gst}% GST
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addToCart(product.id)}
                          disabled={product.stock === 0}
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
                  <CardTitle>Invoice Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Customer Selection */}
                  <div className="space-y-2">
                    <Label>Select Customer</Label>
                    <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose customer..." />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {customer.name} - {customer.phone}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                                  HSN: {item.hsnCode} | ₹{item.price} × {item.quantity} = ₹
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
                                  onChange={(e) =>
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
                      onChange={(e) =>
                        setAdditionalDiscount(parseFloat(e.target.value) || 0)
                      }
                      min="0"
                      max="100"
                    />
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-4">
                    {/* GST Rate Selector */}
                    <div className="pb-2 mb-2 border-b border-blue-200">
                      <Label className="text-sm text-gray-700 mb-2 block">Apply GST Rate</Label>
                      <Select value={globalGstRate} onValueChange={setGlobalGstRate}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select GST rate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Product Default (Individual GST)</SelectItem>
                          <SelectItem value="5">5% GST (Footwear &lt;₹500)</SelectItem>
                          <SelectItem value="12">12% GST (Standard)</SelectItem>
                          <SelectItem value="18">18% GST (Premium)</SelectItem>
                          <SelectItem value="28">28% GST (Luxury)</SelectItem>
                        </SelectContent>
                      </Select>
                      {globalGstRate !== "default" && (
                        <p className="text-xs text-blue-600 mt-1">
                          Applying {globalGstRate}% GST to all items
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Subtotal:</span>
                      <span className="font-semibold text-gray-900">
                        ₹{calculateSubtotal().toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        Total GST
                        {globalGstRate !== "default" && <span className="text-xs ml-1">({globalGstRate}%)</span>}:
                      </span>
                      <span className="font-semibold text-gray-900">
                        ₹{calculateGST().toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* GST Discount Input */}
                    <div className="pt-2">
                      <Label className="text-sm text-gray-700 mb-2 block">GST Discount (%)</Label>
                      <Input
                        type="number"
                        value={gstDiscount}
                        onChange={(e) => setGstDiscount(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                        placeholder="Enter GST discount..."
                        className="h-9 bg-white"
                        min="0"
                        max="100"
                      />
                      {gstDiscount > 0 && (
                        <p className="text-xs text-green-600 mt-1">
                          Discount: -₹{((cartItems.reduce((total, item) => {
                            const itemTotal = item.quantity * item.price;
                            const discountAmount = (itemTotal * item.discount) / 100;
                            const taxableAmount = itemTotal - discountAmount;
                            const gstRate = globalGstRate === "default" ? item.gst : parseFloat(globalGstRate);
                            return total + (taxableAmount * gstRate) / 100;
                          }, 0) * gstDiscount) / 100).toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Include GST Switch */}
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={includeGST}
                        onCheckedChange={(checked) => setIncludeGST(checked)}
                      />
                      <Label className="text-sm text-gray-700">Include GST in Total</Label>
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
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleGenerateInvoice}>
                      Generate Invoice
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={handleWhatsAppInvoice}>
                      <Send className="h-4 w-4" />
                      WhatsApp
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={handlePrintInvoice}>
                      <Printer className="h-4 w-4" />
                      Print
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={handleShareInvoice}>
                      <Share2 className="h-4 w-4" />
                      Payment Link
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Invoice Document */}
          {showInvoice && selectedCustomer && cartItems.length > 0 && (
            <div className="mt-6" id="invoice-document">
              <InvoiceDocument
                invoiceNumber={`INV-${Date.now().toString().slice(-6)}`}
                date={new Date().toISOString().split("T")[0]}
                customerName={customers.find((c) => c.id === selectedCustomer)?.name || ""}
                customerPhone={customers.find((c) => c.id === selectedCustomer)?.phone}
                customerAddress={customers.find((c) => c.id === selectedCustomer)?.address}
                customerGST={customers.find((c) => c.id === selectedCustomer)?.gstNumber}
                items={cartItems}
                subtotal={calculateSubtotal()}
                gstAmount={calculateGST()}
                discount={(calculateSubtotal() * additionalDiscount) / 100}
                total={calculateTotal()}
                onPrint={() => window.print()}
                onDownload={() => alert("PDF download feature coming soon!")}
                onSend={handleWhatsAppInvoice}
              />
              <div className="mt-4 flex justify-between">
                <Button variant="outline" onClick={handleBackToSales}>
                  Back to Sales
                </Button>
                <Button variant="outline" onClick={handleNewInvoice}>
                  New Invoice
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* POS Machine */}
        <TabsContent value="pos" className="space-y-6">
          <POSInterface />
        </TabsContent>

        {/* Quick Invoice */}
        <TabsContent value="quick" className="space-y-6">
          <CreateInvoiceDialog />
        </TabsContent>
      </Tabs>
    </div>
  );
}