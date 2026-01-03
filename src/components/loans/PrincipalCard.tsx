import type { LoanDetail } from '@/types/loan'

interface PrincipalCardProps {
  loan: LoanDetail
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function PrincipalCard({ loan }: PrincipalCardProps) {
  const principalPaid = loan.principal - loan.outstandingPrincipal
  const percentagePaid = loan.principal > 0 ? (principalPaid / loan.principal) * 100 : 0

  return (
    <div className="neo-card p-4">
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-xs text-text-tertiary uppercase tracking-wide mb-1">Principal</p>
          <p className="text-lg font-semibold text-text-primary">฿{formatAmount(loan.principal)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-tertiary uppercase tracking-wide mb-1">Outstanding</p>
          <p
            className={`text-lg font-semibold ${
              loan.outstandingPrincipal > 0
                ? loan.direction === 'borrow'
                  ? 'text-danger'
                  : 'text-success'
                : 'text-text-primary'
            }`}
          >
            ฿{formatAmount(loan.outstandingPrincipal)}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              loan.direction === 'borrow' ? 'bg-danger' : 'bg-success'
            }`}
            style={{ width: `${Math.min(percentagePaid, 100)}%` }}
          />
        </div>
        <p className="text-xs text-text-tertiary text-right">{percentagePaid.toFixed(0)}% paid</p>
      </div>
    </div>
  )
}
