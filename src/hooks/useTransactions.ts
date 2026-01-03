import { useState, useEffect, useCallback, useMemo } from 'react'
import type {
  Transaction,
  TransactionFilters,
  TransactionSort,
  TransactionKind,
  DatePreset,
} from '@/types/transaction'
import type { WasteLevel } from '@/types/dashboard'
import { DEFAULT_FILTERS, DEFAULT_SORT } from '@/types/transaction'
import type { CreateTransactionDto, UpdateTransactionDto } from '@/api/transactions'

const PAGE_SIZE = 20

// Mock data generator
function generateMockTransactions(): Transaction[] {
  const now = new Date()
  const transactions: Transaction[] = []

  const mockData = [
    // Today
    {
      kind: 'expense' as TransactionKind,
      amount: 150,
      note: 'Lunch at restaurant',
      categoryName: 'Food & Dining',
      categoryIcon: '🍔',
      categoryId: '10',
      accountName: 'Cash',
      accountId: '1',
      wasteLevel: 'optional' as WasteLevel,
      hoursAgo: 2,
    },
    {
      kind: 'income' as TransactionKind,
      amount: 25000,
      note: 'Monthly salary',
      categoryName: 'Salary',
      categoryIcon: '💰',
      categoryId: '1',
      accountName: 'SCB Savings',
      accountId: '2',
      wasteLevel: null,
      hoursAgo: 4,
    },
    {
      kind: 'expense' as TransactionKind,
      amount: 45,
      note: 'Coffee',
      categoryName: 'Food & Dining',
      categoryIcon: '🍔',
      categoryId: '10',
      accountName: 'Cash',
      accountId: '1',
      wasteLevel: 'wasteful' as WasteLevel,
      hoursAgo: 6,
    },
    // Yesterday
    {
      kind: 'expense' as TransactionKind,
      amount: 120,
      note: 'Uber to office',
      categoryName: 'Transportation',
      categoryIcon: '🚗',
      categoryId: '11',
      accountName: 'PromptPay',
      accountId: '3',
      wasteLevel: 'necessary' as WasteLevel,
      hoursAgo: 28,
    },
    {
      kind: 'transfer' as TransactionKind,
      amount: 5000,
      note: 'Transfer to savings',
      categoryName: null,
      categoryIcon: null,
      categoryId: null,
      accountName: 'Cash',
      accountId: '1',
      toAccountName: 'SCB Savings',
      toAccountId: '2',
      wasteLevel: null,
      hoursAgo: 30,
    },
    {
      kind: 'expense' as TransactionKind,
      amount: 350,
      note: 'Grocery shopping',
      categoryName: 'Shopping',
      categoryIcon: '🛒',
      categoryId: '12',
      accountName: 'Cash',
      accountId: '1',
      wasteLevel: 'necessary' as WasteLevel,
      hoursAgo: 32,
    },
    // 2 days ago
    {
      kind: 'expense' as TransactionKind,
      amount: 200,
      note: 'Movie tickets',
      categoryName: 'Entertainment',
      categoryIcon: '🎬',
      categoryId: '13',
      accountName: 'PromptPay',
      accountId: '3',
      wasteLevel: 'optional' as WasteLevel,
      hoursAgo: 52,
    },
    {
      kind: 'income' as TransactionKind,
      amount: 3000,
      note: 'Freelance project',
      categoryName: 'Freelance',
      categoryIcon: '💼',
      categoryId: '2',
      accountName: 'SCB Savings',
      accountId: '2',
      wasteLevel: null,
      hoursAgo: 54,
    },
    // 3 days ago
    {
      kind: 'expense' as TransactionKind,
      amount: 85,
      note: 'Medicine',
      categoryName: 'Healthcare',
      categoryIcon: '💊',
      categoryId: '14',
      accountName: 'Cash',
      accountId: '1',
      wasteLevel: 'necessary' as WasteLevel,
      hoursAgo: 72,
    },
    {
      kind: 'expense' as TransactionKind,
      amount: 1500,
      note: 'Electric bill',
      categoryName: 'Bills & Utilities',
      categoryIcon: '⚡',
      categoryId: '15',
      accountName: 'SCB Savings',
      accountId: '2',
      wasteLevel: 'necessary' as WasteLevel,
      hoursAgo: 74,
    },
    // 4 days ago
    {
      kind: 'expense' as TransactionKind,
      amount: 250,
      note: 'New headphones',
      categoryName: 'Shopping',
      categoryIcon: '🛒',
      categoryId: '12',
      accountName: 'PromptPay',
      accountId: '3',
      wasteLevel: 'wasteful' as WasteLevel,
      hoursAgo: 96,
    },
    {
      kind: 'expense' as TransactionKind,
      amount: 180,
      note: 'Dinner with friends',
      categoryName: 'Food & Dining',
      categoryIcon: '🍔',
      categoryId: '10',
      accountName: 'Cash',
      accountId: '1',
      wasteLevel: 'optional' as WasteLevel,
      hoursAgo: 100,
    },
    // 5 days ago
    {
      kind: 'income' as TransactionKind,
      amount: 500,
      note: 'Gift from parents',
      categoryName: 'Gift',
      categoryIcon: '🎁',
      categoryId: '4',
      accountName: 'Cash',
      accountId: '1',
      wasteLevel: null,
      hoursAgo: 120,
    },
    {
      kind: 'expense' as TransactionKind,
      amount: 60,
      note: 'Bus fare',
      categoryName: 'Transportation',
      categoryIcon: '🚗',
      categoryId: '11',
      accountName: 'Cash',
      accountId: '1',
      wasteLevel: 'necessary' as WasteLevel,
      hoursAgo: 122,
    },
    // 6 days ago
    {
      kind: 'expense' as TransactionKind,
      amount: 800,
      note: 'Online course',
      categoryName: 'Education',
      categoryIcon: '🎓',
      categoryId: '16',
      accountName: 'SCB Savings',
      accountId: '2',
      wasteLevel: 'necessary' as WasteLevel,
      hoursAgo: 144,
    },
    // 1 week ago
    {
      kind: 'expense' as TransactionKind,
      amount: 450,
      note: 'Haircut and styling',
      categoryName: 'Personal Care',
      categoryIcon: '💄',
      categoryId: '17',
      accountName: 'Cash',
      accountId: '1',
      wasteLevel: 'optional' as WasteLevel,
      hoursAgo: 168,
    },
    {
      kind: 'transfer' as TransactionKind,
      amount: 2000,
      note: 'To e-wallet',
      categoryName: null,
      categoryIcon: null,
      categoryId: null,
      accountName: 'SCB Savings',
      accountId: '2',
      toAccountName: 'PromptPay',
      toAccountId: '3',
      wasteLevel: null,
      hoursAgo: 170,
    },
    // 2 weeks ago
    {
      kind: 'expense' as TransactionKind,
      amount: 1200,
      note: 'New shoes',
      categoryName: 'Shopping',
      categoryIcon: '🛒',
      categoryId: '12',
      accountName: 'PromptPay',
      accountId: '3',
      wasteLevel: 'optional' as WasteLevel,
      hoursAgo: 336,
    },
    {
      kind: 'income' as TransactionKind,
      amount: 25000,
      note: 'Monthly salary',
      categoryName: 'Salary',
      categoryIcon: '💰',
      categoryId: '1',
      accountName: 'SCB Savings',
      accountId: '2',
      wasteLevel: null,
      hoursAgo: 340,
    },
    {
      kind: 'expense' as TransactionKind,
      amount: 95,
      note: 'Parking fee',
      categoryName: 'Transportation',
      categoryIcon: '🚗',
      categoryId: '11',
      accountName: 'Cash',
      accountId: '1',
      wasteLevel: 'necessary' as WasteLevel,
      hoursAgo: 350,
    },
    // 3 weeks ago
    {
      kind: 'expense' as TransactionKind,
      amount: 2500,
      note: 'Internet bill',
      categoryName: 'Bills & Utilities',
      categoryIcon: '⚡',
      categoryId: '15',
      accountName: 'SCB Savings',
      accountId: '2',
      wasteLevel: 'necessary' as WasteLevel,
      hoursAgo: 500,
    },
    {
      kind: 'expense' as TransactionKind,
      amount: 180,
      note: 'Snacks',
      categoryName: 'Food & Dining',
      categoryIcon: '🍔',
      categoryId: '10',
      accountName: 'Cash',
      accountId: '1',
      wasteLevel: 'wasteful' as WasteLevel,
      hoursAgo: 510,
    },
    // More older transactions for pagination testing
    {
      kind: 'expense' as TransactionKind,
      amount: 320,
      note: 'Books',
      categoryName: 'Education',
      categoryIcon: '🎓',
      categoryId: '16',
      accountName: 'PromptPay',
      accountId: '3',
      wasteLevel: 'necessary' as WasteLevel,
      hoursAgo: 600,
    },
    {
      kind: 'income' as TransactionKind,
      amount: 1500,
      note: 'Side project',
      categoryName: 'Freelance',
      categoryIcon: '💼',
      categoryId: '2',
      accountName: 'SCB Savings',
      accountId: '2',
      wasteLevel: null,
      hoursAgo: 650,
    },
    {
      kind: 'expense' as TransactionKind,
      amount: 280,
      note: 'Gym membership',
      categoryName: 'Healthcare',
      categoryIcon: '💊',
      categoryId: '14',
      accountName: 'SCB Savings',
      accountId: '2',
      wasteLevel: 'necessary' as WasteLevel,
      hoursAgo: 700,
    },
  ]

  mockData.forEach((item, index) => {
    const date = new Date(now.getTime() - item.hoursAgo * 60 * 60 * 1000)

    transactions.push({
      id: String(index + 1),
      kind: item.kind,
      amount: item.amount,
      note: item.note,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      categoryIcon: item.categoryIcon,
      accountId: item.accountId,
      accountName: item.accountName,
      toAccountId: 'toAccountId' in item ? (item.toAccountId as string) : null,
      toAccountName: 'toAccountName' in item ? (item.toAccountName as string) : null,
      wasteLevel: item.wasteLevel,
      transactionDate: date.toISOString(),
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    })
  })

  return transactions
}

