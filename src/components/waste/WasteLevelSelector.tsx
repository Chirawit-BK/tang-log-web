import { useState } from 'react'
import { HelpCircle, X } from 'lucide-react'
import type { WasteLevel } from '@/types/dashboard'
import {
  WASTE_LEVELS,
  WASTE_LEVEL_LABELS,
  WASTE_LEVEL_DESCRIPTIONS,
  WASTE_LEVEL_BG_CLASSES,
} from '@/utils/wasteLevel'

export interface WasteLevelSelectorProps {
  value: WasteLevel | null
  onChange: (level: WasteLevel) => void
  disabled?: boolean
  showHelp?: boolean
  error?: string
}

export function WasteLevelSelector({
  value,
  onChange,
  disabled = false,
  showHelp = true,
  error,
}: WasteLevelSelectorProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-text-secondary">
          Waste Level
        </label>
        {showHelp && (
          <button
            type="button"
            onClick={() => setIsHelpOpen(!isHelpOpen)}
            className="p-1 text-text-tertiary hover:text-text-secondary transition-colors"
            aria-label="Show waste level help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Help Tooltip */}
      {isHelpOpen && (
        <div className="p-3 bg-bg-secondary rounded-xl border border-bg-tertiary relative">
          <button
            type="button"
            onClick={() => setIsHelpOpen(false)}
            className="absolute top-2 right-2 p-1 text-text-tertiary hover:text-text-secondary"
            aria-label="Close help"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="text-sm font-medium text-text-primary mb-2">
            How essential was this expense?
          </p>
          <ul className="space-y-1.5 text-sm text-text-secondary">
            {WASTE_LEVELS.map((level) => (
              <li key={level} className="flex items-start gap-2">
                <span
                  className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${WASTE_LEVEL_BG_CLASSES[level]}`}
                />
                <span>
                  <strong>{WASTE_LEVEL_LABELS[level]}:</strong>{' '}
                  {WASTE_LEVEL_DESCRIPTIONS[level]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Selector Buttons */}
      <div className="flex gap-2">
        {WASTE_LEVELS.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            disabled={disabled}
            aria-pressed={value === level}
            className={`flex-1 py-3 px-3 rounded-xl font-medium transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed ${
                         value === level
                           ? `${WASTE_LEVEL_BG_CLASSES[level]} text-white`
                           : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                       }`}
          >
            {WASTE_LEVEL_LABELS[level]}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  )
}
