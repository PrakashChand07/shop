import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Printer, Download } from "lucide-react";

interface ReportDocumentProps {
  reportType: string;
  reportTitle: string;
  period: string;
  generatedDate: string;
  children: React.ReactNode;
  onPrint?: () => void;
  onDownload?: () => void;
}

export function ReportDocument({
  reportType,
  reportTitle,
  period,
  generatedDate,
  children,
  onPrint,
  onDownload,
}: ReportDocumentProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      {/* Action Buttons */}
      <div className="flex justify-end gap-2 print:hidden">
        <Button variant="outline" size="sm" onClick={onPrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print Report
        </Button>
        <Button variant="outline" size="sm" onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Report Document */}
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="mb-8 border-b border-gray-300 pb-6">
          <div className="mb-6">
            <Logo size="lg" />
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2 text-sm text-gray-600">
              <p className="font-semibold text-gray-900 text-lg">Anjum Footwear</p>
              <p>123, Market Road, Mumbai - 400001</p>
              <p>Phone: +91 98765 43210</p>
              <p>Email: info@anjumfootwear.com</p>
              <p>GSTIN: 27AABCA1234F1Z5</p>
            </div>
            
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900 uppercase">
                {reportTitle}
              </h1>
              <div className="mt-4 space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-semibold">Report Type:</span> {reportType}
                </p>
                <p>
                  <span className="font-semibold">Period:</span> {period}
                </p>
                <p>
                  <span className="font-semibold">Generated:</span> {formatDate(generatedDate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="space-y-6">{children}</div>

        {/* Footer */}
        <div className="mt-12 border-t border-gray-300 pt-6">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <p>© 2026 Anjum Footwear. All rights reserved.</p>
            <p>Page 1 of 1</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Report Section Component
interface ReportSectionProps {
  title: string;
  children: React.ReactNode;
}

export function ReportSection({ title, children }: ReportSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}

// Report Table Component
interface ReportTableColumn {
  header: string;
  align?: "left" | "right" | "center";
}

interface ReportTableProps {
  columns: ReportTableColumn[];
  data: (string | number)[][];
  showTotal?: boolean;
  totalLabel?: string;
}

export function ReportTable({ columns, data, showTotal, totalLabel = "Total" }: ReportTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-300 bg-gray-50">
            {columns.map((col, index) => (
              <th
                key={index}
                className={`p-3 text-xs font-semibold uppercase text-gray-700 ${
                  col.align === "right"
                    ? "text-right"
                    : col.align === "center"
                    ? "text-center"
                    : "text-left"
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-200">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`p-3 text-sm ${
                    columns[cellIndex].align === "right"
                      ? "text-right"
                      : columns[cellIndex].align === "center"
                      ? "text-center"
                      : "text-left"
                  } ${
                    cellIndex === 0 ? "font-medium text-gray-900" : "text-gray-600"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
          {showTotal && (
            <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
              <td className="p-3 text-sm text-gray-900">{totalLabel}</td>
              {Array(columns.length - 1)
                .fill(null)
                .map((_, index) => (
                  <td key={index} className="p-3 text-sm text-gray-900"></td>
                ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Report Summary Box Component
interface SummaryItem {
  label: string;
  value: string;
  highlight?: boolean;
}

interface ReportSummaryProps {
  items: SummaryItem[];
}

export function ReportSummary({ items }: ReportSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((item, index) => (
        <div
          key={index}
          className={`rounded-lg border p-4 ${
            item.highlight
              ? "border-blue-200 bg-blue-50"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <p className="text-xs font-medium text-gray-600 uppercase">{item.label}</p>
          <p
            className={`mt-2 text-xl font-bold ${
              item.highlight ? "text-blue-600" : "text-gray-900"
            }`}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
