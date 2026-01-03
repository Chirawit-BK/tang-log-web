import { api } from './client'
import type {
  Loan,
  LoanFilters,
  LoansListResponse,
  LoanDirection,
  InterestType,
  InterestPeriod,
} from '@/types/loan'

export interface CreateLoanDto {
  direction: LoanDirection
  counterpartyName: string
  principal: number
  accountId: string
  interestType: InterestType
  interestRate: number
  interestPeriod: InterestPeriod
  interestStartDate: string
  dueDate?: string
  note?: string
}

export interface UpdateLoanDto {
  counterpartyName?: string
  interestRate?: number
  interestPeriod?: InterestPeriod
  dueDate?: string | null
  note?: string | null
}

export interface RecordPaymentDto {
  principalAmount?: number // Optional principal payment
  interestPeriods?: number // Optional number of interest periods to pay
  paymentDate: string // ISO date string
  accountId: string // Account to debit/credit
  note?: string
}

export const loansApi = {
  getList: (filters: LoanFilters) => {
    const queryParams = new URLSearchParams()

    if (filters.direction) {
      queryParams.set('direction', filters.direction)
    }

    queryParams.set('showClosed', String(filters.showClosed))

    return api.get<LoansListResponse>(`/loans?${queryParams.toString()}`)
  },

  getById: (id: string) => api.get<Loan>(`/loans/${id}`),

  create: (data: CreateLoanDto) => api.post<Loan>('/loans', data),

  update: (id: string, data: UpdateLoanDto) => api.patch<Loan>(`/loans/${id}`, data),

  close: (id: string) => api.post<Loan>(`/loans/${id}/close`),

  delete: (id: string) => api.delete<void>(`/loans/${id}`),

  recordPayment: (id: string, data: RecordPaymentDto) =>
    api.post<Loan>(`/loans/${id}/payments`, data),
}
