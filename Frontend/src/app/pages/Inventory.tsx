import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, Upload, AlertCircle, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { AddProductDialog } from "../components/AddProductDialog";
import api from "../api/axios";
import { toast } from "sonner";

export function Inventory() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      if (prodRes.data.success) {
        setProducts(prodRes.data.data);
      }
      if (catRes.data.success) {
        setCategories(catRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch inventory data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        toast.success("Product deleted successfully");
        fetchData();
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product.");
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const lowStockProducts = products.filter(
    (product) => product.stock <= (product.lowStockAlert || 10)
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
          <AddProductDialog onAddProduct={fetchData} categories={categories} />
        </div>
      </div>

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

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products by name, SKU..."
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
                {categories.filter(c => c.isActive).map((category) => (
                  <SelectItem key={category._id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">Product Name</th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">SKU</th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">Category</th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">HSN Code</th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-600">Purchase Price</th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-600">Selling Price</th>
                  <th className="pb-3 text-center text-sm font-medium text-gray-900">Stock</th>
                  <th className="pb-3 text-center text-sm font-medium text-gray-600">Alert Level</th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="pb-3 text-center text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                    <tr key={product._id} className="border-b border-gray-100">
                        <td className="py-3 text-sm text-gray-900">{product.name}</td>
                        <td className="py-3 text-sm text-gray-600">{product.sku || "-"}</td>
                        <td className="py-3">
                        <Badge variant="secondary">{product.category || "-"}</Badge>
                        </td>
                        <td className="py-3 text-left text-sm text-gray-900">
                        {product.hsnCode || "-"}
                        </td>
                        <td className="py-3 text-right text-sm text-gray-900">
                        ₹{product.purchasePrice || 0}
                        </td>
                        <td className="py-3 text-right text-sm font-medium text-gray-900">
                        ₹{product.sellingPrice || 0}
                        </td>
                        <td className="py-3 text-center text-sm font-medium text-gray-900">
                        {product.stock} {product.unit}
                        </td>
                        <td className="py-3 text-center text-sm text-gray-600">
                        {product.lowStockAlert || 10}
                        </td>
                        <td className="py-3 text-left">
                        <Badge
                            variant={product.stock <= (product.lowStockAlert || 10) ? "destructive" : "default"}
                            className={
                            product.stock <= (product.lowStockAlert || 10)
                                ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            }
                        >
                            {product.stock <= (product.lowStockAlert || 10) ? "Low Stock" : "In Stock"}
                        </Badge>
                        </td>
                        <td className="py-3 text-center">
                        <div className="flex justify-center flex-row items-center">
                            <AddProductDialog onAddProduct={fetchData} categories={categories} productToEdit={product} />
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(product._id)}>
                                <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                            </Button>
                        </div>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan={10} className="py-6 text-center text-sm text-gray-500">
                        No products found. Use "Add Product" to add.
                    </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}