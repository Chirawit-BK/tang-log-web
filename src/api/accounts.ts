import { api } from './client'
import type { Account, CreateAccountDto, UpdateAccountDto } from '@/types/account'

export const accountsApi = {
  getAll: () => api.get<Account[]>('/accounts'),

  getById: (id: string) => api.get<Account>(`/accounts/${id}`),

  create: (data: CreateAccountDto) => api.post<Account>('/accounts', data),

  update: (id: string, data: UpdateAccountDto) =>
    api.patch<Account>(`/accounts/${id}`, data),

  delete: (id: string) => api.delete<void>(`/accounts/${id}`),
}
