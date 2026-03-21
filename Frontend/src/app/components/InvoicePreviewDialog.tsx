import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Printer, Download, Share2, MessageCircle, X, Check } from "lucide-react";
import { Logo } from "./Logo";

interface InvoiceItem {
  id: string;
  name: string;
  hsnCode: string;
  quantity: number;
  price: number;
  gst: number;
}

interface InvoicePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  customerGST?: string;
  items: InvoiceItem[];
  subtotal: number;
  gstAmount: number;
  total: number;
}

export function InvoicePreviewDialog({
  open,
  onOpenChange,
  invoiceNumber,
  date,
  customerName,
  customerPhone,
  customerAddress,
  customerGST,
  items,
  subtotal,
  gstAmount,
  total,
}: InvoicePreviewDialogProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    alert("PDF download functionality would be implemented here using libraries like jsPDF or react-pdf");
  };

  const handleWhatsApp = () => {
    const message = `Invoice #${invoiceNumber}\n\nDear ${customerName},\n\nYour invoice for ₹${total.toLocaleString("en-IN", { minimumFractionDigits: 2 })} has been generated.\n\nThank you for your business!\n- Anjum Footwear`;
    const phone = customerPhone?.replace(/[^0-9]/g, "");
    const whatsappUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleShare = async () => {
    const shareData = {
      title: `Invoice #${invoiceNumber}`,
      text: `Invoice for ${customerName} - ₹${total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `Invoice #${invoiceNumber} - ${customerName} - ₹${total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
      );
      alert("Invoice details copied to clipboard!");
    }
  };

  const calculateItemTotal = (item: InvoiceItem) => {
    const itemSubtotal = item.quantity * item.price;
    const gstAmount = (itemSubtotal * item.gst) / 100;
    return itemSubtotal + gstAmount;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] lg:max-w-5xl max-h-[95vh] overflow-hidden p-0 flex flex-col">
        {/* Header with Actions */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 lg:p-6 print:hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <DialogTitle className="text-xl lg:text-2xl font-bold">Invoice Preview</DialogTitle>
              <DialogDescription className="text-blue-100 mt-1">
                Review and share your invoice
              </DialogDescription>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrint}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownload}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleWhatsApp}
              className="bg-green-500 text-white hover:bg-green-600 font-semibold"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="bg-blue-800 text-white hover:bg-blue-900 font-semibold"
            >
              <Check className="h-4 w-4 mr-2" />
              Done
            </Button>
          </div>
        </div>

        {/* Invoice Document */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4 lg:p-6 print:p-0 print:bg-white">
          <div className="mx-auto max-w-4xl bg-white rounded-lg shadow-lg print:shadow-none print:rounded-none">
            <div className="p-6 lg:p-10">
              {/* Header */}
              <div className="mb-8 flex flex-col lg:flex-row items-start justify-between border-b-2 border-blue-600 pb-6 gap-4">
                <div className="space-y-3">
                  <Logo size="lg" />
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold text-gray-900">Anjum Footwear</p>
                    <p>123 Fashion Street, Mumbai</p>
                    <p>Maharashtra 400001, India</p>
                    <p className="mt-1">Phone: +91 98765 43210</p>
                    <p>Email: info@anjumfootwear.com</p>
                    <p className="mt-1">GSTIN: 27AABCA1234F1Z5</p>
                  </div>
                </div>
                <div className="text-left lg:text-right">
                  <h1 className="text-3xl lg:text-4xl font-bold text-blue-600">INVOICE</h1>
                  <div className="mt-4 space-y-1 text-sm">
                    <p>
                      <span className="font-semibold text-gray-700">Invoice No:</span>{" "}
                      <span className="text-gray-900">{invoiceNumber}</span>
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Date:</span>{" "}
                      <span className="text-gray-900">{date}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Bill To */}
              <div className="mb-8">
                <h2 className="mb-3 text-sm font-bold uppercase text-gray-700 border-b border-gray-200 pb-2">
                  Bill To:
                </h2>
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                  <p className="font-bold text-gray-900 text-lg">{customerName}</p>
                  {customerAddress && <p className="text-gray-600 mt-2">{customerAddress}</p>}
                  {customerPhone && (
                    <p className="text-gray-600 mt-1 flex items-center gap-2">
                      <span className="font-semibold">Phone:</span> {customerPhone}
                    </p>
                  )}
                  {customerGST && (
                    <p className="text-gray-600 mt-1 flex items-center gap-2">
                      <span className="font-semibold">GSTIN:</span> {customerGST}
                    </p>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="p-3 text-left text-xs font-bold uppercase">#</th>
                        <th className="p-3 text-left text-xs font-bold uppercase">Product</th>
                        <th className="p-3 text-left text-xs font-bold uppercase">HSN</th>
                        <th className="p-3 text-right text-xs font-bold uppercase">Qty</th>
                        <th className="p-3 text-right text-xs font-bold uppercase">Rate</th>
                        <th className="p-3 text-right text-xs font-bold uppercase">GST %</th>
                        <th className="p-3 text-right text-xs font-bold uppercase">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {items.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="p-3 text-sm text-gray-600">{index + 1}</td>
                          <td className="p-3 text-sm font-medium text-gray-900">{item.name}</td>
                          <td className="p-3 text-sm text-gray-600">{item.hsnCode}</td>
                          <td className="p-3 text-right text-sm text-gray-900 font-medium">
                            {item.quantity}
                          </td>
                          <td className="p-3 text-right text-sm text-gray-900">
                            ₹{item.price.toLocaleString("en-IN")}
                          </td>
                          <td className="p-3 text-right text-sm text-gray-600">{item.gst}%</td>
                          <td className="p-3 text-right text-sm font-semibold text-gray-900">
                            ₹{calculateItemTotal(item).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="mb-8 flex justify-end">
                <div className="w-full lg:w-80 space-y-3">
                  <div className="flex justify-between border-b border-gray-200 pb-3 text-sm">
                    <span className="text-gray-700 font-medium">Subtotal:</span>
                    <span className="font-semibold text-gray-900">
                      ₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-3 text-sm">
                    <span className="text-gray-700 font-medium">Total GST:</span>
                    <span className="font-semibold text-gray-900">
                      ₹{gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between border-t-2 border-blue-600 pt-4 text-lg">
                    <span className="font-bold text-gray-900">Grand Total:</span>
                    <span className="font-bold text-blue-600 text-2xl">
                      ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="border-t border-gray-300 pt-6 mb-6">
                <h3 className="mb-3 text-sm font-bold text-gray-700">Terms & Conditions:</h3>
                <ul className="list-inside list-disc space-y-1 text-xs text-gray-600">
                  <li>Payment is due within 15 days from the invoice date</li>
                  <li>Goods once sold will not be taken back or exchanged</li>
                  <li>All disputes are subject to Mumbai jurisdiction only</li>
                  <li>Interest @18% p.a. will be charged on overdue accounts</li>
                </ul>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-300 pt-6 text-center">
                <p className="text-sm font-medium text-gray-700">Thank you for your business!</p>
                <p className="mt-2 text-xs text-gray-500">
                  This is a computer-generated invoice and does not require a signature.
                </p>
              </div>

              {/* Authorized Signature */}
              <div className="mt-8 flex justify-end">
                <div className="text-right">
                  <div className="mb-16"></div>
                  <div className="border-t border-gray-400 pt-2 text-sm text-gray-700 font-medium">
                    Authorized Signature
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
