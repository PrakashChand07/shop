import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, Plus, Edit, Upload, AlertCircle } from "lucide-react";
import { products } from "../lib/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { AddProductDialog } from "../components/AddProductDialog";

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm);

    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const lowStockProducts = products.filter(
    (product) => product.stock <= product.lowStockAlert
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Inventory Management
          </h1>
          <p className="text-gray-600">Manage your products and stock levels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Bulk Import
          </Button>
          <AddProductDialog />
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-900">
                  {lowStockProducts.length} products are running low on stock
                </p>
                <p className="text-sm text-orange-700">
                  {lowStockProducts.map((p) => p.name).join(", ")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products by name, SKU, or barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Product Name
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    SKU / Barcode
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Category
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    HSN Code
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-600">
                    Purchase Price
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-600">
                    Selling Price
                  </th>
                  <th className="pb-3 text-center text-sm font-medium text-gray-900">
                    Stock
                  </th>
                  <th className="pb-3 text-center text-sm text-gray-600">
                    Alert Level
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="pb-3 text-center text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100">
                    <td className="py-3 text-sm text-gray-900">{product.name}</td>
                    <td className="py-3 text-sm text-gray-600">
                      <div>
                        <p>{product.sku}</p>
                        <p className="text-xs text-gray-500">{product.barcode}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge variant="secondary">{product.category}</Badge>
                    </td>
                    <td className="py-3 text-left text-sm text-gray-900">
                      {product.hsnCode}
                    </td>
                    <td className="py-3 text-right text-sm text-gray-900">
                      ₹{product.purchasePrice}
                    </td>
                    <td className="py-3 text-right text-sm font-medium text-gray-900">
                      ₹{product.sellingPrice}
                    </td>
                    <td className="py-3 text-center text-sm font-medium text-gray-900">
                      {product.stock}
                    </td>
                    <td className="py-3 text-center text-sm text-gray-600">
                      {product.lowStockAlert}
                    </td>
                    <td className="py-3 text-left">
                      <Badge
                        variant={
                          product.stock <= product.lowStockAlert
                            ? "destructive"
                            : "default"
                        }
                        className={
                          product.stock <= product.lowStockAlert
                            ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }
                      >
                        {product.stock <= product.lowStockAlert
                          ? "Low Stock"
                          : "In Stock"}
                      </Badge>
                    </td>
                    <td className="py-3 text-center">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}