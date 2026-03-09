import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Download, FileText, Calendar, FileJson, FileSpreadsheet } from "lucide-react";
import { Badge } from "../components/ui/badge";
import * as XLSX from "xlsx";
import { toast } from "sonner";

export function GSTReports() {
  const gstReports = [
    {
      id: "1",
      type: "GSTR-1",
      period: "February 2026",
      status: "Filed",
      amount: 45000,
      filedDate: "2026-03-05",
    },
    {
      id: "2",
      type: "GSTR-3B",
      period: "February 2026",
      status: "Filed",
      amount: 38000,
      filedDate: "2026-03-05",
    },
    {
      id: "3",
      type: "GSTR-1",
      period: "January 2026",
      status: "Filed",
      amount: 42000,
      filedDate: "2026-02-08",
    },
    {
      id: "4",
      type: "GSTR-3B",
      period: "January 2026",
      status: "Filed",
      amount: 35000,
      filedDate: "2026-02-08",
    },
  ];

  const gstSummaryData = [
    {
      rate: "5%",
      taxableAmount: 45000,
      cgst: 1125,
      sgst: 1125,
      totalGst: 2250,
    },
    {
      rate: "12%",
      taxableAmount: 120000,
      cgst: 7200,
      sgst: 7200,
      totalGst: 14400,
    },
    {
      rate: "18%",
      taxableAmount: 85000,
      cgst: 7650,
      sgst: 7650,
      totalGst: 15300,
    },
    {
      rate: "Total",
      taxableAmount: 250000,
      cgst: 15975,
      sgst: 15975,
      totalGst: 31950,
    },
  ];

  // Download GST Summary as JSON
  const downloadJSON = () => {
    const reportData = {
      businessName: "Anjum Footwear",
      gstin: "27AABCA1234F1Z5",
      reportGeneratedDate: new Date().toLocaleDateString("en-IN"),
      reportPeriod: "March 2026",
      summary: {
        totalGSTCollected: 124500,
        inputTaxCredit: 68200,
        netGSTPayable: 56300,
      },
      gstByRate: gstSummaryData,
      filingHistory: gstReports,
    };

    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `GST_Report_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("GST Report downloaded as JSON");
  };

  // Download GST Summary as Excel
  const downloadExcel = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Sheet 1: Summary
    const summaryData = [
      ["Anjum Footwear - GST Report"],
      ["GSTIN: 27AABCA1234F1Z5"],
      [`Report Period: March 2026`],
      [`Generated Date: ${new Date().toLocaleDateString("en-IN")}`],
      [],
      ["Summary"],
      ["Description", "Amount (₹)"],
      ["Total GST Collected", 124500],
      ["Input Tax Credit", 68200],
      ["Net GST Payable", 56300],
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws1, "Summary");

    // Sheet 2: GST by Rate
    const gstRateData = [
      ["GST Summary by Rate"],
      [],
      ["GST Rate", "Taxable Amount", "CGST", "SGST", "Total GST"],
    ];
    gstSummaryData.forEach((item) => {
      gstRateData.push([
        item.rate,
        item.taxableAmount,
        item.cgst,
        item.sgst,
        item.totalGst,
      ]);
    });
    const ws2 = XLSX.utils.aoa_to_sheet(gstRateData);
    XLSX.utils.book_append_sheet(wb, ws2, "GST by Rate");

    // Sheet 3: Filing History
    const filingData = [
      ["Filing History"],
      [],
      ["Return Type", "Period", "Status", "Amount", "Filed Date"],
    ];
    gstReports.forEach((report) => {
      filingData.push([
        report.type,
        report.period,
        report.status,
        report.amount,
        new Date(report.filedDate).toLocaleDateString("en-IN"),
      ]);
    });
    const ws3 = XLSX.utils.aoa_to_sheet(filingData);
    XLSX.utils.book_append_sheet(wb, ws3, "Filing History");

    // Generate Excel file and download
    XLSX.writeFile(wb, `GST_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
    toast.success("GST Report downloaded as Excel");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">GST Reports</h1>
        <p className="text-gray-600">
          Generate and manage GST returns and reports
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total GST Collected</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  ₹1,24,500
                </p>
                <p className="mt-1 text-xs text-gray-500">This Month</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Input Tax Credit</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  ₹68,200
                </p>
                <p className="mt-1 text-xs text-gray-500">This Month</p>
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
                <p className="text-sm text-gray-600">Net GST Payable</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  ₹56,300
                </p>
                <p className="mt-1 text-xs text-gray-500">This Month</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Generate GST Return</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Return Type</Label>
              <select className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                <option>GSTR-1</option>
                <option>GSTR-3B</option>
                <option>GSTR-9</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Month</Label>
              <Input type="month" defaultValue="2026-03" />
            </div>
            <div className="flex items-end">
              <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                <FileText className="h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GST Reports History */}
      <Card>
        <CardHeader>
          <CardTitle>Filing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Return Type
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Period
                  </th>
                  <th className="pb-3 text-center text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Filed Date
                  </th>
                  <th className="pb-3 text-center text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {gstReports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-100">
                    <td className="py-3 text-sm font-medium text-gray-900">
                      {report.type}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {report.period}
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-700 hover:bg-green-200"
                      >
                        {report.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right text-sm font-medium text-gray-900">
                      ₹{report.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {new Date(report.filedDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3 text-center">
                      <Button size="sm" variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* GST Summary */}
      <Card>
        <CardHeader>
          <CardTitle>GST Summary by Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    GST Rate
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-600">
                    Taxable Amount
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-600">
                    CGST
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-600">
                    SGST
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-600">
                    Total GST
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-sm font-medium text-gray-900">5%</td>
                  <td className="py-3 text-right text-sm text-gray-900">
                    ₹45,000
                  </td>
                  <td className="py-3 text-right text-sm text-gray-900">
                    ₹1,125
                  </td>
                  <td className="py-3 text-right text-sm text-gray-900">
                    ₹1,125
                  </td>
                  <td className="py-3 text-right text-sm font-medium text-gray-900">
                    ₹2,250
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-sm font-medium text-gray-900">12%</td>
                  <td className="py-3 text-right text-sm text-gray-900">
                    ₹1,20,000
                  </td>
                  <td className="py-3 text-right text-sm text-gray-900">
                    ₹7,200
                  </td>
                  <td className="py-3 text-right text-sm text-gray-900">
                    ₹7,200
                  </td>
                  <td className="py-3 text-right text-sm font-medium text-gray-900">
                    ₹14,400
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-sm font-medium text-gray-900">18%</td>
                  <td className="py-3 text-right text-sm text-gray-900">
                    ₹85,000
                  </td>
                  <td className="py-3 text-right text-sm text-gray-900">
                    ₹7,650
                  </td>
                  <td className="py-3 text-right text-sm text-gray-900">
                    ₹7,650
                  </td>
                  <td className="py-3 text-right text-sm font-medium text-gray-900">
                    ₹15,300
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 text-sm font-semibold text-gray-900">
                    Total
                  </td>
                  <td className="py-3 text-right text-sm font-semibold text-gray-900">
                    ₹2,50,000
                  </td>
                  <td className="py-3 text-right text-sm font-semibold text-gray-900">
                    ₹15,975
                  </td>
                  <td className="py-3 text-right text-sm font-semibold text-gray-900">
                    ₹15,975
                  </td>
                  <td className="py-3 text-right text-sm font-semibold text-blue-600">
                    ₹31,950
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Download Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Download Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={downloadJSON}
            >
              <FileJson className="h-4 w-4" />
              Download as JSON
            </Button>
            <Button
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={downloadExcel}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Download as Excel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}