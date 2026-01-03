import { useState, useEffect, useCallback } from 'react'
import type { DashboardData, Period } from '@/types/dashboard'

// Mock data generator - will be replaced with actual API call
function generateMockData(period: Period, date: Date): DashboardData {
  const startDate = new Date(date)
  const endDate = new Date(date)

  if (period === 'day') {
    // Same day
  } else if (period === 'week') {
    startDate.setDate(startDate.getDate() - startDate.getDay())
    endDate.setDate(startDate.getDate() + 6)
  } else {
    startDate.setDate(1)
    endDate.setMonth(endDate.getMonth() + 1)
    endDate.setDate(0)
  }

  return {
    period,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    income: 12500,
    expense: 8200,
    accounts: [
      { id: '1', name: 'Cash', type: 'cash', balance: 5300 },
      { id: '2', name: 'SCB', type: 'bank', balance: 32000 },
      { id: '3', name: 'TrueMoney', type: 'ewallet', balance: 8000 },
    ],
    topCategories: [
      { id: '1', name: 'Food', icon: 'Utensils', amount: 3500 },
      { id: '2', name: 'Transport', icon: 'Car', amount: 2100 },
      { id: '3', name: 'Shopping', icon: 'ShoppingBag', amount: 1800 },
      { id: '4', name: 'Entertainment', icon: 'Gamepad2', amount: 500 },
      { id: '5', name: 'Bills', icon: 'Receipt', amount: 300 },
    ],
    wasteDistribution: [
      { level: 'necessary', amount: 4500, percentage: 55 },
      { level: 'optional', amount: 2500, percentage: 30 },
      { level: 'wasteful', amount: 1200, percentage: 15 },
    ],
    loans: {
      borrowed: 10000,
      lent: 5000,
      interestAccrued: 200,
    },
  }
}

interface UseDashboardReturn {
  data: DashboardData | null
  isLoading: boolean
  error: string | null
  period: Period
  selectedDate: Date
  setPeriod: (period: Period) => void
  setSelectedDate: (date: Date) => void
  refresh: () => void
}

export function useDashboard(): UseDashboardReturn {
  const [period, setPeriod] = useState<Period>('month')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // TODO: Replace with actual API call
      // const response = await api.get<DashboardData>('/dashboard', {
      //   params: { period, date: selectedDate.toISOString() }
      // })
      const mockData = generateMockData(period, selectedDate)
      setData(mockData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    } finally {
      setIsLoading(false)
    }
  }, [period, selectedDate])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const refresh = useCallback(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return {
    data,
    isLoading,
    error,
    period,
    selectedDate,
    setPeriod,
    setSelectedDate,
    refresh,
  }
}
