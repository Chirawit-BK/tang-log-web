import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronDown, X, ArrowUpDown, Check } from 'lucide-react'
import type {
  TransactionFilters as FiltersType,
  TransactionSort,
  TransactionKind,
  DatePreset,
} from '@/types/transaction'
import type { WasteLevel } from '@/types/dashboard'
import type { Category } from '@/types/category'
import type { Account } from '@/types/account'
import {
  DATE_PRESET_LABELS,
  TRANSACTION_KIND_LABELS,
  SORT_OPTIONS,
} from '@/types/transaction'

type DropdownType = 'date' | 'kind' | 'category' | 'account' | 'waste' | 'sort' | null

const WASTE_LEVEL_LABELS: Record<WasteLevel, string> = {
  necessary: 'Necessary',
  optional: 'Optional',
  wasteful: 'Wasteful',
}

// Sub-components defined outside main component
interface FilterChipProps {
  label: string
  isActive: boolean
  onClick: () => void
  showCalendarIcon?: boolean
  showSortIcon?: boolean
  isOpen?: boolean
}

function FilterChip({
  label,
  isActive,
  onClick,
  showCalendarIcon,
  showSortIcon,
  isOpen,
}: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold
                  border-2 border-border transition-all whitespace-nowrap
                  shadow-[2px_2px_0px_#1a1a1a] active:shadow-none active:translate-x-0.5 active:translate-y-0.5
                  ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                  }`}
    >
      {showCalendarIcon && <Calendar className="w-3.5 h-3.5" />}
      {showSortIcon && <ArrowUpDown className="w-3.5 h-3.5" />}
      {label}
      <ChevronDown
        className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
  )
}

interface DropdownMenuProps {
  children: React.ReactNode
  isOpen: boolean
}

function DropdownMenu({ children, isOpen }: DropdownMenuProps) {
  if (!isOpen) return null
  return (
    <div className="absolute top-full left-0 mt-2 min-w-[200px] bg-bg-secondary rounded-xl border-3 border-border shadow-[4px_4px_0px_#1a1a1a] z-50 py-2 max-h-[300px] overflow-y-auto">
      {children}
    </div>
  )
}

interface CheckboxItemProps {
  label: string
  checked: boolean
  onClick: () => void
  icon?: string
}

function CheckboxItem({ label, checked, onClick, icon }: CheckboxItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg-secondary transition-colors text-left"
    >
      <span
        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                    ${checked ? 'bg-primary border-primary' : 'border-text-tertiary'}`}
      >
        {checked && <Check className="w-3 h-3 text-white" />}
      </span>
      {icon && <span className="text-base">{icon}</span>}
      <span className="text-text-primary text-sm">{label}</span>
    </button>
  )
}

interface RadioItemProps {
  label: string
  selected: boolean
  onClick: () => void
}

function RadioItem({ label, selected, onClick }: RadioItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg-secondary transition-colors text-left
                  ${selected ? 'bg-bg-secondary' : ''}`}
    >
      <span
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                    ${selected ? 'border-primary' : 'border-text-tertiary'}`}
      >
        {selected && <span className="w-2 h-2 rounded-full bg-primary" />}
      </span>
      <span className="text-text-primary text-sm">{label}</span>
    </button>
  )
}

// Main component
interface TransactionFiltersProps {
  filters: FiltersType
  sort: TransactionSort
  onFilterChange: <K extends keyof FiltersType>(key: K, value: FiltersType[K]) => void
  onSortChange: (sort: TransactionSort) => void
  onReset: () => void
  categories: Category[]
  accounts: Account[]
  hasActiveFilters: boolean
}