// Date helpers
function getDateRangeForPreset(preset: DatePreset): { start: Date; end: Date } {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  switch (preset) {
    case 'today':
      return {
        start: today,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
      }
    case 'this_week': {
      const dayOfWeek = today.getDay()
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - dayOfWeek)
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 7)
      return { start: startOfWeek, end: new Date(endOfWeek.getTime() - 1) }
    }
    case 'this_month': {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999)
      return { start: startOfMonth, end: endOfMonth }
    }
  }
}

// Filter transactions
function filterTransactions(
  transactions: Transaction[],
  filters: TransactionFilters
): Transaction[] {
  return transactions.filter((tx) => {
    // Search filter (case-insensitive partial match on note)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const noteMatch = tx.note?.toLowerCase().includes(searchLower)
      if (!noteMatch) return false
    }

    // Date range filter
    if (filters.dateRange.preset) {
      const { start, end } = getDateRangeForPreset(filters.dateRange.preset)
      const txDate = new Date(tx.transactionDate)
      if (txDate < start || txDate > end) return false
    } else if (filters.dateRange.startDate || filters.dateRange.endDate) {
      const txDate = new Date(tx.transactionDate)
      if (filters.dateRange.startDate) {
        const start = new Date(filters.dateRange.startDate)
        if (txDate < start) return false
      }
      if (filters.dateRange.endDate) {
        const end = new Date(filters.dateRange.endDate)
        end.setHours(23, 59, 59, 999)
        if (txDate > end) return false
      }
    }

    // Kind filter (exclude loan_flow from filtering but show in results)
    if (filters.kinds.length > 0) {
      if (tx.kind === 'loan_flow') {
        // LOAN_FLOW transactions are shown but not manually filterable
        return true
      }
      if (!filters.kinds.includes(tx.kind)) return false
    }

    // Category filter (multi-select)
    if (filters.categoryIds.length > 0) {
      if (!tx.categoryId || !filters.categoryIds.includes(tx.categoryId)) return false
    }

    // Account filter (multi-select)
    if (filters.accountIds.length > 0) {
      const matchesAccount = filters.accountIds.includes(tx.accountId)
      const matchesToAccount = tx.toAccountId && filters.accountIds.includes(tx.toAccountId)
      if (!matchesAccount && !matchesToAccount) return false
    }

    // Waste level filter (only for expense)
    if (filters.wasteLevels.length > 0) {
      if (tx.kind !== 'expense') return true // Non-expense transactions pass this filter
      if (!tx.wasteLevel || !filters.wasteLevels.includes(tx.wasteLevel)) return false
    }

    return true
  })
}

