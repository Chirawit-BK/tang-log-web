// Account types

export type AccountType = 'cash' | 'bank' | 'ewallet' | 'credit_card'

export interface Account {
  id: string
  name: string
  type: AccountType
  initialBalance: number
  currentBalance: number
  icon: string
  color: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateAccountDto {
  name: string
  type: AccountType
  initialBalance: number
  icon?: string
  color?: string
}

export interface UpdateAccountDto {
  name?: string
  type?: AccountType
  icon?: string
  color?: string
  isActive?: boolean
}

// Default icons per account type
export const ACCOUNT_TYPE_ICONS: Record<AccountType, string> = {
  cash: '💵',
  bank: '🏦',
  ewallet: '📱',
  credit_card: '💳',
}

// Account type labels
export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  cash: 'Cash',
  bank: 'Bank',
  ewallet: 'E-wallet',
  credit_card: 'Credit Card',
}

// Preset colors for accounts
export const ACCOUNT_COLORS: string[] = [
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
]

// Preset icons for accounts
export const ACCOUNT_ICONS: string[] = [
  '💵', // Cash
  '🏦', // Bank
  '📱', // E-wallet
  '💳', // Credit Card
  '💰', // Money bag
  '🪙', // Coin
  '💎', // Diamond
  '🏧', // ATM
]
