import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Plus, Loader2 } from 'lucide-react'
import { useAccounts } from '@/hooks'
import type { Account } from '@/types/account'
import { AccountModal } from '@/components/AccountModal'
import { DeleteAccountDialog } from '@/components/DeleteAccountDialog'

export function AccountsPage() {
  const navigate = useNavigate()
  const {
    accounts,
    isLoading,
    error,
    createAccount,
    updateAccount,
    deleteAccount,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAccounts()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null)

  const handleAddAccount = () => {
    setSelectedAccount(null)
    setIsModalOpen(true)
  }

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedAccount(null)
  }

  const handleDeleteRequest = (account: Account) => {
    setAccountToDelete(account)
  }

  const handleConfirmDelete = async () => {
    if (accountToDelete) {
      await deleteAccount(accountToDelete.id)
      setAccountToDelete(null)
      handleCloseModal()
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

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
            Accounts
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
          <div className="space-y-3">
            {/* Account cards */}
            {accounts.map((account) => (
              <button
                key={account.id}
                onClick={() => handleEditAccount(account)}
                className={`w-full bg-bg-secondary rounded-2xl p-4 shadow-sm text-left transition-colors active:bg-bg-tertiary ${
                  !account.isActive ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${account.color}20` }}
                  >
                    {account.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-text-primary truncate">
                        {account.name}
                      </p>
                      <span className="text-lg font-bold text-text-primary">
                        {formatCurrency(account.currentBalance)}
                      </span>
                    </div>
                    <p className="text-sm text-text-tertiary">
                      {account.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>

                  {/* Chevron */}
                  <ChevronRight className="w-5 h-5 text-text-tertiary flex-shrink-0" />
                </div>
              </button>
            ))}

            {/* Add account button */}
            <button
              onClick={handleAddAccount}
              className="w-full bg-bg-secondary rounded-2xl p-4 shadow-sm text-center transition-colors active:bg-bg-tertiary border-2 border-dashed border-bg-tertiary"
            >
              <div className="flex items-center justify-center gap-2 text-primary">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add Account</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Account Modal (Add/Edit) */}
      <AccountModal
        isOpen={isModalOpen}
        account={selectedAccount}
        onClose={handleCloseModal}
        onSave={async (data) => {
          if (selectedAccount) {
            await updateAccount(selectedAccount.id, data)
          } else {
            await createAccount(data as Parameters<typeof createAccount>[0])
          }
          handleCloseModal()
        }}
        onDelete={selectedAccount ? () => handleDeleteRequest(selectedAccount) : undefined}
        isSaving={isCreating || isUpdating}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteAccountDialog
        isOpen={!!accountToDelete}
        accountName={accountToDelete?.name || ''}
        onClose={() => setAccountToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}
