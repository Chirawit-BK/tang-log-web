import { useState, useEffect } from 'react'
import { X, ChevronDown, Calendar, Loader2 } from 'lucide-react'
import type { LoanDirection, InterestType, InterestPeriod } from '@/types/loan'
import { INTEREST_TYPE_LABELS, INTEREST_PERIOD_LABELS } from '@/types/loan'
import type { CreateLoanDto } from '@/api/loans'
import { useAccounts } from '@/hooks/useAccounts'
import { useLoans } from '@/hooks/useLoans'

interface AddLoanModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface FormErrors {
  counterpartyName?: string
  principal?: string
  accountId?: string
  interestRate?: string
  interestStartDate?: string
  dueDate?: string
}

const DIRECTION_OPTIONS: { value: LoanDirection; label: string }[] = [
  { value: 'borrow', label: 'Borrowing' },
  { value: 'lend', label: 'Lending' },
]

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

export function AddLoanModal({ isOpen, onClose, onSuccess }: AddLoanModalProps) {
  const { accounts, isLoading: isLoadingAccounts } = useAccounts()
  const { createLoan, isCreating } = useLoans()

  // Form state
  const [direction, setDirection] = useState<LoanDirection>('borrow')
  const [counterpartyName, setCounterpartyName] = useState('')
  const [principal, setPrincipal] = useState('')
  const [accountId, setAccountId] = useState('')
  const [interestType, setInterestType] = useState<InterestType>('fixed')
  const [interestRate, setInterestRate] = useState('')
  const [interestPeriod, setInterestPeriod] = useState<InterestPeriod>('monthly')
  const [interestStartDate, setInterestStartDate] = useState(formatDateForInput(new Date()))
  const [dueDate, setDueDate] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [showInterestStartDatePicker, setShowInterestStartDatePicker] = useState(false)
  const [showDueDatePicker, setShowDueDatePicker] = useState(false)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setDirection('borrow')
      setCounterpartyName('')
      setPrincipal('')
      setAccountId(accounts[0]?.id || '')
      setInterestType('fixed')
      setInterestRate('')
      setInterestPeriod('monthly')
      setInterestStartDate(formatDateForInput(new Date()))
      setDueDate('')
      setNote('')
      setErrors({})
    }
  }, [isOpen, accounts])

  // Set default account when accounts load
  useEffect(() => {
    if (accounts.length > 0 && !accountId) {
      setAccountId(accounts[0].id)
    }
  }, [accounts, accountId])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!counterpartyName.trim()) {
      newErrors.counterpartyName = 'Please enter a name'
    }

    const principalValue = parseAmount(principal)
    if (!principalValue || principalValue <= 0) {
      newErrors.principal = 'Amount must be greater than 0'
    }

    if (!accountId) {
      newErrors.accountId = 'Please select an account'
    }

    // Interest rate is optional (0 for zero-interest loans)
    const interestRateValue = parseAmount(interestRate)
    if (interestRateValue < 0) {
      newErrors.interestRate = 'Interest rate cannot be negative'
    }

    if (!interestStartDate) {
      newErrors.interestStartDate = 'Please select a start date'
    }

    // Due date validation (if provided, must be after start date)
    if (dueDate) {
      const startDate = new Date(interestStartDate)
      const dueDateObj = new Date(dueDate)
      if (dueDateObj <= startDate) {
        newErrors.dueDate = 'Due date must be after start date'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const data: CreateLoanDto = {
      direction,
      counterpartyName: counterpartyName.trim(),
      principal: parseAmount(principal),
      accountId,
      interestType,
      interestRate: parseAmount(interestRate),
      interestPeriod,
      interestStartDate: new Date(interestStartDate).toISOString(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      note: note.trim() || undefined,
    }

    const result = await createLoan(data)

    if (result) {
      onSuccess?.()
      onClose()
    }
  }

  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    setPrincipal(raw)
    if (errors.principal) {
      setErrors((prev) => ({ ...prev, principal: undefined }))
    }
  }

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '')
    setInterestRate(raw)
    if (errors.interestRate) {
      setErrors((prev) => ({ ...prev, interestRate: undefined }))
    }
  }

  if (!isOpen) {
    return null
  }

  const isLoading = isLoadingAccounts
  const displayPrincipal = principal ? formatAmount(parseInt(principal, 10)) : ''

  return (
    <div className="fixed inset-0 bg-bg-primary z-[100] flex flex-col pt-safe pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-bg-tertiary">
        <button
          onClick={onClose}
          className="touch-target flex items-center justify-center text-primary"
          aria-label="Close"
          disabled={isCreating}
        >
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">Add Loan</h1>
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
            {/* Direction Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">I am...</label>
              <div className="flex gap-2">
                {DIRECTION_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDirection(option.value)}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                      direction === option.value
                        ? option.value === 'borrow'
                          ? 'bg-danger text-white'
                          : 'bg-success text-white'
                        : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Counterparty Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                {direction === 'borrow' ? 'Borrowing from' : 'Lending to'}
              </label>
              <input
                type="text"
                value={counterpartyName}
                onChange={(e) => {
                  setCounterpartyName(e.target.value)
                  if (errors.counterpartyName) {
                    setErrors((prev) => ({ ...prev, counterpartyName: undefined }))
                  }
                }}
                placeholder="Name..."
                className={`w-full px-4 py-3 bg-bg-secondary rounded-xl border text-text-primary
                           placeholder:text-text-tertiary
                           focus:outline-none focus:ring-2 focus:ring-primary/50
                           ${errors.counterpartyName ? 'border-danger' : 'border-bg-tertiary'}`}
              />
              {errors.counterpartyName && (
                <p className="text-sm text-danger">{errors.counterpartyName}</p>
              )}
            </div>

            {/* Principal Amount */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Principal Amount
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
              {errors.principal && <p className="text-sm text-danger">{errors.principal}</p>}
            </div>

            {/* Account Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Account</label>
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

            {/* Interest Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Interest Type</label>
              <div className="flex gap-2">
                {(Object.entries(INTEREST_TYPE_LABELS) as [InterestType, string][]).map(
                  ([type, label]) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setInterestType(type)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        interestType === type
                          ? 'bg-primary text-white'
                          : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Interest Rate/Amount */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Interest {interestType === 'fixed' ? 'Amount' : 'Rate'}
              </label>
              <div className="relative">
                {interestType === 'fixed' && (
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary font-medium">
                    ฿
                  </span>
                )}
                <input
                  type="text"
                  inputMode="decimal"
                  value={interestRate}
                  onChange={handleInterestRateChange}
                  placeholder="0"
                  className={`w-full ${interestType === 'fixed' ? 'pl-10' : 'pl-4'} pr-16 py-3 bg-bg-secondary rounded-xl border text-text-primary
                             text-right font-medium placeholder:text-text-tertiary
                             focus:outline-none focus:ring-2 focus:ring-primary/50
                             ${errors.interestRate ? 'border-danger' : 'border-bg-tertiary'}`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">
                  {interestType === 'fixed' ? '/ period' : '% / period'}
                </span>
              </div>
              {errors.interestRate && <p className="text-sm text-danger">{errors.interestRate}</p>}
              <p className="text-xs text-text-tertiary">Leave empty for zero-interest loan</p>
            </div>

            {/* Interest Period */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Interest Period
              </label>
              <div className="flex gap-2">
                {(Object.entries(INTEREST_PERIOD_LABELS) as [InterestPeriod, string][]).map(
                  ([period, label]) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => setInterestPeriod(period)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        interestPeriod === period
                          ? 'bg-primary text-white'
                          : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Interest Start Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Interest Start Date
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowInterestStartDatePicker(!showInterestStartDatePicker)}
                  className={`w-full flex items-center justify-between px-4 py-3 bg-bg-secondary rounded-xl border text-text-primary
                             focus:outline-none focus:ring-2 focus:ring-primary/50
                             ${errors.interestStartDate ? 'border-danger' : 'border-bg-tertiary'}`}
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-text-tertiary" />
                    {getDateLabel(interestStartDate)}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-text-tertiary transition-transform ${showInterestStartDatePicker ? 'rotate-180' : ''}`}
                  />
                </button>

                {showInterestStartDatePicker && (
                  <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-bg-primary rounded-xl border border-bg-tertiary shadow-lg z-10">
                    <input
                      type="date"
                      value={interestStartDate}
                      onChange={(e) => {
                        setInterestStartDate(e.target.value)
                        setShowInterestStartDatePicker(false)
                        if (errors.interestStartDate) {
                          setErrors((prev) => ({ ...prev, interestStartDate: undefined }))
                        }
                      }}
                      className="w-full px-4 py-3 bg-bg-secondary rounded-xl border border-bg-tertiary text-text-primary
                                focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                )}
              </div>
              {errors.interestStartDate && (
                <p className="text-sm text-danger">{errors.interestStartDate}</p>
              )}
            </div>

            {/* Due Date (Optional) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Due Date <span className="text-text-tertiary">(optional)</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDueDatePicker(!showDueDatePicker)}
                  className={`w-full flex items-center justify-between px-4 py-3 bg-bg-secondary rounded-xl border text-text-primary
                             focus:outline-none focus:ring-2 focus:ring-primary/50
                             ${errors.dueDate ? 'border-danger' : 'border-bg-tertiary'}`}
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-text-tertiary" />
                    {dueDate ? getDateLabel(dueDate) : 'Select...'}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-text-tertiary transition-transform ${showDueDatePicker ? 'rotate-180' : ''}`}
                  />
                </button>

                {showDueDatePicker && (
                  <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-bg-primary rounded-xl border border-bg-tertiary shadow-lg z-10">
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => {
                        setDueDate(e.target.value)
                        setShowDueDatePicker(false)
                        if (errors.dueDate) {
                          setErrors((prev) => ({ ...prev, dueDate: undefined }))
                        }
                      }}
                      min={interestStartDate}
                      className="w-full px-4 py-3 bg-bg-secondary rounded-xl border border-bg-tertiary text-text-primary
                                focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    {dueDate && (
                      <button
                        type="button"
                        onClick={() => {
                          setDueDate('')
                          setShowDueDatePicker(false)
                        }}
                        className="w-full mt-2 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg transition-colors"
                      >
                        Clear due date
                      </button>
                    )}
                  </div>
                )}
              </div>
              {errors.dueDate && <p className="text-sm text-danger">{errors.dueDate}</p>}
            </div>

            {/* Note (Optional) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Notes <span className="text-text-tertiary">(optional)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add notes..."
                rows={3}
                className="w-full px-4 py-3 bg-bg-secondary rounded-xl border border-bg-tertiary
                          text-text-primary placeholder:text-text-tertiary
                          focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isCreating}
              className="w-full px-4 py-3 bg-primary text-white font-semibold rounded-xl
                        transition-all duration-200 active:scale-[0.98]
                        hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed
                        flex items-center justify-center gap-2"
            >
              {isCreating && <Loader2 className="w-5 h-5 animate-spin" />}
              Create
            </button>
          </form>
        )}
      </div>

      {/* Close date pickers when clicking outside */}
      {(showInterestStartDatePicker || showDueDatePicker) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowInterestStartDatePicker(false)
            setShowDueDatePicker(false)
          }}
        />
      )}
    </div>
  )
}
