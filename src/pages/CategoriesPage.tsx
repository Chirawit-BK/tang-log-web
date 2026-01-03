import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Plus, Loader2 } from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'
import type { Category } from '@/types/category'
import { CategoryModal } from '@/components/CategoryModal'
import { DeleteCategoryDialog } from '@/components/DeleteCategoryDialog'

export function CategoriesPage() {
  const navigate = useNavigate()
  const {
    incomeCategories,
    expenseCategories,
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCategories()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  const handleAddCategory = () => {
    setSelectedCategory(null)
    setIsModalOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCategory(null)
  }

  const handleDeleteRequest = (category: Category) => {
    setCategoryToDelete(category)
  }

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete.id)
      setCategoryToDelete(null)
      handleCloseModal()
    }
  }

  const renderCategoryCard = (category: Category) => (
    <button
      key={category.id}
      onClick={() => handleEditCategory(category)}
      className="neo-card w-full p-4 text-left"
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: `${category.color || '#10B981'}20` }}
        >
          {category.icon || '💰'}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-text-primary truncate">
              {category.name}
            </p>
            {category.isSystem && (
              <span className="px-1.5 py-0.5 text-xs bg-bg-secondary text-text-tertiary rounded">
                sys
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <ChevronRight className="w-5 h-5 text-text-tertiary flex-shrink-0" />
      </div>
    </button>
  )

  return (
    <div className="min-h-screen bg-bg-secondary pt-safe pb-safe">
      {/* Header with back button */}
      <header className="sticky top-0 bg-bg-primary border-b border-bg-tertiary pt-safe z-10">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => navigate(-1)}
            className="touch-target flex items-center justify-center -ml-2 text-primary"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-lg font-semibold text-text-primary text-center pr-8">
            Categories
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-danger/10 text-danger rounded-xl p-4 text-center">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Income Categories */}
            <div>
              <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wide mb-3 px-1">
                Income
              </h2>
              <div className="space-y-3">
                {incomeCategories.map(renderCategoryCard)}
              </div>
            </div>

            {/* Expense Categories */}
            <div>
              <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wide mb-3 px-1">
                Expense
              </h2>
              <div className="space-y-3">
                {expenseCategories.map(renderCategoryCard)}
              </div>
            </div>

            {/* Add category button */}
            <button
              onClick={handleAddCategory}
              className="w-full p-4 text-center border-3 border-dashed border-border rounded-xl bg-bg-tertiary/30 hover:bg-bg-tertiary/50 transition-colors"
            >
              <div className="flex items-center justify-center gap-2 text-primary">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add Category</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Category Modal (Add/Edit) */}
      <CategoryModal
        isOpen={isModalOpen}
        category={selectedCategory}
        onClose={handleCloseModal}
        onSave={async (data) => {
          if (selectedCategory) {
            await updateCategory(selectedCategory.id, data)
          } else {
            await createCategory(data as Parameters<typeof createCategory>[0])
          }
          handleCloseModal()
        }}
        onDelete={
          selectedCategory && !selectedCategory.isSystem
            ? () => handleDeleteRequest(selectedCategory)
            : undefined
        }
        isSaving={isCreating || isUpdating}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteCategoryDialog
        isOpen={!!categoryToDelete}
        categoryName={categoryToDelete?.name || ''}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}
