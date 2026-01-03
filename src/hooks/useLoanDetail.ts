import { useState, useEffect, useCallback } from 'react'
import type { LoanDetail, LoanEvent } from '@/types/loan'
import { useLoans } from './useLoans'

// Calculate number of periods between two dates
function calculatePeriods(
  startDate: Date,
  endDate: Date,
  period: 'weekly' | 'monthly'
): number {
  if (endDate < startDate) return 0

  if (period === 'weekly') {
    const diffTime = endDate.getTime() - startDate.getTime()
    const diffWeeks = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000))
    return diffWeeks
  } else {
    // Monthly: count full months
    const startYear = startDate.getFullYear()
    const startMonth = startDate.getMonth()
    const endYear = endDate.getFullYear()
    const endMonth = endDate.getMonth()

    return (endYear - startYear) * 12 + (endMonth - startMonth)
  }
}

// Generate mock events for a loan
function generateMockEvents(loanId: string, loan: LoanDetail): LoanEvent[] {
  const events: LoanEvent[] = []
  const startDate = new Date(loan.interestStartDate)

  // Disburse event - always first
  events.push({
    id: `${loanId}-evt-1`,
    loanId,
    type: 'disburse',
    amount: loan.principal,
    note: 'Initial disbursement',
    createdAt: loan.interestStartDate,
  })

  // Generate some payment events based on loan state
  const principalPaid = loan.principal - loan.outstandingPrincipal

  if (principalPaid > 0) {
    // Add a principal payment event
    const paymentDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000)
    events.push({
      id: `${loanId}-evt-2`,
      loanId,
      type: 'principal_payment',
      amount: principalPaid,
      note: null,
      transactionId: `tx-${loanId}-1`,
      createdAt: paymentDate.toISOString(),
    })
  }

  // Add interest payment events if there are paid periods
  if (loan.periodsPaid > 0) {
    const interestPerPeriod =
      loan.interestType === 'percentage'
        ? (loan.principal * loan.interestRate) / 100
        : loan.interestRate

    // Split into 2 payments for demo
    const firstPaymentPeriods = Math.ceil(loan.periodsPaid / 2)
    const secondPaymentPeriods = loan.periodsPaid - firstPaymentPeriods

    if (firstPaymentPeriods > 0) {
      const paymentDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)
      events.push({
        id: `${loanId}-evt-3`,
        loanId,
        type: 'interest_payment',
        amount: firstPaymentPeriods * interestPerPeriod,
        periodsCount: firstPaymentPeriods,
        note: null,
        transactionId: `tx-${loanId}-2`,
        createdAt: paymentDate.toISOString(),
      })
    }

    if (secondPaymentPeriods > 0) {
      const paymentDate = new Date(startDate.getTime() + 21 * 24 * 60 * 60 * 1000)
      events.push({
        id: `${loanId}-evt-4`,
        loanId,
        type: 'interest_payment',
        amount: secondPaymentPeriods * interestPerPeriod,
        periodsCount: secondPaymentPeriods,
        note: null,
        transactionId: `tx-${loanId}-3`,
        createdAt: paymentDate.toISOString(),
      })
    }
  }

  // Add close event if closed
  if (loan.status === 'closed') {
    events.push({
      id: `${loanId}-evt-close`,
      loanId,
      type: 'close',
      amount: 0,
      note: 'Loan closed',
      createdAt: loan.updatedAt,
    })
  }

  // Sort by date descending (newest first)
  events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return events
}

interface RecordPaymentData {
  principalAmount?: number
  interestPeriods?: number
  paymentDate: string
  accountId: string
  note?: string
}

interface UseLoanDetailReturn {
  loan: LoanDetail | null
  isLoading: boolean
  error: string | null
  refresh: () => void
  updateLoan: (data: { counterpartyName?: string; dueDate?: string | null; note?: string | null }) => Promise<boolean>
  closeLoan: () => Promise<boolean>
  deleteLoan: () => Promise<boolean>
  recordPayment: (data: RecordPaymentData) => Promise<boolean>
  isUpdating: boolean
  isDeleting: boolean
  isRecordingPayment: boolean
}

