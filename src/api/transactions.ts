import { api } from './client'
import type {
  Transaction,
  TransactionsListParams,
  TransactionsListResponse,
} from '@/types/transaction'

export interface CreateTransactionDto {
  kind: 'income' | 'expense' | 'transfer'
  amount: number
  note?: string
  categoryId?: string
  accountId: string
  toAccountId?: string // For transfers
  wasteLevel?: 'necessary' | 'optional' | 'wasteful' // For expense
  transactionDate: string
}

export interface UpdateTransactionDto {
  kind?: 'income' | 'expense' | 'transfer'
  amount?: number
  note?: string
  categoryId?: string
  accountId?: string
  toAccountId?: string
  wasteLevel?: 'necessary' | 'optional' | 'wasteful'
  transactionDate?: string
}

export const transactionsApi = {
  getList: (params: TransactionsListParams) => {
    const queryParams = new URLSearchParams()

    // Search
    if (params.filters.search) {
      queryParams.set('search', params.filters.search)
    }

    // Date range
    if (params.filters.dateRange.preset) {
      queryParams.set('datePreset', params.filters.dateRange.preset)
    } else {
      if (params.filters.dateRange.startDate) {
        queryParams.set('startDate', params.filters.dateRange.startDate)
      }
      if (params.filters.dateRange.endDate) {
        queryParams.set('endDate', params.filters.dateRange.endDate)
      }
    }

    // Kinds
    if (params.filters.kinds.length > 0) {
      queryParams.set('kinds', params.filters.kinds.join(','))
    }

    // Categories
    if (params.filters.categoryIds.length > 0) {
      queryParams.set('categoryIds', params.filters.categoryIds.join(','))
    }

    // Accounts
    if (params.filters.accountIds.length > 0) {
      queryParams.set('accountIds', params.filters.accountIds.join(','))
    }

    // Waste levels
    if (params.filters.wasteLevels.length > 0) {
      queryParams.set('wasteLevels', params.filters.wasteLevels.join(','))
    }

    // Sort
    queryParams.set('sortField', params.sort.field)
    queryParams.set('sortDirection', params.sort.direction)

    // Pagination
    queryParams.set('page', String(params.page))
    queryParams.set('pageSize', String(params.pageSize))

    return api.get<TransactionsListResponse>(`/transactions?${queryParams.toString()}`)
  },

  getById: (id: string) => api.get<Transaction>(`/transactions/${id}`),

  create: (data: CreateTransactionDto) => api.post<Transaction>('/transactions', data),

  update: (id: string, data: UpdateTransactionDto) =>
    api.patch<Transaction>(`/transactions/${id}`, data),

  delete: (id: string) => api.delete<void>(`/transactions/${id}`),
}
