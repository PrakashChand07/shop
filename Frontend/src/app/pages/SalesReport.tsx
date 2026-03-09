import {
  ReportDocument,
  ReportSection,
  ReportTable,
  ReportSummary,
} from "../components/ReportDocument";

export function SalesReport() {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    alert("PDF download would be implemented here");
  };

  // Sample sales data
  const salesByCategory = [
    ["Men's Formal Shoes", "245", "₹3,18,755"],
    ["Women's Sandals", "189", "₹1,13,211"],
    ["Casual Slippers", "567", "₹1,12,833"],
    ["Sports Shoes", "134", "₹1,34,866"],
    ["Kids Footwear", "98", "₹48,702"],
  ];

  const topProducts = [
    ["Bata Men's Formal Shoes", "89", "₹1,15,611"],
    ["Relaxo Hawaii Slippers", "125", "₹24,875"],
    ["Campus Men's Sports Shoes", "67", "₹66,933"],
    ["Liberty Women's Sandals", "78", "₹46,722"],
    ["Paragon Kids School Shoes", "54", "₹26,946"],
  ];

  const dailySales = [
    ["01 Mar 2026", "45", "₹28,450"],
    ["02 Mar 2026", "52", "₹34,780"],
    ["03 Mar 2026", "38", "₹26,890"],
    ["04 Mar 2026", "61", "₹42,120"],
    ["05 Mar 2026", "48", "₹31,560"],
    ["06 Mar 2026", "55", "₹38,900"],
    ["07 Mar 2026", "34", "₹24,850"],
  ];

  const summaryItems = [
    { label: "Total Sales", value: "₹5,89,000", highlight: true },
    { label: "Total Invoices", value: "333" },
    { label: "Avg. Invoice Value", value: "₹1,769" },
    { label: "Total GST Collected", value: "₹41,230" },
  ];

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <h1 className="text-2xl font-semibold text-gray-900">Sales Report</h1>
        <p className="text-gray-600">Monthly sales analysis and performance</p>
      </div>

      <ReportDocument
        reportType="Sales Analysis"
        reportTitle="Monthly Sales Report"
        period="March 2026"
        generatedDate="2026-03-07"
        onPrint={handlePrint}
        onDownload={handleDownload}
      >
        {/* Summary Section */}
        <ReportSection title="Summary Overview">
          <ReportSummary items={summaryItems} />
        </ReportSection>

        {/* Sales by Category */}
        <ReportSection title="Sales by Category">
          <ReportTable
            columns={[
              { header: "Category", align: "left" },
              { header: "Units Sold", align: "right" },
              { header: "Revenue", align: "right" },
            ]}
            data={salesByCategory}
          />
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-gray-700">
                Total Category Sales:
              </span>
              <span className="font-bold text-gray-900">₹7,28,367</span>
            </div>
          </div>
        </ReportSection>

        {/* Top Selling Products */}
        <ReportSection title="Top 5 Selling Products">
          <ReportTable
            columns={[
              { header: "Product Name", align: "left" },
              { header: "Quantity", align: "right" },
              { header: "Revenue", align: "right" },
            ]}
            data={topProducts}
          />
        </ReportSection>

        {/* Daily Sales Trend */}
        <ReportSection title="Daily Sales Trend">
          <ReportTable
            columns={[
              { header: "Date", align: "left" },
              { header: "Invoices", align: "right" },
              { header: "Amount", align: "right" },
            ]}
            data={dailySales}
          />
        </ReportSection>

        {/* Payment Status */}
        <ReportSection title="Payment Status">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-medium text-green-700">Paid</p>
              <p className="mt-2 text-2xl font-bold text-green-600">₹4,67,000</p>
              <p className="mt-1 text-xs text-green-600">79.3% of total</p>
            </div>
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <p className="text-sm font-medium text-orange-700">Pending</p>
              <p className="mt-2 text-2xl font-bold text-orange-600">₹1,22,000</p>
              <p className="mt-1 text-xs text-orange-600">20.7% of total</p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-700">Total</p>
              <p className="mt-2 text-2xl font-bold text-blue-600">₹5,89,000</p>
              <p className="mt-1 text-xs text-blue-600">100%</p>
            </div>
          </div>
        </ReportSection>

        {/* Notes */}
        <div className="rounded-lg bg-blue-50 p-4 text-sm">
          <p className="font-semibold text-blue-900">Notes:</p>
          <ul className="mt-2 space-y-1 text-blue-700">
            <li>• Sales showing 12.5% growth compared to February 2026</li>
            <li>• Casual Slippers category has highest volume but lower margins</li>
            <li>• Men's Formal Shoes generating highest revenue per unit</li>
            <li>• Weekend sales averaging 15% higher than weekdays</li>
          </ul>
        </div>
      </ReportDocument>
    </div>
  );
}
