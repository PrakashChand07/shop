// Mock data for the application - Footwear Business

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  lowStockAlert: number;
  hsnCode: string;
  size?: string;
  brand?: string;
  gst: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalPurchases: number;
  pendingAmount: number;
  address?: string;
  gstNumber?: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalPurchases: number;
  pendingAmount: number;
  gstNumber?: string;
  address?: string;
}

export interface Transaction {
  id: string;
  date: string;
  customerName: string;
  amount: number;
  status: 'paid' | 'pending' | 'partial';
  invoiceNumber: string;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  gst: number;
  discount: number;
  hsnCode: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  customerId: string;
  items: InvoiceItem[];
  subtotal: number;
  gstAmount: number;
  discount: number;
  total: number;
  status: 'paid' | 'pending';
}

// HSN Codes for Footwear:
// 6401 - Waterproof footwear
// 6402 - Other footwear with outer soles and uppers of rubber or plastics
// 6403 - Footwear with outer soles of rubber/plastics/leather and uppers of leather
// 6404 - Footwear with outer soles of rubber/plastics and uppers of textile materials
// 6405 - Other footwear (slippers, sandals, etc.)

export const products: Product[] = [
  {
    id: '1',
    name: 'Bata Men\'s Formal Shoes',
    sku: 'SHOE001',
    barcode: '8901010101010',
    category: 'Men\'s Formal Shoes',
    brand: 'Bata',
    size: '7-10',
    purchasePrice: 800,
    sellingPrice: 1299,
    stock: 45,
    lowStockAlert: 15,
    hsnCode: '6403',
    gst: 5,
  },
  {
    id: '2',
    name: 'Liberty Women\'s Sandals',
    sku: 'SAND001',
    barcode: '8901010101011',
    category: 'Women\'s Sandals',
    brand: 'Liberty',
    size: '5-8',
    purchasePrice: 350,
    sellingPrice: 599,
    stock: 68,
    lowStockAlert: 20,
    hsnCode: '6405',
    gst: 5,
  },
  {
    id: '3',
    name: 'Relaxo Hawaii Slippers',
    sku: 'SLIP001',
    barcode: '8901010101012',
    category: 'Casual Slippers',
    brand: 'Relaxo',
    size: '6-11',
    purchasePrice: 120,
    sellingPrice: 199,
    stock: 250,
    lowStockAlert: 50,
    hsnCode: '6402',
    gst: 5,
  },
  {
    id: '4',
    name: 'Campus Men\'s Sports Shoes',
    sku: 'SHOE002',
    barcode: '8901010101013',
    category: 'Men\'s Sports Shoes',
    brand: 'Campus',
    size: '7-11',
    purchasePrice: 600,
    sellingPrice: 999,
    stock: 35,
    lowStockAlert: 15,
    hsnCode: '6404',
    gst: 12,
  },
  {
    id: '5',
    name: 'Paragon Kids School Shoes',
    sku: 'SHOE003',
    barcode: '8901010101014',
    category: 'Kids Shoes',
    brand: 'Paragon',
    size: '1-5',
    purchasePrice: 300,
    sellingPrice: 499,
    stock: 120,
    lowStockAlert: 30,
    hsnCode: '6403',
    gst: 5,
  },
  {
    id: '6',
    name: 'Action Ladies Belly Shoes',
    sku: 'SHOE004',
    barcode: '8901010101015',
    category: 'Women\'s Formal Shoes',
    brand: 'Action',
    size: '5-8',
    purchasePrice: 400,
    sellingPrice: 699,
    stock: 55,
    lowStockAlert: 20,
    hsnCode: '6403',
    gst: 5,
  },
  {
    id: '7',
    name: 'Sparx Men\'s Casual Shoes',
    sku: 'SHOE005',
    barcode: '8901010101016',
    category: 'Men\'s Casual Shoes',
    brand: 'Sparx',
    size: '7-10',
    purchasePrice: 550,
    sellingPrice: 899,
    stock: 42,
    lowStockAlert: 15,
    hsnCode: '6404',
    gst: 12,
  },
  {
    id: '8',
    name: 'Lakhani Gents Slippers',
    sku: 'SLIP002',
    barcode: '8901010101017',
    category: 'Casual Slippers',
    brand: 'Lakhani',
    size: '6-10',
    purchasePrice: 180,
    sellingPrice: 299,
    stock: 180,
    lowStockAlert: 40,
    hsnCode: '6402',
    gst: 5,
  },
  {
    id: '9',
    name: 'Red Chief Leather Boots',
    sku: 'BOOT001',
    barcode: '8901010101018',
    category: 'Men\'s Boots',
    brand: 'Red Chief',
    size: '7-11',
    purchasePrice: 1500,
    sellingPrice: 2499,
    stock: 20,
    lowStockAlert: 10,
    hsnCode: '6403',
    gst: 12,
  },
  {
    id: '10',
    name: 'VKC Pride Ladies Flats',
    sku: 'FLAT001',
    barcode: '8901010101019',
    category: 'Women\'s Flats',
    brand: 'VKC Pride',
    size: '5-8',
    purchasePrice: 250,
    sellingPrice: 429,
    stock: 95,
    lowStockAlert: 25,
    hsnCode: '6405',
    gst: 5,
  },
  {
    id: '11',
    name: 'Woodland Adventure Shoes',
    sku: 'SHOE006',
    barcode: '8901010101020',
    category: 'Men\'s Adventure Shoes',
    brand: 'Woodland',
    size: '7-11',
    purchasePrice: 1200,
    sellingPrice: 1999,
    stock: 28,
    lowStockAlert: 12,
    hsnCode: '6403',
    gst: 12,
  },
  {
    id: '12',
    name: 'Khadim\'s Formal Shoes',
    sku: 'SHOE007',
    barcode: '8901010101021',
    category: 'Men\'s Formal Shoes',
    brand: 'Khadim\'s',
    size: '7-10',
    purchasePrice: 700,
    sellingPrice: 1149,
    stock: 38,
    lowStockAlert: 15,
    hsnCode: '6403',
    gst: 5,
  },
  {
    id: '13',
    name: 'Asian Running Shoes',
    sku: 'SHOE008',
    barcode: '8901010101022',
    category: 'Men\'s Sports Shoes',
    brand: 'Asian',
    size: '7-11',
    purchasePrice: 550,
    sellingPrice: 899,
    stock: 65,
    lowStockAlert: 20,
    hsnCode: '6404',
    gst: 12,
  },
  {
    id: '14',
    name: 'Metro Women\'s Heels',
    sku: 'HEEL001',
    barcode: '8901010101023',
    category: 'Women\'s Heels',
    brand: 'Metro',
    size: '5-8',
    purchasePrice: 800,
    sellingPrice: 1399,
    stock: 32,
    lowStockAlert: 15,
    hsnCode: '6403',
    gst: 12,
  },
  {
    id: '15',
    name: 'Flite Kids Sandals',
    sku: 'SAND002',
    barcode: '8901010101024',
    category: 'Kids Sandals',
    brand: 'Flite',
    size: '1-5',
    purchasePrice: 200,
    sellingPrice: 349,
    stock: 140,
    lowStockAlert: 35,
    hsnCode: '6405',
    gst: 5,
  },
];

