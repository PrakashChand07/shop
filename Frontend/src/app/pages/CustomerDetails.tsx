import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Mail, Phone, MapPin, ReceiptText, Calendar, Building, CreditCard } from "lucide-react";
import api from "../api/axios";
import { toast } from "sonner";
import { InvoicePreviewDialog } from "../components/InvoicePreviewDialog";

export function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewInvoice, setPreviewInvoice] = useState<any>(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        const [custRes, invRes] = await Promise.all([
          api.get(`/customers/${id}`),
          api.get(`/invoices?customer=${id}`)
        ]);

        if (custRes.data.success) {
          setCustomer(custRes.data.data);
        }
        if (invRes.data.success) {
          setInvoices(invRes.data.data);
        }
      } catch (error) {
        toast.error("Failed to load customer details");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchCustomerData();
    }
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading customer details...</div>;
  }

  if (!customer) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">Customer not found.</p>
        <Button onClick={() => navigate('/customers')}>Back to Customers</Button>
      </div>
    );
  }

  const totalPurchases = invoices
    .filter(inv => inv.status !== 'cancelled')
    .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/customers')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{customer.name}</h1>
          <p className="text-gray-600">Customer Details & History</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Customer Info Card */}
        <Card className="md:col-span-1 border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 text-gray-600">
              <Phone className="h-4 w-4 mt-0.5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">{customer.phone || 'N/A'}</p>
                <p className="text-xs text-gray-500">Primary Phone</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-gray-600">
              <Mail className="h-4 w-4 mt-0.5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">{customer.email || 'N/A'}</p>
                <p className="text-xs text-gray-500">Email Address</p>
              </div>
            </div>
            {customer.companyName && (
              <div className="flex items-start gap-3 text-gray-600">
                <Building className="h-4 w-4 mt-0.5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{customer.companyName}</p>
                  {customer.gstin && <p className="text-xs text-gray-500">GST: {customer.gstin}</p>}
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 text-gray-600 border-t pt-4">
              <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Billing Address</p>
                <p className="text-sm mt-1">
                  {customer.address?.street || customer.address || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics/Summary Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ReceiptText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Total Invoices</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
              </div>
              <div className="rounded-lg border bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Total Purchases</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{totalPurchases.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">Invoice No</th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">Date</th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-600">Amount</th>
                  <th className="pb-3 text-center text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-gray-500">
                      No invoices found for this customer.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr 
                      key={inv._id} 
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setPreviewInvoice(inv)}
                    >
                      <td className="py-4 text-sm font-medium text-blue-600">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          {new Date(inv.createdAt).toLocaleDateString('en-IN')}
                        </div>
                      </td>
                      <td className="py-4 text-right text-sm font-semibold text-gray-900">
                        ₹{(inv.grandTotal || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 text-center">
                        <Badge
                          variant={
                            inv.status === "paid"
                              ? "default"
                              : inv.status === "pending"
                              ? "destructive"
                              : "secondary"
                          }
                          className={
                            inv.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : inv.status === "pending"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {inv.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Preview Dialog */}
      {previewInvoice && (
        <InvoicePreviewDialog
          open={!!previewInvoice}
          onOpenChange={(op) => !op && setPreviewInvoice(null)}
          invoiceNumber={previewInvoice.invoiceNumber}
          date={new Date(previewInvoice.createdAt).toISOString().split("T")[0]}
          customerName={customer?.name || ""}
          customerPhone={customer?.phone || ""}
          customerAddress={customer?.address?.street || customer?.address || ""}
          customerGST={customer?.gstin || ""}
          items={previewInvoice.lineItems ? previewInvoice.lineItems.map((item: any) => ({
            id: item._id,
            name: item.description || item.product?.name || "Product",
            hsnCode: item.hsnCode || "",
            quantity: item.quantity || 1,
            price: item.unitPrice || 0,
            gst: item.taxRate || 0,
          })) : []}
          subtotal={previewInvoice.subtotal || 0}
          gstAmount={previewInvoice.totalTax || 0}
          total={previewInvoice.grandTotal || 0}
        />
      )}
    </div>
  );
}
