import { useState, useRef, useEffect } from 'react'
import { MoreVertical, Edit2, CheckCircle, Trash2 } from 'lucide-react'
import type { LoanDetail } from '@/types/loan'

interface LoanActionsMenuProps {
  loan: LoanDetail
  onEdit: () => void
  onClose: () => void
  onDelete: () => void
}

export function LoanActionsMenu({ loan, onEdit, onClose, onDelete }: LoanActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const isActive = loan.status === 'active'
  const canClose = isActive && loan.outstandingPrincipal === 0 && loan.interestAccrued === 0

  const handleAction = (action: () => void) => {
    setIsOpen(false)
    action()
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="touch-target flex items-center justify-center text-text-secondary hover:text-primary transition-colors"
        aria-label="More actions"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 neo-card overflow-hidden z-50 p-0">
          {/* Edit */}
          <button
            onClick={() => handleAction(onEdit)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-text-primary hover:bg-bg-tertiary transition-colors"
          >
            <Edit2 className="w-4 h-4 text-text-tertiary" />
            <span>Edit Loan</span>
          </button>

          {/* Close Loan */}
          {isActive && (
            <button
              onClick={() => handleAction(onClose)}
              disabled={!canClose}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                canClose
                  ? 'text-text-primary hover:bg-bg-tertiary'
                  : 'text-text-tertiary cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <div>
                <span>Close Loan</span>
                {!canClose && (
                  <p className="text-xs text-text-tertiary">Outstanding balance must be 0</p>
                )}
              </div>
            </button>
          )}

          {/* Delete */}
          <button
            onClick={() => handleAction(onDelete)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-danger hover:bg-danger/5 transition-colors border-t border-bg-secondary"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Loan</span>
          </button>
        </div>
      )}
    </div>
  )
}