export const customers: Customer[] = [
  {
    id: '1',
    name: 'Footstyle Retail Store',
    phone: '+91 98765 43210',
    email: 'footstyle.retail@email.com',
    totalPurchases: 145000,
    pendingAmount: 15000,
    address: 'Shop 12, Commercial Complex, MG Road, Mumbai',
    gstNumber: '27AABCF1234R1Z5',
  },
  {
    id: '2',
    name: 'Shoe Palace',
    phone: '+91 98765 43211',
    email: 'shoepalace@email.com',
    totalPurchases: 98000,
    pendingAmount: 0,
    address: 'A-23, Gandhi Market, Delhi',
    gstNumber: '07AABCS5678R1Z1',
  },
  {
    id: '3',
    name: 'Step Up Footwear',
    phone: '+91 98765 43212',
    email: 'stepup.footwear@email.com',
    totalPurchases: 187000,
    pendingAmount: 22000,
    address: '45, Nehru Chowk, Ahmedabad',
    gstNumber: '24AABCS9012R1Z3',
  },
  {
    id: '4',
    name: 'Fashion Feet Hub',
    phone: '+91 98765 43213',
    email: 'fashionfeet@email.com',
    totalPurchases: 76000,
    pendingAmount: 8000,
    address: '78, KPHB Colony, Hyderabad',
    gstNumber: '36AABCF3456R1Z7',
  },
  {
    id: '5',
    name: 'King Shoes Emporium',
    phone: '+91 98765 43214',
    email: 'kingshoes@email.com',
    totalPurchases: 132000,
    pendingAmount: 0,
    address: 'B-12, Civil Lines, Jaipur',
    gstNumber: '08AABCK7890R1Z9',
  },
  {
    id: '6',
    name: 'Walk Well Footwear',
    phone: '+91 98765 43215',
    email: 'walkwell@email.com',
    totalPurchases: 65000,
    pendingAmount: 5000,
    address: '34, Park Street, Kolkata',
    gstNumber: '19AABCW2345R1Z2',
  },
  {
    id: '7',
    name: 'Trendy Shoes Corner',
    phone: '+91 98765 43216',
    email: 'trendyshoes@email.com',
    totalPurchases: 54000,
    pendingAmount: 12000,
    address: '56, Brigade Road, Bangalore',
    gstNumber: '29AABCT6789R1Z4',
  },
  {
    id: '8',
    name: 'Comfort Walk Store',
    phone: '+91 98765 43217',
    email: 'comfortwalk@email.com',
    totalPurchases: 89000,
    pendingAmount: 0,
    address: '12, Station Road, Pune',
    gstNumber: '27AABCC1234R1Z6',
  },
];

