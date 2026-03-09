import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { CreditCard, Check, Clock, X, QrCode } from "lucide-react";
import { transactions } from "../lib/mockData";
import { AddPaymentDialog } from "../components/AddPaymentDialog";

export function Payments() {
  const totalReceived = transactions
    .filter((t) => t.status === "paid")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPending = transactions
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPartial = transactions
    .filter((t) => t.status === "partial")
    .reduce((sum, t) => sum + t.amount, 0);

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

      {/* Payment Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Received</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  ₹{totalReceived.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
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
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Partial Payments</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  ₹{totalPartial.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">UPI Payment</p>
                <p className="text-sm text-gray-500">Scan & Pay</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <QrCode className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">QR Code</p>
                <p className="text-sm text-gray-500">Dynamic QR</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Payment Link</p>
                <p className="text-sm text-gray-500">Share via WhatsApp</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
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
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100">
                    <td className="py-3 text-sm text-gray-900">
                      {transaction.invoiceNumber}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {new Date(transaction.date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3 text-sm text-gray-900">
                      {transaction.customerName}
                    </td>
                    <td className="py-3 text-right text-sm font-medium text-gray-900">
                      ₹{transaction.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 text-center">
                      <Badge
                        variant={
                          transaction.status === "paid"
                            ? "default"
                            : transaction.status === "pending"
                            ? "destructive"
                            : "secondary"
                        }
                        className={
                          transaction.status === "paid"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : transaction.status === "pending"
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        }
                      >
                        {transaction.status === "paid" && (
                          <Check className="mr-1 h-3 w-3" />
                        )}
                        {transaction.status === "pending" && (
                          <Clock className="mr-1 h-3 w-3" />
                        )}
                        {transaction.status === "partial" && (
                          <CreditCard className="mr-1 h-3 w-3" />
                        )}
                        {transaction.status.charAt(0).toUpperCase() +
                          transaction.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 text-center">
                      {transaction.status !== "paid" && (
                        <Button size="sm" variant="outline">
                          Record Payment
                        </Button>
                      )}
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