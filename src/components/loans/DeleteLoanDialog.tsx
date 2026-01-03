import { Loader2 } from 'lucide-react'

interface DeleteLoanDialogProps {
  isOpen: boolean
  counterpartyName: string
  onClose: () => void
  onConfirm: () => void
  isDeleting: boolean
}

export function DeleteLoanDialog({
  isOpen,
  counterpartyName,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteLoanDialogProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={isDeleting ? undefined : onClose}
      />

      {/* Dialog */}
      <div className="relative bg-bg-secondary rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl">
        <h2 className="text-lg font-semibold text-text-primary mb-2">Delete Loan?</h2>

        <p className="text-text-secondary mb-1">
          The loan with "{counterpartyName}" will be deleted.
        </p>

        <p className="text-sm text-text-tertiary mb-6">
          All associated events and transactions will also be deleted. This cannot be undone.
        </p>

        <div className="space-y-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="w-full px-4 py-3 bg-bg-secondary text-text-primary font-medium rounded-xl
                       transition-colors active:bg-bg-tertiary disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full px-4 py-3 bg-danger text-white font-medium rounded-xl
                       transition-colors active:bg-danger/90 disabled:opacity-50
                       flex items-center justify-center gap-2"
          >
            {isDeleting && <Loader2 className="w-5 h-5 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
