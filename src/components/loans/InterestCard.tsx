import type { LoanDetail } from '@/types/loan'
import { INTEREST_PERIOD_LABELS } from '@/types/loan'

interface InterestCardProps {
  loan: LoanDetail
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function InterestCard({ loan }: InterestCardProps) {
  // Calculate interest per period
  const interestPerPeriod =
    loan.interestType === 'percentage'
      ? (loan.principal * loan.interestRate) / 100
      : loan.interestRate

  const periodLabel = loan.interestPeriod === 'weekly' ? 'wk' : 'mo'
  const periodLabelFull = INTEREST_PERIOD_LABELS[loan.interestPeriod].toLowerCase()

  // Format interest rate display
  const rateDisplay =
    loan.interestType === 'percentage'
      ? `${loan.interestRate}%/${periodLabel}`
      : `฿${formatAmount(loan.interestRate)}/${periodLabel}`

  return (
    <div className="neo-card p-4">
      {/* Interest rate and accrued */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-text-tertiary uppercase tracking-wide mb-1">Interest Rate</p>
          <p className="text-lg font-semibold text-text-primary">{rateDisplay}</p>
          <p className="text-xs text-text-tertiary">
            ฿{formatAmount(interestPerPeriod)} per {periodLabelFull.slice(0, -2)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-tertiary uppercase tracking-wide mb-1">Interest Accrued</p>
          <p
            className={`text-lg font-semibold ${loan.interestAccrued > 0 ? 'text-warning' : 'text-text-primary'}`}
          >
            ฿{formatAmount(loan.interestAccrued)}
          </p>
          {loan.periodsUnpaid > 0 && (
            <p className="text-xs text-warning">
              ({loan.periodsUnpaid} unpaid period{loan.periodsUnpaid !== 1 ? 's' : ''})
            </p>
          )}
        </div>
      </div>

      {/* Interest breakdown */}
      <div className="border-t border-bg-secondary pt-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-text-tertiary">Started</span>
          <span className="text-text-primary">{formatDate(loan.interestStartDate)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-tertiary">Periods started</span>
          <span className="text-text-primary">{loan.periodsStarted}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-tertiary">Periods paid</span>
          <span className="text-success">{loan.periodsPaid}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-tertiary">Periods unpaid</span>
          <span className={loan.periodsUnpaid > 0 ? 'text-warning' : 'text-text-primary'}>
            {loan.periodsUnpaid}
          </span>
        </div>
      </div>
    </div>
  )
}
