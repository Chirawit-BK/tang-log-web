import { useState, useEffect, useCallback } from 'react'
import type {
  Account,
  CreateAccountDto,
  UpdateAccountDto,
  AccountType,
} from '@/types/account'

// Mock data generator - will be replaced with actual API
function generateMockAccounts(): Account[] {
  return [
    {
      id: '1',
      name: 'Cash',
      type: 'cash',
      initialBalance: 5000,
      currentBalance: 5000,
      icon: '💵',
      color: '#10B981',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'SCB Savings',
      type: 'bank',
      initialBalance: 25000,
      currentBalance: 25000,
      icon: '🏦',
      color: '#3B82F6',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'PromptPay',
      type: 'ewallet',
      initialBalance: 3500,
      currentBalance: 3500,
      icon: '📱',
      color: '#8B5CF6',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]
}

interface UseAccountsReturn {
  accounts: Account[]
  isLoading: boolean
  error: string | null
  refresh: () => void
  createAccount: (data: CreateAccountDto) => Promise<Account | null>
  updateAccount: (id: string, data: UpdateAccountDto) => Promise<Account | null>
  deleteAccount: (id: string) => Promise<boolean>
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
}

export function useAccounts(): UseAccountsReturn {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // TODO: Replace with actual API call when backend is ready
      // const data = await accountsApi.getAll()
      await new Promise((resolve) => setTimeout(resolve, 300))
      const mockData = generateMockAccounts()
      setAccounts(mockData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load accounts')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  const createAccount = useCallback(
    async (data: CreateAccountDto): Promise<Account | null> => {
      setIsCreating(true)
      setError(null)

      try {
        // TODO: Replace with actual API call when backend is ready
        // const newAccount = await accountsApi.create(data)
        await new Promise((resolve) => setTimeout(resolve, 300))

        const defaultIcons: Record<AccountType, string> = {
          cash: '💵',
          bank: '🏦',
          ewallet: '📱',
          credit_card: '💳',
        }

        const newAccount: Account = {
          id: Date.now().toString(),
          name: data.name,
          type: data.type,
          initialBalance: data.initialBalance,
          currentBalance: data.initialBalance,
          icon: data.icon || defaultIcons[data.type],
          color: data.color || '#10B981',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        setAccounts((prev) => [...prev, newAccount])
        return newAccount
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create account')
        return null
      } finally {
        setIsCreating(false)
      }
    },
    []
  )

  const updateAccount = useCallback(
    async (id: string, data: UpdateAccountDto): Promise<Account | null> => {
      setIsUpdating(true)
      setError(null)

      try {
        // TODO: Replace with actual API call when backend is ready
        // const updatedAccount = await accountsApi.update(id, data)
        await new Promise((resolve) => setTimeout(resolve, 300))

        let updatedAccount: Account | null = null

        setAccounts((prev) =>
          prev.map((account) => {
            if (account.id === id) {
              updatedAccount = {
                ...account,
                ...data,
                updatedAt: new Date().toISOString(),
              }
              return updatedAccount
            }
            return account
          })
        )

        return updatedAccount
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update account')
        return null
      } finally {
        setIsUpdating(false)
      }
    },
    []
  )

  const deleteAccount = useCallback(async (id: string): Promise<boolean> => {
    setIsDeleting(true)
    setError(null)

    try {
      // TODO: Replace with actual API call when backend is ready
      // await accountsApi.delete(id)
      await new Promise((resolve) => setTimeout(resolve, 300))

      setAccounts((prev) => prev.filter((account) => account.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account')
      return false
    } finally {
      setIsDeleting(false)
    }
  }, [])

  return {
    accounts,
    isLoading,
    error,
    refresh: fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    isCreating,
    isUpdating,
    isDeleting,
  }
}
