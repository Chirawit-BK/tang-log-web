import { ChevronDown } from 'lucide-react'
import type { Period } from '@/types/dashboard'

interface PeriodSelectorProps {
  period: Period
  selectedDate: Date
  onPeriodChange: (period: Period) => void
  onDateChange: (date: Date) => void
}

const periodLabels: Record<Period, string> = {
  day: 'Day',
  week: 'Week',
  month: 'Month',
}

export function PeriodSelector({
  period,
  selectedDate,
  onPeriodChange,
  onDateChange,
}: PeriodSelectorProps) {
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPeriodChange(e.target.value as Period)
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange(new Date(e.target.value))
  }

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Period dropdown */}
      <div className="relative">
        <select
          value={period}
          onChange={handlePeriodChange}
          className="appearance-none bg-bg-secondary rounded-xl px-4 py-2 pr-10 text-sm font-medium
                     text-text-primary border border-bg-tertiary
                     focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {Object.entries(periodLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
      </div>

      {/* Date display/picker */}
      <div className="relative flex-1">
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={handleDateChange}
          className="w-full bg-bg-secondary rounded-xl px-4 py-2 text-sm font-medium
                     text-text-primary border border-bg-tertiary text-right
                     focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
    </div>
  )
}
