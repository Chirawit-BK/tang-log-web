import { api } from './client'
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types/category'

export const categoriesApi = {
  getAll: () => api.get<Category[]>('/categories'),

  getById: (id: string) => api.get<Category>(`/categories/${id}`),

  create: (data: CreateCategoryDto) => api.post<Category>('/categories', data),

  update: (id: string, data: UpdateCategoryDto) =>
    api.patch<Category>(`/categories/${id}`, data),

  delete: (id: string) => api.delete<void>(`/categories/${id}`),
}
