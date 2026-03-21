import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, Plus, MessageSquare, FileText, DollarSign, Eye } from "lucide-react";
import { AddCustomerDialog } from "../components/AddCustomerDialog";
import api from "../api/axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";

export function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerInvoices, setCustomerInvoices] = useState<any[]>([]);
  const [isViewOpen, setIsViewOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm]);

  const fetchCustomers = async () => {
    try {
      const res = await api.get(`/customers?search=${searchTerm}`);
      if (res.data.success) {
        setCustomers(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch customers", error);
    }
  };

  const openCustomerView = async (customer: any) => {
    setSelectedCustomer(customer);
    setIsViewOpen(true);
    try {
      const res = await api.get(`/invoices?customer=${customer._id}`);
      if (res.data.success) {
        setCustomerInvoices(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch invoices", error);
    }
  };

  const filteredCustomers = customers;

  const totalCustomers = customers.length;
  const totalPending = 0; // Requires backend aggregation
  const totalRevenue = 0; // Requires backend aggregation

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Customer Management
          </h1>
          <p className="text-gray-600">Manage your customer database</p>
        </div>
        <AddCustomerDialog />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {totalCustomers}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Payments</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  ₹{totalPending.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search customers by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Name
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Contact
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Address
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-600">
                    Total Purchases
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-600">
                    Pending Amount
                  </th>
                  <th className="pb-3 text-center text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer: any) => (
                  <tr key={customer._id} className="border-b border-gray-100">
                    <td className="py-3 text-sm font-medium text-gray-900">
                      {customer.name}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      <div>
                        <p>{customer.phone}</p>
                        <p className="text-xs text-gray-500">{customer.email}</p>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {customer.address?.street || customer.address || "-"}
                    </td>
                    <td className="py-3 text-right text-sm font-medium text-gray-900">
                      -
                    </td>
                    <td className="py-3 text-right">
                       <Badge variant="default" className="bg-blue-100 text-blue-700">
                         {customer.status || 'Active'}
                       </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex justify-center gap-1">
                        <Button size="sm" variant="ghost" title="View Details" onClick={() => openCustomerView(customer)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" title="Send WhatsApp">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{selectedCustomer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedCustomer.phone || '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{selectedCustomer.address?.street || selectedCustomer.address || '-'}</p>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Purchase History</h3>
                {customerInvoices.length > 0 ? (
                  <div className="space-y-2">
                    {customerInvoices.map((inv) => (
                      <div key={inv._id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-blue-600">{inv.invoiceNumber}</p>
                          <p className="text-xs text-gray-500">{new Date(inv.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-md">₹{inv.grandTotal}</p>
                          <p className="text-xs text-gray-500 mt-1">{inv.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No purchases found.</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}