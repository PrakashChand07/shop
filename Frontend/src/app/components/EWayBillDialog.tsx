import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  FileText,
  Truck,
  MapPin,
  Building2,
  FileBarChart,
  Printer,
  Download,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { Card, CardContent } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { customers } from "../lib/mockData";

interface EWayBillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceNumber?: string;
  invoiceValue?: number;
  invoiceDate?: string;
  customerName?: string;
  customerGSTIN?: string;
  customerAddress?: string;
  hsnCode?: string;
  onGenerate?: (ewayBillNumber: string) => void;
}

export function EWayBillDialog({
  open,
  onOpenChange,
  invoiceNumber = "",
  invoiceValue = 50000,
  invoiceDate = new Date().toISOString(),
  customerName = "",
  customerGSTIN = "",
  customerAddress = "",
  hsnCode = "6403",
  onGenerate,
}: EWayBillDialogProps) {
  const [step, setStep] = useState<"form" | "generated">("form");
  const [generatedEBN, setGeneratedEBN] = useState("");
  
  const [formData, setFormData] = useState({
    supplierGSTIN: "27AABCA1234F1Z5",
    buyerGSTIN: customerGSTIN,
    transporterName: "",
    vehicleNumber: "",
    transportMode: "Road",
    placeOfDispatch: "Mumbai, Maharashtra",
    deliveryAddress: customerAddress,
    hsnCode: hsnCode,
  });

  const generateEWayBillNumber = () => {
    // Generate a 12-digit E-Way Bill Number
    const prefix = "35"; // State code for Maharashtra
    const randomDigits = Math.floor(Math.random() * 10000000000).toString().padStart(10, "0");
    return prefix + randomDigits;
  };

  const handleGenerate = () => {
    const ebn = generateEWayBillNumber();
    setGeneratedEBN(ebn);
    setStep("generated");
    if (onGenerate) {
      onGenerate(ebn);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert("E-Way Bill downloaded successfully!");
  };

  const handleReset = () => {
    setStep("form");
    setGeneratedEBN("");
    onOpenChange(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calculateValidUntil = () => {
    const date = new Date(invoiceDate);
    date.setDate(date.getDate() + 7); // E-Way Bill valid for 7 days
    return formatDate(date.toISOString());
  };

  if (step === "generated") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              E-Way Bill Generated Successfully
            </DialogTitle>
            <DialogDescription>
              Your E-Way Bill has been generated and is ready for use
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* E-Way Bill Number Display */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">E-Way Bill Number (EBN)</p>
                  <p className="text-3xl font-bold text-green-700 tracking-wider">
                    {generatedEBN}
                  </p>
                  <p className="text-xs text-gray-500">
                    Valid Until: {calculateValidUntil()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* E-Way Bill Details */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-semibold text-lg">E-Way Bill Details</h3>
                  <p className="text-sm text-gray-500">Invoice: {invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Invoice Date</p>
                  <p className="font-semibold">{formatDate(invoiceDate)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Supplier GSTIN</p>
                  <p className="font-semibold">{formData.supplierGSTIN}</p>
                  <p className="text-sm text-gray-700 mt-1">Anjum Footwear</p>
                  <p className="text-xs text-gray-500">123, Market Road, Mumbai - 400001</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Buyer GSTIN</p>
                  <p className="font-semibold">{formData.buyerGSTIN}</p>
                  <p className="text-sm text-gray-700 mt-1">{customerName}</p>
                  <p className="text-xs text-gray-500">{formData.deliveryAddress}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">HSN Code</p>
                  <p className="font-semibold">{formData.hsnCode}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Invoice Value</p>
                  <p className="font-semibold text-lg">{formatCurrency(invoiceValue)}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Transport Mode</p>
                  <p className="font-semibold">{formData.transportMode}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Transporter Name</p>
                  <p className="font-semibold">{formData.transporterName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Vehicle Number</p>
                  <p className="font-semibold">{formData.vehicleNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Place of Dispatch</p>
                  <p className="font-semibold">{formData.placeOfDispatch}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleReset}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileBarChart className="h-5 w-5 text-blue-600" />
            Generate E-Way Bill
          </DialogTitle>
          <DialogDescription>
            E-Way Bill is mandatory for invoices above ₹50,000 as per GST rules
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info Alert */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-800">
              Invoice Value: <span className="font-semibold">{formatCurrency(invoiceValue)}</span> - E-Way Bill generation is required
            </AlertDescription>
          </Alert>

          {/* Invoice Information */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Invoice Number:</span>
                <span className="font-semibold">{invoiceNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold">{formatDate(invoiceDate)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplierGSTIN">Supplier GSTIN</Label>
                <Input
                  id="supplierGSTIN"
                  value={formData.supplierGSTIN}
                  onChange={(e) =>
                    setFormData({ ...formData, supplierGSTIN: e.target.value })
                  }
                  placeholder="Supplier GSTIN"
                  className="font-mono"
                />
                <p className="text-xs text-gray-500">Anjum Footwear</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyerGSTIN">Buyer GSTIN *</Label>
                <Input
                  id="buyerGSTIN"
                  value={formData.buyerGSTIN}
                  onChange={(e) =>
                    setFormData({ ...formData, buyerGSTIN: e.target.value })
                  }
                  placeholder="Buyer GSTIN"
                  className="font-mono"
                  required
                />
                <p className="text-xs text-gray-500">{customerName}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryAddress">Delivery Address *</Label>
              <Input
                id="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryAddress: e.target.value })
                }
                placeholder="Complete delivery address"
                required
              />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transportMode">Transport Mode *</Label>
                <Select
                  value={formData.transportMode}
                  onValueChange={(value) =>
                    setFormData({ ...formData, transportMode: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Road">Road</SelectItem>
                    <SelectItem value="Rail">Rail</SelectItem>
                    <SelectItem value="Air">Air</SelectItem>
                    <SelectItem value="Ship">Ship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transporterName">Transporter Name *</Label>
                <Input
                  id="transporterName"
                  value={formData.transporterName}
                  onChange={(e) =>
                    setFormData({ ...formData, transporterName: e.target.value })
                  }
                  placeholder="Transporter company name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                <Input
                  id="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vehicleNumber: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="MH02AB1234"
                  className="font-mono"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="placeOfDispatch">Place of Dispatch *</Label>
                <Input
                  id="placeOfDispatch"
                  value={formData.placeOfDispatch}
                  onChange={(e) =>
                    setFormData({ ...formData, placeOfDispatch: e.target.value })
                  }
                  placeholder="City, State"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hsnCode">HSN Code *</Label>
                <Input
                  id="hsnCode"
                  value={formData.hsnCode}
                  onChange={(e) =>
                    setFormData({ ...formData, hsnCode: e.target.value })
                  }
                  placeholder="6403"
                  className="font-mono"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Total Invoice Value</Label>
                <div className="flex items-center h-10 px-3 rounded-md border border-gray-200 bg-gray-50">
                  <span className="font-semibold">{formatCurrency(invoiceValue)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleGenerate}
              disabled={
                !formData.buyerGSTIN ||
                !formData.transporterName ||
                !formData.vehicleNumber ||
                !formData.deliveryAddress
              }
            >
              <FileBarChart className="h-4 w-4 mr-2" />
              Generate E-Way Bill
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}