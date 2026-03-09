import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, Plus, Phone, Mail } from "lucide-react";
import { suppliers } from "../lib/mockData";
import { AddSupplierDialog } from "../components/AddSupplierDialog";

export function Suppliers() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone.includes(searchTerm) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Supplier Management
          </h1>
          <p className="text-gray-600">Manage your supplier database</p>
        </div>
        <AddSupplierDialog />
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search suppliers by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Suppliers ({filteredSuppliers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Supplier Name
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Contact
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    GST Number
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
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b border-gray-100">
                    <td className="py-3 text-sm font-medium text-gray-900">
                      {supplier.name}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          {supplier.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {supplier.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {supplier.gstNumber || "-"}
                    </td>
                    <td className="py-3 text-right text-sm font-medium text-gray-900">
                      ₹{supplier.totalPurchases.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 text-right">
                      {supplier.pendingAmount > 0 ? (
                        <Badge
                          variant="destructive"
                          className="bg-orange-100 text-orange-700 hover:bg-orange-200"
                        >
                          ₹{supplier.pendingAmount.toLocaleString("en-IN")}
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
                    <td className="py-3 text-center">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
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