export const suppliers: Supplier[] = [
  {
    id: '1',
    name: 'Bata India Limited',
    phone: '+91 98765 11111',
    email: 'sales@bata.com',
    totalPurchases: 850000,
    pendingAmount: 85000,
    gstNumber: '27AAACB0950D1ZF',
    address: '27/B Camac Street, Kolkata - 700016',
  },
  {
    id: '2',
    name: 'Relaxo Footwears Ltd',
    phone: '+91 98765 22222',
    email: 'info@relaxofootwear.com',
    totalPurchases: 720000,
    pendingAmount: 0,
    gstNumber: '07AAACR3066N1ZT',
    address: '1, Community Centre, Naraina, Delhi - 110028',
  },
  {
    id: '3',
    name: 'Liberty Shoes Limited',
    phone: '+91 98765 33333',
    email: 'contact@libertyshoes.com',
    totalPurchases: 580000,
    pendingAmount: 45000,
    gstNumber: '10AAACL5267M1Z1',
    address: 'Liberty Compound, Karnal Road, Karnal - 132001',
  },
  {
    id: '4',
    name: 'Action Shoes Distributors',
    phone: '+91 98765 44444',
    email: 'sales@actionshoes.com',
    totalPurchases: 420000,
    pendingAmount: 32000,
    gstNumber: '07AABCA5678R1Z5',
    address: '45, Industrial Area, Faridabad - 121003',
  },
  {
    id: '5',
    name: 'Campus Activewear Ltd',
    phone: '+91 98765 55555',
    email: 'distributor@campusshoes.com',
    totalPurchases: 650000,
    pendingAmount: 0,
    gstNumber: '07AABCC8765R1Z8',
    address: 'C-43, Sector 59, Noida - 201301',
  },
  {
    id: '6',
    name: 'Paragon Footwear Suppliers',
    phone: '+91 98765 66666',
    email: 'orders@paragonfootwear.com',
    totalPurchases: 380000,
    pendingAmount: 28000,
    gstNumber: '32AABCP4321R1Z3',
    address: 'Industrial Estate, Ernakulam, Kerala - 682030',
  },
  {
    id: '7',
    name: 'Sparx Footwear Distribution',
    phone: '+91 98765 77777',
    email: 'info@sparxdistribution.com',
    totalPurchases: 490000,
    pendingAmount: 40000,
    gstNumber: '07AABCS9876R1Z2',
    address: 'Plot 67, Gurgaon Industrial Area - 122001',
  },
];

