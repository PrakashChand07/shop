export interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  isActive: boolean;
}
