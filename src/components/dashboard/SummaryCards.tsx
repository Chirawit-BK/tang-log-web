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
    <div className="bg-bg-secondary rounded-2xl p-4 shadow-sm flex-1 animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-bg-tertiary" />
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
        className="bg-bg-secondary rounded-2xl p-4 shadow-sm flex-1 text-left
                   transition-all duration-200 active:scale-[0.98]"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <span className="text-sm text-text-tertiary">Income</span>
        </div>
        <p className="text-lg font-bold text-success">{formatCurrency(income)}</p>
      </button>

      {/* Expense Card */}
      <button
        onClick={onExpenseClick}
        className="bg-bg-secondary rounded-2xl p-4 shadow-sm flex-1 text-left
                   transition-all duration-200 active:scale-[0.98]"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-expense/20 flex items-center justify-center">
            <TrendingDown className="w-4 h-4 text-expense" />
          </div>
          <span className="text-sm text-text-tertiary">Expense</span>
        </div>
        <p className="text-lg font-bold text-expense">{formatCurrency(expense)}</p>
      </button>
    </div>
  )
}
