import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Receipt,
  Edit2,
  Trash2,
  Calendar,
  Wallet,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import { useTransactions } from '@/hooks/useTransactions'
import { AddTransactionModal } from '@/components/AddTransactionModal'
import { DeleteTransactionDialog } from '@/components/DeleteTransactionDialog'
import { WasteLevelText } from '@/components/waste'
import { TRANSACTION_KIND_LABELS } from '@/types/transaction'
import type { Transaction } from '@/types/transaction'

function formatAmount(amount: number): string {
  return amount.toLocaleString('th-TH')
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getTransactionById, deleteTransaction, isDeleting, isLoading } = useTransactions()

  const [transaction, setTransaction] = useState<Transaction | undefined>()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Load transaction
  useEffect(() => {
    if (id) {
      const tx = getTransactionById(id)
      setTransaction(tx)
    }
  }, [id, getTransactionById])

  const handleDelete = async () => {
    if (!id) return

    const success = await deleteTransaction(id)
    if (success) {
      navigate(-1)
    }
  }

  const handleEditSuccess = () => {
    // Refresh the transaction data
    if (id) {
      const tx = getTransactionById(id)
      setTransaction(tx)
    }
  }

  const isLoanFlow = transaction?.kind === 'loan_flow'

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-secondary pt-safe pb-safe flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-bg-secondary pt-safe pb-safe">
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
              Transaction
            </h1>
          </div>
        </header>

        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="bg-bg-secondary rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col items-center justify-center py-8 text-text-tertiary">
              <Receipt className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium text-text-primary">Transaction not found</p>
              <p className="text-sm mt-2">This transaction may have been deleted</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-secondary pt-safe pb-safe">
      {/* Header */}
      <header className="sticky top-0 bg-bg-primary border-b border-bg-tertiary pt-safe z-10">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            onClick={() => navigate(-1)}
            className="touch-target flex items-center justify-center -ml-2 text-primary"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-text-primary">Transaction</h1>
          <div className="flex items-center gap-1">
            {!isLoanFlow && (
              <>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="touch-target flex items-center justify-center text-primary"
                  aria-label="Edit transaction"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="touch-target flex items-center justify-center text-danger"
                  aria-label="Delete transaction"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Amount Card */}
        <div className="bg-bg-secondary rounded-2xl p-6 shadow-sm">
          <div className="text-center">
            {/* Kind Badge */}
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                transaction.kind === 'income'
                  ? 'bg-success/20 text-success'
                  : transaction.kind === 'expense'
                    ? 'bg-danger/20 text-danger'
                    : transaction.kind === 'transfer'
                      ? 'bg-primary/20 text-primary'
                      : 'bg-warning/20 text-warning'
              }`}
            >
              {TRANSACTION_KIND_LABELS[transaction.kind]}
            </span>

            {/* Amount */}
            <p
              className={`text-4xl font-bold mb-2 ${
                transaction.kind === 'income'
                  ? 'text-success'
                  : transaction.kind === 'expense'
                    ? 'text-danger'
                    : 'text-text-primary'
              }`}
            >
              {transaction.kind === 'income' ? '+' : transaction.kind === 'expense' ? '-' : ''}
              ฿{formatAmount(transaction.amount)}
            </p>

            {/* Note */}
            {transaction.note && (
              <p className="text-text-secondary">{transaction.note}</p>
            )}
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-bg-secondary rounded-2xl p-4 shadow-sm divide-y divide-bg-tertiary">
          {/* Category */}
          {transaction.categoryName && (
            <div className="flex items-center justify-between py-3">
              <span className="text-text-secondary">Category</span>
              <span className="flex items-center gap-2 text-text-primary font-medium">
                <span>{transaction.categoryIcon}</span>
                {transaction.categoryName}
              </span>
            </div>
          )}

          {/* Account */}
          <div className="flex items-center justify-between py-3">
            <span className="text-text-secondary">
              {transaction.kind === 'transfer' ? 'From Account' : 'Account'}
            </span>
            <span className="flex items-center gap-2 text-text-primary font-medium">
              <Wallet className="w-4 h-4 text-text-tertiary" />
              {transaction.accountName}
            </span>
          </div>

          {/* To Account (Transfer only) */}
          {transaction.kind === 'transfer' && transaction.toAccountName && (
            <div className="flex items-center justify-between py-3">
              <span className="text-text-secondary">To Account</span>
              <span className="flex items-center gap-2 text-text-primary font-medium">
                <ArrowRight className="w-4 h-4 text-text-tertiary" />
                {transaction.toAccountName}
              </span>
            </div>
          )}

          {/* Waste Level (Expense only) */}
          {transaction.kind === 'expense' && transaction.wasteLevel && (
            <div className="flex items-center justify-between py-3">
              <span className="text-text-secondary">Waste Level</span>
              <WasteLevelText level={transaction.wasteLevel} />
            </div>
          )}

          {/* Date */}
          <div className="flex items-center justify-between py-3">
            <span className="text-text-secondary">Date</span>
            <span className="flex items-center gap-2 text-text-primary font-medium">
              <Calendar className="w-4 h-4 text-text-tertiary" />
              {formatDate(transaction.transactionDate)}
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center justify-between py-3">
            <span className="text-text-secondary">Time</span>
            <span className="text-text-primary font-medium">
              {formatTime(transaction.createdAt)}
            </span>
          </div>
        </div>

        {/* LOAN_FLOW Notice */}
        {isLoanFlow && (
          <div className="p-4 bg-warning/10 border border-warning/30 rounded-xl">
            <p className="text-sm text-warning font-medium text-center">
              This transaction is part of a loan and cannot be edited or deleted directly.
              Manage it through the Loans module.
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AddTransactionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editTransaction={transaction}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Dialog */}
      <DeleteTransactionDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        transaction={transaction}
        isDeleting={isDeleting}
      />
    </div>
  )
}
