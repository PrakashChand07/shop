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

const profitLossData = [
  { month: "Sep", income: 65000, expense: 45000, id: "sep-2025" },
  { month: "Oct", income: 72000, expense: 48000, id: "oct-2025" },
  { month: "Nov", income: 68000, expense: 46000, id: "nov-2025" },
  { month: "Dec", income: 81000, expense: 52000, id: "dec-2025" },
  { month: "Jan", income: 75000, expense: 49000, id: "jan-2026" },
  { month: "Feb", income: 78000, expense: 51000, id: "feb-2026" },
  { month: "Mar", income: 62000, expense: 42000, id: "mar-2026" },
];

export function Accounting() {
  const totalIncome = profitLossData.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = profitLossData.reduce((sum, item) => sum + item.expense, 0);
  const netProfit = totalIncome - totalExpense;
  const profitMargin = ((netProfit / totalIncome) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Accounting & Books
        </h1>
        <p className="text-gray-600">
          Manage your accounts and financial records
        </p>
      </div>

      {/* Financial Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Income</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  ₹{totalIncome.toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-sm text-green-600">Last 7 months</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  ₹{totalExpense.toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-sm text-red-600">Last 7 months</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Profit</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  ₹{netProfit.toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-sm text-blue-600">
                  {profitMargin}% margin
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <DollarSign className="h-6 w-6 text-blue-600" />
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Add Income */}
        <Card>
          <CardHeader>
            <CardTitle>Record Income</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" defaultValue="2026-03-07" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input type="text" placeholder="Sales from invoice..." />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                <option>Sales Revenue</option>
                <option>Service Income</option>
                <option>Other Income</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input type="number" placeholder="0.00" />
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Add Income
            </Button>
          </CardContent>
        </Card>

        {/* Add Expense */}
        <Card>
          <CardHeader>
            <CardTitle>Record Expense</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" defaultValue="2026-03-07" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input type="text" placeholder="Rent, utilities, supplies..." />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                <option>Rent</option>
                <option>Utilities</option>
                <option>Salaries</option>
                <option>Purchase</option>
                <option>Marketing</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input type="number" placeholder="0.00" />
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700">
              Add Expense
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Accounting Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Date
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Description
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Category
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-600">
                    Income
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-600">
                    Expense
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-sm text-gray-600">07/03/2026</td>
                  <td className="py-3 text-sm text-gray-900">
                    Sales - Invoice INV-2026-001
                  </td>
                  <td className="py-3 text-sm text-gray-600">Sales Revenue</td>
                  <td className="py-3 text-right text-sm font-medium text-green-600">
                    +₹1,250
                  </td>
                  <td className="py-3 text-right text-sm text-gray-400">-</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-sm text-gray-600">06/03/2026</td>
                  <td className="py-3 text-sm text-gray-900">
                    Electricity Bill Payment
                  </td>
                  <td className="py-3 text-sm text-gray-600">Utilities</td>
                  <td className="py-3 text-right text-sm text-gray-400">-</td>
                  <td className="py-3 text-right text-sm font-medium text-red-600">
                    -₹2,500
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-sm text-gray-600">05/03/2026</td>
                  <td className="py-3 text-sm text-gray-900">
                    Purchase from MediCare Distributors
                  </td>
                  <td className="py-3 text-sm text-gray-600">Purchase</td>
                  <td className="py-3 text-right text-sm text-gray-400">-</td>
                  <td className="py-3 text-right text-sm font-medium text-red-600">
                    -₹15,000
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-sm text-gray-600">05/03/2026</td>
                  <td className="py-3 text-sm text-gray-900">
                    Sales - Invoice INV-2026-007
                  </td>
                  <td className="py-3 text-sm text-gray-600">Sales Revenue</td>
                  <td className="py-3 text-right text-sm font-medium text-green-600">
                    +₹920
                  </td>
                  <td className="py-3 text-right text-sm text-gray-400">-</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-sm text-gray-600">01/03/2026</td>
                  <td className="py-3 text-sm text-gray-900">
                    Monthly Rent Payment
                  </td>
                  <td className="py-3 text-sm text-gray-600">Rent</td>
                  <td className="py-3 text-right text-sm text-gray-400">-</td>
                  <td className="py-3 text-right text-sm font-medium text-red-600">
                    -₹20,000
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}