import { InvoiceDocument } from "../components/InvoiceDocument";
import { products, customers } from "../lib/mockData";

export function InvoicePreview() {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert("PDF download would be implemented here");
  };

  const handleSend = () => {
    alert("WhatsApp send would be implemented here");
  };

  // Sample invoice data
  const sampleCustomer = customers[0];
  
  const sampleItems = [
    {
      id: "1",
      name: "Bata Men's Formal Shoes",
      hsnCode: "6403",
      quantity: 2,
      price: 1299,
      gst: 5,
      discount: 0,
    },
    {
      id: "2",
      name: "Liberty Women's Sandals",
      hsnCode: "6405",
      quantity: 3,
      price: 599,
      gst: 5,
      discount: 10,
    },
    {
      id: "3",
      name: "Campus Men's Sports Shoes",
      hsnCode: "6404",
      quantity: 1,
      price: 999,
      gst: 12,
      discount: 0,
    },
  ];

  const calculateSubtotal = () => {
    return sampleItems.reduce((total, item) => {
      const itemTotal = item.quantity * item.price;
      const discountAmount = (itemTotal * item.discount) / 100;
      return total + (itemTotal - discountAmount);
    }, 0);
  };

  const calculateGST = () => {
    return sampleItems.reduce((total, item) => {
      const itemTotal = item.quantity * item.price;
      const discountAmount = (itemTotal * item.discount) / 100;
      const taxableAmount = itemTotal - discountAmount;
      return total + (taxableAmount * item.gst) / 100;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const gstAmount = calculateGST();
  const discount = 0;
  const total = subtotal + gstAmount - discount;

  return (
    <div className="space-y-6 pb-8">
      <div className="print:hidden">
        <h1 className="text-2xl font-semibold text-gray-900">Invoice Preview</h1>
        <p className="text-gray-600">Sample invoice document with Anjum Footwear branding</p>
      </div>

      <InvoiceDocument
        invoiceNumber="INV-2026-001"
        date="2026-03-07"
        customerName={sampleCustomer.name}
        customerPhone={sampleCustomer.phone}
        customerAddress={sampleCustomer.address}
        customerGST={sampleCustomer.gstNumber}
        items={sampleItems}
        subtotal={subtotal}
        gstAmount={gstAmount}
        discount={discount}
        total={total}
        onPrint={handlePrint}
        onDownload={handleDownload}
        onSend={handleSend}
      />
    </div>
  );
}