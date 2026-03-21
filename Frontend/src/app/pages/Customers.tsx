import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, Plus, MessageSquare, FileText, DollarSign, Eye } from "lucide-react";
import { AddCustomerDialog } from "../components/AddCustomerDialog";
import { SharedPagination } from "../components/SharedPagination";
import api from "../api/axios";
import { useNavigate } from "react-router";

export function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm, currentPage]);

  const fetchCustomers = async () => {
    try {
      const res = await api.get(`/customers?search=${searchTerm}&page=${currentPage}&limit=10`);
      if (res.data.success) {
        setCustomers(res.data.data);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.pages || 1);
          setTotalItems(res.data.pagination.total || 0);
        } else {
          setTotalItems(res.data.data.length);
        }
      }
    } catch (error) {
      console.error("Failed to fetch customers", error);
    }
  };

  const openCustomerView = (customer: any) => {
    navigate(`/customers/${customer._id}`);
  };

  const filteredCustomers = customers;

  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalPurchases || 0), 0);

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
                  {totalItems}
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
                <p className="text-sm text-gray-600">Total Revenue (This Page)</p>
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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({totalItems})</CardTitle>
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
                    Status
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
                    <td className="py-3 text-right text-sm font-bold text-green-600">
                      ₹{(customer.totalPurchases || 0).toLocaleString("en-IN")}
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