import { ArrowDownLeft, ArrowUpRight, Percent, ChevronRight, HandCoins } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { LoansSummary as LoansSummaryType } from '@/types/dashboard'

interface LoansSummaryProps {
  loans: LoansSummaryType
  isLoading?: boolean
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function SkeletonCard() {
  return (
    <div className="bg-bg-secondary rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 w-28 rounded bg-bg-tertiary" />
        <div className="w-5 h-5 rounded bg-bg-tertiary" />
      </div>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-bg-tertiary" />
              <div className="h-4 w-24 rounded bg-bg-tertiary" />
            </div>
            <div className="h-4 w-16 rounded bg-bg-tertiary" />
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyState() {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate('/loans')}
      className="bg-bg-secondary rounded-2xl p-4 shadow-sm w-full text-left
                 transition-all duration-200 active:scale-[0.99]"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary">Loans Summary</h3>
        <ChevronRight className="w-5 h-5 text-text-tertiary" />
      </div>
      <div className="py-6 text-center text-text-tertiary">
        <HandCoins className="w-10 h-10 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No active loans</p>
      </div>
    </button>
  )
}

export function LoansSummary({ loans, isLoading }: LoansSummaryProps) {
  const navigate = useNavigate()

  if (isLoading) {
    return <SkeletonCard />
  }

  const hasLoans = loans.borrowed > 0 || loans.lent > 0

  if (!hasLoans) {
    return <EmptyState />
  }

  return (
    <button
      onClick={() => navigate('/loans')}
      className="bg-bg-secondary rounded-2xl p-4 shadow-sm w-full text-left
                 transition-all duration-200 active:scale-[0.99]"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-text-primary">Loans Summary</h3>
        <ChevronRight className="w-5 h-5 text-text-tertiary" />
      </div>

      <div className="space-y-3">
        {/* Borrowed */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-expense/20 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4 text-expense" />
            </div>
            <span className="text-text-secondary">Borrowed</span>
          </div>
          <span className="font-semibold text-expense">
            {formatCurrency(loans.borrowed)}
          </span>
        </div>

        {/* Lent */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-success" />
            </div>
            <span className="text-text-secondary">Lent</span>
          </div>
          <span className="font-semibold text-success">
            {formatCurrency(loans.lent)}
          </span>
        </div>

        {/* Interest */}
        {loans.interestAccrued > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-bg-tertiary">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
                <Percent className="w-4 h-4 text-warning" />
              </div>
              <span className="text-text-secondary">Interest Accrued</span>
            </div>
            <span className="font-semibold text-warning">
              {formatCurrency(loans.interestAccrued)}
            </span>
          </div>
        )}
      </div>
    </button>
  )
}
