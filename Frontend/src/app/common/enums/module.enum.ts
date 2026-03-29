export enum ModuleName {
  DASHBOARD = "Dashboard",
  SALES = "Sales",
  INVOICE = "Invoice",
  PURCHASE = "Purchase",
  INVENTORY = "Inventory",
  CATEGORY = "Category",
  CUSTOMER = "Customer",
  SUPPLIER = "Supplier",
  STAFF = "Staff",
  ROLE = "Role & Permission",
  ACCOUNTING = "Accounting",
  GST_REPORT = "GST Report",
  EWAY_BILL = "E-Way Bill",
  WHATSAPP = "WhatsApp Automation",
  PAYMENT = "Payment",
  REPORT = "Report",
  SETTING = "Setting",
}

export interface IModulePermission {
  module: ModuleName | string;
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  isVisible: boolean;
}

export const generateDefaultPermissions = (): IModulePermission[] => {
  return Object.values(ModuleName).map((module) => ({
    module,
    canRead: true,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    isVisible: true,
  }));
};
