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
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { CreateInvoiceDialog } from "../components/CreateInvoiceDialog";
import { AddProductDialog } from "../components/AddProductDialog";
import { AddCustomerDialog } from "../components/AddCustomerDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import api from "../api/axios";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<any>(null);
  const [chartData, setChartData] = useState<any>([]);

  // Filter states
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedYear) params.year = selectedYear;
      if (selectedMonth) params.month = selectedMonth;

      const [statsRes, chartRes] = await Promise.all([
        api.get('/dashboard/stats', { params }),
        api.get('/dashboard/revenue-chart') // Chart always shows global trend
      ]);
      
      if (statsRes.data?.success) {
        setStatsData(statsRes.data.data);
      }
      if (chartRes.data?.success) {
        setChartData(chartRes.data.data);
      }
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [selectedYear, selectedMonth]);

  if (loading || !statsData) {
    return <div className="flex justify-center items-center h-[500px]">Loading Dashboard...</div>;
  }

  const {
    salesStats,
    totalCustomers,
    activeStaff,
    totalProducts,
    recentTransactions
  } = statsData;

  const totalFilteredInvoices = salesStats.filtered.gstInvoices + salesStats.filtered.nonGstInvoices;
  const totalFilteredSales = salesStats.filtered.gstSales + salesStats.filtered.nonGstSales;
  const filteredGstPercent = totalFilteredSales > 0 ? (salesStats.filtered.gstSales / totalFilteredSales) * 100 : 0;
  const filteredNonGstPercent = totalFilteredSales > 0 ? (salesStats.filtered.nonGstSales / totalFilteredSales) * 100 : 0;
  const filteredTaxRate = salesStats.filtered.gstSales > 0 ? (salesStats.filtered.totalTax / salesStats.filtered.gstSales) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back!
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[110px] bg-white">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {[2024, 2025, 2026, 2027].map(y => (
                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue placeholder="All Months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <SelectItem key={m} value={m.toString()}>
                  {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* GST vs Non-GST Sales Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-600 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              GST Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                ₹{salesStats.filtered.gstSales.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-gray-500">
                {salesStats.filtered.gstInvoices} invoices
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <FileText className="h-4 w-4 text-green-600" />
              Non-GST Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                ₹{salesStats.filtered.nonGstSales.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-gray-500">
                {salesStats.filtered.nonGstInvoices} invoices
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              Tax Collected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                ₹{salesStats.filtered.totalTax.toLocaleString("en-IN")}
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
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                ₹{(salesStats.filtered.gstSales + salesStats.filtered.nonGstSales).toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-gray-500">
                {salesStats.filtered.gstInvoices + salesStats.filtered.nonGstInvoices} total invoices
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtered GST vs Non-GST Overview */}
      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Sales Breakdown (Selected Period)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* GST Sales */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">GST Sales</span>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  {salesStats.filtered.gstInvoices} bills
                </Badge>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                ₹{salesStats.filtered.gstSales.toLocaleString("en-IN")}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ 
                    width: `${filteredGstPercent}%` 
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                {filteredGstPercent.toFixed(1)}% of total
              </p>
            </div>

            {/* Non-GST Sales */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Non-GST Sales</span>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  {salesStats.filtered.nonGstInvoices} bills
                </Badge>
              </div>
              <div className="text-3xl font-bold text-green-600">
                ₹{salesStats.filtered.nonGstSales.toLocaleString("en-IN")}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ 
                    width: `${filteredNonGstPercent}%` 
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                {filteredNonGstPercent.toFixed(1)}% of total
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
                ₹{salesStats.filtered.totalTax.toLocaleString("en-IN")}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ 
                    width: `${filteredTaxRate}%` 
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                {filteredTaxRate.toFixed(1)}% tax rate avg
              </p>
            </div>
          </div>

          {/* Total Filtered Revenue */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sales (Selected Period)</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">
                  ₹{totalFilteredSales.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Invoices generated</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {totalFilteredInvoices}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatsCard
          title="Total Customers"
          value={totalCustomers.toString()}
          icon={Users}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          onClick={() => navigate("/customers")}
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
          title="Total Products"
          value={totalProducts.toString()}
          icon={Package}
          iconBgColor="bg-indigo-100"
          iconColor="text-indigo-600"
          onClick={() => navigate("/products")}
        />
        <StatsCard
          title="GST Bills"
          value={salesStats.filtered.gstInvoices.toString()}
          icon={FileText}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Non-GST Bills"
          value={salesStats.filtered.nonGstInvoices.toString()}
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
            <CardTitle>Sales Trend Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300} key="sales-container">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Monthly Sales (₹)"
                    key="sales-line"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-gray-500 text-sm">
                No sufficient sales data to show trend graph
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inventory Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {statsData.inventoryData && statsData.inventoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300} key="inventory-container">
                <PieChart>
                  <Pie
                    data={statsData.inventoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : name
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statsData.inventoryData.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    formatter={(value, name) => [value, "Items in Stock"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-gray-500 text-sm">
                No inventory data available
              </div>
            )}
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
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction: any) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/invoices/${transaction.id}`)}>
                      <td className="py-3 text-sm text-gray-900 font-medium px-2">
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-sm text-gray-500">
                      No recent invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}