import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import api from "../api/axios";

interface PaymentCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  cartItems: any[];
  subtotal: number;
  totalGst: number;
  additionalDiscount: number;
  grandTotal: number;
  isIgst?: boolean;
  globalGstRate?: string;
  onSuccess: (invoiceData: any) => void;
}

export function PaymentCollectionDialog({
  open,
  onOpenChange,
  customerId,
  cartItems,
  subtotal,
  totalGst,
  additionalDiscount,
  grandTotal,
  isIgst = false,
  globalGstRate = "default",
  onSuccess
}: PaymentCollectionDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountPaid, setAmountPaid] = useState<number | string>(grandTotal);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      // 1. Create Invoice
      // Transform cartItems to lineItems
      const lineItems = cartItems.map(item => {
        const itemTaxRate = globalGstRate === "default" ? item.gst : parseFloat(globalGstRate);
        return {
          product: item.productId,
          description: item.name,
          hsnCode: item.hsnCode || "",
          quantity: item.quantity,
          unitPrice: item.price,
          taxRate: itemTaxRate,
          // backend will recalculate exact totals, we just provide base values
        };
      });

      const today = new Date();
      const invoicePayload = {
        customer: customerId,
        type: 'invoice',
        dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // default 7 days 
        lineItems,
        discount: additionalDiscount,
        discountType: 'percent', // Assuming additionalDiscount is %
        isIgst
      };

      const invRes = await api.post('/invoices', invoicePayload);
      if (!invRes.data.success) {
        throw new Error("Failed to create invoice");
      }

      const invoice = invRes.data.data;

      // 2. Add Payment if amount > 0
      const paid = parseFloat(amountPaid.toString());
      if (paid > 0) {
        await api.post('/payments', {
          invoice: invoice._id,
          customer: customerId,
          amount: paid,
          paymentMethod,
          status: 'completed'
        });
      }

      toast.success("Invoice and Payment recorded successfully!");
      onOpenChange(false);
      onSuccess(invoice);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Payment & Invoice</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="rounded-lg bg-blue-50 p-4 flex justify-between items-center text-blue-900 border border-blue-100">
            <span className="font-medium text-lg">Grand Total</span>
            <span className="font-bold text-2xl">₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select method..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="card">Credit/Debit Card</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Amount Received</Label>
            <Input 
              type="number" 
              value={amountPaid} 
              onChange={(e) => setAmountPaid(e.target.value)} 
              min={0}
              max={grandTotal}
            />
            {Number(amountPaid) < grandTotal && (
               <p className="text-xs text-orange-600 font-medium">
                 ₹{(grandTotal - Number(amountPaid)).toLocaleString()} will be marked as pending.
               </p>
            )}
            {Number(amountPaid) > grandTotal && (
               <p className="text-xs text-red-600 font-medium">
                 Amount cannot exceed Grand Total.
               </p>
            )}
          </div>

          <Button 
            className="w-full h-12 text-lg font-semibold bg-green-600 hover:bg-green-700"
            onClick={handleConfirm}
            disabled={isProcessing || Number(amountPaid) > grandTotal || Number(amountPaid) < 0}
          >
            {isProcessing ? "Processing..." : "Confirm & Generate Invoice"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
