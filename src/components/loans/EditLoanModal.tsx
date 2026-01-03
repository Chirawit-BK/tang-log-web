import { useState, useEffect } from 'react'
import { X, Calendar, ChevronDown, Loader2 } from 'lucide-react'
import type { LoanDetail } from '@/types/loan'

interface EditLoanModalProps {
  isOpen: boolean
  loan: LoanDetail | null
  onClose: () => void
  onSave: (data: { counterpartyName?: string; dueDate?: string | null; note?: string | null }) => Promise<boolean>
  isSaving: boolean
}

function formatDateForInput(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toISOString().split('T')[0]
}

function getDateLabel(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function EditLoanModal({ isOpen, loan, onClose, onSave, isSaving }: EditLoanModalProps) {
  const [counterpartyName, setCounterpartyName] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [note, setNote] = useState('')
  const [showDueDatePicker, setShowDueDatePicker] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset form when modal opens with loan data
  useEffect(() => {
    if (isOpen && loan) {
      setCounterpartyName(loan.counterpartyName)
      setDueDate(formatDateForInput(loan.dueDate))
      setNote(loan.note || '')
      setError(null)
    }
  }, [isOpen, loan])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!counterpartyName.trim()) {
      setError('Name is required')
      return
    }

    const success = await onSave({
      counterpartyName: counterpartyName.trim(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      note: note.trim() || null,
    })

    if (success) {
      onClose()
    }
  }

  if (!isOpen || !loan) {
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
          disabled={isSaving}
        >
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">Edit Loan</h1>
        <div className="w-11" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Counterparty Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              {loan.direction === 'borrow' ? 'Borrowing from' : 'Lending to'}
            </label>
            <input
              type="text"
              value={counterpartyName}
              onChange={(e) => {
                setCounterpartyName(e.target.value)
                setError(null)
              }}
              placeholder="Name..."
              className={`w-full px-4 py-3 bg-bg-secondary rounded-xl border text-text-primary
                         placeholder:text-text-tertiary
                         focus:outline-none focus:ring-2 focus:ring-primary/50
                         ${error ? 'border-danger' : 'border-bg-tertiary'}`}
            />
            {error && <p className="text-sm text-danger">{error}</p>}
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Due Date <span className="text-text-tertiary">(optional)</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDueDatePicker(!showDueDatePicker)}
                className="w-full flex items-center justify-between px-4 py-3 bg-bg-secondary rounded-xl border border-bg-tertiary text-text-primary
                           focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-text-tertiary" />
                  {dueDate ? getDateLabel(dueDate) : 'Not set'}
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
                    }}
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
          </div>

          {/* Note */}
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

          {/* Read-only info */}
          <div className="p-4 bg-bg-secondary rounded-xl">
            <p className="text-xs text-text-tertiary uppercase tracking-wide mb-2">
              Non-editable fields
            </p>
            <p className="text-sm text-text-secondary">
              Principal, interest rate, interest period, and start date cannot be changed after creation.
              To modify these, close this loan and create a new one.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full px-4 py-3 bg-primary text-white font-semibold rounded-xl
                      transition-all duration-200 active:scale-[0.98]
                      hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center justify-center gap-2"
          >
            {isSaving && <Loader2 className="w-5 h-5 animate-spin" />}
            Save Changes
          </button>
        </form>
      </div>

      {/* Close date picker when clicking outside */}
      {showDueDatePicker && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowDueDatePicker(false)}
        />
      )}
    </div>
  )
}
