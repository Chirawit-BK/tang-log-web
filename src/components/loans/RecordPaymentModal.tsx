import { useState, useEffect, useMemo } from 'react'
import { X, Calendar, ChevronDown, Loader2 } from 'lucide-react'
import type { LoanDetail } from '@/types/loan'
import { useAccounts } from '@/hooks/useAccounts'

interface RecordPaymentModalProps {
  isOpen: boolean
  loan: LoanDetail | null
  onClose: () => void
  onSubmit: (data: {
    principalAmount?: number
    interestPeriods?: number
    paymentDate: string
    accountId: string
    note?: string
  }) => Promise<boolean>
  isSubmitting: boolean
}

interface FormErrors {
  payment?: string
  principal?: string
  periods?: string
  accountId?: string
  paymentDate?: string
}

function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0]
}

function formatAmount(value: number): string {
  return value.toLocaleString('th-TH')
}

function parseAmount(value: string): number {
  return parseInt(value.replace(/[^0-9]/g, ''), 10) || 0
}

function getDateLabel(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (formatDateForInput(date) === formatDateForInput(today)) {
    return 'Today'
  }
  if (formatDateForInput(date) === formatDateForInput(yesterday)) {
    return 'Yesterday'
  }
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function RecordPaymentModal({
  isOpen,
  loan,
  onClose,
  onSubmit,
  isSubmitting,
}: RecordPaymentModalProps) {
  const { accounts, isLoading: isLoadingAccounts } = useAccounts()

  // Form state
  const [principalAmount, setPrincipalAmount] = useState('')
  const [interestPeriods, setInterestPeriods] = useState('')
  const [paymentDate, setPaymentDate] = useState(formatDateForInput(new Date()))
  const [accountId, setAccountId] = useState('')
  const [note, setNote] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  // Calculate interest per period
  const interestPerPeriod = useMemo(() => {
    if (!loan) return 0
    if (loan.interestType === 'percentage') {
      return (loan.principal * loan.interestRate) / 100
    }
    return loan.interestRate
  }, [loan])

  // Calculate interest amount based on periods input
  const interestAmount = useMemo(() => {
    const periods = parseInt(interestPeriods, 10) || 0
    return periods * interestPerPeriod
  }, [interestPeriods, interestPerPeriod])

  // Calculate remaining principal after payment
  const remainingPrincipal = useMemo(() => {
    if (!loan) return 0
    const payment = parseAmount(principalAmount)
    return Math.max(0, loan.outstandingPrincipal - payment)
  }, [loan, principalAmount])

  // Calculate total payment
  const totalPayment = useMemo(() => {
    return parseAmount(principalAmount) + interestAmount
  }, [principalAmount, interestAmount])

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && loan) {
      setPrincipalAmount('')
      setInterestPeriods('')
      setPaymentDate(formatDateForInput(new Date()))
      setAccountId(loan.accountId || accounts[0]?.id || '')
      setNote('')
      setErrors({})
    }
  }, [isOpen, loan, accounts])

  // Set default account when accounts load
  useEffect(() => {
    if (accounts.length > 0 && !accountId && loan) {
      setAccountId(loan.accountId || accounts[0].id)
    }
  }, [accounts, accountId, loan])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    const principalValue = parseAmount(principalAmount)
    const periodsValue = parseInt(interestPeriods, 10) || 0

    // At least one payment must be > 0
    if (principalValue === 0 && periodsValue === 0) {
      newErrors.payment = 'Enter a principal amount or interest periods'
    }

    // Principal cannot exceed outstanding
    if (principalValue > (loan?.outstandingPrincipal || 0)) {
      newErrors.principal = `Cannot exceed outstanding (฿${formatAmount(loan?.outstandingPrincipal || 0)})`
    }

    // Interest periods must be non-negative
    if (periodsValue < 0) {
      newErrors.periods = 'Periods cannot be negative'
    }

    // Account required
    if (!accountId) {
      newErrors.accountId = 'Please select an account'
    }

    // Date required
    if (!paymentDate) {
      newErrors.paymentDate = 'Please select a date'
    }

    // Date cannot be in the future
    if (paymentDate && new Date(paymentDate) > new Date()) {
      newErrors.paymentDate = 'Cannot be a future date'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const principalValue = parseAmount(principalAmount)
    const periodsValue = parseInt(interestPeriods, 10) || 0

    const success = await onSubmit({
      principalAmount: principalValue > 0 ? principalValue : undefined,
      interestPeriods: periodsValue > 0 ? periodsValue : undefined,
      paymentDate: new Date(paymentDate).toISOString(),
      accountId,
      note: note.trim() || undefined,
    })

    if (success) {
      onClose()
    }
  }

  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    setPrincipalAmount(raw)
    if (errors.principal || errors.payment) {
      setErrors((prev) => ({ ...prev, principal: undefined, payment: undefined }))
    }
  }

  const handlePeriodsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    setInterestPeriods(raw)
    if (errors.periods || errors.payment) {
      setErrors((prev) => ({ ...prev, periods: undefined, payment: undefined }))
    }
  }

  if (!isOpen || !loan) {
    return null
  }

  const isLoading = isLoadingAccounts
  const displayPrincipal = principalAmount ? formatAmount(parseInt(principalAmount, 10)) : ''

  return (
    <div className="fixed inset-0 bg-bg-primary z-[100] flex flex-col pt-safe pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-bg-tertiary">
        <button
          onClick={onClose}
          className="touch-target flex items-center justify-center text-primary"
          aria-label="Close"
          disabled={isSubmitting}
        >
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">Record Payment</h1>
        <div className="w-11" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current State Section */}
            <div className="p-4 bg-bg-secondary rounded-xl space-y-3">
              <p className="text-xs text-text-tertiary uppercase tracking-wide font-medium">
                Current State
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-text-tertiary">Outstanding</p>
                  <p className="text-lg font-semibold text-text-primary">
                    ฿{formatAmount(loan.outstandingPrincipal)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">Interest/period</p>
                  <p className="text-lg font-semibold text-text-primary">
                    {loan.interestType === 'percentage'
                      ? `${loan.interestRate}%`
                      : `฿${formatAmount(interestPerPeriod)}`}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">Periods unpaid</p>
                  <p className="text-lg font-semibold text-text-primary">{loan.periodsUnpaid}</p>
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">Interest accrued</p>
                  <p className="text-lg font-semibold text-text-primary">
                    ฿{formatAmount(loan.interestAccrued)}
                  </p>
                </div>
              </div>
            </div>

            {/* General payment error */}
            {errors.payment && (
              <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl">
                <p className="text-sm text-danger text-center">{errors.payment}</p>
              </div>
            )}

            {/* Principal Payment */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Principal Payment <span className="text-text-tertiary">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary font-medium">
                  ฿
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={displayPrincipal}
                  onChange={handlePrincipalChange}
                  placeholder="0"
                  className={`w-full pl-10 pr-4 py-3 bg-bg-secondary rounded-xl border text-text-primary
                             text-right text-xl font-semibold placeholder:text-text-tertiary
                             focus:outline-none focus:ring-2 focus:ring-primary/50
                             ${errors.principal ? 'border-danger' : 'border-bg-tertiary'}`}
                />
              </div>
              {errors.principal ? (
                <p className="text-sm text-danger">{errors.principal}</p>
              ) : (
                parseAmount(principalAmount) > 0 && (
                  <p className="text-sm text-text-tertiary">
                    Remaining: ฿{formatAmount(remainingPrincipal)}
                  </p>
                )
              )}
            </div>

            {/* Interest Periods */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Interest Periods to Pay <span className="text-text-tertiary">(optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={interestPeriods}
                  onChange={handlePeriodsChange}
                  placeholder="0"
                  className={`w-full px-4 py-3 bg-bg-secondary rounded-xl border text-text-primary
                             text-right text-xl font-semibold placeholder:text-text-tertiary
                             focus:outline-none focus:ring-2 focus:ring-primary/50
                             ${errors.periods ? 'border-danger' : 'border-bg-tertiary'}`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">
                  periods
                </span>
              </div>
              {errors.periods ? (
                <p className="text-sm text-danger">{errors.periods}</p>
              ) : (
                (parseInt(interestPeriods, 10) || 0) > 0 && (
                  <p className="text-sm text-text-tertiary">
                    Amount: ฿{formatAmount(interestAmount)}
                  </p>
                )
              )}
            </div>

            {/* Total Payment */}
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-primary">Total Payment</p>
                <p className="text-2xl font-bold text-primary">฿{formatAmount(totalPayment)}</p>
              </div>
            </div>

            {/* Payment Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Payment Date</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className={`w-full flex items-center justify-between px-4 py-3 bg-bg-secondary rounded-xl border text-text-primary
                             focus:outline-none focus:ring-2 focus:ring-primary/50
                             ${errors.paymentDate ? 'border-danger' : 'border-bg-tertiary'}`}
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-text-tertiary" />
                    {getDateLabel(paymentDate)}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-text-tertiary transition-transform ${showDatePicker ? 'rotate-180' : ''}`}
                  />
                </button>

                {showDatePicker && (
                  <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-bg-primary rounded-xl border border-bg-tertiary shadow-lg z-10">
                    <input
                      type="date"
                      value={paymentDate}
                      max={formatDateForInput(new Date())}
                      onChange={(e) => {
                        setPaymentDate(e.target.value)
                        setShowDatePicker(false)
                        if (errors.paymentDate) {
                          setErrors((prev) => ({ ...prev, paymentDate: undefined }))
                        }
                      }}
                      className="w-full px-4 py-3 bg-bg-secondary rounded-xl border border-bg-tertiary text-text-primary
                                focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                )}
              </div>
              {errors.paymentDate && <p className="text-sm text-danger">{errors.paymentDate}</p>}
            </div>

            {/* Account Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                {loan.direction === 'borrow' ? 'Pay From Account' : 'Receive To Account'}
              </label>
              <div className="relative">
                <select
                  value={accountId}
                  onChange={(e) => {
                    setAccountId(e.target.value)
                    if (errors.accountId) {
                      setErrors((prev) => ({ ...prev, accountId: undefined }))
                    }
                  }}
                  className={`w-full appearance-none px-4 py-3 bg-bg-secondary rounded-xl border text-text-primary
                             focus:outline-none focus:ring-2 focus:ring-primary/50
                             ${errors.accountId ? 'border-danger' : 'border-bg-tertiary'}`}
                >
                  <option value="">Select account</option>
                  {accounts
                    .filter((a) => a.isActive)
                    .map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.icon} {account.name}
                      </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none" />
              </div>
              {errors.accountId && <p className="text-sm text-danger">{errors.accountId}</p>}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Notes <span className="text-text-tertiary">(optional)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add notes..."
                rows={2}
                className="w-full px-4 py-3 bg-bg-secondary rounded-xl border border-bg-tertiary
                          text-text-primary placeholder:text-text-tertiary
                          focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-primary text-white font-semibold rounded-xl
                        transition-all duration-200 active:scale-[0.98]
                        hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed
                        flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
              Record Payment
            </button>
          </form>
        )}
      </div>

      {/* Close date picker when clicking outside */}
      {showDatePicker && (
        <div className="fixed inset-0 z-0" onClick={() => setShowDatePicker(false)} />
      )}
    </div>
  )
}
