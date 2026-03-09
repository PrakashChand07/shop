import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { IndianRupee, Calendar, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "./ui/separator";
import { staff } from "../lib/mockData";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface PaySalaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaySalaryDialog({ open, onOpenChange }: PaySalaryDialogProps) {
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("2026");
  const [paymentMode, setPaymentMode] = useState("bank_transfer");

  const selectedEmployee = staff.find((s) => s.id === selectedStaffId);

  const handlePaySalary = () => {
    if (!selectedStaffId || !month) {
      toast.error("Please select employee and month");
      return;
    }

    toast.success(
      `Salary payment of ₹${selectedEmployee?.netSalary.toLocaleString("en-IN")} processed successfully for ${selectedEmployee?.name}`
    );

    // Reset form
    setSelectedStaffId("");
    setMonth("");
    onOpenChange(false);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-green-600" />
            Pay Salary
          </DialogTitle>
          <DialogDescription>
            Process salary payment for an employee
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Employee Selection */}
          <div className="space-y-2">
            <Label>Select Employee *</Label>
            <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose employee..." />
              </SelectTrigger>
              <SelectContent>
                {staff
                  .filter((s) => s.status === "active")
                  .map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.employeeId} - {employee.name} ({employee.designation})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Month and Year Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Month *</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger>
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Year *</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payment Mode */}
          <div className="space-y-2">
            <Label>Payment Mode *</Label>
            <Select value={paymentMode} onValueChange={setPaymentMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Salary Breakdown */}
          {selectedEmployee && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-gray-700">Salary Breakdown</h3>
              
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {selectedEmployee.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedEmployee.employeeId} - {selectedEmployee.designation}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Active
                      </Badge>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Basic Salary:</span>
                        <span className="font-semibold">
                          {formatCurrency(selectedEmployee.basicSalary)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Allowances:</span>
                        <span className="font-semibold text-green-600">
                          +{formatCurrency(selectedEmployee.allowances)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Deductions:</span>
                        <span className="font-semibold text-red-600">
                          -{formatCurrency(selectedEmployee.deductions)}
                        </span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between text-base">
                        <span className="font-bold text-gray-900">Net Salary:</span>
                        <span className="font-bold text-blue-600 text-lg">
                          {formatCurrency(selectedEmployee.netSalary)}
                        </span>
                      </div>
                    </div>

                    {selectedEmployee.bankAccount && (
                      <div className="pt-2 border-t border-blue-200 mt-2">
                        <p className="text-xs text-gray-600">Bank Account:</p>
                        <p className="text-sm font-medium">{selectedEmployee.bankAccount}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handlePaySalary}
              disabled={!selectedStaffId || !month}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Process Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
