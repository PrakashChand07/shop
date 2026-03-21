import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, Eye, Filter } from "lucide-react";
import { InvoicePreviewDialog } from "../components/InvoicePreviewDialog";
import api from "../api/axios";

export function Invoices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, [searchTerm]);

  const fetchInvoices = async () => {
    try {
      const res = await api.get(`/invoices?search=${searchTerm}`);
      if (res.data.success) {
        setInvoices(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch invoices", error);
    }
  };

  const handleView = async (invoice: any) => {
    try {
      // Fetch full invoice details to ensure we have all line items
      const res = await api.get(`/invoices/${invoice._id}`);
      if (res.data.success) {
        setSelectedInvoice(res.data.data);
        setIsPreviewOpen(true);
      }
    } catch (error) {
      console.error("Error fetching invoice details:", error);
    }
  };

  const mapLineItems = (lineItems: any[]) => {
    if (!lineItems) return [];
    return lineItems.map((item: any) => ({
      id: item._id,
      name: item.description || item.product?.name || "Product",
      hsnCode: item.hsnCode || "",
      quantity: item.quantity || 1,
      price: item.unitPrice || 0,
      gst: item.taxRate || 0,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Invoices
          </h1>
          <p className="text-gray-600">View and manage all generated invoices</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by invoice number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Invoice No.
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Date
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Customer
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="pb-3 text-center text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="pb-3 text-center text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.length > 0 ? invoices.map((invoice) => (
                  <tr key={invoice._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 text-sm font-semibold text-blue-600">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-sm text-gray-900 font-medium">
                      {invoice.customer?.name || "N/A"}
                    </td>
                    <td className="py-3 text-right text-sm font-medium text-gray-900">
                      ₹{invoice.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 text-center">
                      <Badge
                        variant="outline"
                        className={
                          invoice.status === 'paid' 
                          ? 'bg-green-100 text-green-700 border-green-200' 
                          : 'bg-orange-100 text-orange-700 border-orange-200'
                        }
                      >
                        {invoice.status?.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex justify-center gap-1">
                        <Button size="sm" variant="ghost" title="View Invoice" onClick={() => handleView(invoice)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Invoice Document Preview Modal */}
      {selectedInvoice && (
        <InvoicePreviewDialog
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          invoiceNumber={selectedInvoice.invoiceNumber}
          date={new Date(selectedInvoice.createdAt).toISOString().split("T")[0]}
          customerName={selectedInvoice.customer?.name || selectedInvoice.companySnapshot?.name || ""}
          customerPhone={selectedInvoice.customer?.phone || selectedInvoice.companySnapshot?.phone || ""}
          customerAddress={selectedInvoice.customer?.address?.street || selectedInvoice.companySnapshot?.address?.street || ""}
          customerGST={selectedInvoice.customer?.gstin || ""}
          items={mapLineItems(selectedInvoice.lineItems)}
          subtotal={selectedInvoice.subtotal || 0}
          gstAmount={selectedInvoice.totalTax || 0}
          total={selectedInvoice.grandTotal || 0}
        />
      )}
    </div>
  );
}
