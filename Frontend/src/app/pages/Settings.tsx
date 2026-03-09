import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { Building2, User, Bell, Printer, Database } from "lucide-react";

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your business and app settings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <CardTitle>Business Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Business Name</Label>
              <Input defaultValue="Anjum Footwear" />
            </div>

            <div className="space-y-2">
              <Label>Business Type</Label>
              <select className="w-full rounded-md border border-gray-300 px-3 py-2">
                <option>Footwear Retail</option>
                <option>Footwear Wholesale</option>
                <option>Footwear Distribution</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" defaultValue="info@anjumfootwear.com" />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input type="tel" defaultValue="+91 98765 43210" />
            </div>

            <div className="space-y-2">
              <Label>GST Number</Label>
              <Input defaultValue="27AABCA1234F1Z5" />
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Input defaultValue="123, Market Road, Mumbai - 400001" />
            </div>
            <Button className="w-full">Save Changes</Button>
          </CardContent>
        </Card>

        {/* User Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              <CardTitle>User Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input type="text" defaultValue="Rahul Kumar" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" defaultValue="rahul@email.com" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input type="text" defaultValue="+91 98765 43210" />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input type="password" placeholder="Enter current password" />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" placeholder="Enter new password" />
            </div>
            <Button className="w-full">Update Profile</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <CardTitle>Notification Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Low Stock Alerts</Label>
                <p className="text-sm text-gray-500">
                  Get notified when products are low
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Payment Reminders</Label>
                <p className="text-sm text-gray-500">
                  Notify about pending payments
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-500">
                  Receive reports via email
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>WhatsApp Notifications</Label>
                <p className="text-sm text-gray-500">
                  Get updates on WhatsApp
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Printer Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Printer className="h-5 w-5 text-blue-600" />
              <CardTitle>Printer & Invoice Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Invoice Prefix</Label>
              <Input type="text" defaultValue="INV" />
            </div>
            <div className="space-y-2">
              <Label>Invoice Footer Note</Label>
              <Input
                type="text"
                defaultValue="Thank you for your business!"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Print Invoice</Label>
                <p className="text-sm text-gray-500">
                  Print automatically after generation
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Company Logo</Label>
                <p className="text-sm text-gray-500">
                  Display logo on invoices
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Paper Size</Label>
              <select className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                <option>A4</option>
                <option>A5</option>
                <option>Thermal (80mm)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Backup & Data */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              <CardTitle>Backup & Data Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Last Backup</Label>
                <p className="text-sm text-gray-600">07/03/2026, 10:30 AM</p>
                <Button variant="outline" className="w-full">
                  Backup Now
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Export Data</Label>
                <p className="text-sm text-gray-600">
                  Download all business data
                </p>
                <Button variant="outline" className="w-full">
                  Export to Excel
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Import Data</Label>
                <p className="text-sm text-gray-600">
                  Import products, customers
                </p>
                <Button variant="outline" className="w-full">
                  Import from Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}