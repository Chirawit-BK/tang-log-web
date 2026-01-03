import { useNavigate } from 'react-router-dom'
import { ChevronRight, ArrowRightLeft } from 'lucide-react'
import type { Transaction } from '@/types/transaction'
import { WasteLevelBadge } from '@/components/waste'

interface TransactionCardProps {
  transaction: Transaction
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/transactions/${transaction.id}`)
  }

  // Format amount with sign and color
  const isIncome = transaction.kind === 'income'
  const isTransfer = transaction.kind === 'transfer'
  const amountSign = isIncome ? '+' : '-'
  const amountColor = isIncome ? 'text-success' : 'text-danger'

  // Format amount with Thai Baht
  const formattedAmount = new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(transaction.amount)

  // Format time
  const time = new Date(transaction.transactionDate).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  // Display text
  const displayTitle = transaction.note || transaction.categoryName || 'Transaction'
  const displaySubtitle = isTransfer
    ? `${transaction.accountName} → ${transaction.toAccountName}`
    : transaction.categoryName

  // Icon
  const displayIcon = isTransfer ? null : transaction.categoryIcon

  // Waste indicator
  const showWasteIndicator = transaction.kind === 'expense' && transaction.wasteLevel

  return (
    <button
      onClick={handleClick}
      className="w-full bg-bg-primary rounded-xl p-4 flex items-center gap-3
                 transition-all duration-200 active:scale-[0.98] active:bg-bg-secondary
                 text-left"
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center text-xl flex-shrink-0">
        {isTransfer ? (
          <ArrowRightLeft className="w-5 h-5 text-text-secondary" />
        ) : (
          displayIcon || '💰'
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-text-primary truncate">{displayTitle}</p>
          {showWasteIndicator && (
            <WasteLevelBadge level={transaction.wasteLevel!} />
          )}
        </div>
        <p className="text-sm text-text-tertiary truncate">{displaySubtitle}</p>
      </div>

      {/* Amount and Time */}
      <div className="flex flex-col items-end flex-shrink-0">
        <p className={`font-semibold ${amountColor}`}>
          {amountSign}฿{formattedAmount}
        </p>
        <p className="text-xs text-text-tertiary">{time}</p>
      </div>

      {/* Chevron */}
      <ChevronRight className="w-5 h-5 text-text-tertiary flex-shrink-0" />
    </button>
  )
}
