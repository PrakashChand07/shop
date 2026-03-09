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
import { 
  FileText, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  User, 
  ShoppingCart,
  Calendar,
  MapPin,
  Phone,
  CreditCard,
  Package,
  Printer,
  Download,
  Share2,
  MessageCircle,
  Eye,
  ReceiptText
} from "lucide-react";
import { useNavigate } from "react-router";
import { products, customers } from "../lib/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { Logo } from "./Logo";
import { InvoiceDocument } from "./InvoiceDocument";
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

export function CreateInvoiceDialog() {
  const [open, setOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);
  };

  const calculateGST = () => {
    const gst = cartItems.reduce((total, item) => {
      const itemTotal = item.quantity * item.price;
      // Use global GST rate if selected, otherwise use product's GST
      const gstRate = globalGstRate === "default" ? item.gst : parseFloat(globalGstRate);
      return total + (itemTotal * gstRate) / 100;
    }, 0);
    // Apply GST discount
    return gst - (gst * gstDiscount) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + (includeGST ? calculateGST() : 0);
  };

  const handleCreateInvoice = () => {
    if (!selectedCustomer) {
      alert("Please select a customer");
      return;
    }
    if (cartItems.length === 0) {
      alert("Please add items to cart");
      return;
    }
    // Open the full invoice preview dialog
    setPreviewOpen(true);
  };

  const selectedCustomerData = customers.find((c) => c.id === selectedCustomer);
  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
  const invoiceDate = new Date().toLocaleDateString("en-IN");

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <FileText className="h-4 w-4" />
            Create Invoice
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] lg:max-w-6xl max-h-[90vh] overflow-hidden p-0 flex flex-col">
          <div className="flex flex-col lg:flex-row h-full overflow-hidden">
            {/* Left Side - Product Selection */}
            <div className="w-full lg:w-[45%] border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50 overflow-y-auto">
              <div className="p-4 lg:p-6">
                <DialogHeader className="mb-4 lg:mb-6">
                  <DialogTitle className="text-xl lg:text-2xl">Create New Invoice</DialogTitle>
                  <DialogDescription>
                    Select customer and add products to generate invoice
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 lg:space-y-6">
                  {/* Customer Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm lg:text-base font-semibold flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      Customer Details
                    </Label>
                    <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select a customer..." />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            <div className="flex flex-col py-1">
                              <span className="font-medium">{customer.name}</span>
                              <span className="text-xs text-gray-500">{customer.phone}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedCustomerData && (
                      <div className="rounded-lg bg-white border border-gray-200 p-3 lg:p-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-gray-600">{selectedCustomerData.phone}</span>
                        </div>
                        {selectedCustomerData.address && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-gray-600">{selectedCustomerData.address}</span>
                          </div>
                        )}
                        {selectedCustomerData.gstNumber && (
                          <div className="flex items-center gap-2 text-sm">
                            <CreditCard className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-gray-600">GST: {selectedCustomerData.gstNumber}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Product Search */}
                  <div className="space-y-3">
                    <Label className="text-sm lg:text-base font-semibold flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-600" />
                      Add Products
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search products by name, SKU, or barcode..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white"
                      />
                    </div>

                    <div className="max-h-[250px] lg:max-h-[350px] space-y-2 overflow-y-auto">
                      {filteredProducts.slice(0, 10).map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-2 lg:p-3 hover:border-blue-300 hover:shadow-sm transition-all"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm lg:text-base truncate">{product.name}</p>
                            <div className="flex items-center gap-2 lg:gap-3 mt-1">
                              <span className="text-xs text-gray-500">SKU: {product.sku}</span>
                              <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-semibold text-blue-600 text-sm lg:text-base">₹{product.sellingPrice}</span>
                              <span className="text-xs text-gray-500">+ {product.gst}% GST</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addToCart(product.id)}
                            disabled={product.stock === 0}
                            className="bg-blue-600 hover:bg-blue-700 h-8 px-2 lg:px-3 ml-2 flex-shrink-0"
                          >
                            <Plus className="h-3.5 w-3.5 lg:mr-1" />
                            <span className="hidden lg:inline">Add</span>
                          </Button>
                        </div>
                      ))}
                      {filteredProducts.length === 0 && (
                        <p className="text-center text-sm text-gray-500 py-8">
                          No products found
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Premium Invoice Preview */}
            <div className="w-full lg:w-[55%] bg-white overflow-y-auto">
              <div className="p-4 lg:p-6">
                {/* Invoice Header */}
                <div className="border-b-2 border-blue-600 pb-4 lg:pb-6 mb-4 lg:mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Logo size="lg" />
                      <p className="text-xs lg:text-sm text-gray-600 mt-2">Premium Footwear Collection</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-1">INVOICE</div>
                      <div className="text-xs lg:text-sm text-gray-600">#{invoiceNumber}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 mt-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">From</div>
                      <div className="font-semibold text-gray-900 text-sm lg:text-base">Anjum Footwear</div>
                      <div className="text-xs lg:text-sm text-gray-600 mt-1">123 Fashion Street, Mumbai</div>
                      <div className="text-xs lg:text-sm text-gray-600">Maharashtra 400001</div>
                      <div className="text-xs lg:text-sm text-gray-600 mt-1">GST: 27XXXXX1234X1ZX</div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Bill To</div>
                      {selectedCustomerData ? (
                        <>
                          <div className="font-semibold text-gray-900 text-sm lg:text-base">{selectedCustomerData.name}</div>
                          <div className="text-xs lg:text-sm text-gray-600 mt-1">{selectedCustomerData.phone}</div>
                          {selectedCustomerData.address && (
                            <div className="text-xs lg:text-sm text-gray-600">{selectedCustomerData.address}</div>
                          )}
                          {selectedCustomerData.gstNumber && (
                            <div className="text-xs lg:text-sm text-gray-600 mt-1">GST: {selectedCustomerData.gstNumber}</div>
                          )}
                        </>
                      ) : (
                        <div className="text-xs lg:text-sm text-gray-400 italic">No customer selected</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 lg:mt-4 text-xs lg:text-sm text-gray-600">
                    <Calendar className="h-3.5 lg:h-4 w-3.5 lg:w-4" />
                    <span>Date: {invoiceDate}</span>
                  </div>
                  
                  {/* GST Toggle */}
                  <div className="mt-3 lg:mt-4 flex items-center justify-between bg-white border-2 border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <ReceiptText className="h-4 w-4 text-blue-600" />
                      <Label htmlFor="gst-toggle" className="text-sm font-semibold cursor-pointer">
                        Include GST in Invoice
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${includeGST ? 'text-gray-400' : 'text-green-600'}`}>
                        Non-GST
                      </span>
                      <Switch
                        id="gst-toggle"
                        checked={includeGST}
                        onCheckedChange={setIncludeGST}
                      />
                      <span className={`text-xs font-medium ${includeGST ? 'text-blue-600' : 'text-gray-400'}`}>
                        GST
                      </span>
                    </div>
                  </div>
                </div>

                {/* Invoice Items */}
                <div className="mb-4 lg:mb-6">
                  <div className="bg-blue-600 text-white rounded-t-lg px-3 lg:px-4 py-2 lg:py-3">
                    <div className="grid grid-cols-12 gap-1 lg:gap-2 font-semibold text-xs lg:text-sm">
                      <div className="col-span-5">Item</div>
                      <div className="col-span-2 text-center">Qty</div>
                      <div className="col-span-2 text-right">Price</div>
                      <div className="col-span-2 text-right">GST</div>
                      <div className="col-span-1 text-right"></div>
                    </div>
                  </div>

                  <div className="border border-t-0 border-gray-200 rounded-b-lg">
                    {cartItems.length === 0 ? (
                      <div className="p-6 lg:p-8 text-center">
                        <ShoppingCart className="h-10 lg:h-12 w-10 lg:w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium text-sm lg:text-base">No items added</p>
                        <p className="text-xs lg:text-sm text-gray-400 mt-1">Search and add products from the left panel</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200 max-h-[300px] overflow-y-auto">
                        {cartItems.map((item, index) => (
                          <div key={item.id} className="px-3 lg:px-4 py-2 lg:py-3 hover:bg-gray-50 transition-colors">
                            <div className="grid grid-cols-12 gap-1 lg:gap-2 items-center">
                              <div className="col-span-5">
                                <div className="font-medium text-gray-900 text-xs lg:text-sm truncate">{item.name}</div>
                                <div className="text-xs text-gray-500 mt-0.5">HSN: {item.hsnCode}</div>
                              </div>
                              <div className="col-span-2 flex items-center justify-center gap-0.5 lg:gap-1">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-6 w-6"
                                  onClick={() => updateQuantity(item.id, -1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-6 lg:w-8 text-center font-medium text-xs lg:text-sm">{item.quantity}</span>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-6 w-6"
                                  onClick={() => updateQuantity(item.id, 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="col-span-2 text-right text-xs lg:text-sm">
                                ₹{item.price.toLocaleString("en-IN")}
                              </div>
                              <div className="col-span-2 text-right text-xs lg:text-sm">
                                <div>₹{((item.price * item.quantity * item.gst) / 100).toFixed(2)}</div>
                                <div className="text-xs text-gray-500">({item.gst}%)</div>
                              </div>
                              <div className="col-span-1 text-right">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 lg:h-7 w-6 lg:w-7"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Trash2 className="h-3 lg:h-3.5 w-3 lg:w-3.5 text-red-500" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-right text-xs lg:text-sm font-semibold text-gray-900 mt-2">
                              Item Total: ₹{((item.price * item.quantity) + ((item.price * item.quantity * item.gst) / 100)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Invoice Summary */}
                {cartItems.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 lg:p-6 border-2 border-blue-200">
                    <div className="space-y-2 lg:space-y-3">
                      {/* GST Rate Selector - Only show when GST is enabled */}
                      {includeGST && (
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
                      )}
                      
                      <div className="flex justify-between text-sm lg:text-base">
                        <span className="text-gray-700">Subtotal</span>
                        <span className="font-semibold text-gray-900">
                          ₹{calculateSubtotal().toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      
                      {includeGST && (
                        <>
                          <div className="flex justify-between text-sm lg:text-base">
                            <span className="text-gray-700">Total GST 
                              {globalGstRate !== "default" && <span className="text-xs ml-1">({globalGstRate}%)</span>}
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
                                  const gstRate = globalGstRate === "default" ? item.gst : parseFloat(globalGstRate);
                                  return total + (itemTotal * gstRate) / 100;
                                }, 0) * gstDiscount) / 100).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                      
                      <Separator className="my-2 lg:my-3" />
                      <div className="flex justify-between items-center">
                        <span className="text-lg lg:text-xl font-bold text-gray-900">
                          Grand Total {!includeGST && <span className="text-xs text-gray-600 font-normal">(Non-GST)</span>}
                        </span>
                        <span className="text-2xl lg:text-3xl font-bold text-blue-600">
                          ₹{calculateTotal().toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="mt-4 lg:mt-6 flex gap-3">
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 h-10 lg:h-12 text-sm lg:text-base font-semibold"
                    onClick={handleCreateInvoice}
                    disabled={!selectedCustomer || cartItems.length === 0}
                  >
                    <FileText className="h-4 lg:h-5 w-4 lg:w-5 mr-2" />
                    Generate Full Invoice
                  </Button>
                </div>

                {/* Footer Note */}
                <div className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Thank you for your business! For any queries, please contact us.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full Invoice Preview Dialog */}
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
        total={calculateTotal()}
      />
    </>
  );
}