export const transactions: Transaction[] = [
  {
    id: '1',
    date: '2026-03-07',
    customerName: 'Footstyle Retail Store',
    amount: 12450,
    status: 'paid',
    invoiceNumber: 'INV-2026-001',
  },
  {
    id: '2',
    date: '2026-03-07',
    customerName: 'Shoe Palace',
    amount: 8590,
    status: 'paid',
    invoiceNumber: 'INV-2026-002',
  },
  {
    id: '3',
    date: '2026-03-07',
    customerName: 'Step Up Footwear',
    amount: 24800,
    status: 'pending',
    invoiceNumber: 'INV-2026-003',
  },
  {
    id: '4',
    date: '2026-03-06',
    customerName: 'Fashion Feet Hub',
    amount: 6780,
    status: 'paid',
    invoiceNumber: 'INV-2026-004',
  },
  {
    id: '5',
    date: '2026-03-06',
    customerName: 'King Shoes Emporium',
    amount: 18200,
    status: 'partial',
    invoiceNumber: 'INV-2026-005',
  },
  {
    id: '6',
    date: '2026-03-06',
    customerName: 'Walk Well Footwear',
    amount: 15400,
    status: 'paid',
    invoiceNumber: 'INV-2026-006',
  },
  {
    id: '7',
    date: '2026-03-05',
    customerName: 'Trendy Shoes Corner',
    amount: 9820,
    status: 'paid',
    invoiceNumber: 'INV-2026-007',
  },
  {
    id: '8',
    date: '2026-03-05',
    customerName: 'Comfort Walk Store',
    amount: 22100,
    status: 'pending',
    invoiceNumber: 'INV-2026-008',
  },
  {
    id: '9',
    date: '2026-03-04',
    customerName: 'Footstyle Retail Store',
    amount: 16900,
    status: 'paid',
    invoiceNumber: 'INV-2026-009',
  },
  {
    id: '10',
    date: '2026-03-04',
    customerName: 'Step Up Footwear',
    amount: 19500,
    status: 'paid',
    invoiceNumber: 'INV-2026-010',
  },
];

export const salesData = [
  { month: 'Sep', sales: 245000, id: 'sep-2025' },
  { month: 'Oct', sales: 282000, id: 'oct-2025' },
  { month: 'Nov', sales: 268000, id: 'nov-2025' },
  { month: 'Dec', sales: 321000, id: 'dec-2025' },
  { month: 'Jan', sales: 295000, id: 'jan-2026' },
  { month: 'Feb', sales: 308000, id: 'feb-2026' },
  { month: 'Mar', sales: 189000, id: 'mar-2026' },
];

// GST vs Non-GST Sales Statistics
export const salesStats = {
  today: {
    gstSales: 18650,
    nonGstSales: 6200,
    totalTax: 2985,
    gstInvoices: 12,
    nonGstInvoices: 5,
  },
  monthly: {
    gstSales: 412300,
    nonGstSales: 176700,
    totalTax: 65968,
    gstInvoices: 285,
    nonGstInvoices: 98,
  },
  yearly: {
    gstSales: 5247800,
    nonGstSales: 1894200,
    totalTax: 839648,
    gstInvoices: 3420,
    nonGstInvoices: 1180,
  },
};

