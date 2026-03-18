import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { UserPlus, Calculator } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "./ui/separator";
import api from "../api/axios";
import { useEffect } from "react";

interface AddStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffToEdit?: any;
  onAddStaff?: () => void;
}

export function AddStaffDialog({ open, onOpenChange, staffToEdit, onAddStaff }: AddStaffDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    aadhaarNumber: "",
    designation: "",
    department: "",
    joiningDate: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    ifscCode: "",
    panNumber: "",
    address: "",
  });

  useEffect(() => {
    if (open) {
      if (staffToEdit) {
        setFormData({
          name: staffToEdit.name || "",
          phone: staffToEdit.phone || "",
          email: staffToEdit.email || "",
          aadhaarNumber: staffToEdit.aadhaarNumber || "",
          designation: staffToEdit.designation || "",
          department: staffToEdit.department || "",
          joiningDate: staffToEdit.joiningDate ? new Date(staffToEdit.joiningDate).toISOString().split('T')[0] : "",
          basicSalary: staffToEdit.basicSalary?.toString() || "",
          allowances: staffToEdit.allowances?.toString() || "",
          deductions: staffToEdit.deductions?.toString() || "",
          bankName: staffToEdit.bankDetails?.bankName || "",
          accountName: staffToEdit.bankDetails?.accountName || "",
          accountNumber: staffToEdit.bankDetails?.accountNumber || "",
          ifscCode: staffToEdit.bankDetails?.ifscCode || "",
          panNumber: staffToEdit.panNumber || "",
          address: staffToEdit.address || "",
        });
      } else {
        setFormData({
          name: "", phone: "", email: "", aadhaarNumber: "", designation: "", department: "",
          joiningDate: "", basicSalary: "", allowances: "", deductions: "",
          bankName: "", accountName: "", accountNumber: "", ifscCode: "", panNumber: "", address: "",
        });
      }
    }
  }, [open, staffToEdit]);

  const calculateNetSalary = () => {
    const basic = parseFloat(formData.basicSalary) || 0;
    const allowances = parseFloat(formData.allowances) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    return basic + allowances - deductions;
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.phone || !formData.designation || !formData.basicSalary) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
        const payload = {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            aadhaarNumber: formData.aadhaarNumber,
            designation: formData.designation,
            department: formData.department,
            joiningDate: formData.joiningDate || new Date(),
            basicSalary: Number(formData.basicSalary),
            allowances: Number(formData.allowances) || 0,
            deductions: Number(formData.deductions) || 0,
            bankDetails: {
                bankName: formData.bankName,
                accountName: formData.accountName,
                accountNumber: formData.accountNumber,
                ifscCode: formData.ifscCode,
            },
            panNumber: formData.panNumber,
            address: formData.address,
        };

        if (staffToEdit) {
            await api.put(`/staff/${staffToEdit._id}`, payload);
            toast.success("Staff updated successfully!");
        } else {
            const res = await api.post("/staff", payload);
            toast.success(`Staff added successfully! Employee ID: ${res.data.data.employeeId}`);
        }
        
        if (onAddStaff) onAddStaff();
        onOpenChange(false);
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to save staff record");
    }
  };

  const departments = [
    "Operations",
    "Sales",
    "Finance",
    "HR",
    "Logistics",
    "IT",
    "Marketing",
    "General",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            {staffToEdit ? "Edit Staff Member" : "Add New Staff Member"}
          </DialogTitle>
          <DialogDescription>
            {staffToEdit ? "Update employee details" : "Enter employee details to add a new staff member"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Personal Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-700">Personal Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="employee@anjumfootwear.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
             
              <div className="space-y-2">
                <Label htmlFor="panNumber">PAN Number</Label>
                <Input
                  id="panNumber"
                  value={formData.panNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })
                  }
                  placeholder="ABCPS1234D"
                  className="font-mono"
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="aadhaarNumber">Aadhaar Card Number</Label>
                <Input
                  id="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, aadhaarNumber: e.target.value })
                  }
                  placeholder="1234 5678 9012"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Complete address"
              />
            </div>
          </div>

          <Separator />

          {/* Employment Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-700">Employment Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="designation">Designation *</Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                  placeholder="e.g., Sales Executive"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    setFormData({ ...formData, department: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="joiningDate">Joining Date *</Label>
                <Input
                  id="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) =>
                    setFormData({ ...formData, joiningDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="pt-2">
              <h4 className="font-medium text-xs text-gray-500 mb-3 uppercase tracking-wider">Bank Details</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    placeholder="e.g. HDFC Bank"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Holder Name</Label>
                  <Input
                    id="accountName"
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                    placeholder="e.g. John Doe"
                  />
                </div>
              </div>
               <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    placeholder="e.g. 50100200300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ifscCode">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    value={formData.ifscCode}
                    onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                    placeholder="e.g. HDFC0001234"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Salary Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Salary Details
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basicSalary">Basic Salary *</Label>
                <Input
                  id="basicSalary"
                  type="number"
                  value={formData.basicSalary}
                  onChange={(e) =>
                    setFormData({ ...formData, basicSalary: e.target.value })
                  }
                  placeholder="25000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allowances">Allowances</Label>
                <Input
                  id="allowances"
                  type="number"
                  value={formData.allowances}
                  onChange={(e) =>
                    setFormData({ ...formData, allowances: e.target.value })
                  }
                  placeholder="5000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deductions">Deductions</Label>
                <Input
                  id="deductions"
                  type="number"
                  value={formData.deductions}
                  onChange={(e) =>
                    setFormData({ ...formData, deductions: e.target.value })
                  }
                  placeholder="1000"
                />
              </div>
            </div>

            {/* Net Salary Display */}
            <div className="rounded-lg bg-blue-50 border-2 border-blue-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Net Salary (Monthly):</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{calculateNetSalary().toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Basic + Allowances - Deductions
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
              <UserPlus className="h-4 w-4 mr-2" />
              {staffToEdit ? "Save Changes" : "Add Staff"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
