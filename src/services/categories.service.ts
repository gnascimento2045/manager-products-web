import api from './api';

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
}

export const categoriesService = {
  findAll: () => api.get<Category[]>('/categories'),
  findOne: (id: string) => api.get<Category>(`/categories/${id}`),
  create: (dto: CreateCategoryDto) => api.post<Category>('/categories', dto),
  update: (id: string, dto: UpdateCategoryDto) => api.put<Category>(`/categories/${id}`, dto),
  remove: (id: string) => api.delete(`/categories/${id}`),
};