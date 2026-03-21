import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { CreditCard, Check, Clock, X, QrCode, Search, Filter } from "lucide-react";
import { AddPaymentDialog } from "../components/AddPaymentDialog";
import { SharedPagination } from "../components/SharedPagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import api from "../api/axios";
import { toast } from "sonner";

export function Payments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");

  const fetchPayments = async () => {
    try {
      const methodQuery = paymentMethodFilter !== "all" ? `&paymentMethod=${paymentMethodFilter}` : "";
      const res = await api.get(`/payments?page=${currentPage}&limit=10${methodQuery}`);
      if (res.data.success) {
        setPayments(res.data.data);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.pages || 1);
          setTotalItems(res.data.pagination.total || 0);
        } else {
          setTotalItems(res.data.data.length);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch payments");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [currentPage, paymentMethodFilter]);

  // Derived current page stats
  const totalReceivedThisPage = payments
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const getMethodIcon = (method: string) => {
    switch(method) {
      case 'upi': return <QrCode className="mr-1 h-3 w-3" />;
      case 'card': return <CreditCard className="mr-1 h-3 w-3" />;
      default: return <CreditCard className="mr-1 h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Payment Management
          </h1>
          <p className="text-gray-600">Track and manage all payments</p>
        </div>
        <AddPaymentDialog />
      </div>

      {/* Payment Stats (Based on current view/page) */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Received (This Page)</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  ₹{totalReceivedThisPage.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search payments..."
                className="pl-10"
                disabled
              />
            </div>
            <Select 
              value={paymentMethodFilter} 
              onValueChange={(val) => {
                setPaymentMethodFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History ({totalItems})</CardTitle>
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
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Method
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="pb-3 text-center text-sm font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-sm text-gray-500">
                      No payments found.
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment._id} className="border-b border-gray-100">
                      <td className="py-3 text-sm text-blue-600 font-medium cursor-pointer hover:underline">
                        {payment.invoice?.invoiceNumber || "N/A"}
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {new Date(payment.paymentDate).toLocaleDateString("en-IN")}
                      </td>
                      <td className="py-3 text-sm text-gray-900">
                        {payment.customer?.name || "Unknown"}
                      </td>
                      <td className="py-3 text-sm text-gray-900">
                        <Badge variant="outline" className="capitalize">
                          {getMethodIcon(payment.paymentMethod)}
                          {payment.paymentMethod.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3 text-right text-sm font-medium text-gray-900">
                        ₹{(payment.amount || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 text-center">
                        <Badge
                          variant={
                            payment.status === "completed"
                              ? "default"
                              : payment.status === "pending"
                              ? "destructive"
                              : "secondary"
                          }
                          className={
                            payment.status === "completed"
                              ? "bg-green-100 text-green-700 hover:bg-green-200 capitalize"
                              : payment.status === "pending"
                              ? "bg-red-100 text-red-700 hover:bg-red-200 capitalize"
                              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 capitalize"
                          }
                        >
                          {payment.status === "completed" && (
                            <Check className="mr-1 h-3 w-3" />
                          )}
                          {payment.status === "pending" && (
                            <Clock className="mr-1 h-3 w-3" />
                          )}
                          {payment.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
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