export const inventoryData = [
  { name: 'Men\'s Shoes', value: 35, id: 'cat-mens-shoes' },
  { name: 'Women\'s Shoes', value: 28, id: 'cat-womens-shoes' },
  { name: 'Slippers', value: 20, id: 'cat-slippers' },
  { name: 'Sports Shoes', value: 12, id: 'cat-sports' },
  { name: 'Kids Footwear', value: 5, id: 'cat-kids' },
];

// E-Way Bill Interface
export interface EWayBill {
  id: string;
  ewayBillNumber: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceValue: number;
  supplierName: string;
  supplierGSTIN: string;
  supplierAddress: string;
  buyerName: string;
  buyerGSTIN: string;
  buyerAddress: string;
  transporterName: string;
  vehicleNumber: string;
  transportMode: string;
  placeOfDispatch: string;
  deliveryAddress: string;
  hsnCode: string;
  validUntil: string;
  status: 'active' | 'cancelled' | 'expired';
}

// E-Way Bill Mock Data
export const ewayBills: EWayBill[] = [
  {
    id: '1',
    ewayBillNumber: '351234567890',
    invoiceNumber: 'INV-2026-001',
    invoiceDate: '2026-03-05',
    invoiceValue: 75000,
    supplierName: 'Anjum Footwear',
    supplierGSTIN: '27AABCA1234F1Z5',
    supplierAddress: '123, Market Road, Mumbai - 400001',
    buyerName: 'Footstyle Retail Store',
    buyerGSTIN: '27AABCF1234R1Z5',
    buyerAddress: 'Shop 12, Commercial Complex, MG Road, Mumbai',
    transporterName: 'BlueDart Express',
    vehicleNumber: 'MH02AB1234',
    transportMode: 'Road',
    placeOfDispatch: 'Mumbai, Maharashtra',
    deliveryAddress: 'Shop 12, Commercial Complex, MG Road, Mumbai - 400023',
    hsnCode: '6403',
    validUntil: '2026-03-12',
    status: 'active',
  },
  {
    id: '2',
    ewayBillNumber: '351234567891',
    invoiceNumber: 'INV-2026-015',
    invoiceDate: '2026-03-06',
    invoiceValue: 128000,
    supplierName: 'Anjum Footwear',
    supplierGSTIN: '27AABCA1234F1Z5',
    supplierAddress: '123, Market Road, Mumbai - 400001',
    buyerName: 'Step Up Footwear',
    buyerGSTIN: '24AABCS9012R1Z3',
    buyerAddress: '45, Nehru Chowk, Ahmedabad',
    transporterName: 'DTDC Courier',
    vehicleNumber: 'GJ01CD5678',
    transportMode: 'Road',
    placeOfDispatch: 'Mumbai, Maharashtra',
    deliveryAddress: '45, Nehru Chowk, Satellite, Ahmedabad - 380015',
    hsnCode: '6403',
    validUntil: '2026-03-13',
    status: 'active',
  },
  {
    id: '3',
    ewayBillNumber: '351234567892',
    invoiceNumber: 'INV-2026-022',
    invoiceDate: '2026-03-04',
    invoiceValue: 95500,
    supplierName: 'Anjum Footwear',
    supplierGSTIN: '27AABCA1234F1Z5',
    supplierAddress: '123, Market Road, Mumbai - 400001',
    buyerName: 'King Shoes Emporium',
    buyerGSTIN: '08AABCK7890R1Z9',
    buyerAddress: 'B-12, Civil Lines, Jaipur',
    transporterName: 'Mahindra Logistics',
    vehicleNumber: 'RJ14EF9012',
    transportMode: 'Road',
    placeOfDispatch: 'Mumbai, Maharashtra',
    deliveryAddress: 'B-12, Civil Lines, Jaipur - 302006',
    hsnCode: '6404',
    validUntil: '2026-03-11',
    status: 'active',
  },
  {
    id: '4',
    ewayBillNumber: '351234567893',
    invoiceNumber: 'INV-2026-018',
    invoiceDate: '2026-02-28',
    invoiceValue: 62000,
    supplierName: 'Anjum Footwear',
    supplierGSTIN: '27AABCA1234F1Z5',
    supplierAddress: '123, Market Road, Mumbai - 400001',
    buyerName: 'Fashion Feet Hub',
    buyerGSTIN: '36AABCF3456R1Z7',
    buyerAddress: '78, KPHB Colony, Hyderabad',
    transporterName: 'VRL Logistics',
    vehicleNumber: 'TS09GH3456',
    transportMode: 'Road',
    placeOfDispatch: 'Mumbai, Maharashtra',
    deliveryAddress: '78, KPHB Colony, Kukatpally, Hyderabad - 500072',
    hsnCode: '6403',
    validUntil: '2026-03-07',
    status: 'expired',
  },
  {
    id: '5',
    ewayBillNumber: '351234567894',
    invoiceNumber: 'INV-2026-012',
    invoiceDate: '2026-03-02',
    invoiceValue: 58000,
    supplierName: 'Anjum Footwear',
    supplierGSTIN: '27AABCA1234F1Z5',
    supplierAddress: '123, Market Road, Mumbai - 400001',
    buyerName: 'Comfort Walk Store',
    buyerGSTIN: '27AABCC1234R1Z6',
    buyerAddress: '12, Station Road, Pune',
    transporterName: 'Gati-KWE',
    vehicleNumber: 'MH12IJ7890',
    transportMode: 'Road',
    placeOfDispatch: 'Mumbai, Maharashtra',
    deliveryAddress: '12, Station Road, Shivajinagar, Pune - 411005',
    hsnCode: '6405',
    validUntil: '2026-03-09',
    status: 'cancelled',
  },
  {
    id: '6',
    ewayBillNumber: '351234567895',
    invoiceNumber: 'INV-2026-025',
    invoiceDate: '2026-03-07',
    invoiceValue: 145000,
    supplierName: 'Anjum Footwear',
    supplierGSTIN: '27AABCA1234F1Z5',
    supplierAddress: '123, Market Road, Mumbai - 400001',
    buyerName: 'Shoe Palace',
    buyerGSTIN: '07AABCS5678R1Z1',
    buyerAddress: 'A-23, Gandhi Market, Delhi',
    transporterName: 'Delhivery',
    vehicleNumber: 'DL3CKL1234',
    transportMode: 'Road',
    placeOfDispatch: 'Mumbai, Maharashtra',
    deliveryAddress: 'A-23, Gandhi Market, Karol Bagh, Delhi - 110005',
    hsnCode: '6403',
    validUntil: '2026-03-14',
    status: 'active',
  },
];

