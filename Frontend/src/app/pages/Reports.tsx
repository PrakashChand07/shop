import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  FileText,
  Download,
  TrendingUp,
  Package,
  DollarSign,
  BarChart3,
  FileSpreadsheet,
  Eye,
} from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

export function Reports() {
  const [selectedReport, setSelectedReport] = useState("Sales Report");
  const [fromDate, setFromDate] = useState("2026-03-01");
  const [toDate, setToDate] = useState("2026-03-07");

  const handleGenerate = () => {
    let reportPath = "/reports";
    
    switch (selectedReport) {
      case "Sales Report":
        reportPath = "/reports/sales";
        break;
      case "Stock Report":
        reportPath = "/reports/stock";
        break;
      case "GST Summary":
        reportPath = "/reports/gst";
        break;
      default:
        alert(`Generating ${selectedReport} for ${fromDate} to ${toDate}`);
        return;
    }
    
    window.location.href = reportPath;
  };

  const reportTypes = [
    {
      id: "sales",
      name: "Sales Report",
      description: "Detailed sales analysis and trends",
      icon: TrendingUp,
      color: "bg-blue-100 text-blue-600",
      link: "/reports/sales",
    },
    {
      id: "purchase",
      name: "Purchase Report",
      description: "Purchase orders and supplier analysis",
      icon: Package,
      color: "bg-green-100 text-green-600",
    },
    {
      id: "profit-loss",
      name: "Profit & Loss Statement",
      description: "Income and expense breakdown",
      icon: BarChart3,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: "stock",
      name: "Stock Report",
      description: "Current inventory levels and valuation",
      icon: Package,
      color: "bg-orange-100 text-orange-600",
      link: "/reports/stock",
    },
    {
      id: "outstanding",
      name: "Outstanding Payments",
      description: "Pending customer and supplier payments",
      icon: DollarSign,
      color: "bg-red-100 text-red-600",
    },
    {
      id: "gst",
      name: "GST Summary",
      description: "Tax collected and paid details",
      icon: FileText,
      color: "bg-indigo-100 text-indigo-600",
      link: "/reports/gst",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <p className="text-gray-600">
          Generate and download business reports
        </p>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
              >
                <option>Sales Report</option>
                <option>Purchase Report</option>
                <option>Profit & Loss</option>
                <option>Stock Report</option>
                <option>Outstanding Payments</option>
                <option>GST Summary</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>From Date</Label>
              <Input 
                type="date" 
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>To Date</Label>
              <Input 
                type="date" 
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
                onClick={handleGenerate}
              >
                <FileText className="h-4 w-4" />
                Generate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Types */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${report.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {report.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {report.description}
                    </p>
                    {report.link ? (
                      <Link to={report.link}>
                        <Button size="sm" variant="outline" className="mt-3 gap-2">
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-3 gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Report Name
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Period
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Generated On
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Format
                  </th>
                  <th className="pb-3 text-center text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-sm font-medium text-gray-900">
                    Sales Report
                  </td>
                  <td className="py-3 text-sm text-gray-600">
                    01/03/2026 - 07/03/2026
                  </td>
                  <td className="py-3 text-sm text-gray-600">07/03/2026</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileSpreadsheet className="h-4 w-4" />
                      Excel
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <Button size="sm" variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-sm font-medium text-gray-900">
                    Profit & Loss Statement
                  </td>
                  <td className="py-3 text-sm text-gray-600">February 2026</td>
                  <td className="py-3 text-sm text-gray-600">01/03/2026</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4" />
                      PDF
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <Button size="sm" variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-sm font-medium text-gray-900">
                    Stock Report
                  </td>
                  <td className="py-3 text-sm text-gray-600">As on 01/03/2026</td>
                  <td className="py-3 text-sm text-gray-600">01/03/2026</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileSpreadsheet className="h-4 w-4" />
                      Excel
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <Button size="sm" variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-sm font-medium text-gray-900">
                    Outstanding Payments
                  </td>
                  <td className="py-3 text-sm text-gray-600">As on 25/02/2026</td>
                  <td className="py-3 text-sm text-gray-600">25/02/2026</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4" />
                      PDF
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <Button size="sm" variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-sm font-medium text-gray-900">
                    GST Summary
                  </td>
                  <td className="py-3 text-sm text-gray-600">January 2026</td>
                  <td className="py-3 text-sm text-gray-600">05/02/2026</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileSpreadsheet className="h-4 w-4" />
                      Excel
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <Button size="sm" variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
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