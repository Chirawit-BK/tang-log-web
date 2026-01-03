import { useState, useEffect, useMemo } from 'react'
import { X, ChevronDown, Calendar, Loader2 } from 'lucide-react'
import type { Transaction, TransactionKind } from '@/types/transaction'
import type { WasteLevel } from '@/types/dashboard'
import type { CreateTransactionDto } from '@/api/transactions'
import { TRANSACTION_KIND_LABELS } from '@/types/transaction'
import { useAccounts } from '@/hooks/useAccounts'
import { useCategories } from '@/hooks/useCategories'
import { useTransactions } from '@/hooks/useTransactions'
import { WasteLevelSelector, WasteLevelOnboarding } from '@/components/waste'

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  editTransaction?: Transaction | null
  onSuccess?: () => void
}

interface FormErrors {
  amount?: string
  accountId?: string
  toAccountId?: string
  categoryId?: string
  wasteLevel?: string
  transactionDate?: string
}

const KIND_OPTIONS: { value: Exclude<TransactionKind, 'loan_flow'>; label: string }[] = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
  { value: 'transfer', label: 'Transfer' },
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

export function AddTransactionModal({
  isOpen,
  onClose,
  editTransaction,
  onSuccess,
}: AddTransactionModalProps) {
  const { accounts, isLoading: isLoadingAccounts } = useAccounts()
  const { incomeCategories, expenseCategories, isLoading: isLoadingCategories } = useCategories()
  const { createTransaction, updateTransaction, isCreating, isUpdating } = useTransactions()

  const isEditMode = !!editTransaction
  const isLoanFlow = editTransaction?.kind === 'loan_flow'

  // Form state
  const [kind, setKind] = useState<Exclude<TransactionKind, 'loan_flow'>>('expense')
  const [amount, setAmount] = useState('')
  const [accountId, setAccountId] = useState('')
  const [toAccountId, setToAccountId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [wasteLevel, setWasteLevel] = useState<WasteLevel | ''>('')
  const [transactionDate, setTransactionDate] = useState(formatDateForInput(new Date()))
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Reset form when modal opens/closes or edit transaction changes
  useEffect(() => {
    if (isOpen) {
      if (editTransaction) {
        setKind(editTransaction.kind === 'loan_flow' ? 'expense' : editTransaction.kind)
        setAmount(editTransaction.amount.toString())
        setAccountId(editTransaction.accountId)
        setToAccountId(editTransaction.toAccountId || '')
        setCategoryId(editTransaction.categoryId || '')
        setWasteLevel(editTransaction.wasteLevel || '')
        setTransactionDate(formatDateForInput(new Date(editTransaction.transactionDate)))
        setNote(editTransaction.note || '')
      } else {
        // Reset for new transaction
        setKind('expense')
        setAmount('')
        setAccountId(accounts[0]?.id || '')
        setToAccountId('')
        setCategoryId('')
        setWasteLevel('')
        setTransactionDate(formatDateForInput(new Date()))
        setNote('')
      }
      setErrors({})
    }
  }, [isOpen, editTransaction, accounts])

  // Set default account when accounts load
  useEffect(() => {
    if (!isEditMode && accounts.length > 0 && !accountId) {
      setAccountId(accounts[0].id)
    }
  }, [accounts, isEditMode, accountId])

  // Filter categories based on kind
  const availableCategories = useMemo(() => {
    if (kind === 'income') return incomeCategories
    if (kind === 'expense') return expenseCategories
    return []
  }, [kind, incomeCategories, expenseCategories])

  // Reset category when kind changes (if current category doesn't match)
  useEffect(() => {
    if (kind === 'transfer') {
      setCategoryId('')
      setWasteLevel('')
    } else {
      const currentCategoryValid = availableCategories.some((c) => c.id === categoryId)
      if (!currentCategoryValid) {
        setCategoryId('')
      }
      if (kind === 'income') {
        setWasteLevel('')
      }
    }
  }, [kind, availableCategories, categoryId])

  // Available accounts for "to" selector (exclude selected "from" account)
  const availableToAccounts = useMemo(() => {
    return accounts.filter((a) => a.id !== accountId && a.isActive)
  }, [accounts, accountId])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    const amountValue = parseAmount(amount)
    if (!amountValue || amountValue <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }

    if (!accountId) {
      newErrors.accountId = 'Please select an account'
    }

    if (kind === 'transfer') {
      if (!toAccountId) {
        newErrors.toAccountId = 'Please select destination account'
      } else if (toAccountId === accountId) {
        newErrors.toAccountId = 'Cannot transfer to the same account'
      }
    }

    if ((kind === 'income' || kind === 'expense') && !categoryId) {
      newErrors.categoryId = 'Please select a category'
    }

    if (kind === 'expense' && !wasteLevel) {
      newErrors.wasteLevel = 'Please select waste level'
    }

    if (!transactionDate) {
      newErrors.transactionDate = 'Please select a date'
    } else {
      const selectedDate = new Date(transactionDate)
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      if (selectedDate >= tomorrow) {
        newErrors.transactionDate = 'Cannot select future dates'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLoanFlow) return // LOAN_FLOW is read-only

    if (!validateForm()) return

    const amountValue = parseAmount(amount)

    const data: CreateTransactionDto = {
      kind,
      amount: amountValue,
      accountId,
      transactionDate: new Date(transactionDate).toISOString(),
      note: note.trim() || undefined,
      categoryId: kind !== 'transfer' ? categoryId : undefined,
      toAccountId: kind === 'transfer' ? toAccountId : undefined,
      wasteLevel: kind === 'expense' ? (wasteLevel as WasteLevel) : undefined,
    }

    let success = false

    if (isEditMode && editTransaction) {
      const result = await updateTransaction(editTransaction.id, data)
      success = !!result
    } else {
      const result = await createTransaction(data)
      success = !!result
    }

    if (success) {
      onSuccess?.()
      onClose()
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    setAmount(raw)
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: undefined }))
    }
  }

  const handleDateQuickSelect = (type: 'today' | 'yesterday') => {
    const date = new Date()
    if (type === 'yesterday') {
      date.setDate(date.getDate() - 1)
    }
    setTransactionDate(formatDateForInput(date))
    setShowDatePicker(false)
  }

  if (!isOpen) {
    return null
  }

  const isLoading = isLoadingAccounts || isLoadingCategories
  const isSaving = isCreating || isUpdating
  const displayAmount = amount ? formatAmount(parseInt(amount, 10)) : ''

  return (
    <div className="fixed inset-0 bg-bg-primary z-[100] flex flex-col pt-safe pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b-3 border-border">
        <button
          onClick={onClose}
          className="touch-target flex items-center justify-center text-primary"
          aria-label="Close"
          disabled={isSaving}
        >
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-text-primary">
          {isEditMode ? 'Edit Transaction' : 'Add Transaction'}
        </h1>
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
            {/* LOAN_FLOW Notice */}
            {isLoanFlow && (
              <div className="p-4 bg-warning/20 border-3 border-warning rounded-xl">
                <p className="text-sm text-warning font-bold">
                  Loan transactions cannot be edited. They are managed through the Loans module.
                </p>
              </div>
            )}

            {/* Kind Selector - Read-only in edit mode */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Type</label>
              {isEditMode ? (
                <div className="px-4 py-3 bg-bg-tertiary rounded-xl text-text-primary font-medium">
                  {TRANSACTION_KIND_LABELS[editTransaction?.kind || kind]}
                </div>
              ) : (
                <div className="flex gap-2">
                  {KIND_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setKind(option.value)}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold border-2 border-border
                                 shadow-[2px_2px_0px_#1a1a1a] active:shadow-none active:translate-x-0.5 active:translate-y-0.5
                                 transition-all duration-200 ${
                        kind === option.value
                          ? 'bg-primary text-white'
                          : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary font-medium">
                  ฿
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={displayAmount}
                  onChange={handleAmountChange}
                  placeholder="0"
                  disabled={isLoanFlow}
                  className={`neo-input w-full pl-10 pr-4 py-3 bg-bg-secondary rounded-xl text-text-primary
                             text-right text-xl font-bold placeholder:text-text-tertiary
                             disabled:opacity-50 disabled:cursor-not-allowed
                             ${errors.amount ? 'border-danger' : ''}`}
                />
              </div>
              {errors.amount && <p className="text-sm text-danger">{errors.amount}</p>}
            </div>

            {/* Account Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                {kind === 'transfer' ? 'From Account' : 'Account'}
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
                  disabled={isLoanFlow}
                  className={`neo-input w-full appearance-none px-4 py-3 bg-bg-secondary rounded-xl text-text-primary
                             disabled:opacity-50 disabled:cursor-not-allowed
                             ${errors.accountId ? 'border-danger' : ''}`}
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

            {/* To Account (Transfer only) */}
            {kind === 'transfer' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-secondary">To Account</label>
                <div className="relative">
                  <select
                    value={toAccountId}
                    onChange={(e) => {
                      setToAccountId(e.target.value)
                      if (errors.toAccountId) {
                        setErrors((prev) => ({ ...prev, toAccountId: undefined }))
                      }
                    }}
                    disabled={isLoanFlow}
                    className={`neo-input w-full appearance-none px-4 py-3 bg-bg-secondary rounded-xl text-text-primary
                               disabled:opacity-50 disabled:cursor-not-allowed
                               ${errors.toAccountId ? 'border-danger' : ''}`}
                  >
                    <option value="">Select destination account</option>
                    {availableToAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.icon} {account.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none" />
                </div>
                {errors.toAccountId && <p className="text-sm text-danger">{errors.toAccountId}</p>}
              </div>
            )}

            {/* Category Selector (Income/Expense only) */}
            {kind !== 'transfer' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-secondary">Category</label>
                <div className="relative">
                  <select
                    value={categoryId}
                    onChange={(e) => {
                      setCategoryId(e.target.value)
                      if (errors.categoryId) {
                        setErrors((prev) => ({ ...prev, categoryId: undefined }))
                      }
                    }}
                    disabled={isLoanFlow}
                    className={`neo-input w-full appearance-none px-4 py-3 bg-bg-secondary rounded-xl text-text-primary
                               disabled:opacity-50 disabled:cursor-not-allowed
                               ${errors.categoryId ? 'border-danger' : ''}`}
                  >
                    <option value="">Select category</option>
                    {availableCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none" />
                </div>
                {errors.categoryId && <p className="text-sm text-danger">{errors.categoryId}</p>}
              </div>
            )}

            {/* Waste Level (Expense only) */}
            {kind === 'expense' && (
              <WasteLevelOnboarding>
                <WasteLevelSelector
                  value={wasteLevel || null}
                  onChange={(level) => {
                    setWasteLevel(level)
                    if (errors.wasteLevel) {
                      setErrors((prev) => ({ ...prev, wasteLevel: undefined }))
                    }
                  }}
                  disabled={isLoanFlow}
                  error={errors.wasteLevel}
                />
              </WasteLevelOnboarding>
            )}

            {/* Date Picker */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Date</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  disabled={isLoanFlow}
                  className={`neo-input w-full flex items-center justify-between px-4 py-3 bg-bg-secondary rounded-xl text-text-primary
                             disabled:opacity-50 disabled:cursor-not-allowed
                             ${errors.transactionDate ? 'border-danger' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-text-tertiary" />
                    {getDateLabel(transactionDate)}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-text-tertiary transition-transform ${showDatePicker ? 'rotate-180' : ''}`}
                  />
                </button>

                {showDatePicker && (
                  <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-bg-secondary rounded-xl border-3 border-border shadow-[4px_4px_0px_#1a1a1a] z-10">
                    {/* Quick options */}
                    <div className="flex gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => handleDateQuickSelect('today')}
                        className={`flex-1 py-2 px-3 rounded-lg font-bold border-2 border-border transition-all
                                   shadow-[2px_2px_0px_#1a1a1a] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 ${
                          getDateLabel(transactionDate) === 'Today'
                            ? 'bg-primary text-white'
                            : 'bg-bg-tertiary text-text-secondary hover:bg-bg-tertiary'
                        }`}
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDateQuickSelect('yesterday')}
                        className={`flex-1 py-2 px-3 rounded-lg font-bold border-2 border-border transition-all
                                   shadow-[2px_2px_0px_#1a1a1a] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 ${
                          getDateLabel(transactionDate) === 'Yesterday'
                            ? 'bg-primary text-white'
                            : 'bg-bg-tertiary text-text-secondary hover:bg-bg-tertiary'
                        }`}
                      >
                        Yesterday
                      </button>
                    </div>

                    {/* Date input */}
                    <input
                      type="date"
                      value={transactionDate}
                      onChange={(e) => {
                        setTransactionDate(e.target.value)
                        if (errors.transactionDate) {
                          setErrors((prev) => ({ ...prev, transactionDate: undefined }))
                        }
                      }}
                      max={formatDateForInput(new Date())}
                      className="neo-input w-full px-4 py-3 bg-bg-tertiary rounded-xl text-text-primary"
                    />
                  </div>
                )}
              </div>
              {errors.transactionDate && (
                <p className="text-sm text-danger">{errors.transactionDate}</p>
              )}
            </div>

            {/* Note Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Note <span className="text-text-tertiary">(optional)</span>
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's this for?"
                disabled={isLoanFlow}
                className="neo-input w-full px-4 py-3 bg-bg-secondary rounded-xl
                          text-text-primary placeholder:text-text-tertiary
                          disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Submit Button */}
            {!isLoanFlow && (
              <button
                type="submit"
                disabled={isSaving}
                className="neo-btn w-full px-4 py-3 bg-primary text-white
                          disabled:opacity-50 disabled:cursor-not-allowed
                          flex items-center justify-center gap-2"
              >
                {isSaving && <Loader2 className="w-5 h-5 animate-spin" />}
                {isEditMode ? 'Save Changes' : 'Add Transaction'}
              </button>
            )}
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
