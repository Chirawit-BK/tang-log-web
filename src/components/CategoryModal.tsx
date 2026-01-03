import { useState } from 'react'
import { X, Trash2, Loader2 } from 'lucide-react'
import type {
  Category,
  CategoryType,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@/types/category'
import {
  CATEGORY_TYPE_LABELS,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
} from '@/types/category'

interface CategoryModalProps {
  isOpen: boolean
  category: Category | null
  onClose: () => void
  onSave: (data: CreateCategoryDto | UpdateCategoryDto) => Promise<void>
  onDelete?: () => void
  isSaving: boolean
}

const CATEGORY_TYPES: CategoryType[] = ['income', 'expense']

// Inner form component that receives initial values as props
function CategoryForm({
  category,
  onClose,
  onSave,
  onDelete,
  isSaving,
}: Omit<CategoryModalProps, 'isOpen'>) {
  const isEditMode = !!category
  const isSystemCategory = category?.isSystem || false

  // Initialize state from props - form resets when category changes via key in parent
  const [name, setName] = useState(category?.name ?? '')
  const [type, setType] = useState<CategoryType>(category?.type ?? 'expense')
  const [icon, setIcon] = useState(category?.icon ?? '💰')
  const [color, setColor] = useState(category?.color ?? CATEGORY_COLORS[0])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditMode) {
      const updateData: UpdateCategoryDto = {
        icon,
        color,
      }
      // Only include name if not a system category
      if (!isSystemCategory) {
        updateData.name = name
      }
      await onSave(updateData)
    } else {
      const createData: CreateCategoryDto = {
        name,
        type,
        icon,
        color,
      }
      await onSave(createData)
    }
  }

  return (
    <div className="fixed inset-0 bg-bg-primary z-[100] flex flex-col pt-safe pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-bg-tertiary">
        <button
          onClick={onClose}
          className="touch-target flex items-center justify-center text-primary"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">
          {isEditMode ? 'Edit Category' : 'Add Category'}
        </h1>
        <div className="w-11" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* System Category Notice */}
          {isSystemCategory && (
            <div className="px-4 py-3 bg-primary/10 text-primary rounded-xl text-sm">
              This is a system category. Only icon and color can be customized.
            </div>
          )}

          {/* Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Type
            </label>
            {isEditMode ? (
              <div className="px-4 py-3 bg-bg-tertiary rounded-xl text-text-secondary">
                {CATEGORY_TYPE_LABELS[type]}
                <span className="text-xs ml-2">(Cannot be changed)</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {CATEGORY_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                      type === t
                        ? 'bg-primary text-white'
                        : 'bg-bg-secondary text-text-secondary'
                    }`}
                  >
                    {CATEGORY_TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Name
            </label>
            {isSystemCategory ? (
              <div className="px-4 py-3 bg-bg-tertiary rounded-xl text-text-secondary">
                {name}
                <span className="text-xs ml-2">(Cannot be changed)</span>
              </div>
            ) : (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Subscriptions"
                required
                className="w-full px-4 py-3 bg-bg-secondary rounded-xl border border-bg-tertiary
                           text-text-primary placeholder:text-text-tertiary
                           focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            )}
          </div>

          {/* Icon Picker */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`w-12 h-12 rounded-xl text-2xl transition-all ${
                    icon === i
                      ? 'bg-primary/20 ring-2 ring-primary'
                      : 'bg-bg-secondary'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-full transition-all ${
                    color === c ? 'ring-2 ring-offset-2 ring-primary' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSaving || (!isSystemCategory && !name.trim())}
            className="w-full px-4 py-3 bg-primary text-white font-semibold rounded-xl
                       transition-all duration-200 active:scale-[0.98]
                       hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            {isSaving && <Loader2 className="w-5 h-5 animate-spin" />}
            {isEditMode ? 'Save Changes' : 'Create'}
          </button>

          {/* Delete Button (Edit mode only, non-system categories) */}
          {isEditMode && onDelete && !isSystemCategory && (
            <button
              type="button"
              onClick={onDelete}
              className="w-full px-4 py-3 text-danger font-semibold rounded-xl
                         transition-all duration-200 active:scale-[0.98]
                         border border-danger/30 hover:bg-danger/10
                         flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Delete Category
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

// Wrapper component that controls mounting/unmounting based on isOpen
// Uses key to reset form state when category changes
export function CategoryModal({
  isOpen,
  category,
  onClose,
  onSave,
  onDelete,
  isSaving,
}: CategoryModalProps) {
  if (!isOpen) {
    return null
  }

  // Key ensures form remounts and reinitializes when category changes
  return (
    <CategoryForm
      key={category?.id ?? 'new'}
      category={category}
      onClose={onClose}
      onSave={onSave}
      onDelete={onDelete}
      isSaving={isSaving}
    />
  )
}
