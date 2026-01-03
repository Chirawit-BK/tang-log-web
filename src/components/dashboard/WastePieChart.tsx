import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { PieChart as PieChartIcon } from 'lucide-react'
import type { WasteDistribution, WasteLevel } from '@/types/dashboard'
import {
  WASTE_LEVEL_COLORS,
  WASTE_LEVEL_LABELS,
  WASTE_LEVEL_BG_CLASSES,
} from '@/utils/wasteLevel'

interface WastePieChartProps {
  distribution: WasteDistribution[]
  isLoading?: boolean
  onSegmentClick?: (level: WasteLevel) => void
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Use shared waste level utilities for consistent colors/labels

function SkeletonChart() {
  return (
    <div className="neo-card p-4">
      <div className="h-5 w-36 rounded bg-bg-tertiary mb-4" />
      <div className="flex items-center justify-center">
        <div className="w-40 h-40 rounded-full bg-bg-tertiary animate-pulse" />
      </div>
      <div className="flex justify-center gap-4 mt-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 animate-pulse">
            <div className="w-3 h-3 rounded-full bg-bg-tertiary" />
            <div className="h-4 w-16 rounded bg-bg-tertiary" />
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="neo-card p-4">
      <h3 className="text-base font-semibold text-text-primary mb-4">
        Waste Distribution
      </h3>
      <div className="py-8 text-center text-text-tertiary">
        <PieChartIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No expense data yet</p>
      </div>
    </div>
  )
}

export function WastePieChart({
  distribution,
  isLoading,
  onSegmentClick,
}: WastePieChartProps) {
  if (isLoading) {
    return <SkeletonChart />
  }

  const hasData = distribution.some((d) => d.amount > 0)

  if (!hasData) {
    return <EmptyState />
  }

  const chartData = distribution.map((d) => ({
    name: WASTE_LEVEL_LABELS[d.level],
    value: d.amount,
    level: d.level,
    percentage: d.percentage,
  }))

  return (
    <div className="neo-card p-4">
      <h3 className="text-base font-bold text-text-primary mb-4">
        Waste Distribution
      </h3>

      {/* Pie Chart */}
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              onClick={(data) => onSegmentClick?.(data.level)}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.level}
                  fill={WASTE_LEVEL_COLORS[entry.level]}
                  className="cursor-pointer transition-opacity hover:opacity-80"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {distribution.map((d) => (
          <button
            key={d.level}
            onClick={() => onSegmentClick?.(d.level)}
            className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
          >
            <span className={`w-3 h-3 rounded-full ${WASTE_LEVEL_BG_CLASSES[d.level]}`} />
            <span className="text-text-secondary">{WASTE_LEVEL_LABELS[d.level]}</span>
            <span className="font-medium text-text-primary">
              {formatCurrency(d.amount)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
