import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { suppliers } from "../lib/mockData";
import { CreatePurchaseDialog } from "../components/CreatePurchaseDialog";

export function Purchase() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Purchase Management
          </h1>
          <p className="text-gray-600">Create and manage purchase orders</p>
        </div>
        <CreatePurchaseDialog />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Create Purchase Order */}
        <Card>
          <CardHeader>
            <CardTitle>Create Purchase Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Supplier</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose supplier..." />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>PO Number</Label>
              <Input type="text" placeholder="PO-2026-001" />
            </div>

            <div className="space-y-2">
              <Label>PO Date</Label>
              <Input type="date" defaultValue="2026-03-07" />
            </div>

            <div className="space-y-2">
              <Label>Expected Delivery Date</Label>
              <Input type="date" />
            </div>

            <Button className="w-full">Add Products</Button>
          </CardContent>
        </Card>

        {/* Recent Purchase Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">PO-2026-00{i}</p>
                    <p className="text-sm text-gray-500">
                      {suppliers[i % suppliers.length].name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(2026, 2, 7 - i).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ₹{(50000 - i * 5000).toLocaleString("en-IN")}
                    </p>
                    <Button size="sm" variant="outline" className="mt-1">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}