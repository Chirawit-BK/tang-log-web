import { useState, useMemo } from 'react'
import { Search, Receipt, Loader2 } from 'lucide-react'
import { useTransactions } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { useAccounts } from '@/hooks/useAccounts'
import {
  TransactionCard,
  TransactionFilters,
  SearchBar,
} from '@/components/transactions'

export function TransactionsPage() {
  const [showSearch, setShowSearch] = useState(false)

  const {
    groupedTransactions,
    totalCount,
    displayedCount,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    filters,
    sort,
    updateFilter,
    setSort,
    resetFilters,
    loadMore,
  } = useTransactions()

  const { categories } = useCategories()
  const { accounts } = useAccounts()

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== '' ||
      filters.dateRange.preset !== null ||
      filters.dateRange.startDate !== null ||
      filters.kinds.length > 0 ||
      filters.categoryIds.length > 0 ||
      filters.accountIds.length > 0 ||
      filters.wasteLevels.length > 0
    )
  }, [filters])

  // Handle search change
  const handleSearchChange = (value: string) => {
    updateFilter('search', value)
  }

  // Toggle search visibility
  const toggleSearch = () => {
    setShowSearch(!showSearch)
    if (showSearch && filters.search) {
      updateFilter('search', '')
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Transactions</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-text-tertiary mt-4">Loading transactions...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Transactions</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-danger">
          <Receipt className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg">Failed to load transactions</p>
          <p className="text-sm mt-2 text-text-tertiary">{error}</p>
        </div>
      </div>
    )
  }

  // Check if there are no transactions at all (not just filtered)
  const hasNoTransactionsEver = totalCount === 0 && !hasActiveFilters

  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-text-primary">Transactions</h1>
        <button
          onClick={toggleSearch}
          className={`p-2 rounded-lg border-2 border-border transition-all
                      shadow-[2px_2px_0px_#1a1a1a] active:shadow-none active:translate-x-0.5 active:translate-y-0.5
                      ${showSearch ? 'bg-primary text-white' : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'}`}
          aria-label={showSearch ? 'Hide search' : 'Show search'}
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Search bar (collapsible) */}
      {showSearch && (
        <div className="mb-4">
          <SearchBar
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search notes..."
          />
        </div>
      )}

      {/* Filters */}
      <div className="mb-4">
        <TransactionFilters
          filters={filters}
          sort={sort}
          onFilterChange={updateFilter}
          onSortChange={setSort}
          onReset={resetFilters}
          categories={categories}
          accounts={accounts}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Results count */}
      {!hasNoTransactionsEver && (
        <p className="text-sm text-text-tertiary mb-4">
          Showing {displayedCount} of {totalCount} transactions
        </p>
      )}

      {/* Empty state - no transactions ever */}
      {hasNoTransactionsEver && (
        <div className="flex flex-col items-center justify-center py-16 text-text-tertiary">
          <Receipt className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg font-medium text-text-primary">No transactions yet</p>
          <p className="text-sm mt-2 text-center">
            Start tracking by adding your first transaction
          </p>
        </div>
      )}

      {/* Empty state - no results for filter */}
      {!hasNoTransactionsEver && groupedTransactions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-text-tertiary">
          <Search className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg font-medium text-text-primary">No transactions found</p>
          <p className="text-sm mt-2 text-center">
            No transactions match your filters
          </p>
          <button
            onClick={resetFilters}
            className="neo-btn mt-4 px-4 py-2 bg-primary text-white"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Transaction groups */}
      {groupedTransactions.length > 0 && (
        <div className="space-y-6">
          {groupedTransactions.map((group) => (
            <div key={group.dateKey}>
              {/* Date header */}
              <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wide mb-3">
                {group.date}
              </h2>

              {/* Transaction cards */}
              <div className="space-y-2">
                {group.transactions.map((transaction) => (
                  <TransactionCard key={transaction.id} transaction={transaction} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load more button */}
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="neo-btn px-6 py-3 bg-bg-secondary text-text-primary disabled:opacity-50
                       flex items-center gap-2"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}

      {/* No more transactions message */}
      {!hasMore && displayedCount > 0 && displayedCount === totalCount && (
        <p className="mt-6 text-center text-sm text-text-tertiary">
          No more transactions
        </p>
      )}
    </div>
  )
}
