import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { MessageSquare, Bell, Clock } from "lucide-react";
import { customers } from "../lib/mockData";

export function WhatsAppAutomation() {
  const overdueCustomers = customers.filter((c) => c.pendingAmount > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          WhatsApp Automation
        </h1>
        <p className="text-gray-600">
          Automate payment reminders and notifications
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Automation Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Reminder Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Automatic Reminders</Label>
                <p className="text-sm text-gray-500">
                  Send automated payment reminders to customers
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="space-y-4 rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900">Reminder Schedule</h3>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      3 Days Before Due
                    </p>
                    <p className="text-xs text-gray-500">First reminder</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      7 Days After Due
                    </p>
                    <p className="text-xs text-gray-500">Follow-up reminder</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      15 Days After Due
                    </p>
                    <p className="text-xs text-gray-500">Final reminder</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div className="space-y-0.5">
                <Label>Send Invoice on WhatsApp</Label>
                <p className="text-sm text-gray-500">
                  Auto-send invoices after generation
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div className="space-y-0.5">
                <Label>Payment Confirmation Messages</Label>
                <p className="text-sm text-gray-500">
                  Send thank you message after payment
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Pending Reminders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pending Payment Reminders</CardTitle>
              <Badge className="bg-orange-100 text-orange-700">
                {overdueCustomers.length} Overdue
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overdueCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-start justify-between rounded-lg border border-gray-200 p-3"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.phone}</p>
                    <p className="mt-1 text-sm font-medium text-red-600">
                      Pending: ₹{customer.pendingAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Send Reminder
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Message Templates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-4 w-4 text-blue-600" />
              <Label>Payment Reminder Template</Label>
            </div>
            <p className="text-sm text-gray-600 rounded bg-gray-50 p-3">
              Dear [Customer Name], <br />
              <br />
              This is a friendly reminder that you have a pending payment of ₹
              [Amount] for invoice [Invoice Number].
              <br />
              <br />
              Please make the payment at your earliest convenience. Thank you!
              <br />
              <br />- [Business Name]
            </p>
            <Button size="sm" variant="outline" className="mt-2">
              Edit Template
            </Button>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-green-600" />
              <Label>Invoice Sharing Template</Label>
            </div>
            <p className="text-sm text-gray-600 rounded bg-gray-50 p-3">
              Dear [Customer Name], <br />
              <br />
              Thank you for your purchase! Please find your invoice attached.
              <br />
              Invoice Number: [Invoice Number]
              <br />
              Amount: ₹[Amount]
              <br />
              <br />
              For any queries, feel free to contact us.
              <br />
              <br />- [Business Name]
            </p>
            <Button size="sm" variant="outline" className="mt-2">
              Edit Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
