// Transaction types

import type { WasteLevel } from './dashboard'

export type TransactionKind = 'income' | 'expense' | 'transfer' | 'loan_flow'

export type SortField = 'date' | 'amount'
export type SortDirection = 'asc' | 'desc'

export interface Transaction {
  id: string
  kind: TransactionKind
  amount: number
  note: string | null
  categoryId: string | null
  categoryName: string | null
  categoryIcon: string | null
  accountId: string
  accountName: string
  toAccountId: string | null // For transfers
  toAccountName: string | null // For transfers
  wasteLevel: WasteLevel | null // Only for expense
  transactionDate: string // ISO date string
  createdAt: string
  updatedAt: string
}

export interface TransactionFilters {
  search: string
  dateRange: DateRangeFilter
  kinds: TransactionKind[] // Empty = all (except loan_flow)
  categoryIds: string[]
  accountIds: string[]
  wasteLevels: WasteLevel[]
}

export interface DateRangeFilter {
  preset: DatePreset | null
  startDate: string | null // ISO date string
  endDate: string | null // ISO date string
}

export type DatePreset = 'today' | 'this_week' | 'this_month'

export interface TransactionSort {
  field: SortField
  direction: SortDirection
}

export interface TransactionsListParams {
  filters: TransactionFilters
  sort: TransactionSort
  page: number
  pageSize: number
}

export interface TransactionsListResponse {
  transactions: Transaction[]
  totalCount: number
  hasMore: boolean
}

// Default filter values
export const DEFAULT_FILTERS: TransactionFilters = {
  search: '',
  dateRange: {
    preset: null,
    startDate: null,
    endDate: null,
  },
  kinds: [],
  categoryIds: [],
  accountIds: [],
  wasteLevels: [],
}

export const DEFAULT_SORT: TransactionSort = {
  field: 'date',
  direction: 'desc',
}

// Labels
export const TRANSACTION_KIND_LABELS: Record<TransactionKind, string> = {
  income: 'Income',
  expense: 'Expense',
  transfer: 'Transfer',
  loan_flow: 'Loan',
}

export const DATE_PRESET_LABELS: Record<DatePreset, string> = {
  today: 'Today',
  this_week: 'This Week',
  this_month: 'This Month',
}

export const SORT_OPTIONS: { label: string; field: SortField; direction: SortDirection }[] = [
  { label: 'Date (Newest)', field: 'date', direction: 'desc' },
  { label: 'Date (Oldest)', field: 'date', direction: 'asc' },
  { label: 'Amount (High to Low)', field: 'amount', direction: 'desc' },
  { label: 'Amount (Low to High)', field: 'amount', direction: 'asc' },
]
