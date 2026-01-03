import { useState, useEffect, useCallback } from 'react'
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@/types/category'

// Mock data generator - will be replaced with actual API
function generateMockCategories(): Category[] {
  return [
    // Income categories (system)
    {
      id: '1',
      name: 'Salary',
      type: 'income',
      icon: '💰',
      color: '#10B981',
      isSystem: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Freelance',
      type: 'income',
      icon: '💼',
      color: '#3B82F6',
      isSystem: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Investment',
      type: 'income',
      icon: '📈',
      color: '#8B5CF6',
      isSystem: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Gift',
      type: 'income',
      icon: '🎁',
      color: '#EC4899',
      isSystem: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '5',
      name: 'Other Income',
      type: 'income',
      icon: '➕',
      color: '#6366F1',
      isSystem: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '6',
      name: 'Interest',
      type: 'income',
      icon: '💵',
      color: '#14B8A6',
      isSystem: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Expense categories (system)
    {
      id: '10',
      name: 'Food & Dining',
      type: 'expense',
      icon: '🍔',
      color: '#F59E0B',
      isSystem: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '11',
      name: 'Transportation',
      type: 'expense',
      icon: '🚗',
      color: '#3B82F6',
      isSystem: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '12',
      name: 'Shopping',
      type: 'expense',
      icon: '🛒',
      color: '#EC4899',
      isSystem: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '13',
      name: 'Entertainment',
      type: 'expense',
      icon: '🎬',
      color: '#8B5CF6',
      isSystem: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '14',
      name: 'Healthcare',
      type: 'expense',
      icon: '💊',
      color: '#EF4444',
      isSystem: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '15',
      name: 'Bills & Utilities',
      type: 'expense',
      icon: '⚡',
      color: '#F97316',
      isSystem: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '16',
      name: 'Education',
      type: 'expense',
      icon: '🎓',
      color: '#6366F1',
      isSystem: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '17',
      name: 'Personal Care',
      type: 'expense',
      icon: '💄',
      color: '#EC4899',
      isSystem: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '18',
      name: 'Other Expense',
      type: 'expense',
      icon: '➕',
      color: '#6366F1',
      isSystem: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // User-created categories (examples)
    {
      id: '100',
      name: 'Side Hustle',
      type: 'income',
      icon: '💵',
      color: '#14B8A6',
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '101',
      name: 'Gym Membership',
      type: 'expense',
      icon: '🏋️',
      color: '#10B981',
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]
}

interface UseCategoriesReturn {
  categories: Category[]
  incomeCategories: Category[]
  expenseCategories: Category[]
  isLoading: boolean
  error: string | null
  refresh: () => void
  createCategory: (data: CreateCategoryDto) => Promise<Category | null>
  updateCategory: (id: string, data: UpdateCategoryDto) => Promise<Category | null>
  deleteCategory: (id: string) => Promise<boolean>
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // TODO: Replace with actual API call when backend is ready
      // const data = await categoriesApi.getAll()
      await new Promise((resolve) => setTimeout(resolve, 300))
      const mockData = generateMockCategories()
      setCategories(mockData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // Computed: filter by type
  const incomeCategories = categories.filter((c) => c.type === 'income')
  const expenseCategories = categories.filter((c) => c.type === 'expense')

  const createCategory = useCallback(
    async (data: CreateCategoryDto): Promise<Category | null> => {
      setIsCreating(true)
      setError(null)

      try {
        // TODO: Replace with actual API call when backend is ready
        // const newCategory = await categoriesApi.create(data)
        await new Promise((resolve) => setTimeout(resolve, 300))

        const newCategory: Category = {
          id: Date.now().toString(),
          name: data.name,
          type: data.type,
          icon: data.icon || '💰',
          color: data.color || '#10B981',
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        setCategories((prev) => [...prev, newCategory])
        return newCategory
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create category')
        return null
      } finally {
        setIsCreating(false)
      }
    },
    []
  )

  const updateCategory = useCallback(
    async (id: string, data: UpdateCategoryDto): Promise<Category | null> => {
      setIsUpdating(true)
      setError(null)

      try {
        // TODO: Replace with actual API call when backend is ready
        // const updatedCategory = await categoriesApi.update(id, data)
        await new Promise((resolve) => setTimeout(resolve, 300))

        let updatedCategory: Category | null = null

        setCategories((prev) =>
          prev.map((category) => {
            if (category.id === id) {
              updatedCategory = {
                ...category,
                ...data,
                updatedAt: new Date().toISOString(),
              }
              return updatedCategory
            }
            return category
          })
        )

        return updatedCategory
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update category')
        return null
      } finally {
        setIsUpdating(false)
      }
    },
    []
  )

  const deleteCategory = useCallback(async (id: string): Promise<boolean> => {
    setIsDeleting(true)
    setError(null)

    try {
      // TODO: Replace with actual API call when backend is ready
      // await categoriesApi.delete(id)
      await new Promise((resolve) => setTimeout(resolve, 300))

      setCategories((prev) => prev.filter((category) => category.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category')
      return false
    } finally {
      setIsDeleting(false)
    }
  }, [])

  return {
    categories,
    incomeCategories,
    expenseCategories,
    isLoading,
    error,
    refresh: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    isDeleting,
  }
}