export function useLoanDetail(loanId: string | undefined): UseLoanDetailReturn {
  const {
    getLoanById,
    updateLoan: updateLoanBase,
    closeLoan: closeLoanBase,
    deleteLoan: deleteLoanBase,
    isUpdating,
    isDeleting,
    isLoading: isLoansLoading,
  } = useLoans()

  const [loan, setLoan] = useState<LoanDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRecordingPayment, setIsRecordingPayment] = useState(false)

  const fetchLoanDetail = useCallback(() => {
    if (!loanId) {
      setLoan(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    // Simulate API delay
    setTimeout(() => {
      const baseLoan = getLoanById(loanId)

      if (!baseLoan) {
        setLoan(null)
        setError('Loan not found')
        setIsLoading(false)
        return
      }

      // Compute interest periods
      const now = new Date()
      const startDate = new Date(baseLoan.interestStartDate)
      const periodsStarted = calculatePeriods(startDate, now, baseLoan.interestPeriod)

      // Calculate interest per period
      const interestPerPeriod =
        baseLoan.interestType === 'percentage'
          ? (baseLoan.principal * baseLoan.interestRate) / 100
          : baseLoan.interestRate

      // For mock: derive periodsPaid from interestAccrued
      const periodsUnpaid =
        interestPerPeriod > 0 ? Math.floor(baseLoan.interestAccrued / interestPerPeriod) : 0
      const periodsPaid = Math.max(0, periodsStarted - periodsUnpaid)

      // Calculate total interest paid (mock: assume some payments made)
      const totalInterestPaid = periodsPaid * interestPerPeriod

      const loanDetail: LoanDetail = {
        ...baseLoan,
        periodsStarted,
        periodsPaid,
        periodsUnpaid,
        totalInterestPaid,
        events: [], // Will be populated below
      }

      // Generate mock events
      loanDetail.events = generateMockEvents(loanId, loanDetail)

      setLoan(loanDetail)
      setIsLoading(false)
    }, 100)
  }, [loanId, getLoanById])

  useEffect(() => {
    // Wait for loans to be loaded first
    if (!isLoansLoading) {
      fetchLoanDetail()
    }
  }, [fetchLoanDetail, isLoansLoading])

  const updateLoan = useCallback(
    async (data: { counterpartyName?: string; dueDate?: string | null; note?: string | null }): Promise<boolean> => {
      if (!loanId) return false

      const updated = await updateLoanBase(loanId, data)
      if (updated) {
        fetchLoanDetail()
        return true
      }
      return false
    },
    [loanId, updateLoanBase, fetchLoanDetail]
  )

  const closeLoan = useCallback(async (): Promise<boolean> => {
    if (!loanId) return false

    const success = await closeLoanBase(loanId)
    if (success) {
      fetchLoanDetail()
    }
    return success
  }, [loanId, closeLoanBase, fetchLoanDetail])

  const deleteLoan = useCallback(async (): Promise<boolean> => {
    if (!loanId) return false

    return await deleteLoanBase(loanId)
  }, [loanId, deleteLoanBase])

  const recordPayment = useCallback(
    async (data: RecordPaymentData): Promise<boolean> => {
      if (!loanId || !loan) return false

      setIsRecordingPayment(true)

      try {
        // TODO: Replace with actual API call when backend is ready
        // await loansApi.recordPayment(loanId, data)
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Calculate interest per period
        const interestPerPeriod =
          loan.interestType === 'percentage'
            ? (loan.principal * loan.interestRate) / 100
            : loan.interestRate

        // Update loan state locally (mock)
        const principalPaid = data.principalAmount || 0
        const periodsPaid = data.interestPeriods || 0
        const interestPaid = periodsPaid * interestPerPeriod

        setLoan((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            outstandingPrincipal: Math.max(0, prev.outstandingPrincipal - principalPaid),
            periodsPaid: prev.periodsPaid + periodsPaid,
            periodsUnpaid: Math.max(0, prev.periodsUnpaid - periodsPaid),
            interestAccrued: Math.max(0, prev.interestAccrued - interestPaid),
            totalInterestPaid: prev.totalInterestPaid + interestPaid,
            updatedAt: new Date().toISOString(),
          }
        })

        // Refresh to get updated data (in real implementation, API would return updated loan)
        fetchLoanDetail()
        return true
      } catch (err) {
        console.error('Failed to record payment:', err)
        return false
      } finally {
        setIsRecordingPayment(false)
      }
    },
    [loanId, loan, fetchLoanDetail]
  )

  return {
    loan,
    isLoading: isLoading || isLoansLoading,
    error,
    refresh: fetchLoanDetail,
    updateLoan,
    closeLoan,
    deleteLoan,
    recordPayment,
    isUpdating,
    isDeleting,
    isRecordingPayment,
  }
}
