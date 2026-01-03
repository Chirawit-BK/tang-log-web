import { useState } from 'react'
import { Wallet, ChevronDown, ChevronUp, Banknote, Building2, Smartphone } from 'lucide-react'
import type { AccountBalance } from '@/types/dashboard'

interface BalanceCardProps {
  accounts: AccountBalance[]
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

const accountTypeIcons = {
  cash: Banknote,
  bank: Building2,
  ewallet: Smartphone,
}

const accountTypeColors = {
  cash: 'bg-success text-white border-2 border-border',
  bank: 'bg-primary text-white border-2 border-border',
  ewallet: 'bg-secondary text-white border-2 border-border',
}

function SkeletonCard() {
  return (
    <div className="neo-card p-5 animate-pulse">
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="w-5 h-5 rounded bg-bg-tertiary" />
        <div className="h-4 w-24 rounded bg-bg-tertiary" />
      </div>
      <div className="h-8 w-32 mx-auto rounded bg-bg-tertiary mb-4" />
      <div className="flex justify-center gap-2">
        <div className="h-8 w-20 rounded-full bg-bg-tertiary" />
        <div className="h-8 w-20 rounded-full bg-bg-tertiary" />
        <div className="h-8 w-20 rounded-full bg-bg-tertiary" />
      </div>
    </div>
  )
}

export function BalanceCard({ accounts, isLoading }: BalanceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (isLoading) {
    return <SkeletonCard />
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

  return (
    <div className="neo-card p-5 bg-warning/10">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-2 text-text-tertiary">
        <Wallet className="w-5 h-5" />
        <span className="text-sm">Total Balance</span>
      </div>

      {/* Total amount */}
      <p className="text-3xl font-bold text-text-primary text-center mb-4">
        {formatCurrency(totalBalance)}
      </p>

      {/* Account chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {accounts.map((account) => {
          const Icon = accountTypeIcons[account.type]
          const colorClass = accountTypeColors[account.type]

          return (
            <div
              key={account.id}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${colorClass}`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{formatCurrency(account.balance)}</span>
            </div>
          )
        })}
      </div>

      {/* Expand button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full mt-4 pt-3 border-t border-bg-tertiary flex items-center justify-center gap-1 text-sm text-text-tertiary"
      >
        {isExpanded ? (
          <>
            Hide details <ChevronUp className="w-4 h-4" />
          </>
        ) : (
          <>
            Show details <ChevronDown className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Expanded account list */}
      {isExpanded && (
        <div className="mt-3 space-y-2">
          {accounts.map((account) => {
            const Icon = accountTypeIcons[account.type]

            return (
              <div
                key={account.id}
                className="flex items-center justify-between py-2 px-3 rounded-xl bg-bg-secondary"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${accountTypeColors[account.type]}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-text-primary">{account.name}</span>
                </div>
                <span className="font-semibold text-text-primary">
                  {formatCurrency(account.balance)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
