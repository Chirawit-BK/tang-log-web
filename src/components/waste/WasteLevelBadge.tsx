import type { WasteLevel } from '@/types/dashboard'
import {
  WASTE_LEVEL_BG_CLASSES,
  WASTE_LEVEL_LABELS,
} from '@/utils/wasteLevel'

export interface WasteLevelBadgeProps {
  level: WasteLevel
  size?: 'sm' | 'md'
}

const sizeClasses = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
}

export function WasteLevelBadge({ level, size = 'sm' }: WasteLevelBadgeProps) {
  return (
    <span
      className={`rounded-full flex-shrink-0 ${sizeClasses[size]} ${WASTE_LEVEL_BG_CLASSES[level]}`}
      role="img"
      aria-label={`${WASTE_LEVEL_LABELS[level]} expense`}
      title={WASTE_LEVEL_LABELS[level]}
    />
  )
}
