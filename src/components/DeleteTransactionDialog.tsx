import { Loader2, AlertTriangle } from 'lucide-react'
import type { Transaction } from '@/types/transaction'
import { TRANSACTION_KIND_LABELS } from '@/types/transaction'

interface DeleteTransactionDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  transaction: Transaction | null
  isDeleting: boolean
}

function formatAmount(amount: number): string {
  return amount.toLocaleString('th-TH')
}

export function DeleteTransactionDialog({
  isOpen,
  onClose,
  onConfirm,
  transaction,
  isDeleting,
}: DeleteTransactionDialogProps) {
  if (!isOpen || !transaction) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={isDeleting ? undefined : onClose}
      />

      {/* Dialog */}
      <div className="relative bg-bg-primary rounded-2xl w-full max-w-sm p-6 shadow-xl">
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-danger/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-danger" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-text-primary text-center mb-2">
          Delete Transaction?
        </h2>

        {/* Description */}
        <p className="text-text-secondary text-center mb-4">
          This action cannot be undone. The following transaction will be permanently deleted:
        </p>

        {/* Transaction Details */}
        <div className="bg-bg-secondary rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-tertiary">
              {TRANSACTION_KIND_LABELS[transaction.kind]}
            </span>
            <span className={`text-lg font-semibold ${
              transaction.kind === 'income' ? 'text-success' :
              transaction.kind === 'expense' ? 'text-danger' : 'text-primary'
            }`}>
              {transaction.kind === 'income' ? '+' : transaction.kind === 'expense' ? '-' : ''}
              ฿{formatAmount(transaction.amount)}
            </span>
          </div>
          {transaction.note && (
            <p className="text-sm text-text-primary truncate">{transaction.note}</p>
          )}
          {transaction.categoryName && (
            <p className="text-xs text-text-tertiary mt-1">
              {transaction.categoryIcon} {transaction.categoryName}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-bg-secondary text-text-primary font-medium rounded-xl
                      transition-all duration-200 hover:bg-bg-tertiary
                      disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-danger text-white font-medium rounded-xl
                      transition-all duration-200 hover:bg-danger/90
                      disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center justify-center gap-2"
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
