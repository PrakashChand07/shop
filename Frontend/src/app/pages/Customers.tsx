import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, Plus, MessageSquare, FileText, DollarSign } from "lucide-react";
import { customers } from "../lib/mockData";
import { AddCustomerDialog } from "../components/AddCustomerDialog";

export function Customers() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCustomers = customers.length;
  const totalPending = customers.reduce((sum, c) => sum + c.pendingAmount, 0);
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalPurchases, 0);

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
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-100">
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
                      {customer.address || "-"}
                    </td>
                    <td className="py-3 text-right text-sm font-medium text-gray-900">
                      ₹{customer.totalPurchases.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 text-right">
                      {customer.pendingAmount > 0 ? (
                        <Badge
                          variant="destructive"
                          className="bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          ₹{customer.pendingAmount.toLocaleString("en-IN")}
                        </Badge>
                      ) : (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-700 hover:bg-green-200"
                        >
                          Paid
                        </Badge>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex justify-center gap-1">
                        <Button size="sm" variant="ghost" title="Send WhatsApp">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" title="View Ledger">
                          <FileText className="h-4 w-4" />
                        </Button>
                        {customer.pendingAmount > 0 && (
                          <Button size="sm" variant="ghost" title="Add Payment">
                            <DollarSign className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}