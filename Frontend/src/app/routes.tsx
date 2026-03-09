import { createBrowserRouter, Navigate } from "react-router";
import { MainLayout } from "./components/MainLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";
import { Sales } from "./pages/Sales";
import { Purchase } from "./pages/Purchase";
import { Inventory } from "./pages/Inventory";
import { Customers } from "./pages/Customers";
import { Suppliers } from "./pages/Suppliers";
import { Accounting } from "./pages/Accounting";
import { GSTReports } from "./pages/GSTReports";
import { WhatsAppAutomation } from "./pages/WhatsAppAutomation";
import { Payments } from "./pages/Payments";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { SalesReport } from "./pages/SalesReport";
import { StockReport } from "./pages/StockReport";
import { InvoicePreview } from "./pages/InvoicePreview";
import { GSTSummaryReport } from "./pages/GSTSummaryReport";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { EWayBills } from "./pages/EWayBills";
import { Staff } from "./pages/Staff";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: "sales", Component: Sales },
      { path: "invoice-preview", Component: InvoicePreview },
      { path: "purchase", Component: Purchase },
      { path: "inventory", Component: Inventory },
      { path: "customers", Component: Customers },
      { path: "suppliers", Component: Suppliers },
      { path: "staff", Component: Staff },
      { path: "accounting", Component: Accounting },
      { path: "gst-reports", Component: GSTReports },
      { path: "eway-bills", Component: EWayBills },
      { path: "whatsapp", Component: WhatsAppAutomation },
      { path: "payments", Component: Payments },
      { path: "reports", Component: Reports },
      { path: "reports/sales", Component: SalesReport },
      { path: "reports/stock", Component: StockReport },
      { path: "reports/gst", Component: GSTSummaryReport },
      { path: "settings", Component: Settings },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);