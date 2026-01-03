// Dashboard types

export type Period = 'day' | 'week' | 'month'

export type WasteLevel = 'necessary' | 'optional' | 'wasteful'

export interface AccountBalance {
  id: string
  name: string
  type: 'cash' | 'bank' | 'ewallet'
  balance: number
}

export interface CategorySummary {
  id: string
  name: string
  icon: string
  amount: number
}

export interface WasteDistribution {
  level: WasteLevel
  amount: number
  percentage: number
}

export interface LoansSummary {
  borrowed: number // Total owing to others
  lent: number // Total owed to you
  interestAccrued: number // Interest accrued today
}

export interface DashboardData {
  period: Period
  startDate: string
  endDate: string
  income: number
  expense: number
  accounts: AccountBalance[]
  topCategories: CategorySummary[]
  wasteDistribution: WasteDistribution[]
  loans: LoansSummary
}
