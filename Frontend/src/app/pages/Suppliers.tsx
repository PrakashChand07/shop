import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, Plus, Phone, Mail, Trash2, Edit } from "lucide-react";
import { AddSupplierDialog } from "../components/AddSupplierDialog";

export function Suppliers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [apiSuppliers, setApiSuppliers] = useState<any[]>([]);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/suppliers');
      if (res.data.success) {
        setApiSuppliers(res.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch suppliers");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      try {
        const res = await api.delete(`/suppliers/${id}`);
        if (res.data.success) {
          toast.success("Supplier deleted successfully!");
          fetchSuppliers();
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Failed to delete supplier");
      }
    }
  };

  const filteredSuppliers = apiSuppliers.filter(
    (supplier) =>
      supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone?.includes(searchTerm) ||
      supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <AddSupplierDialog onAddSupplier={fetchSuppliers} />
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
                  <tr key={supplier._id} className="border-b border-gray-100">
                    <td className="py-3 text-sm font-medium text-gray-900">
                      {supplier.name}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          {supplier.phone}
                        </div>
                        {supplier.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            {supplier.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {supplier.gstNumber || "-"}
                    </td>
                    <td className="py-3 text-right text-sm font-medium text-gray-900">
                      ₹{(supplier.totalPurchases || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 text-right">
                      {(supplier.outstanding || 0) > 0 ? (
                        <Badge
                          variant="destructive"
                          className="bg-orange-100 text-orange-700 hover:bg-orange-200"
                        >
                          ₹{(supplier.outstanding || 0).toLocaleString("en-IN")}
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
                      <div className="flex items-center justify-center gap-2">
                        <AddSupplierDialog onAddSupplier={fetchSuppliers} supplierToEdit={supplier} />
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(supplier._id)}>
                          <Trash2 className="h-4 w-4" />
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
    </div>
  );
}