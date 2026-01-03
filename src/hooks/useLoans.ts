import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Loan, LoanFilters, LoanDirection } from '@/types/loan'
import { DEFAULT_LOAN_FILTERS } from '@/types/loan'
import type { CreateLoanDto, UpdateLoanDto } from '@/api/loans'

// Mock data generator
function generateMockLoans(): Loan[] {
  const now = new Date()

  return [
    {
      id: '1',
      direction: 'borrow',
      counterpartyName: 'John Doe',
      principal: 10000,
      outstandingPrincipal: 7500,
      interestType: 'fixed',
      interestRate: 100,
      interestPeriod: 'monthly',
      interestAccrued: 200,
      interestStartDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      accountId: '1',
      accountName: 'Cash',
      note: 'Emergency loan',
      createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: '2',
      direction: 'borrow',
      counterpartyName: 'Company ABC',
      principal: 50000,
      outstandingPrincipal: 0,
      interestType: 'percentage',
      interestRate: 5,
      interestPeriod: 'monthly',
      interestAccrued: 0,
      interestStartDate: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: null,
      status: 'closed',
      accountId: '2',
      accountName: 'SCB Savings',
      note: 'Business advance',
      createdAt: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      direction: 'lend',
      counterpartyName: 'Jane Smith',
      principal: 5000,
      outstandingPrincipal: 5000,
      interestType: 'fixed',
      interestRate: 50,
      interestPeriod: 'monthly',
      interestAccrued: 50,
      interestStartDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      accountId: '1',
      accountName: 'Cash',
      note: 'Personal loan to friend',
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: '4',
      direction: 'lend',
      counterpartyName: 'Bob Wilson',
      principal: 3000,
      outstandingPrincipal: 0,
      interestType: 'fixed',
      interestRate: 0,
      interestPeriod: 'monthly',
      interestAccrued: 0,
      interestStartDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: null,
      status: 'closed',
      accountId: '1',
      accountName: 'Cash',
      note: 'Interest-free loan',
      createdAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
}

// Filter loans
function filterLoans(loans: Loan[], filters: LoanFilters): Loan[] {
  return loans.filter((loan) => {
    // Direction filter
    if (filters.direction && loan.direction !== filters.direction) {
      return false
    }

    // Status filter (hide closed by default)
    if (!filters.showClosed && loan.status === 'closed') {
      return false
    }

    return true
  })
}

// Sort loans: active first, then by created_at desc
function sortLoans(loans: Loan[]): Loan[] {
  return [...loans].sort((a, b) => {
    // Active loans first
    if (a.status !== b.status) {
      return a.status === 'active' ? -1 : 1
    }
    // Then by created_at desc
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

// Group loans by direction for display
export interface LoanGroup {
  direction: LoanDirection
  label: string
  loans: Loan[]
}

function groupLoansByDirection(loans: Loan[]): LoanGroup[] {
  const groups: LoanGroup[] = []

  const borrowed = loans.filter((l) => l.direction === 'borrow')
  const lent = loans.filter((l) => l.direction === 'lend')

  if (borrowed.length > 0) {
    groups.push({
      direction: 'borrow',
      label: 'BORROWED (ยืมเขา)',
      loans: borrowed,
    })
  }

  if (lent.length > 0) {
    groups.push({
      direction: 'lend',
      label: 'LENT (ให้ยืม)',
      loans: lent,
    })
  }

  return groups
}

interface UseLoansReturn {
  loans: Loan[]
  groupedLoans: LoanGroup[]
  totalCount: number
  isLoading: boolean
  error: string | null
  filters: LoanFilters
  setFilters: (filters: LoanFilters) => void
  updateFilter: <K extends keyof LoanFilters>(key: K, value: LoanFilters[K]) => void
  resetFilters: () => void
  refresh: () => void
  createLoan: (data: CreateLoanDto) => Promise<Loan | null>
  updateLoan: (id: string, data: UpdateLoanDto) => Promise<Loan | null>
  closeLoan: (id: string) => Promise<boolean>
  deleteLoan: (id: string) => Promise<boolean>
  getLoanById: (id: string) => Loan | undefined
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
}

export function useLoans(): UseLoansReturn {
  const [allLoans, setAllLoans] = useState<Loan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<LoanFilters>(DEFAULT_LOAN_FILTERS)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchLoans = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await loansApi.getList(filters)
      await new Promise((resolve) => setTimeout(resolve, 300))
      const mockData = generateMockLoans()
      setAllLoans(mockData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load loans')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLoans()
  }, [fetchLoans])

  // Apply filters and sorting
  const filteredAndSorted = useMemo(() => {
    const filtered = filterLoans(allLoans, filters)
    return sortLoans(filtered)
  }, [allLoans, filters])

  // Group by direction
  const groupedLoans = useMemo(() => {
    // Only group when showing "All" (direction is null)
    if (filters.direction === null) {
      return groupLoansByDirection(filteredAndSorted)
    }
    // When filtered by direction, return single group
    const label = filters.direction === 'borrow' ? 'BORROWED (ยืมเขา)' : 'LENT (ให้ยืม)'
    return filteredAndSorted.length > 0
      ? [{ direction: filters.direction, label, loans: filteredAndSorted }]
      : []
  }, [filteredAndSorted, filters.direction])

  const totalCount = filteredAndSorted.length

  const updateFilter = useCallback(
    <K extends keyof LoanFilters>(key: K, value: LoanFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_LOAN_FILTERS)
  }, [])

  const handleSetFilters = useCallback((newFilters: LoanFilters) => {
    setFilters(newFilters)
  }, [])

  const getLoanById = useCallback(
    (id: string): Loan | undefined => {
      return allLoans.find((loan) => loan.id === id)
    },
    [allLoans]
  )

  const createLoan = useCallback(
    async (data: CreateLoanDto): Promise<Loan | null> => {
      setIsCreating(true)
      setError(null)

      try {
        // TODO: Replace with actual API call when backend is ready
        // const newLoan = await loansApi.create(data)
        await new Promise((resolve) => setTimeout(resolve, 300))

        const newLoan: Loan = {
          id: Date.now().toString(),
          direction: data.direction,
          counterpartyName: data.counterpartyName,
          principal: data.principal,
          outstandingPrincipal: data.principal, // Initially full amount
          interestType: data.interestType,
          interestRate: data.interestRate,
          interestPeriod: data.interestPeriod,
          interestAccrued: 0,
          interestStartDate: data.interestStartDate,
          dueDate: data.dueDate || null,
          status: 'active',
          accountId: data.accountId,
          accountName: '', // Would be populated by API
          note: data.note || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        setAllLoans((prev) => [newLoan, ...prev])
        return newLoan
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create loan')
        return null
      } finally {
        setIsCreating(false)
      }
    },
    []
  )

  const updateLoan = useCallback(
    async (id: string, data: UpdateLoanDto): Promise<Loan | null> => {
      setIsUpdating(true)
      setError(null)

      try {
        // TODO: Replace with actual API call when backend is ready
        // const updatedLoan = await loansApi.update(id, data)
        await new Promise((resolve) => setTimeout(resolve, 300))

        let updatedLoan: Loan | null = null

        setAllLoans((prev) =>
          prev.map((loan) => {
            if (loan.id === id) {
              updatedLoan = {
                ...loan,
                ...data,
                updatedAt: new Date().toISOString(),
              } as Loan
              return updatedLoan
            }
            return loan
          })
        )

        return updatedLoan
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update loan')
        return null
      } finally {
        setIsUpdating(false)
      }
    },
    []
  )

  const closeLoan = useCallback(async (id: string): Promise<boolean> => {
    setIsUpdating(true)
    setError(null)

    try {
      // TODO: Replace with actual API call when backend is ready
      // await loansApi.close(id)
      await new Promise((resolve) => setTimeout(resolve, 300))

      setAllLoans((prev) =>
        prev.map((loan) => {
          if (loan.id === id) {
            return {
              ...loan,
              status: 'closed',
              outstandingPrincipal: 0,
              interestAccrued: 0,
              updatedAt: new Date().toISOString(),
            }
          }
          return loan
        })
      )

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to close loan')
      return false
    } finally {
      setIsUpdating(false)
    }
  }, [])

  const deleteLoan = useCallback(async (id: string): Promise<boolean> => {
    setIsDeleting(true)
    setError(null)

    try {
      // TODO: Replace with actual API call when backend is ready
      // await loansApi.delete(id)
      await new Promise((resolve) => setTimeout(resolve, 300))

      setAllLoans((prev) => prev.filter((loan) => loan.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete loan')
      return false
    } finally {
      setIsDeleting(false)
    }
  }, [])

  return {
    loans: filteredAndSorted,
    groupedLoans,
    totalCount,
    isLoading,
    error,
    filters,
    setFilters: handleSetFilters,
    updateFilter,
    resetFilters,
    refresh: fetchLoans,
    createLoan,
    updateLoan,
    closeLoan,
    deleteLoan,
    getLoanById,
    isCreating,
    isUpdating,
    isDeleting,
  }
}
