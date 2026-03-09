import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Search,
  FileBarChart,
  Eye,
  Download,
  Printer,
  Filter,
  Calendar,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
} from "lucide-react";
import { ewayBills } from "../lib/mockData";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Separator } from "../components/ui/separator";
import { Label } from "../components/ui/label";
import { EWayBillDialog } from "../components/EWayBillDialog";

export function EWayBills() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEWayBill, setSelectedEWayBill] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredEWayBills = ewayBills.filter((bill) => {
    const matchesSearch =
      bill.ewayBillNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.buyerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || bill.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const selectedBillDetails = ewayBills.find(
    (bill) => bill.id === selectedEWayBill
  );

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            <Clock className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert("E-Way Bill downloaded successfully!");
  };

  // Calculate statistics
  const stats = {
    total: ewayBills.length,
    active: ewayBills.filter((b) => b.status === "active").length,
    totalValue: ewayBills.reduce((sum, bill) => sum + bill.invoiceValue, 0),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">E-Way Bills</h1>
          <p className="text-gray-600">
            Manage GST E-Way Bills for high-value shipments
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create E-Way Bill
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total E-Way Bills</p>
                <p className="text-2xl font-semibold mt-1">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FileBarChart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active E-Way Bills</p>
                <p className="text-2xl font-semibold mt-1">{stats.active}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Shipment Value</p>
                <p className="text-2xl font-semibold mt-1">
                  {formatCurrency(stats.totalValue)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Truck className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>E-Way Bill Records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by EBN, Invoice, or Buyer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* E-Way Bills Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>E-Way Bill No.</TableHead>
                  <TableHead>Invoice No.</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEWayBills.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No E-Way Bills found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEWayBills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell className="font-mono font-semibold">
                        {bill.ewayBillNumber}
                      </TableCell>
                      <TableCell className="font-medium">
                        {bill.invoiceNumber}
                      </TableCell>
                      <TableCell>{formatDate(bill.invoiceDate)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{bill.buyerName}</p>
                          <p className="text-xs text-gray-500">{bill.buyerGSTIN}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Truck className="h-3 w-3 text-gray-400" />
                          {bill.deliveryAddress.split(",")[0]}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(bill.invoiceValue)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          {formatDate(bill.validUntil)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(bill.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedEWayBill(bill.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handlePrint}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDownload}
                          >
                            <Download className="h-4 w-4" />
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

      {/* E-Way Bill Details Dialog */}
      <Dialog
        open={!!selectedEWayBill}
        onOpenChange={() => setSelectedEWayBill(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileBarChart className="h-5 w-5 text-blue-600" />
              E-Way Bill Details
            </DialogTitle>
            <DialogDescription>
              Complete information about the E-Way Bill
            </DialogDescription>
          </DialogHeader>

          {selectedBillDetails && (
            <div className="space-y-4">
              {/* E-Way Bill Number */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">E-Way Bill Number (EBN)</p>
                    <p className="text-3xl font-bold text-blue-700 tracking-wider font-mono">
                      {selectedBillDetails.ewayBillNumber}
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Valid Until: </span>
                        <span className="font-semibold">
                          {formatDate(selectedBillDetails.validUntil)}
                        </span>
                      </div>
                      <div>{getStatusBadge(selectedBillDetails.status)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Details */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Invoice Details</h3>
                    <p className="text-sm text-gray-500">
                      {selectedBillDetails.invoiceNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Invoice Date</p>
                    <p className="font-semibold">
                      {formatDate(selectedBillDetails.invoiceDate)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-gray-500">Supplier Details</Label>
                      <div className="mt-2 space-y-1">
                        <p className="font-semibold">{selectedBillDetails.supplierName}</p>
                        <p className="text-sm text-gray-600">
                          GSTIN: {selectedBillDetails.supplierGSTIN}
                        </p>
                        <p className="text-sm text-gray-500">
                          {selectedBillDetails.supplierAddress}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Transport Details</Label>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">
                          <span className="text-gray-600">Mode: </span>
                          <span className="font-semibold">
                            {selectedBillDetails.transportMode}
                          </span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-600">Transporter: </span>
                          <span className="font-semibold">
                            {selectedBillDetails.transporterName}
                          </span>
                        </p>
                        <p className="text-sm font-mono">
                          <span className="text-gray-600">Vehicle: </span>
                          <span className="font-semibold">
                            {selectedBillDetails.vehicleNumber}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-gray-500">Buyer Details</Label>
                      <div className="mt-2 space-y-1">
                        <p className="font-semibold">{selectedBillDetails.buyerName}</p>
                        <p className="text-sm text-gray-600">
                          GSTIN: {selectedBillDetails.buyerGSTIN}
                        </p>
                        <p className="text-sm text-gray-500">
                          {selectedBillDetails.buyerAddress}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Product Details</Label>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">
                          <span className="text-gray-600">HSN Code: </span>
                          <span className="font-semibold font-mono">
                            {selectedBillDetails.hsnCode}
                          </span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-600">Invoice Value: </span>
                          <span className="font-semibold text-lg">
                            {formatCurrency(selectedBillDetails.invoiceValue)}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Place of Dispatch</Label>
                    <p className="font-semibold mt-1">
                      {selectedBillDetails.placeOfDispatch}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Delivery Address</Label>
                    <p className="font-semibold mt-1">
                      {selectedBillDetails.deliveryAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => setSelectedEWayBill(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create E-Way Bill Dialog */}
      <EWayBillDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  );
}