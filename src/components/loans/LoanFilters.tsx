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
            className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm border-2 border-border
                       shadow-[2px_2px_0px_#1a1a1a] active:shadow-none active:translate-x-0.5 active:translate-y-0.5
                       transition-all duration-200
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
        <span className="text-sm font-semibold text-text-secondary">Show closed loans</span>
        <button
          onClick={() => onFilterChange('showClosed', !filters.showClosed)}
          className={`relative w-12 h-7 rounded-lg border-2 border-border transition-colors duration-200
                     ${filters.showClosed ? 'bg-primary' : 'bg-bg-tertiary'}`}
          role="switch"
          aria-checked={filters.showClosed}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white border-2 border-border rounded transition-transform duration-200
                       ${filters.showClosed ? 'translate-x-5' : 'translate-x-0'}`}
          />
        </button>
      </div>
    </div>
  )
}
