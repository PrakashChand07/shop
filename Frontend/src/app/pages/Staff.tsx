import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Search,
  Users,
  Plus,
  Eye,
  Edit,
  Trash2,
  IndianRupee,
  UserCheck,
  UserX,
  Calendar,
  Filter,
  Download,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { AddStaffDialog } from "../components/AddStaffDialog";
import { PaySalaryDialog } from "../components/PaySalaryDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export function Staff() {
  const [staff, setStaff] = useState<any[]>([]);
  const [salaryPayments, setSalaryPayments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");
  const [salaryMonthFilter, setSalaryMonthFilter] = useState("all");
  const [salaryYearFilter, setSalaryYearFilter] = useState(new Date().getFullYear().toString());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPaySalaryDialog, setShowPaySalaryDialog] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<any>(null);

  const fetchStaff = async () => {
    try {
      const res = await api.get("/staff");
      setStaff(res.data.data);
    } catch (error) {
      toast.error("Failed to load staff list");
    }
  };

  const fetchSalaryPayments = async () => {
    try {
      const res = await api.get("/salary");
      setSalaryPayments(res.data.data);
    } catch (error) {
      toast.error("Failed to load salary payments");
    }
  };

  const filteredSalaryPayments = salaryPayments.filter((payment) => {
    const matchesMonth = salaryMonthFilter === "all" || payment.month === salaryMonthFilter;
    const matchesYear = salaryYearFilter === "all" || payment.year.toString() === salaryYearFilter;
    return matchesMonth && matchesYear;
  });

  useEffect(() => {
    fetchStaff();
    fetchSalaryPayments();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      try {
        await api.delete(`/staff/${id}`);
        toast.success("Staff deleted successfully");
        fetchStaff();
      } catch (error) {
        toast.error("Failed to delete staff");
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await api.patch(`/staff/${id}/toggle-status`);
      toast.success("Staff status updated");
      fetchStaff();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredStaff = staff.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.designation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      departmentFilter === "all" || employee.department === departmentFilter;

    const matchesStatus =
      statusFilter === "all" || (statusFilter === "active" ? employee.isActive : !employee.isActive);

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 cursor-pointer" title="Click to disable">
        <UserCheck className="h-3 w-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 cursor-pointer" title="Click to enable">
        <UserX className="h-3 w-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "hold":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Hold
          </Badge>
        );
      default:
        return null;
    }
  };

  // Calculate statistics
  const activeStaff = staff.filter((e) => e.isActive).length;
  const totalMonthlySalary = staff
    .filter((e) => e.isActive)
    .reduce((sum, employee) => sum + (employee.netSalary || 0), 0);
  const pendingPayments = salaryPayments.filter((p) => p.status === "pending").length;
  const departments = Array.from(new Set(staff.map((s) => s.department)));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">
            Manage employees and calculate salaries
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              setStaffToEdit(null);
              setShowAddDialog(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setShowPaySalaryDialog(true)}
          >
            <IndianRupee className="h-4 w-4 mr-2" />
            Pay Salary
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-2xl font-semibold mt-1">{staff.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Staff</p>
                <p className="text-2xl font-semibold mt-1">{activeStaff}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Salary</p>
                <p className="text-2xl font-semibold mt-1">
                  {formatCurrency(totalMonthlySalary)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <IndianRupee className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Payments</p>
                <p className="text-2xl font-semibold mt-1">{pendingPayments}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="staff" className="space-y-4">
        <TabsList>
          <TabsTrigger value="staff">Staff List</TabsTrigger>
          <TabsTrigger value="payments">Salary Payments</TabsTrigger>
        </TabsList>

        {/* Staff List Tab */}
        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Records</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search by name, ID, or designation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Staff Table */}
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Joining Date</TableHead>
                      <TableHead className="text-right">Net Salary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          No staff found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStaff.map((employee) => (
                        <TableRow key={employee._id}>
                          <TableCell className="font-mono font-semibold">
                            {employee.employeeId}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{employee.name}</p>
                              <p className="text-xs text-gray-500">{employee.phone}</p>
                            </div>
                          </TableCell>
                          <TableCell>{employee.designation}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{employee.department}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(employee.joiningDate)}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(employee.netSalary)}
                          </TableCell>
                          <TableCell>
                            <div onClick={() => handleToggleStatus(employee._id)}>
                              {getStatusBadge(employee.isActive)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => {
                                setStaffToEdit(employee);
                                setShowAddDialog(true);
                              }}>
                                <Edit className="h-4 w-4 text-blue-600" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(employee._id)}>
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Salary Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle>Salary Payment History</CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={salaryMonthFilter} onValueChange={setSalaryMonthFilter}>
                    <SelectTrigger className="w-[130px]">
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Months</SelectItem>
                      <SelectItem value="January">January</SelectItem>
                      <SelectItem value="February">February</SelectItem>
                      <SelectItem value="March">March</SelectItem>
                      <SelectItem value="April">April</SelectItem>
                      <SelectItem value="May">May</SelectItem>
                      <SelectItem value="June">June</SelectItem>
                      <SelectItem value="July">July</SelectItem>
                      <SelectItem value="August">August</SelectItem>
                      <SelectItem value="September">September</SelectItem>
                      <SelectItem value="October">October</SelectItem>
                      <SelectItem value="November">November</SelectItem>
                      <SelectItem value="December">December</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={salaryYearFilter} onValueChange={setSalaryYearFilter}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Month/Year</TableHead>
                      <TableHead className="text-right">Basic</TableHead>
                      <TableHead className="text-right">Allowances</TableHead>
                      <TableHead className="text-right">Deductions</TableHead>
                      <TableHead className="text-right">Net Salary</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSalaryPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                          No salary payments found for selected criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSalaryPayments.map((payment) => (
                        <TableRow key={payment._id}>
                        <TableCell className="font-mono">
                          {payment.employeeId}
                        </TableCell>
                        <TableCell className="font-medium">
                          {payment.staffName}
                        </TableCell>
                        <TableCell>
                          {payment.month} {payment.year}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(payment.basicSalary)}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          +{formatCurrency(payment.allowances || 0)}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          -{formatCurrency(payment.deductions || 0)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(payment.netSalary)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(payment.paymentDate)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {payment.paymentMode.replace("_", " ")}
                          </Badge>
                          {payment.transactionId && (
                            <div className="text-[10px] text-gray-500 mt-1">
                              Txn: {payment.transactionId}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                      </TableRow>
                    ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddStaffDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
        staffToEdit={staffToEdit}
        onAddStaff={fetchStaff}
      />
      <PaySalaryDialog
        open={showPaySalaryDialog}
        onOpenChange={setShowPaySalaryDialog}
        staffList={staff}
        salaryPayments={salaryPayments}
        onPaymentProcessed={fetchSalaryPayments}
      />
    </div>
  );
}
