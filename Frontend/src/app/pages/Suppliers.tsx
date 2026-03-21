import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, Plus, Phone, Mail, Trash2, Edit } from "lucide-react";
import { AddSupplierDialog } from "../components/AddSupplierDialog";
import { SharedPagination } from "../components/SharedPagination";

export function Suppliers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [apiSuppliers, setApiSuppliers] = useState<any[]>([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get(`/suppliers?search=${searchTerm}&page=${currentPage}&limit=10`);
      if (res.data.success) {
        setApiSuppliers(res.data.data);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.pages || 1);
          setTotalItems(res.data.pagination.total || 0);
        } else {
          setTotalItems(res.data.data.length);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch suppliers");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [searchTerm, currentPage]);

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

  // Optional frontend fallback filter if backend search is limited
  const filteredSuppliers = apiSuppliers;

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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Suppliers ({totalItems})</CardTitle>
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
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Address
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
                    <td className="py-3 text-left text-sm font-medium text-gray-900">
                      {supplier.address || "-"}
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
          
          <SharedPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={10}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}