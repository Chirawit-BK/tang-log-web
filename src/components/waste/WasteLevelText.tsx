import type { WasteLevel } from '@/types/dashboard'
import {
  WASTE_LEVEL_BADGE_CLASSES,
  WASTE_LEVEL_LABELS,
} from '@/utils/wasteLevel'

export interface WasteLevelTextProps {
  level: WasteLevel
  variant?: 'badge' | 'plain'
}

export function WasteLevelText({ level, variant = 'badge' }: WasteLevelTextProps) {
  if (variant === 'plain') {
    return (
      <span className={WASTE_LEVEL_BADGE_CLASSES[level].split(' ')[0]}>
        {WASTE_LEVEL_LABELS[level]}
      </span>
    )
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${WASTE_LEVEL_BADGE_CLASSES[level]}`}
    >
      {WASTE_LEVEL_LABELS[level]}
    </span>
  )
}
