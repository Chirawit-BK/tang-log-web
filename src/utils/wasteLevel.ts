import type { WasteLevel } from '@/types/dashboard'

// Hex colors for charts/SVG
export const WASTE_LEVEL_COLORS: Record<WasteLevel, string> = {
  necessary: '#22c55e', // green-500
  optional: '#eab308', // yellow-500
  wasteful: '#ef4444', // red-500
}

// Tailwind classes for backgrounds
export const WASTE_LEVEL_BG_CLASSES: Record<WasteLevel, string> = {
  necessary: 'bg-success',
  optional: 'bg-warning',
  wasteful: 'bg-danger',
}

// Tailwind classes for text
export const WASTE_LEVEL_TEXT_CLASSES: Record<WasteLevel, string> = {
  necessary: 'text-success',
  optional: 'text-warning',
  wasteful: 'text-danger',
}

// Combined badge styles (text + background)
export const WASTE_LEVEL_BADGE_CLASSES: Record<WasteLevel, string> = {
  necessary: 'text-success bg-success/10',
  optional: 'text-warning bg-warning/10',
  wasteful: 'text-danger bg-danger/10',
}

// Labels
export const WASTE_LEVEL_LABELS: Record<WasteLevel, string> = {
  necessary: 'Necessary',
  optional: 'Optional',
  wasteful: 'Wasteful',
}

// Descriptions for help tooltip
export const WASTE_LEVEL_DESCRIPTIONS: Record<WasteLevel, string> = {
  necessary: 'Required for daily life (rent, bills, groceries)',
  optional: 'Nice to have (eating out, entertainment)',
  wasteful: 'Impulse buys or regretted purchases',
}

// Icons for accessibility (not color-only)
export const WASTE_LEVEL_ICONS: Record<WasteLevel, string> = {
  necessary: '●', // solid circle
  optional: '◐', // half circle
  wasteful: '○', // empty circle
}

// All waste levels in display order
export const WASTE_LEVELS: WasteLevel[] = ['necessary', 'optional', 'wasteful']

// LocalStorage key for first-time tooltip
export const WASTE_LEVEL_ONBOARDING_KEY = 'tanglog_waste_level_onboarded'

// Check if user has seen onboarding
export function hasSeenWasteLevelOnboarding(): boolean {
  return localStorage.getItem(WASTE_LEVEL_ONBOARDING_KEY) === 'true'
}

// Mark onboarding as seen
export function markWasteLevelOnboardingSeen(): void {
  localStorage.setItem(WASTE_LEVEL_ONBOARDING_KEY, 'true')
}
