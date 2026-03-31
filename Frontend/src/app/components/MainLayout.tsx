import { ReactNode, useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router";
import {
  LayoutDashboard,
  ShoppingCart,
  ShoppingBag,
  Tags,
  Package,
  Users,
  Building2,
  Calculator,
  FileText,
  MessageSquare,
  CreditCard,
  BarChart3,
  Settings as SettingsIcon,
  Search,
  Bell,
  Menu,
  X,
  User,
  Plus,
  LogOut,
  FileBarChart,
  Truck,
  UserCog,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from "../context/AuthContext";
import { useIndustry } from "../context/IndustryContext";
import { ModuleName } from "../common/enums/module.enum";

const navigation = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard, requiredModule: ModuleName.DASHBOARD },
  { name: "Sales", path: "/sales", icon: ShoppingCart, requiredModule: ModuleName.SALES },
  { name: "Invoices", path: "/invoices", icon: FileText, requiredModule: ModuleName.INVOICE },
  { name: "Purchase", path: "/purchase", icon: Package, requiredModule: ModuleName.PURCHASE },
  { name: "Inventory", path: "/inventory", icon: ShoppingBag, requiredModule: ModuleName.INVENTORY },
  { name: "Categories", path: "/categories", icon: Tags, requiredModule: ModuleName.CATEGORY },
  { name: "Customers", path: "/customers", icon: Users, requiredModule: ModuleName.CUSTOMER },
  { name: "Suppliers", path: "/suppliers", icon: Building2, requiredModule: ModuleName.SUPPLIER },
  { name: "Staff", path: "/staff", icon: UserCog, requiredModule: ModuleName.STAFF },
  { name: "Roles", path: "/roles", icon: KeyRound, requiredModule: ModuleName.ROLE },
  { name: "Permissions", path: "/permissions", icon: ShieldCheck, requiredModule: ModuleName.ROLE },
  { name: "Accounting", path: "/accounting", icon: Calculator, requiredModule: ModuleName.ACCOUNTING },
  // { name: "GST Reports", path: "/gst-reports", icon: FileText, requiredModule: ModuleName.GST_REPORT },
  // { name: "E-Way Bills", path: "/eway-bills", icon: FileBarChart, requiredModule: ModuleName.EWAY_BILL },
  // { name: "WhatsApp Automation", path: "/whatsapp", icon: MessageSquare, requiredModule: ModuleName.WHATSAPP },
  { name: "Payments", path: "/payments", icon: CreditCard, requiredModule: ModuleName.PAYMENT },
  { name: "Reports", path: "/reports", icon: BarChart3, requiredModule: ModuleName.REPORT },
  { name: "Settings", path: "/settings", icon: SettingsIcon, requiredModule: ModuleName.SETTING },
];

export function MainLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { isPharmacy, isFootwear, industryType } = useIndustry();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-gray-200 px-6">
            <Logo size="md" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navigation.map((item) => {
              // ─── PERMISSION CHECK ───
              if (user?.role === "staff") {
                // If it's a staff member, we must find a permission record, or else deny access by default
                let perm = user.permissions?.find((p) => p.module === item.requiredModule);

                // Fallback for old database records before the 17-module expansion
                if (!perm) {
                  const fallbackMap: Record<string, string> = {
                    [ModuleName.STAFF]: "User",
                    [ModuleName.ROLE]: "Role",
                    [ModuleName.SALES]: "Order",
                    [ModuleName.INVOICE]: "Order",
                    [ModuleName.PURCHASE]: "Order",
                    [ModuleName.INVENTORY]: "Product",
                  };
                  const oldName = fallbackMap[item.requiredModule];
                  if (oldName) {
                    perm = user.permissions?.find((p) => p.module === oldName);
                  }
                }

                if (perm) {
                  // If all accesses are explicitly false, or the module is manually hidden
                  const hasZeroAccess =
                    !perm.canRead && !perm.canCreate && !perm.canUpdate && !perm.canDelete;
                  
                  if (hasZeroAccess || !perm.isVisible) {
                    return null; // Don't render this sidebar link
                  }
                }
              }

              const isActive =
                location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(item.path));
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.company?.name || "Accounting & Billing"}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="inline-flex items-center bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize border border-blue-200">
                     {industryType}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Navigation */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
            {/* <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button> */}

            {/* <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search invoices, products, customers..."
                className="pl-10"
              />
            </div> */}

            {/* <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
              </Button>

              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div> */}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}