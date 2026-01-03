import { useNavigate } from 'react-router-dom'
import { ChevronRight, Calendar, User } from 'lucide-react'
import type { Loan } from '@/types/loan'

interface LoanCardProps {
  loan: Loan
}

export function LoanCard({ loan }: LoanCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/loans/${loan.id}`)
  }

  // Format amount with Thai Baht
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Card styling based on direction and status
  const getCardStyle = () => {
    if (loan.status === 'closed') {
      return 'bg-bg-tertiary/50'
    }
    if (loan.direction === 'borrow') {
      return 'bg-danger/10'
    }
    return 'bg-success/10'
  }

  // Status badge styling
  const getStatusBadge = () => {
    if (loan.status === 'closed') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold border-2 border-border bg-bg-tertiary text-text-tertiary">
          Closed
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold border-2 border-border bg-primary text-white">
        Active
      </span>
    )
  }

  // Icon color based on direction
  const getIconColor = () => {
    if (loan.status === 'closed') return 'text-text-tertiary'
    return loan.direction === 'borrow' ? 'text-danger' : 'text-success'
  }

  const isActive = loan.status === 'active'
  const hasOutstanding = loan.outstandingPrincipal > 0
  const hasInterestAccrued = loan.interestAccrued > 0

  return (
    <button
      onClick={handleClick}
      className={`neo-card w-full p-4 text-left ${getCardStyle()}`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-lg bg-bg-secondary border-2 border-border flex items-center justify-center flex-shrink-0 ${getIconColor()}`}
        >
          <User className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header row: Name and Status */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="font-semibold text-text-primary truncate">{loan.counterpartyName}</p>
            {getStatusBadge()}
          </div>

          {/* Financial info */}
          <div className="space-y-1">
            {/* Principal */}
            <div className="flex justify-between text-sm">
              <span className="text-text-tertiary">Principal:</span>
              <span className="text-text-primary font-medium">฿{formatAmount(loan.principal)}</span>
            </div>

            {/* Outstanding (only if active and has balance) */}
            {isActive && hasOutstanding && (
              <div className="flex justify-between text-sm">
                <span className="text-text-tertiary">Outstanding:</span>
                <span
                  className={`font-medium ${loan.direction === 'borrow' ? 'text-danger' : 'text-success'}`}
                >
                  ฿{formatAmount(loan.outstandingPrincipal)}
                </span>
              </div>
            )}

            {/* Interest accrued (only if active and has interest) */}
            {isActive && hasInterestAccrued && (
              <div className="flex justify-between text-sm">
                <span className="text-text-tertiary">Interest:</span>
                <span className="text-warning font-medium">
                  ฿{formatAmount(loan.interestAccrued)} accrued
                </span>
              </div>
            )}

            {/* Due date (only if set and active) */}
            {isActive && loan.dueDate && (
              <div className="flex items-center gap-1 text-sm text-text-tertiary mt-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Due: {formatDate(loan.dueDate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Chevron */}
        <ChevronRight className="w-5 h-5 text-text-tertiary flex-shrink-0 mt-1" />
      </div>
    </button>
  )
}
