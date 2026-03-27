import api from "@/app/api/axios";
import { CategoryFormData } from "./types";

export const fetchCategoriesApi = async (searchTerm: string, currentPage: number | string) => {
  const response = await api.get(`/categories?search=${searchTerm}&page=${currentPage}&limit=10`);
  return response.data;
};

export const createCategoryApi = async (data: CategoryFormData) => {
  const response = await api.post('/categories', data);
  return response.data;
};

export const updateCategoryApi = async (id: string, data: CategoryFormData) => {
  const response = await api.put(`/categories/${id}`, data);
  return response.data;
};

export const deleteCategoryApi = async (id: string) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};