export function TransactionFilters({
  filters,
  sort,
  onFilterChange,
  onSortChange,
  onReset,
  categories,
  accounts,
  hasActiveFilters,
}: TransactionFiltersProps) {
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDropdown = (dropdown: DropdownType) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  // Get display labels for active filters
  const getDateLabel = () => {
    if (filters.dateRange.preset) {
      return DATE_PRESET_LABELS[filters.dateRange.preset]
    }
    if (filters.dateRange.startDate || filters.dateRange.endDate) {
      return 'Custom'
    }
    return 'Date'
  }

  const getKindLabel = () => {
    if (filters.kinds.length === 0) return 'Type'
    if (filters.kinds.length === 1) return TRANSACTION_KIND_LABELS[filters.kinds[0]]
    return `${filters.kinds.length} types`
  }

  const getCategoryLabel = () => {
    if (filters.categoryIds.length === 0) return 'Category'
    if (filters.categoryIds.length === 1) {
      const cat = categories.find((c) => c.id === filters.categoryIds[0])
      return cat?.name || 'Category'
    }
    return `${filters.categoryIds.length} categories`
  }

  const getAccountLabel = () => {
    if (filters.accountIds.length === 0) return 'Account'
    if (filters.accountIds.length === 1) {
      const acc = accounts.find((a) => a.id === filters.accountIds[0])
      return acc?.name || 'Account'
    }
    return `${filters.accountIds.length} accounts`
  }

  const getWasteLabel = () => {
    if (filters.wasteLevels.length === 0) return 'Waste'
    if (filters.wasteLevels.length === 1) return WASTE_LEVEL_LABELS[filters.wasteLevels[0]]
    return `${filters.wasteLevels.length} levels`
  }

  const getSortLabel = () => {
    const option = SORT_OPTIONS.find(
      (o) => o.field === sort.field && o.direction === sort.direction
    )
    return option?.label || 'Sort'
  }

  // Handlers
  const handleDatePresetSelect = (preset: DatePreset | null) => {
    onFilterChange('dateRange', {
      preset,
      startDate: null,
      endDate: null,
    })
    setOpenDropdown(null)
  }

  const handleKindToggle = (kind: TransactionKind) => {
    const current = filters.kinds
    const updated = current.includes(kind)
      ? current.filter((k) => k !== kind)
      : [...current, kind]
    onFilterChange('kinds', updated)
  }

  const handleCategoryToggle = (categoryId: string) => {
    const current = filters.categoryIds
    const updated = current.includes(categoryId)
      ? current.filter((id) => id !== categoryId)
      : [...current, categoryId]
    onFilterChange('categoryIds', updated)
  }

  const handleAccountToggle = (accountId: string) => {
    const current = filters.accountIds
    const updated = current.includes(accountId)
      ? current.filter((id) => id !== accountId)
      : [...current, accountId]
    onFilterChange('accountIds', updated)
  }

  const handleWasteToggle = (level: WasteLevel) => {
    const current = filters.wasteLevels
    const updated = current.includes(level)
      ? current.filter((l) => l !== level)
      : [...current, level]
    onFilterChange('wasteLevels', updated)
  }

  const handleSortSelect = (field: 'date' | 'amount', direction: 'asc' | 'desc') => {
    onSortChange({ field, direction })
    setOpenDropdown(null)
  }

  const incomeCategories = categories.filter((c) => c.type === 'income')
  const expenseCategories = categories.filter((c) => c.type === 'expense')

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Filter chips row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {/* Date filter */}
        <div className="relative">
          <FilterChip
            label={getDateLabel()}
            isActive={!!filters.dateRange.preset || !!filters.dateRange.startDate}
            onClick={() => toggleDropdown('date')}
            showCalendarIcon
            isOpen={openDropdown === 'date'}
          />
          <DropdownMenu isOpen={openDropdown === 'date'}>
            <RadioItem
              label="All Time"
              selected={!filters.dateRange.preset}
              onClick={() => handleDatePresetSelect(null)}
            />
            <RadioItem
              label="Today"
              selected={filters.dateRange.preset === 'today'}
              onClick={() => handleDatePresetSelect('today')}
            />
            <RadioItem
              label="This Week"
              selected={filters.dateRange.preset === 'this_week'}
              onClick={() => handleDatePresetSelect('this_week')}
            />
            <RadioItem
              label="This Month"
              selected={filters.dateRange.preset === 'this_month'}
              onClick={() => handleDatePresetSelect('this_month')}
            />
          </DropdownMenu>
        </div>

        {/* Kind filter */}
        <div className="relative">
          <FilterChip
            label={getKindLabel()}
            isActive={filters.kinds.length > 0}
            onClick={() => toggleDropdown('kind')}
            isOpen={openDropdown === 'kind'}
          />
          <DropdownMenu isOpen={openDropdown === 'kind'}>
            <CheckboxItem
              label="Income"
              checked={filters.kinds.includes('income')}
              onClick={() => handleKindToggle('income')}
            />
            <CheckboxItem
              label="Expense"
              checked={filters.kinds.includes('expense')}
              onClick={() => handleKindToggle('expense')}
            />
            <CheckboxItem
              label="Transfer"
              checked={filters.kinds.includes('transfer')}
              onClick={() => handleKindToggle('transfer')}
            />
          </DropdownMenu>
        </div>

        {/* Category filter */}
        <div className="relative">
          <FilterChip
            label={getCategoryLabel()}
            isActive={filters.categoryIds.length > 0}
            onClick={() => toggleDropdown('category')}
            isOpen={openDropdown === 'category'}
          />
          <DropdownMenu isOpen={openDropdown === 'category'}>
            {incomeCategories.length > 0 && (
              <>
                <div className="px-4 py-1.5 text-xs font-semibold text-text-tertiary uppercase">
                  Income
                </div>
                {incomeCategories.map((cat) => (
                  <CheckboxItem
                    key={cat.id}
                    label={cat.name}
                    icon={cat.icon || undefined}
                    checked={filters.categoryIds.includes(cat.id)}
                    onClick={() => handleCategoryToggle(cat.id)}
                  />
                ))}
              </>
            )}
            {expenseCategories.length > 0 && (
              <>
                <div className="px-4 py-1.5 text-xs font-semibold text-text-tertiary uppercase mt-2">
                  Expense
                </div>
                {expenseCategories.map((cat) => (
                  <CheckboxItem
                    key={cat.id}
                    label={cat.name}
                    icon={cat.icon || undefined}
                    checked={filters.categoryIds.includes(cat.id)}
                    onClick={() => handleCategoryToggle(cat.id)}
                  />
                ))}
              </>
            )}
          </DropdownMenu>
        </div>

        {/* Account filter */}
        <div className="relative">
          <FilterChip
            label={getAccountLabel()}
            isActive={filters.accountIds.length > 0}
            onClick={() => toggleDropdown('account')}
            isOpen={openDropdown === 'account'}
          />
          <DropdownMenu isOpen={openDropdown === 'account'}>
            {accounts.map((acc) => (
              <CheckboxItem
                key={acc.id}
                label={acc.name}
                icon={acc.icon}
                checked={filters.accountIds.includes(acc.id)}
                onClick={() => handleAccountToggle(acc.id)}
              />
            ))}
          </DropdownMenu>
        </div>

        {/* Waste level filter */}
        <div className="relative">
          <FilterChip
            label={getWasteLabel()}
            isActive={filters.wasteLevels.length > 0}
            onClick={() => toggleDropdown('waste')}
            isOpen={openDropdown === 'waste'}
          />
          <DropdownMenu isOpen={openDropdown === 'waste'}>
            <CheckboxItem
              label="Necessary"
              checked={filters.wasteLevels.includes('necessary')}
              onClick={() => handleWasteToggle('necessary')}
            />
            <CheckboxItem
              label="Optional"
              checked={filters.wasteLevels.includes('optional')}
              onClick={() => handleWasteToggle('optional')}
            />
            <CheckboxItem
              label="Wasteful"
              checked={filters.wasteLevels.includes('wasteful')}
              onClick={() => handleWasteToggle('wasteful')}
            />
          </DropdownMenu>
        </div>

        {/* Sort */}
        <div className="relative">
          <FilterChip
            label={getSortLabel()}
            isActive={sort.field !== 'date' || sort.direction !== 'desc'}
            onClick={() => toggleDropdown('sort')}
            showSortIcon
            isOpen={openDropdown === 'sort'}
          />
          <DropdownMenu isOpen={openDropdown === 'sort'}>
            {SORT_OPTIONS.map((option) => (
              <RadioItem
                key={`${option.field}-${option.direction}`}
                label={option.label}
                selected={sort.field === option.field && sort.direction === option.direction}
                onClick={() => handleSortSelect(option.field, option.direction)}
              />
            ))}
          </DropdownMenu>
        </div>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold
                       bg-danger text-white border-2 border-border
                       shadow-[2px_2px_0px_#1a1a1a] active:shadow-none active:translate-x-0.5 active:translate-y-0.5
                       whitespace-nowrap"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