// Sort transactions
function sortTransactions(transactions: Transaction[], sort: TransactionSort): Transaction[] {
  const sorted = [...transactions]

  sorted.sort((a, b) => {
    let comparison = 0

    if (sort.field === 'date') {
      comparison = new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime()
    } else if (sort.field === 'amount') {
      comparison = a.amount - b.amount
    }

    return sort.direction === 'asc' ? comparison : -comparison
  })

  return sorted
}

// Group transactions by date for display
export interface TransactionGroup {
  date: string // Date label (Today, Yesterday, or formatted date)
  dateKey: string // YYYY-MM-DD for grouping
  transactions: Transaction[]
}

function getDateLabel(date: Date): string {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const txDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (txDate.getTime() === today.getTime()) return 'Today'
  if (txDate.getTime() === yesterday.getTime()) return 'Yesterday'

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

function groupTransactionsByDate(transactions: Transaction[]): TransactionGroup[] {
  const groups: Map<string, TransactionGroup> = new Map()

  transactions.forEach((tx) => {
    const date = new Date(tx.transactionDate)
    const dateKey = date.toISOString().split('T')[0]

    if (!groups.has(dateKey)) {
      groups.set(dateKey, {
        date: getDateLabel(date),
        dateKey,
        transactions: [],
      })
    }

    groups.get(dateKey)!.transactions.push(tx)
  })

  // Sort groups by date (newest first is default, but sorting happens before grouping)
  return Array.from(groups.values())
}

interface UseTransactionsReturn {
  transactions: Transaction[]
  groupedTransactions: TransactionGroup[]
  totalCount: number
  displayedCount: number
  hasMore: boolean
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  filters: TransactionFilters
  sort: TransactionSort
  setFilters: (filters: TransactionFilters) => void
  setSort: (sort: TransactionSort) => void
  updateFilter: <K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) => void
  resetFilters: () => void
  loadMore: () => void
  refresh: () => void
  createTransaction: (data: CreateTransactionDto) => Promise<Transaction | null>
  updateTransaction: (id: string, data: UpdateTransactionDto) => Promise<Transaction | null>
  deleteTransaction: (id: string) => Promise<boolean>
  getTransactionById: (id: string) => Transaction | undefined
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
}