// Staff/Employee Interface
export interface Staff {
  id: string;
  name: string;
  employeeId: string;
  phone: string;
  email: string;
  designation: string;
  department: string;
  joiningDate: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  bankAccount?: string;
  panNumber?: string;
  address?: string;
  status: 'active' | 'inactive';
}

// Salary Payment Interface
export interface SalaryPayment {
  id: string;
  staffId: string;
  staffName: string;
  employeeId: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paymentDate: string;
  paymentMode: 'bank_transfer' | 'cash' | 'cheque';
  status: 'paid' | 'pending' | 'hold';
  remarks?: string;
}

// Staff Mock Data
export const staff: Staff[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    employeeId: 'EMP001',
    phone: '+91 98765 11001',
    email: 'rahul.sharma@anjumfootwear.com',
    designation: 'Store Manager',
    department: 'Operations',
    joiningDate: '2024-01-15',
    basicSalary: 35000,
    allowances: 8000,
    deductions: 2000,
    netSalary: 41000,
    bankAccount: 'HDFC Bank - 1234567890',
    panNumber: 'ABCPS1234D',
    address: 'Andheri West, Mumbai - 400058',
    status: 'active',
  },
  {
    id: '2',
    name: 'Priya Patel',
    employeeId: 'EMP002',
    phone: '+91 98765 11002',
    email: 'priya.patel@anjumfootwear.com',
    designation: 'Sales Executive',
    department: 'Sales',
    joiningDate: '2024-03-01',
    basicSalary: 22000,
    allowances: 5000,
    deductions: 1200,
    netSalary: 25800,
    bankAccount: 'ICICI Bank - 9876543210',
    panNumber: 'DEFPS5678E',
    address: 'Powai, Mumbai - 400076',
    status: 'active',
  },
  {
    id: '3',
    name: 'Amit Kumar',
    employeeId: 'EMP003',
    phone: '+91 98765 11003',
    email: 'amit.kumar@anjumfootwear.com',
    designation: 'Accountant',
    department: 'Finance',
    joiningDate: '2023-11-10',
    basicSalary: 28000,
    allowances: 6000,
    deductions: 1500,
    netSalary: 32500,
    bankAccount: 'SBI - 5566778899',
    panNumber: 'GHIPS9012F',
    address: 'Borivali East, Mumbai - 400066',
    status: 'active',
  },
  {
    id: '4',
    name: 'Sneha Desai',
    employeeId: 'EMP004',
    phone: '+91 98765 11004',
    email: 'sneha.desai@anjumfootwear.com',
    designation: 'Inventory Manager',
    department: 'Operations',
    joiningDate: '2024-02-20',
    basicSalary: 26000,
    allowances: 5500,
    deductions: 1300,
    netSalary: 30200,
    bankAccount: 'Axis Bank - 1122334455',
    panNumber: 'JKLPS3456G',
    address: 'Vile Parle, Mumbai - 400056',
    status: 'active',
  },
  {
    id: '5',
    name: 'Vikram Singh',
    employeeId: 'EMP005',
    phone: '+91 98765 11005',
    email: 'vikram.singh@anjumfootwear.com',
    designation: 'Sales Executive',
    department: 'Sales',
    joiningDate: '2024-04-15',
    basicSalary: 20000,
    allowances: 4500,
    deductions: 1000,
    netSalary: 23500,
    bankAccount: 'HDFC Bank - 6677889900',
    panNumber: 'MNOPS7890H',
    address: 'Malad West, Mumbai - 400064',
    status: 'active',
  },
  {
    id: '6',
    name: 'Anjali Mehta',
    employeeId: 'EMP006',
    phone: '+91 98765 11006',
    email: 'anjali.mehta@anjumfootwear.com',
    designation: 'Cashier',
    department: 'Finance',
    joiningDate: '2025-01-05',
    basicSalary: 18000,
    allowances: 3000,
    deductions: 800,
    netSalary: 20200,
    bankAccount: 'PNB - 4455667788',
    panNumber: 'PQRPS1122I',
    address: 'Kandivali East, Mumbai - 400101',
    status: 'active',
  },
  {
    id: '7',
    name: 'Rajesh Yadav',
    employeeId: 'EMP007',
    phone: '+91 98765 11007',
    email: 'rajesh.yadav@anjumfootwear.com',
    designation: 'Delivery Executive',
    department: 'Logistics',
    joiningDate: '2023-08-20',
    basicSalary: 16000,
    allowances: 4000,
    deductions: 700,
    netSalary: 19300,
    bankAccount: 'BOB - 9988776655',
    panNumber: 'STUPS3344J',
    address: 'Goregaon West, Mumbai - 400062',
    status: 'active',
  },
  {
    id: '8',
    name: 'Meera Joshi',
    employeeId: 'EMP008',
    phone: '+91 98765 11008',
    email: 'meera.joshi@anjumfootwear.com',
    designation: 'HR Executive',
    department: 'HR',
    joiningDate: '2024-06-01',
    basicSalary: 24000,
    allowances: 5000,
    deductions: 1100,
    netSalary: 27900,
    bankAccount: 'Kotak Bank - 3344556677',
    panNumber: 'VWXPS5566K',
    address: 'Bandra West, Mumbai - 400050',
    status: 'active',
  },
];

