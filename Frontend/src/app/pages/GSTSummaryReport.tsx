import {
  ReportDocument,
  ReportSection,
  ReportTable,
  ReportSummary,
} from "../components/ReportDocument";

export function GSTSummaryReport() {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert("PDF download would be implemented here");
  };

  // GST Summary Data
  const gstSales = [
    ["5% GST (Footwear)", "₹4,85,000", "₹24,250"],
    ["12% GST (Sports Shoes)", "₹1,42,000", "₹17,040"],
    ["Total", "₹6,27,000", "₹41,290"],
  ];

  const gstPurchases = [
    ["5% GST (Footwear)", "₹3,20,000", "₹16,000"],
    ["12% GST (Sports Shoes)", "₹95,000", "₹11,400"],
    ["Total", "₹4,15,000", "₹27,400"],
  ];

  const categoryWiseGST = [
    ["Men's Formal Shoes", "6403", "5%", "₹3,18,755", "₹15,938"],
    ["Women's Sandals & Flats", "6405", "5%", "₹1,59,933", "₹7,997"],
    ["Casual Slippers", "6402", "5%", "₹1,12,833", "₹5,642"],
    ["Sports Shoes", "6404", "12%", "₹1,34,866", "₹16,184"],
    ["Kids Footwear", "6403/6405", "5%", "₹48,702", "₹2,435"],
  ];

  const summaryItems = [
    { label: "Total Sales", value: "₹6,27,000" },
    { label: "GST Collected", value: "₹41,290", highlight: true },
    { label: "GST Paid", value: "₹27,400" },
    { label: "Net GST Payable", value: "₹13,890", highlight: true },
  ];

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <h1 className="text-2xl font-semibold text-gray-900">GST Summary Report</h1>
        <p className="text-gray-600">Monthly GST tax summary for compliance</p>
      </div>

      <ReportDocument
        reportType="Tax Compliance"
        reportTitle="GST Summary Report"
        period="March 2026"
        generatedDate="2026-03-07"
        onPrint={handlePrint}
        onDownload={handleDownload}
      >
        {/* Summary Section */}
        <ReportSection title="GST Summary Overview">
          <ReportSummary items={summaryItems} />
        </ReportSection>

        {/* Business Information */}
        <ReportSection title="Business Details">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-700">Business Name:</p>
                <p className="text-gray-900">Anjum Footwear</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">GSTIN:</p>
                <p className="text-gray-900">27AABCA1234F1Z5</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Address:</p>
                <p className="text-gray-900">123, Market Road, Mumbai - 400001</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Tax Period:</p>
                <p className="text-gray-900">March 2026</p>
              </div>
            </div>
          </div>
        </ReportSection>

        {/* GST on Sales */}
        <ReportSection title="GST Collected on Sales (Output Tax)">
          <ReportTable
            columns={[
              { header: "Tax Rate", align: "left" },
              { header: "Taxable Value", align: "right" },
              { header: "GST Amount", align: "right" },
            ]}
            data={gstSales}
          />
        </ReportSection>

        {/* GST on Purchases */}
        <ReportSection title="GST Paid on Purchases (Input Tax Credit)">
          <ReportTable
            columns={[
              { header: "Tax Rate", align: "left" },
              { header: "Taxable Value", align: "right" },
              { header: "GST Amount", align: "right" },
            ]}
            data={gstPurchases}
          />
        </ReportSection>

        {/* Category-wise GST */}
        <ReportSection title="Category-wise GST Breakdown">
          <ReportTable
            columns={[
              { header: "Product Category", align: "left" },
              { header: "HSN Code", align: "left" },
              { header: "GST Rate", align: "center" },
              { header: "Sales Value", align: "right" },
              { header: "GST Amount", align: "right" },
            ]}
            data={categoryWiseGST}
          />
        </ReportSection>

        {/* Net GST Liability */}
        <ReportSection title="Net GST Liability">
          <div className="space-y-4">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Total Output Tax (GST Collected):</span>
                  <span className="font-semibold text-gray-900">₹41,290</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Less: Input Tax Credit (GST Paid):</span>
                  <span className="font-semibold text-gray-900">₹27,400</span>
                </div>
                <div className="border-t-2 border-blue-300 pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Net GST Payable:</span>
                    <span className="font-bold text-blue-600 text-lg">₹13,890</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 text-sm">
              <p className="mb-2 font-semibold text-gray-700">Payment Details:</p>
              <div className="space-y-1 text-gray-600">
                <p>• Due Date: 20th April 2026</p>
                <p>• Payment Method: Online through GST Portal</p>
                <p>• Return Filing: GSTR-3B to be filed by 20th April 2026</p>
              </div>
            </div>
          </div>
        </ReportSection>

        {/* HSN Summary */}
        <ReportSection title="HSN-wise Summary of Outward Supplies">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300 bg-gray-50">
                  <th className="p-3 text-left text-xs font-semibold uppercase text-gray-700">
                    HSN Code
                  </th>
                  <th className="p-3 text-left text-xs font-semibold uppercase text-gray-700">
                    Description
                  </th>
                  <th className="p-3 text-center text-xs font-semibold uppercase text-gray-700">
                    UQC
                  </th>
                  <th className="p-3 text-right text-xs font-semibold uppercase text-gray-700">
                    Total Qty
                  </th>
                  <th className="p-3 text-right text-xs font-semibold uppercase text-gray-700">
                    Taxable Value
                  </th>
                  <th className="p-3 text-right text-xs font-semibold uppercase text-gray-700">
                    Tax Rate
                  </th>
                  <th className="p-3 text-right text-xs font-semibold uppercase text-gray-700">
                    Tax Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium text-gray-900">6403</td>
                  <td className="p-3 text-gray-600">Leather Footwear</td>
                  <td className="p-3 text-center text-gray-600">PRS</td>
                  <td className="p-3 text-right text-gray-900">245</td>
                  <td className="p-3 text-right text-gray-900">₹3,67,457</td>
                  <td className="p-3 text-right text-gray-600">5%</td>
                  <td className="p-3 text-right text-gray-900">₹18,373</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium text-gray-900">6405</td>
                  <td className="p-3 text-gray-600">Other Footwear</td>
                  <td className="p-3 text-center text-gray-600">PRS</td>
                  <td className="p-3 text-right text-gray-900">454</td>
                  <td className="p-3 text-right text-gray-900">₹2,08,635</td>
                  <td className="p-3 text-right text-gray-600">5%</td>
                  <td className="p-3 text-right text-gray-900">₹10,432</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium text-gray-900">6402</td>
                  <td className="p-3 text-gray-600">Rubber/Plastic Footwear</td>
                  <td className="p-3 text-center text-gray-600">PRS</td>
                  <td className="p-3 text-right text-gray-900">567</td>
                  <td className="p-3 text-right text-gray-900">₹1,12,833</td>
                  <td className="p-3 text-right text-gray-600">5%</td>
                  <td className="p-3 text-right text-gray-900">₹5,642</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium text-gray-900">6404</td>
                  <td className="p-3 text-gray-600">Textile Upper Footwear</td>
                  <td className="p-3 text-center text-gray-600">PRS</td>
                  <td className="p-3 text-right text-gray-900">134</td>
                  <td className="p-3 text-right text-gray-900">₹1,34,866</td>
                  <td className="p-3 text-right text-gray-600">12%</td>
                  <td className="p-3 text-right text-gray-900">₹16,184</td>
                </tr>
                <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                  <td className="p-3 text-gray-900" colSpan={3}>
                    Total
                  </td>
                  <td className="p-3 text-right text-gray-900">1,400</td>
                  <td className="p-3 text-right text-gray-900">₹8,23,791</td>
                  <td className="p-3"></td>
                  <td className="p-3 text-right text-gray-900">₹50,631</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ReportSection>

        {/* Compliance Notes */}
        <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-sm">
          <p className="font-semibold text-yellow-900 mb-2">⚠️ Important Notes:</p>
          <ul className="space-y-1 text-yellow-800">
            <li>• Ensure GSTR-1 is filed by 11th April 2026</li>
            <li>• GSTR-3B to be filed by 20th April 2026</li>
            <li>• Payment of GST liability to be made before filing GSTR-3B</li>
            <li>• Maintain proper invoices and records as per GST Act</li>
            <li>• Reconcile input tax credit with GSTR-2A/2B</li>
          </ul>
        </div>

        {/* Declaration */}
        <div className="mt-6 text-xs text-gray-600">
          <p className="font-semibold">Declaration:</p>
          <p className="mt-1">
            I hereby declare that the information given in this report is true and correct
            to the best of my knowledge and belief and nothing has been concealed or held
            therefrom.
          </p>
        </div>
      </ReportDocument>
    </div>
  );
}
