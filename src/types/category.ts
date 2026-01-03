// Category types

export type CategoryType = 'income' | 'expense'

export interface Category {
  id: string
  name: string
  type: CategoryType
  icon: string | null
  color: string | null
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryDto {
  name: string
  type: CategoryType
  icon?: string
  color?: string
}

export interface UpdateCategoryDto {
  name?: string
  icon?: string
  color?: string
}

// Category type labels
export const CATEGORY_TYPE_LABELS: Record<CategoryType, string> = {
  income: 'Income',
  expense: 'Expense',
}

// Preset icons for categories
export const CATEGORY_ICONS: string[] = [
  '💰', '💵', '💴', '💶', '💷', '💳', '🏦', '💎',
  '🍔', '🍕', '🍜', '🍱', '☕', '🍺', '🎂', '🍿',
  '🚗', '🚕', '🚌', '🚇', '✈️', '🚲', '⛽', '🅿️',
  '🏠', '🏢', '🏥', '🏫', '🎓', '📚', '🎮', '🎬',
  '👕', '👔', '👗', '👠', '💄', '🎁', '📱', '💻',
  '⚡', '💧', '📡', '📞', '📺', '🔧', '🔨', '🎯',
  '💼', '📈', '🎁', '➕', '🛒', '🏋️', '💊', '🐕',
]

// Preset colors for categories
export const CATEGORY_COLORS: string[] = [
  '#10B981', // Emerald (success)
  '#3B82F6', // Blue
  '#8B5CF6', // Purple (secondary)
  '#F59E0B', // Amber (warning)
  '#EF4444', // Red (danger)
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F97316', // Orange
]
