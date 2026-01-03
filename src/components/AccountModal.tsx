import { useState, useEffect } from 'react'
import { X, Trash2, Loader2 } from 'lucide-react'
import type {
  Account,
  AccountType,
  CreateAccountDto,
  UpdateAccountDto,
} from '@/types/account'
import {
  ACCOUNT_TYPE_LABELS,
  ACCOUNT_TYPE_ICONS,
  ACCOUNT_COLORS,
  ACCOUNT_ICONS,
} from '@/types/account'

interface AccountModalProps {
  isOpen: boolean
  account: Account | null
  onClose: () => void
  onSave: (data: CreateAccountDto | UpdateAccountDto) => Promise<void>
  onDelete?: () => void
  isSaving: boolean
}

const ACCOUNT_TYPES: AccountType[] = ['cash', 'bank', 'ewallet', 'credit_card']

export function AccountModal({
  isOpen,
  account,
  onClose,
  onSave,
  onDelete,
  isSaving,
}: AccountModalProps) {
  const isEditMode = !!account

  const [name, setName] = useState('')
  const [type, setType] = useState<AccountType>('cash')
  const [initialBalance, setInitialBalance] = useState('')
  const [icon, setIcon] = useState('💵')
  const [color, setColor] = useState(ACCOUNT_COLORS[0])
  const [isActive, setIsActive] = useState(true)

  // Reset form when modal opens/closes or account changes
  useEffect(() => {
    if (isOpen && account) {
      setName(account.name)
      setType(account.type)
      setInitialBalance(account.initialBalance.toString())
      setIcon(account.icon)
      setColor(account.color)
      setIsActive(account.isActive)
    } else if (isOpen) {
      setName('')
      setType('cash')
      setInitialBalance('')
      setIcon(ACCOUNT_TYPE_ICONS['cash'])
      setColor(ACCOUNT_COLORS[0])
      setIsActive(true)
    }
  }, [isOpen, account])

  // Update icon when type changes (only in create mode)
  useEffect(() => {
    if (!isEditMode) {
      setIcon(ACCOUNT_TYPE_ICONS[type])
    }
  }, [type, isEditMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditMode) {
      const updateData: UpdateAccountDto = {
        name,
        type,
        icon,
        color,
        isActive,
      }
      await onSave(updateData)
    } else {
      const createData: CreateAccountDto = {
        name,
        type,
        initialBalance: parseFloat(initialBalance) || 0,
        icon,
        color,
      }
      await onSave(createData)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-bg-primary z-[100] flex flex-col pt-safe pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-bg-tertiary">
        <button
          onClick={onClose}
          className="touch-target flex items-center justify-center text-primary"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">
          {isEditMode ? 'Edit Account' : 'Add Account'}
        </h1>
        <div className="w-11" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Savings"
              required
              className="w-full px-4 py-3 bg-bg-secondary rounded-xl border border-bg-tertiary
                         text-text-primary placeholder:text-text-tertiary
                         focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ACCOUNT_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    type === t
                      ? 'bg-primary text-white'
                      : 'bg-bg-secondary text-text-secondary'
                  }`}
                >
                  {ACCOUNT_TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Initial Balance */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              {isEditMode ? 'Initial Balance' : 'Initial Balance'}
            </label>
            {isEditMode ? (
              <div className="px-4 py-3 bg-bg-tertiary rounded-xl text-text-secondary">
                {formatCurrency(account?.initialBalance || 0)}
                <span className="text-xs ml-2">(Cannot be changed)</span>
              </div>
            ) : (
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary">
                  ฿
                </span>
                <input
                  type="number"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                  placeholder="0"
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 bg-bg-secondary rounded-xl border border-bg-tertiary
                             text-text-primary placeholder:text-text-tertiary
                             focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            )}
          </div>

          {/* Current Balance (Edit mode only) */}
          {isEditMode && account && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Current Balance
              </label>
              <div className="px-4 py-3 bg-bg-tertiary rounded-xl text-text-primary font-semibold">
                {formatCurrency(account.currentBalance)}
              </div>
            </div>
          )}

          {/* Icon Picker */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {ACCOUNT_ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`w-12 h-12 rounded-xl text-2xl transition-all ${
                    icon === i
                      ? 'bg-primary/20 ring-2 ring-primary'
                      : 'bg-bg-secondary'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {ACCOUNT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-full transition-all ${
                    color === c ? 'ring-2 ring-offset-2 ring-primary' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Active Toggle (Edit mode only) */}
          {isEditMode && (
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-text-secondary">
                Active
              </span>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  isActive ? 'bg-primary' : 'bg-bg-tertiary'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSaving || !name.trim()}
            className="w-full px-4 py-3 bg-primary text-white font-semibold rounded-xl
                       transition-all duration-200 active:scale-[0.98]
                       hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            {isSaving && <Loader2 className="w-5 h-5 animate-spin" />}
            {isEditMode ? 'Save Changes' : 'Create'}
          </button>

          {/* Delete Button (Edit mode only) */}
          {isEditMode && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="w-full px-4 py-3 text-danger font-semibold rounded-xl
                         transition-all duration-200 active:scale-[0.98]
                         border border-danger/30 hover:bg-danger/10
                         flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Delete Account
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
