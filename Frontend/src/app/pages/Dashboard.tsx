import { StatsCard } from "../components/StatsCard";
import {
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Users,
  ShoppingCart,
  Package,
  FileText,
  Plus,
  UserPlus,
  FileBarChart,
  UserCog,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { salesData, inventoryData, transactions, ewayBills, staff, salesStats } from "../lib/mockData";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { CreateInvoiceDialog } from "../components/CreateInvoiceDialog";
import { AddProductDialog } from "../components/AddProductDialog";
import { AddCustomerDialog } from "../components/AddCustomerDialog";
import { useNavigate } from "react-router";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function Dashboard() {
  const navigate = useNavigate();
  const activeEWayBills = ewayBills.filter((b) => b.status === "active").length;
  const activeStaff = staff.filter((s) => s.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back!
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <CreateInvoiceDialog />
          <AddProductDialog />
          <AddCustomerDialog />
        </div>
      </div>

      {/* GST vs Non-GST Sales Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-600 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              GST Sales (Today)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                ₹{salesStats.today.gstSales.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-gray-500">
                {salesStats.today.gstInvoices} invoices
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <FileText className="h-4 w-4 text-green-600" />
              Non-GST Sales (Today)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                ₹{salesStats.today.nonGstSales.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-gray-500">
                {salesStats.today.nonGstInvoices} invoices
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              Tax Collected (Today)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                ₹{salesStats.today.totalTax.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-gray-500">
                GST amount
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-600 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-orange-600" />
              Total Sales (Today)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                ₹{(salesStats.today.gstSales + salesStats.today.nonGstSales).toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-gray-500">
                {salesStats.today.gstInvoices + salesStats.today.nonGstInvoices} total invoices
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly GST vs Non-GST Overview */}
      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Monthly Sales Breakdown (GST vs Non-GST)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* GST Sales */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">GST Sales</span>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  {salesStats.monthly.gstInvoices} bills
                </Badge>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                ₹{salesStats.monthly.gstSales.toLocaleString("en-IN")}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ 
                    width: `${(salesStats.monthly.gstSales / (salesStats.monthly.gstSales + salesStats.monthly.nonGstSales)) * 100}%` 
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                {((salesStats.monthly.gstSales / (salesStats.monthly.gstSales + salesStats.monthly.nonGstSales)) * 100).toFixed(1)}% of total
              </p>
            </div>

            {/* Non-GST Sales */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Non-GST Sales</span>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  {salesStats.monthly.nonGstInvoices} bills
                </Badge>
              </div>
              <div className="text-3xl font-bold text-green-600">
                ₹{salesStats.monthly.nonGstSales.toLocaleString("en-IN")}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ 
                    width: `${(salesStats.monthly.nonGstSales / (salesStats.monthly.gstSales + salesStats.monthly.nonGstSales)) * 100}%` 
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                {((salesStats.monthly.nonGstSales / (salesStats.monthly.gstSales + salesStats.monthly.nonGstSales)) * 100).toFixed(1)}% of total
              </p>
            </div>

            {/* Tax Collected */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Tax Collected</span>
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                  GST
                </Badge>
              </div>
              <div className="text-3xl font-bold text-purple-600">
                ₹{salesStats.monthly.totalTax.toLocaleString("en-IN")}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ 
                    width: `${(salesStats.monthly.totalTax / salesStats.monthly.gstSales) * 100}%` 
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                {((salesStats.monthly.totalTax / salesStats.monthly.gstSales) * 100).toFixed(1)}% tax rate avg
              </p>
            </div>
          </div>

          {/* Total Monthly Revenue */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Monthly Revenue</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">
                  ₹{(salesStats.monthly.gstSales + salesStats.monthly.nonGstSales).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {salesStats.monthly.gstInvoices + salesStats.monthly.nonGstInvoices}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <StatsCard
          title="Pending Payments"
          value="₹1,22,000"
          icon={DollarSign}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
        />
        <StatsCard
          title="Active E-Way Bills"
          value={activeEWayBills.toString()}
          icon={FileBarChart}
          iconBgColor="bg-cyan-100"
          iconColor="text-cyan-600"
          onClick={() => navigate("/eway-bills")}
        />
        <StatsCard
          title="Low Stock Alerts"
          value="2"
          icon={AlertTriangle}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
        />
        <StatsCard
          title="Total Customers"
          value="248"
          icon={Users}
          trend={{ value: "12 new this week", isPositive: true }}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatsCard
          title="Active Staff"
          value={activeStaff.toString()}
          icon={UserCog}
          iconBgColor="bg-teal-100"
          iconColor="text-teal-600"
          onClick={() => navigate("/staff")}
        />
        <StatsCard
          title="Products"
          value="234"
          icon={Package}
          iconBgColor="bg-indigo-100"
          iconColor="text-indigo-600"
        />
        <StatsCard
          title="Yearly GST Sales"
          value={`₹${(salesStats.yearly.gstSales / 100000).toFixed(1)}L`}
          icon={TrendingUp}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Yearly Non-GST"
          value={`₹${(salesStats.yearly.nonGstSales / 100000).toFixed(1)}L`}
          icon={FileText}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300} key="sales-container">
              <LineChart data={salesData} id="sales-chart">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" id="sales-grid" />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  id="sales-xaxis"
                />
                <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} id="sales-yaxis" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  id="sales-tooltip"
                />
                <Legend id="sales-legend" />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Sales (₹)"
                  key="sales-line"
                  id="sales-line-main"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inventory Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300} key="inventory-container">
              <PieChart id="inventory-chart">
                <Pie
                  data={inventoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  id="inventory-pie"
                >
                  {inventoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.id}-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip id="inventory-tooltip" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
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
                        {transaction.status.charAt(0).toUpperCase() +
                          transaction.status.slice(1)}
                      </Badge>
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