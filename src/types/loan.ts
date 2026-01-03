// Loan types

export type LoanDirection = 'borrow' | 'lend'
export type LoanStatus = 'active' | 'closed'
export type InterestType = 'fixed' | 'percentage'
export type InterestPeriod = 'weekly' | 'monthly'

export interface Loan {
  id: string
  direction: LoanDirection
  counterpartyName: string
  principal: number // Original loan amount
  outstandingPrincipal: number // Current amount owed (computed by API)
  interestType: InterestType
  interestRate: number // Amount or percentage depending on type
  interestPeriod: InterestPeriod
  interestAccrued: number // Unpaid interest (computed by API)
  interestStartDate: string // ISO date string
  dueDate: string | null // ISO date string, optional
  status: LoanStatus
  accountId: string
  accountName: string
  note: string | null
  createdAt: string
  updatedAt: string
}

export interface LoanFilters {
  direction: LoanDirection | null // null = all
  showClosed: boolean
}

export const DEFAULT_LOAN_FILTERS: LoanFilters = {
  direction: null,
  showClosed: false,
}

export interface LoansListResponse {
  loans: Loan[]
  totalCount: number
}

// Labels
export const LOAN_DIRECTION_LABELS: Record<LoanDirection, string> = {
  borrow: 'Borrowed (ยืมเขา)',
  lend: 'Lent (ให้ยืม)',
}

export const LOAN_STATUS_LABELS: Record<LoanStatus, string> = {
  active: 'Active',
  closed: 'Closed',
}

export const INTEREST_TYPE_LABELS: Record<InterestType, string> = {
  fixed: 'Fixed Amount',
  percentage: 'Percentage',
}

export const INTEREST_PERIOD_LABELS: Record<InterestPeriod, string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
}

// Loan Events
export type LoanEventType =
  | 'disburse'
  | 'principal_payment'
  | 'interest_payment'
  | 'adjustment'
  | 'close'

export interface LoanEvent {
  id: string
  loanId: string
  type: LoanEventType
  amount: number
  periodsCount?: number // For interest payments, number of periods paid
  note: string | null
  transactionId?: string // Linked transaction if any
  createdAt: string
}

export const LOAN_EVENT_TYPE_LABELS: Record<LoanEventType, string> = {
  disburse: 'Disbursed',
  principal_payment: 'Principal Payment',
  interest_payment: 'Interest Payment',
  adjustment: 'Adjustment',
  close: 'Closed',
}

// Extended loan detail with computed interest fields
export interface LoanDetail extends Loan {
  periodsStarted: number // Total periods since interest start date
  periodsPaid: number // Periods covered by interest payments
  periodsUnpaid: number // periodsStarted - periodsPaid
  totalInterestPaid: number // Sum of all interest payments
  events: LoanEvent[]
}
