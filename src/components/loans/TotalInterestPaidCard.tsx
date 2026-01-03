import type { LoanDetail } from '@/types/loan'

interface TotalInterestPaidCardProps {
  loan: LoanDetail
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function TotalInterestPaidCard({ loan }: TotalInterestPaidCardProps) {
  return (
    <div className="bg-bg-secondary rounded-xl p-4 shadow-sm">
      <p className="text-xs text-text-tertiary uppercase tracking-wide mb-1">Total Interest Paid</p>
      <div className="flex items-baseline gap-2">
        <p className="text-lg font-semibold text-text-primary">
          ฿{formatAmount(loan.totalInterestPaid)}
        </p>
        {loan.periodsPaid > 0 && (
          <p className="text-sm text-text-tertiary">
            ({loan.periodsPaid} period{loan.periodsPaid !== 1 ? 's' : ''})
          </p>
        )}
      </div>
    </div>
  )
}
