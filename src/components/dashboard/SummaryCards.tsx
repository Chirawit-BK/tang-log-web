import { TrendingUp, TrendingDown } from 'lucide-react'

interface SummaryCardsProps {
  income: number
  expense: number
  isLoading?: boolean
  onIncomeClick?: () => void
  onExpenseClick?: () => void
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
    <div className="neo-card p-4 flex-1 animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-bg-tertiary border-2 border-border" />
        <div className="h-4 w-16 rounded bg-bg-tertiary" />
      </div>
      <div className="h-6 w-24 rounded bg-bg-tertiary" />
    </div>
  )
}

export function SummaryCards({
  income,
  expense,
  isLoading,
  onIncomeClick,
  onExpenseClick,
}: SummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="flex gap-3">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      {/* Income Card */}
      <button
        onClick={onIncomeClick}
        className="neo-card p-4 flex-1 text-left bg-success/10"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-success border-2 border-border flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-text-secondary">Income</span>
        </div>
        <p className="text-xl font-black text-success">{formatCurrency(income)}</p>
      </button>

      {/* Expense Card */}
      <button
        onClick={onExpenseClick}
        className="neo-card p-4 flex-1 text-left bg-expense/10"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-expense border-2 border-border flex items-center justify-center">
            <TrendingDown className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-text-secondary">Expense</span>
        </div>
        <p className="text-xl font-black text-expense">{formatCurrency(expense)}</p>
      </button>
    </div>
  )
}
