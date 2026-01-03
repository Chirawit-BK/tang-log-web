import { useState } from 'react'
import { Handshake, Loader2, Plus } from 'lucide-react'
import { useLoans } from '@/hooks/useLoans'
import { LoanCard, LoanFilters } from '@/components/loans'
import { AddLoanModal } from '@/components/AddLoanModal'

export function LoansPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const { groupedLoans, totalCount, isLoading, error, filters, updateFilter, refresh } = useLoans()

  // Check if we have no loans at all (not filtered)
  const hasNoLoansEver = totalCount === 0 && filters.direction === null && !filters.showClosed

  // Loading state
  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Loans</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-text-tertiary mt-4">Loading loans...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Loans</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-danger">
          <Handshake className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg">Failed to load loans</p>
          <p className="text-sm mt-2 text-text-tertiary">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-text-primary">Loans</h1>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <LoanFilters filters={filters} onFilterChange={updateFilter} />
      </div>

      {/* Results count */}
      {!hasNoLoansEver && totalCount > 0 && (
        <p className="text-sm text-text-tertiary mb-4">
          {totalCount} loan{totalCount !== 1 ? 's' : ''}
        </p>
      )}

      {/* Empty state - no loans ever */}
      {hasNoLoansEver && (
        <div className="flex flex-col items-center justify-center py-16 text-text-tertiary">
          <Handshake className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg font-medium text-text-primary">No loans tracked</p>
          <p className="text-sm mt-2 text-center">
            Keep track of money you've lent or borrowed
          </p>
        </div>
      )}

      {/* Empty state - no results for filter */}
      {!hasNoLoansEver && groupedLoans.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-text-tertiary">
          <Handshake className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg font-medium text-text-primary">No loans found</p>
          <p className="text-sm mt-2 text-center">No loans match your current filters</p>
        </div>
      )}

      {/* Loan groups */}
      {groupedLoans.length > 0 && (
        <div className="space-y-6">
          {groupedLoans.map((group) => (
            <div key={group.direction}>
              {/* Group header */}
              <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wide mb-3">
                {group.label}
              </h2>

              {/* Loan cards */}
              <div className="space-y-3">
                {group.loans.map((loan) => (
                  <LoanCard key={loan.id} loan={loan} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Loan Button */}
      <div className="mt-6">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full py-4 px-4 border-3 border-dashed border-border rounded-xl
                     text-text-secondary font-bold bg-bg-tertiary/30
                     hover:bg-bg-tertiary/50 hover:text-primary
                     transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Loan
        </button>
      </div>

      {/* Add Loan Modal */}
      <AddLoanModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={refresh}
      />
    </div>
  )
}
