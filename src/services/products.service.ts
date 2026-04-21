import api from './api';
import type { Category } from './categories.service';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  category: Category;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  isActive?: boolean;
  categoryId: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  isActive?: boolean;
  categoryId?: string;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
}

export const productsService = {
  findAll: (page = 1, limit = 10) =>
    api.get<ProductsResponse>('/products', { params: { page, limit } }),
  findOne: (id: string) => api.get<Product>(`/products/${id}`),
  create: (dto: CreateProductDto) => api.post<Product>('/products', dto),
  update: (id: string, dto: UpdateProductDto) =>
    api.put<Product>(`/products/${id}`, dto),
  remove: (id: string) => api.delete(`/products/${id}`),
};