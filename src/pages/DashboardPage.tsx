import { useCallback, useRef } from 'react'
import { useDashboard } from '@/hooks'
import {
  PeriodSelector,
  SummaryCards,
  BalanceCard,
  TopCategories,
  WastePieChart,
  LoansSummary,
} from '@/components/dashboard'

export function DashboardPage() {
  const {
    data,
    isLoading,
    period,
    selectedDate,
    setPeriod,
    setSelectedDate,
    refresh,
  } = useDashboard()

  // Pull-to-refresh state
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const isPulling = useRef(false)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY
      isPulling.current = true
    }
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (isPulling.current) {
        const distance = e.changedTouches[0].clientY - startY.current
        if (distance > 80) {
          refresh()
        }
        isPulling.current = false
      }
    },
    [refresh]
  )

  const handleIncomeClick = () => {
    // TODO: Navigate to transactions filtered by income
  }

  const handleExpenseClick = () => {
    // TODO: Navigate to transactions filtered by expense
  }

  const handleCategoryClick = (categoryId: string) => {
    // TODO: Navigate to transactions filtered by category
    console.log('Category clicked:', categoryId)
  }

  const handleWasteSegmentClick = (level: string) => {
    // TODO: Navigate to transactions filtered by waste level
    console.log('Waste segment clicked:', level)
  }

  return (
    <div
      ref={containerRef}
      className="px-4 py-6 min-h-screen"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">TangLog</h1>
      </div>

      {/* Period Selector */}
      <div className="mb-6">
        <PeriodSelector
          period={period}
          selectedDate={selectedDate}
          onPeriodChange={setPeriod}
          onDateChange={setSelectedDate}
        />
      </div>

      {/* Dashboard Content */}
      <div className="space-y-4">
        {/* Income & Expense Cards */}
        <SummaryCards
          income={data?.income ?? 0}
          expense={data?.expense ?? 0}
          isLoading={isLoading}
          onIncomeClick={handleIncomeClick}
          onExpenseClick={handleExpenseClick}
        />

        {/* Total Balance */}
        <BalanceCard accounts={data?.accounts ?? []} isLoading={isLoading} />

        {/* Top Categories */}
        <TopCategories
          categories={data?.topCategories ?? []}
          isLoading={isLoading}
          onCategoryClick={handleCategoryClick}
        />

        {/* Waste Distribution */}
        <WastePieChart
          distribution={data?.wasteDistribution ?? []}
          isLoading={isLoading}
          onSegmentClick={handleWasteSegmentClick}
        />

        {/* Loans Summary */}
        <LoansSummary loans={data?.loans ?? { borrowed: 0, lent: 0, interestAccrued: 0 }} isLoading={isLoading} />
      </div>
    </div>
  )
}
