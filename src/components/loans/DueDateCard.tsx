import { Calendar, AlertTriangle } from 'lucide-react'
import type { LoanDetail } from '@/types/loan'

interface DueDateCardProps {
  loan: LoanDetail
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function getDaysUntil(dateStr: string): number {
  const dueDate = new Date(dateStr)
  const today = new Date()
  // Reset time to compare dates only
  dueDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  const diffTime = dueDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function DueDateCard({ loan }: DueDateCardProps) {
  if (!loan.dueDate) return null

  const daysUntil = getDaysUntil(loan.dueDate)
  const isOverdue = daysUntil < 0
  const isDueSoon = daysUntil >= 0 && daysUntil <= 7

  const getCountdownText = () => {
    if (isOverdue) {
      const daysOverdue = Math.abs(daysUntil)
      return `${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue`
    }
    if (daysUntil === 0) {
      return 'Due today'
    }
    return `in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`
  }

  return (
    <div
      className={`neo-card p-4 ${
        isOverdue
          ? 'bg-danger/10'
          : isDueSoon
            ? 'bg-warning/10'
            : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isOverdue
              ? 'bg-danger/20 text-danger'
              : isDueSoon
                ? 'bg-warning/20 text-warning'
                : 'bg-bg-tertiary text-text-tertiary'
          }`}
        >
          {isOverdue ? (
            <AlertTriangle className="w-5 h-5" />
          ) : (
            <Calendar className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-xs text-text-tertiary uppercase tracking-wide mb-1">Due Date</p>
          <p className="text-lg font-semibold text-text-primary">{formatDate(loan.dueDate)}</p>
          <p
            className={`text-sm ${
              isOverdue ? 'text-danger font-medium' : isDueSoon ? 'text-warning' : 'text-text-tertiary'
            }`}
          >
            {getCountdownText()}
          </p>
        </div>
      </div>
    </div>
  )
}
