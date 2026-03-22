import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useState, useEffect } from "react";
import api from "../api/axios";

// Helper components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { format } from "date-fns";
import { SharedPagination } from "../components/SharedPagination";

export function Accounting() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  // Default to the current month (1-12)
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState({ total: 0, pages: 1, limit: 10 });

  const fetchAccountingData = async () => {
    try {
      setLoading(true);
      const params: any = { page: currentPage, limit: paginationData.limit };
      if (selectedYear) params.year = selectedYear;
      if (selectedMonth) params.month = selectedMonth;

      const res = await api.get('/accounting', { params });
      if (res.data?.success) {
        setData(res.data.data);
        if (res.data.pagination) {
          setPaginationData(res.data.pagination);
        }
      }
    } catch (error) {
      console.error("Error fetching accounting data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset page to 1 when filters change
    setCurrentPage(1);
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    fetchAccountingData();
  }, [selectedYear, selectedMonth, currentPage]);

  const totalIncome = data?.totalIncome || 0;
  const totalExpense = data?.totalExpense || 0;
  const totalGST = data?.totalGST || 0;
  const netProfit = data?.netProfit || 0;
  const totalSupplierExpense = data?.totalSupplierExpense || 0;
  const totalSalaryExpense = data?.totalSalaryExpense || 0;
  const totalManualExpense = data?.totalManualExpense || 0;
  const profitLossData = data?.profitLossData || [];
  const transactions = data?.recentTransactions || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Accounting & Books
          </h1>
          <p className="text-gray-600">
            Manage your accounts and financial records
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-3">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px] bg-white">
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

      {/* Financial Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Income</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  ₹{totalIncome.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  ₹{totalExpense.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Supplier purchases:</span>
                <span className="font-medium text-gray-700">₹{totalSupplierExpense.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Staff Salaries:</span>
                <span className="font-medium text-gray-700">₹{totalSalaryExpense.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Other Expenses:</span>
                <span className="font-medium text-gray-700">₹{totalManualExpense.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total GST Collected</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  ₹{totalGST.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Profit</p>
                <p className={`mt-2 text-2xl font-semibold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{netProfit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <DollarSign className={`h-6 w-6 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profit & Loss Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Profit & Loss Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350} key="profit-loss-container">
            <BarChart data={profitLossData} id="profit-loss-chart">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" id="profit-loss-grid" />
              <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: "12px" }} id="profit-loss-xaxis" />
              <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} id="profit-loss-yaxis" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                id="profit-loss-tooltip"
              />
              <Legend id="profit-loss-legend" />
              <Bar dataKey="income" fill="#10b981" name="Income (₹)" id="income-bar" />
              <Bar dataKey="expense" fill="#ef4444" name="Expenses (₹)" id="expense-bar" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Accounting Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center min-h-[500px]">
              <p className="text-sm text-gray-500">Loading data...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex items-center justify-center min-h-[500px]">
              <p className="text-sm text-gray-500">No transactions found for the selected period.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Income</TableHead>
                    <TableHead className="text-right">Expense</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((t: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell className="text-gray-600">{format(new Date(t.date), "dd MMM yyyy")}</TableCell>
                      <TableCell className="font-medium text-gray-900">{t.description}</TableCell>
                      <TableCell className="text-gray-600">{t.category}</TableCell>
                      <TableCell className="text-right text-green-600 font-medium">
                        {t.income > 0 ? `+₹${t.income.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "-"}
                      </TableCell>
                      <TableCell className="text-right text-red-600 font-medium">
                        {t.expense > 0 ? `-₹${t.expense.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {/* Empty rows to maintain fixed height */}
                  {Array.from({ length: Math.max(0, paginationData.limit - transactions.length) }).map((_, idx) => (
                    <TableRow key={`empty-${idx}`}>
                      <TableCell className="text-transparent">{"-"}</TableCell>
                      <TableCell className="text-transparent">{"-"}</TableCell>
                      <TableCell className="text-transparent">{"-"}</TableCell>
                      <TableCell className="text-transparent">{"-"}</TableCell>
                      <TableCell className="text-transparent">{"-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {paginationData.pages > 1 && (
                <SharedPagination
                  currentPage={currentPage}
                  totalPages={paginationData.pages}
                  onPageChange={(page) => setCurrentPage(page)}
                  itemsPerPage={paginationData.limit}
                  totalItems={paginationData.total}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}