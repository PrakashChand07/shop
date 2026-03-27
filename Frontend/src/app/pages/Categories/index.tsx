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
import { CreateCategoryDialog } from "./components/CreateCategoryDialog";
import { EditCategoryDialog } from "./components/EditCategoryDialog";
import { DeleteCategoryDialog } from "./components/DeleteCategoryDialog";
import { Button } from "@/app/components/ui/button";

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleEditSubmit = async (formData: CategoryFormData) => {
    if (!editingCategory) return;
    setIsSubmitting(true);
    try {
      await updateCategoryApi(editingCategory._id, formData);
      toast.success("Category updated successfully");
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateSubmit = async (formData: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      await createCategoryApi(formData);
      toast.success("Category created successfully");
      setIsCreateDialogOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await deleteCategoryApi(categoryToDelete._id);
      toast.success("Category deleted");
      fetchCategories();
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category.");
    } finally {
      setIsDeleting(false);
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
        <ActionButton onClick={() => setIsCreateDialogOpen(true)} className="gap-2 bg-blue-600 hover:bg-blue-700">
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
                            onClick={() => setEditingCategory(category)}
                          >
                            <Edit className="h-4 w-4 text-gray-500 hover:text-blue-600" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => setCategoryToDelete(category)}
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

      <CreateCategoryDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateSubmit}
        isLoading={isSubmitting}
      />

      <EditCategoryDialog
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        onSubmit={handleEditSubmit}
        isLoading={isSubmitting}
        category={editingCategory}
      />

      <DeleteCategoryDialog
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        category={categoryToDelete}
      />
    </div>
  );
}
