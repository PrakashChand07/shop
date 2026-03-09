import {
  ReportDocument,
  ReportSection,
  ReportTable,
  ReportSummary,
} from "../components/ReportDocument";
import { products } from "../lib/mockData";

export function StockReport() {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert("PDF download would be implemented here");
  };

  // Calculate stock value
  const totalStockValue = products.reduce(
    (total, product) => total + product.stock * product.purchasePrice,
    0
  );

  const totalStockQty = products.reduce((total, product) => total + product.stock, 0);

  const lowStockItems = products.filter(
    (product) => product.stock <= product.lowStockAlert
  );

  // Prepare stock data
  const stockData = products.map((product) => [
    product.name,
    product.sku,
    product.hsnCode,
    product.stock.toString(),
    `₹${product.purchasePrice.toLocaleString("en-IN")}`,
    `₹${(product.stock * product.purchasePrice).toLocaleString("en-IN")}`,
    product.stock <= product.lowStockAlert ? "Low Stock" : "In Stock",
  ]);

  // Category-wise stock
  const categoryStock = [
    ["Men's Formal Shoes", "125", "₹1,18,750"],
    ["Women's Sandals & Flats", "218", "₹98,200"],
    ["Casual Slippers", "430", "₹64,500"],
    ["Sports Shoes", "142", "₹1,65,200"],
    ["Kids Footwear", "260", "₹78,000"],
    ["Boots & Heels", "80", "₹1,84,000"],
  ];

  const summaryItems = [
    { label: "Total Products", value: products.length.toString() },
    { label: "Total Stock Qty", value: totalStockQty.toString() },
    {
      label: "Stock Value",
      value: `₹${totalStockValue.toLocaleString("en-IN")}`,
      highlight: true,
    },
    { label: "Low Stock Items", value: lowStockItems.length.toString() },
  ];

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <h1 className="text-2xl font-semibold text-gray-900">Stock Report</h1>
        <p className="text-gray-600">Current inventory levels and valuation</p>
      </div>

      <ReportDocument
        reportType="Inventory Analysis"
        reportTitle="Stock Report"
        period="As on 07 March 2026"
        generatedDate="2026-03-07"
        onPrint={handlePrint}
        onDownload={handleDownload}
      >
        {/* Summary Section */}
        <ReportSection title="Stock Summary">
          <ReportSummary items={summaryItems} />
        </ReportSection>

        {/* Category-wise Stock */}
        <ReportSection title="Category-wise Stock">
          <ReportTable
            columns={[
              { header: "Category", align: "left" },
              { header: "Total Units", align: "right" },
              { header: "Stock Value", align: "right" },
            ]}
            data={categoryStock}
          />
        </ReportSection>

        {/* Detailed Stock List */}
        <ReportSection title="Detailed Stock List">
          <ReportTable
            columns={[
              { header: "Product Name", align: "left" },
              { header: "SKU", align: "left" },
              { header: "HSN Code", align: "left" },
              { header: "Qty", align: "right" },
              { header: "Rate", align: "right" },
              { header: "Value", align: "right" },
              { header: "Status", align: "center" },
            ]}
            data={stockData}
          />
        </ReportSection>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <ReportSection title="Low Stock Alert">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="mb-3 font-semibold text-red-900">
                ⚠️ Items Requiring Immediate Reorder:
              </p>
              <div className="space-y-2">
                {lowStockItems.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-red-800">
                      <span className="font-medium">{product.name}</span> (SKU:{" "}
                      {product.sku})
                    </span>
                    <span className="rounded-full bg-red-100 px-3 py-1 font-medium text-red-700">
                      Stock: {product.stock} | Alert: {product.lowStockAlert}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ReportSection>
        )}

        {/* Stock Health */}
        <ReportSection title="Stock Health Indicators">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm font-medium text-gray-600">Fast Moving Items</p>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                <li>• Relaxo Hawaii Slippers</li>
                <li>• Paragon Kids School Shoes</li>
                <li>• Liberty Women's Sandals</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm font-medium text-gray-600">Slow Moving Items</p>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                <li>• Red Chief Leather Boots</li>
                <li>• Metro Women's Heels</li>
                <li>• Woodland Adventure Shoes</li>
              </ul>
            </div>
          </div>
        </ReportSection>

        {/* Recommendations */}
        <div className="rounded-lg bg-blue-50 p-4 text-sm">
          <p className="font-semibold text-blue-900">Recommendations:</p>
          <ul className="mt-2 space-y-1 text-blue-700">
            <li>• Place urgent order for {lowStockItems.length} low stock items</li>
            <li>• Consider promotional offers on slow-moving premium items</li>
            <li>• Increase stock of casual slippers before peak season</li>
            <li>• Review pricing strategy for high-value inventory items</li>
          </ul>
        </div>
      </ReportDocument>
    </div>
  );
}