// Salary Payments Mock Data
export const salaryPayments: SalaryPayment[] = [
  {
    id: '1',
    staffId: '1',
    staffName: 'Rahul Sharma',
    employeeId: 'EMP001',
    month: 'February',
    year: 2026,
    basicSalary: 35000,
    allowances: 8000,
    deductions: 2000,
    netSalary: 41000,
    paymentDate: '2026-03-01',
    paymentMode: 'bank_transfer',
    status: 'paid',
  },
  {
    id: '2',
    staffId: '2',
    staffName: 'Priya Patel',
    employeeId: 'EMP002',
    month: 'February',
    year: 2026,
    basicSalary: 22000,
    allowances: 5000,
    deductions: 1200,
    netSalary: 25800,
    paymentDate: '2026-03-01',
    paymentMode: 'bank_transfer',
    status: 'paid',
  },
  {
    id: '3',
    staffId: '3',
    staffName: 'Amit Kumar',
    employeeId: 'EMP003',
    month: 'February',
    year: 2026,
    basicSalary: 28000,
    allowances: 6000,
    deductions: 1500,
    netSalary: 32500,
    paymentDate: '2026-03-01',
    paymentMode: 'bank_transfer',
    status: 'paid',
  },
  {
    id: '4',
    staffId: '4',
    staffName: 'Sneha Desai',
    employeeId: 'EMP004',
    month: 'February',
    year: 2026,
    basicSalary: 26000,
    allowances: 5500,
    deductions: 1300,
    netSalary: 30200,
    paymentDate: '2026-03-01',
    paymentMode: 'bank_transfer',
    status: 'paid',
  },
  {
    id: '5',
    staffId: '5',
    staffName: 'Vikram Singh',
    employeeId: 'EMP005',
    month: 'February',
    year: 2026,
    basicSalary: 20000,
    allowances: 4500,
    deductions: 1000,
    netSalary: 23500,
    paymentDate: '2026-03-01',
    paymentMode: 'bank_transfer',
    status: 'paid',
  },
  {
    id: '6',
    staffId: '6',
    staffName: 'Anjali Mehta',
    employeeId: 'EMP006',
    month: 'February',
    year: 2026,
    basicSalary: 18000,
    allowances: 3000,
    deductions: 800,
    netSalary: 20200,
    paymentDate: '2026-03-02',
    paymentMode: 'bank_transfer',
    status: 'paid',
  },
  {
    id: '7',
    staffId: '7',
    staffName: 'Rajesh Yadav',
    employeeId: 'EMP007',
    month: 'February',
    year: 2026,
    basicSalary: 16000,
    allowances: 4000,
    deductions: 700,
    netSalary: 19300,
    paymentDate: '2026-03-02',
    paymentMode: 'cash',
    status: 'paid',
  },
  {
    id: '8',
    staffId: '1',
    staffName: 'Rahul Sharma',
    employeeId: 'EMP001',
    month: 'March',
    year: 2026,
    basicSalary: 35000,
    allowances: 8000,
    deductions: 2000,
    netSalary: 41000,
    paymentDate: '2026-04-01',
    paymentMode: 'bank_transfer',
    status: 'pending',
  },
  {
    id: '9',
    staffId: '2',
    staffName: 'Priya Patel',
    employeeId: 'EMP002',
    month: 'March',
    year: 2026,
    basicSalary: 22000,
    allowances: 5000,
    deductions: 1200,
    netSalary: 25800,
    paymentDate: '2026-04-01',
    paymentMode: 'bank_transfer',
    status: 'pending',
  },
  {
    id: '10',
    staffId: '3',
    staffName: 'Amit Kumar',
    employeeId: 'EMP003',
    month: 'March',
    year: 2026,
    basicSalary: 28000,
    allowances: 6000,
    deductions: 1500,
    netSalary: 32500,
    paymentDate: '2026-04-01',
    paymentMode: 'bank_transfer',
    status: 'pending',
  },
];