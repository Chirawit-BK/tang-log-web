import type { LoanDirection, LoanFilters as LoanFiltersType } from '@/types/loan'

interface LoanFiltersProps {
  filters: LoanFiltersType
  onFilterChange: <K extends keyof LoanFiltersType>(key: K, value: LoanFiltersType[K]) => void
}

interface DirectionTab {
  value: LoanDirection | null
  label: string
}

const DIRECTION_TABS: DirectionTab[] = [
  { value: null, label: 'All' },
  { value: 'borrow', label: 'Borrowed' },
  { value: 'lend', label: 'Lent' },
]

export function LoanFilters({ filters, onFilterChange }: LoanFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Direction Tabs */}
      <div className="flex gap-2">
        {DIRECTION_TABS.map((tab) => (
          <button
            key={tab.value ?? 'all'}
            onClick={() => onFilterChange('direction', tab.value)}
            className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200
                       ${
                         filters.direction === tab.value
                           ? 'bg-primary text-white'
                           : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                       }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Show Closed Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-secondary">Show closed loans</span>
        <button
          onClick={() => onFilterChange('showClosed', !filters.showClosed)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200
                     ${filters.showClosed ? 'bg-primary' : 'bg-bg-tertiary'}`}
          role="switch"
          aria-checked={filters.showClosed}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
                       ${filters.showClosed ? 'translate-x-5' : 'translate-x-0'}`}
          />
        </button>
      </div>
    </div>
  )
}