export function useTransactions(): UseTransactionsReturn {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS)
  const [sort, setSort] = useState<TransactionSort>(DEFAULT_SORT)
  const [page, setPage] = useState(1)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await transactionsApi.getList({ filters, sort, page: 1, pageSize: PAGE_SIZE })
      await new Promise((resolve) => setTimeout(resolve, 300))
      const mockData = generateMockTransactions()
      setAllTransactions(mockData)
      setPage(1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  // Apply filters and sorting
  const filteredAndSorted = useMemo(() => {
    const filtered = filterTransactions(allTransactions, filters)
    return sortTransactions(filtered, sort)
  }, [allTransactions, filters, sort])

  // Paginate
  const paginatedTransactions = useMemo(() => {
    return filteredAndSorted.slice(0, page * PAGE_SIZE)
  }, [filteredAndSorted, page])

  // Group by date
  const groupedTransactions = useMemo(() => {
    return groupTransactionsByDate(paginatedTransactions)
  }, [paginatedTransactions])

  const totalCount = filteredAndSorted.length
  const displayedCount = paginatedTransactions.length
  const hasMore = displayedCount < totalCount

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore) return

    setIsLoadingMore(true)

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    setPage((prev) => prev + 1)
    setIsLoadingMore(false)
  }, [hasMore, isLoadingMore])

  const updateFilter = useCallback(
    <K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
      setPage(1) // Reset pagination when filters change
    },
    []
  )

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }, [])

  const handleSetFilters = useCallback((newFilters: TransactionFilters) => {
    setFilters(newFilters)
    setPage(1)
  }, [])

  const handleSetSort = useCallback((newSort: TransactionSort) => {
    setSort(newSort)
    setPage(1)
  }, [])

  const getTransactionById = useCallback(
    (id: string): Transaction | undefined => {
      return allTransactions.find((tx) => tx.id === id)
    },
    [allTransactions]
  )

  const createTransaction = useCallback(
    async (data: CreateTransactionDto): Promise<Transaction | null> => {
      setIsCreating(true)
      setError(null)

      try {
        // TODO: Replace with actual API call when backend is ready
        // const newTransaction = await transactionsApi.create(data)
        await new Promise((resolve) => setTimeout(resolve, 300))

        const newTransaction: Transaction = {
          id: Date.now().toString(),
          kind: data.kind,
          amount: data.amount,
          note: data.note || null,
          categoryId: data.categoryId || null,
          categoryName: null, // Would be populated by API
          categoryIcon: null, // Would be populated by API
          accountId: data.accountId,
          accountName: '', // Would be populated by API
          toAccountId: data.toAccountId || null,
          toAccountName: null, // Would be populated by API
          wasteLevel: data.wasteLevel || null,
          transactionDate: data.transactionDate,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        setAllTransactions((prev) => [newTransaction, ...prev])
        return newTransaction
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create transaction')
        return null
      } finally {
        setIsCreating(false)
      }
    },
    []
  )

  const updateTransaction = useCallback(
    async (id: string, data: UpdateTransactionDto): Promise<Transaction | null> => {
      setIsUpdating(true)
      setError(null)

      try {
        // TODO: Replace with actual API call when backend is ready
        // const updatedTransaction = await transactionsApi.update(id, data)
        await new Promise((resolve) => setTimeout(resolve, 300))

        let updatedTransaction: Transaction | null = null

        setAllTransactions((prev) =>
          prev.map((tx) => {
            if (tx.id === id) {
              updatedTransaction = {
                ...tx,
                ...data,
                updatedAt: new Date().toISOString(),
              } as Transaction
              return updatedTransaction
            }
            return tx
          })
        )

        return updatedTransaction
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update transaction')
        return null
      } finally {
        setIsUpdating(false)
      }
    },
    []
  )

  const deleteTransaction = useCallback(async (id: string): Promise<boolean> => {
    setIsDeleting(true)
    setError(null)

    try {
      // TODO: Replace with actual API call when backend is ready
      // await transactionsApi.delete(id)
      await new Promise((resolve) => setTimeout(resolve, 300))

      setAllTransactions((prev) => prev.filter((tx) => tx.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction')
      return false
    } finally {
      setIsDeleting(false)
    }
  }, [])

  return {
    transactions: paginatedTransactions,
    groupedTransactions,
    totalCount,
    displayedCount,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    filters,
    sort,
    setFilters: handleSetFilters,
    setSort: handleSetSort,
    updateFilter,
    resetFilters,
    loadMore,
    refresh: fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
    isCreating,
    isUpdating,
    isDeleting,
  }
}
