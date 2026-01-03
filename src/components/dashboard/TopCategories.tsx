import {
  Utensils,
  Car,
  ShoppingBag,
  Gamepad2,
  Receipt,
  Home,
  Heart,
  Plane,
  Gift,
  MoreHorizontal,
  type LucideIcon,
} from 'lucide-react'
import type { CategorySummary } from '@/types/dashboard'

interface TopCategoriesProps {
  categories: CategorySummary[]
  isLoading?: boolean
  onCategoryClick?: (categoryId: string) => void
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const iconMap: Record<string, LucideIcon> = {
  Utensils,
  Car,
  ShoppingBag,
  Gamepad2,
  Receipt,
  Home,
  Heart,
  Plane,
  Gift,
}

const categoryColors = [
  'bg-orange-500/20 text-orange-400',
  'bg-blue-500/20 text-blue-400',
  'bg-pink-500/20 text-pink-400',
  'bg-purple-500/20 text-purple-400',
  'bg-green-500/20 text-green-400',
]

function SkeletonList() {
  return (
    <div className="bg-bg-secondary rounded-2xl p-4 shadow-sm">
      <div className="h-5 w-40 rounded bg-bg-tertiary mb-4" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-bg-tertiary" />
            <div className="flex-1">
              <div className="h-4 w-20 rounded bg-bg-tertiary" />
            </div>
            <div className="h-4 w-16 rounded bg-bg-tertiary" />
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="bg-bg-secondary rounded-2xl p-4 shadow-sm">
      <h3 className="text-base font-semibold text-text-primary mb-4">
        Top Expense Categories
      </h3>
      <div className="py-8 text-center text-text-tertiary">
        <MoreHorizontal className="w-10 h-10 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No expenses yet</p>
      </div>
    </div>
  )
}

export function TopCategories({
  categories,
  isLoading,
  onCategoryClick,
}: TopCategoriesProps) {
  if (isLoading) {
    return <SkeletonList />
  }

  if (categories.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="bg-bg-secondary rounded-2xl p-4 shadow-sm">
      <h3 className="text-base font-semibold text-text-primary mb-4">
        Top Expense Categories
      </h3>

      <div className="space-y-3">
        {categories.map((category, index) => {
          const Icon = iconMap[category.icon] || Receipt
          const colorClass = categoryColors[index % categoryColors.length]

          return (
            <button
              key={category.id}
              onClick={() => onCategoryClick?.(category.id)}
              className="flex items-center gap-3 w-full p-2 -mx-2 rounded-xl
                         transition-colors hover:bg-bg-secondary active:bg-bg-tertiary"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="flex-1 text-left font-medium text-text-primary">
                {category.name}
              </span>
              <span className="font-semibold text-text-primary">
                {formatCurrency(category.amount)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
