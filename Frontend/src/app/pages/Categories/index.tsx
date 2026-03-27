import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { ActionButton } from "@/app/components/common/ActionButton";
import { Badge } from "@/app/components/ui/badge";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { SharedPagination } from "@/app/components/SharedPagination";
import { toast } from "sonner";
import { Category, CategoryFormData } from "./types";
import { fetchCategoriesApi, createCategoryApi, updateCategoryApi, deleteCategoryApi } from "./api";
import { CategoryForm } from "./components/CategoryForm";
import { Button } from "@/app/components/ui/button";

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await fetchCategoriesApi(searchTerm, currentPage);
      if (data.success) {
        setCategories(data.data);
        if (data.pagination) {
          setTotalPages(data.pagination.pages || 1);
          setTotalItems(data.pagination.total || 0);
        } else {
          setTotalItems(data.data.length);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [searchTerm, currentPage]);

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
    } else {
      setEditingCategory(null);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (formData: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await updateCategoryApi(editingCategory._id, formData);
        toast.success("Category updated successfully");
      } else {
        await createCategoryApi(formData);
        toast.success("Category created successfully");
      }
      setIsDialogOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategoryApi(id);
        toast.success("Category deleted");
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Failed to delete category.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Product Categories
          </h1>
          <p className="text-gray-600">Manage categories for your inventory</p>
        </div>
        <ActionButton onClick={() => handleOpenDialog()} className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add Category
        </ActionButton>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories ({totalItems})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">Category Name</th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">Description</th>
                  <th className="pb-3 text-center text-sm font-medium text-gray-600">Status</th>
                  <th className="pb-3 text-center text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-sm text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <tr key={category._id} className="border-b border-gray-100">
                      <td className="py-3 text-sm font-medium text-gray-900">
                        {category.name}
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {category.description || "-"}
                      </td>
                      <td className="py-3 text-center">
                        <Badge
                          variant={category.isActive ? "default" : "secondary"}
                          className={
                            category.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleOpenDialog(category)}
                          >
                            <Edit className="h-4 w-4 text-gray-500 hover:text-blue-600" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDelete(category._id)}
                          >
                            <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-sm text-gray-500">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <SharedPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={10}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm 
            initialData={editingCategory}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
