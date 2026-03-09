import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Printer, Download, Send, FileBarChart } from "lucide-react";
import { useState } from "react";
import { EWayBillDialog } from "./EWayBillDialog";
import { Alert, AlertDescription } from "./ui/alert";

interface InvoiceItem {
  id: string;
  name: string;
  hsnCode: string;
  quantity: number;
  price: number;
  gst: number;
  discount: number;
}

interface InvoiceDocumentProps {
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  customerGST?: string;
  items: InvoiceItem[];
  subtotal: number;
  gstAmount: number;
  discount: number;
  total: number;
  onPrint?: () => void;
  onDownload?: () => void;
  onSend?: () => void;
}

export function InvoiceDocument({
  invoiceNumber,
  date,
  customerName,
  customerPhone,
  customerAddress,
  customerGST,
  items,
  subtotal,
  gstAmount,
  discount,
  total,
  onPrint,
  onDownload,
  onSend,
}: InvoiceDocumentProps) {
  const [showEWayBillDialog, setShowEWayBillDialog] = useState(false);
  const [generatedEWayBill, setGeneratedEWayBill] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calculateItemTotal = (item: InvoiceItem) => {
    const itemSubtotal = item.quantity * item.price;
    const discountAmount = (itemSubtotal * item.discount) / 100;
    const taxableAmount = itemSubtotal - discountAmount;
    const gstAmount = (taxableAmount * item.gst) / 100;
    return taxableAmount + gstAmount;
  };

  const requiresEWayBill = total >= 50000;
  const primaryHsnCode = items.length > 0 ? items[0].hsnCode : "6403";

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* E-Way Bill Alert */}
      {requiresEWayBill && !generatedEWayBill && (
        <Alert className="bg-amber-50 border-amber-200 print:hidden">
          <FileBarChart className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-sm text-amber-800">
            E-Way Bill is mandatory for invoices above ₹50,000. Click "Generate E-Way Bill" button below.
          </AlertDescription>
        </Alert>
      )}

      {/* E-Way Bill Generated Alert */}
      {generatedEWayBill && (
        <Alert className="bg-green-50 border-green-200 print:hidden">
          <FileBarChart className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-sm text-green-800">
            E-Way Bill Generated: <span className="font-semibold">{generatedEWayBill}</span>
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 print:hidden">
        {requiresEWayBill && (
          <Button
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto"
            onClick={() => setShowEWayBillDialog(true)}
          >
            <FileBarChart className="h-4 w-4 mr-2" />
            {generatedEWayBill ? "View E-Way Bill" : "Generate E-Way Bill"}
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onPrint} className="w-full sm:w-auto">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button variant="outline" size="sm" onClick={onDownload} className="w-full sm:w-auto">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button size="sm" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto" onClick={onSend}>
          <Send className="h-4 w-4 mr-2" />
          Send via WhatsApp
        </Button>
      </div>

      {/* Invoice Document */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 md:p-8 shadow-sm">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start justify-between border-b border-gray-300 pb-4 sm:pb-6 gap-4 sm:gap-0">
          <div className="space-y-2 sm:space-y-3 w-full sm:w-auto">
            <Logo size="lg" />
            <div className="text-xs sm:text-sm text-gray-600">
              <p className="font-semibold">Anjum Footwear</p>
              <p>123, Market Road, Mumbai - 400001</p>
              <p>Phone: +91 98765 43210</p>
              <p className="hidden sm:block">Email: info@anjumfootwear.com</p>
              <p>GSTIN: 27AABCA1234F1Z5</p>
            </div>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">INVOICE</h1>
            <div className="mt-3 sm:mt-4 space-y-1 text-xs sm:text-sm">
              <p>
                <span className="font-semibold">Invoice No:</span> {invoiceNumber}
              </p>
              <p>
                <span className="font-semibold">Date:</span> {formatDate(date)}
              </p>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-6 sm:mb-8">
          <h2 className="mb-2 sm:mb-3 text-xs sm:text-sm font-semibold uppercase text-gray-700">
            Bill To:
          </h2>
          <div className="rounded-lg bg-gray-50 p-3 sm:p-4 text-xs sm:text-sm">
            <p className="font-semibold text-gray-900">{customerName}</p>
            {customerAddress && <p className="text-gray-600 mt-1">{customerAddress}</p>}
            {customerPhone && <p className="text-gray-600 mt-1">Phone: {customerPhone}</p>}
            {customerGST && <p className="text-gray-600 mt-1">GSTIN: {customerGST}</p>}
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6 sm:mb-8 overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[640px] px-4 sm:px-0">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300 bg-gray-50">
                  <th className="p-2 sm:p-3 text-left text-[10px] sm:text-xs font-semibold uppercase text-gray-700">
                    #
                  </th>
                  <th className="p-2 sm:p-3 text-left text-[10px] sm:text-xs font-semibold uppercase text-gray-700">
                    Product
                  </th>
                  <th className="p-2 sm:p-3 text-left text-[10px] sm:text-xs font-semibold uppercase text-gray-700">
                    HSN
                  </th>
                  <th className="p-2 sm:p-3 text-right text-[10px] sm:text-xs font-semibold uppercase text-gray-700">
                    Qty
                  </th>
                  <th className="p-2 sm:p-3 text-right text-[10px] sm:text-xs font-semibold uppercase text-gray-700">
                    Rate
                  </th>
                  <th className="p-2 sm:p-3 text-right text-[10px] sm:text-xs font-semibold uppercase text-gray-700">
                    GST %
                  </th>
                  <th className="p-2 sm:p-3 text-right text-[10px] sm:text-xs font-semibold uppercase text-gray-700 hidden sm:table-cell">
                    Discount
                  </th>
                  <th className="p-2 sm:p-3 text-right text-[10px] sm:text-xs font-semibold uppercase text-gray-700">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-600">{index + 1}</td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-600">{item.hsnCode}</td>
                    <td className="p-2 sm:p-3 text-right text-xs sm:text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="p-2 sm:p-3 text-right text-xs sm:text-sm text-gray-900">
                      ₹{item.price.toLocaleString("en-IN")}
                    </td>
                    <td className="p-2 sm:p-3 text-right text-xs sm:text-sm text-gray-600">
                      {item.gst}%
                    </td>
                    <td className="p-2 sm:p-3 text-right text-xs sm:text-sm text-gray-600 hidden sm:table-cell">
                      {item.discount}%
                    </td>
                    <td className="p-2 sm:p-3 text-right text-xs sm:text-sm font-medium text-gray-900">
                      ₹{calculateItemTotal(item).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="mb-6 sm:mb-8 flex justify-end">
          <div className="w-full sm:max-w-xs space-y-2">
            <div className="flex justify-between border-b border-gray-200 pb-2 text-xs sm:text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-gray-900">
                ₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2 text-xs sm:text-sm">
              <span className="text-gray-600">GST:</span>
              <span className="font-medium text-gray-900">
                ₹{gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between border-b border-gray-200 pb-2 text-xs sm:text-sm">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium text-red-600">
                  -₹{discount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t-2 border-gray-300 pt-3 text-sm sm:text-base">
              <span className="font-semibold text-gray-900">Total Amount:</span>
              <span className="font-bold text-blue-600 text-base sm:text-lg">
                ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="border-t border-gray-300 pt-4 sm:pt-6">
          <h3 className="mb-2 text-xs sm:text-sm font-semibold text-gray-700">
            Terms & Conditions:
          </h3>
          <ul className="list-inside list-disc space-y-1 text-[10px] sm:text-xs text-gray-600">
            <li>Payment is due within 15 days from the invoice date</li>
            <li>Goods once sold will not be taken back or exchanged</li>
            <li className="hidden sm:list-item">All disputes are subject to Mumbai jurisdiction only</li>
            <li>Interest @18% p.a. will be charged on overdue accounts</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 border-t border-gray-300 pt-4 sm:pt-6 text-center">
          <p className="text-xs sm:text-sm font-medium text-gray-700">
            Thank you for your business!
          </p>
          <p className="mt-2 text-[10px] sm:text-xs text-gray-500">
            This is a computer-generated invoice and does not require a signature.
          </p>
        </div>

        {/* Authorized Signature */}
        <div className="mt-6 sm:mt-8 flex justify-end">
          <div className="text-right">
            <div className="mb-8 sm:mb-12"></div>
            <div className="border-t border-gray-400 pt-2 text-xs sm:text-sm text-gray-700">
              Authorized Signature
            </div>
          </div>
        </div>
      </div>

      {/* E-Way Bill Dialog */}
      <EWayBillDialog
        open={showEWayBillDialog}
        onOpenChange={setShowEWayBillDialog}
        invoiceNumber={invoiceNumber}
        invoiceValue={total}
        invoiceDate={date}
        customerName={customerName}
        customerGSTIN={customerGST}
        customerAddress={customerAddress}
        hsnCode={primaryHsnCode}
        onGenerate={(ebn) => setGeneratedEWayBill(ebn)}
      />
    </div>
  );
}