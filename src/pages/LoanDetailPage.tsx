import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Handshake, Loader2, Plus, Lock } from 'lucide-react'
import { useLoanDetail } from '@/hooks/useLoanDetail'
import {
  PrincipalCard,
  InterestCard,
  TotalInterestPaidCard,
  DueDateCard,
  EventTimeline,
  LoanActionsMenu,
  EditLoanModal,
  DeleteLoanDialog,
  RecordPaymentModal,
} from '@/components/loans'
import { LOAN_DIRECTION_LABELS } from '@/types/loan'

export function LoanDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const {
    loan,
    isLoading,
    error,
    updateLoan,
    closeLoan,
    deleteLoan,
    recordPayment,
    isUpdating,
    isDeleting,
    isRecordingPayment,
  } = useLoanDetail(id)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const handleEdit = () => {
    setIsEditModalOpen(true)
  }

  const handleClose = async () => {
    const success = await closeLoan()
    if (success) {
      // Loan will be refreshed automatically
    }
  }

  const handleDelete = async () => {
    const success = await deleteLoan()
    if (success) {
      navigate('/loans')
    }
  }

  const handleRecordPayment = () => {
    setIsPaymentModalOpen(true)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-secondary pt-safe pb-safe flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // Error state or loan not found
  if (error || !loan) {
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
              Loan
            </h1>
          </div>
        </header>

        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="neo-card p-6">
            <div className="flex flex-col items-center justify-center py-8 text-text-tertiary">
              <Handshake className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-bold text-text-primary">Loan not found</p>
              <p className="text-sm mt-2">{error || 'This loan may have been deleted'}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isActive = loan.status === 'active'
  const isClosed = loan.status === 'closed'
  const directionLabel = LOAN_DIRECTION_LABELS[loan.direction].split(' ')[0].toUpperCase()

  return (
    <div className="min-h-screen bg-bg-secondary pt-safe pb-safe">
      {/* Header with back button and actions */}
      <header className="sticky top-0 bg-bg-primary border-b border-bg-tertiary pt-safe z-10">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            onClick={() => navigate(-1)}
            className="touch-target flex items-center justify-center -ml-2 text-primary"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-text-primary truncate max-w-[200px]">
            {loan.counterpartyName}
          </h1>
          <LoanActionsMenu
            loan={loan}
            onEdit={handleEdit}
            onClose={handleClose}
            onDelete={() => setIsDeleteDialogOpen(true)}
          />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Direction badge */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border-2 border-border ${
              loan.direction === 'borrow'
                ? 'bg-danger text-white'
                : 'bg-success text-white'
            }`}
          >
            {directionLabel}
          </span>
          {isClosed && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-bg-tertiary text-text-tertiary">
              <Lock className="w-3 h-3" />
              CLOSED
            </span>
          )}
        </div>

        {/* Closed loan notice */}
        {isClosed && (
          <div className="p-4 bg-bg-tertiary/50 border border-bg-tertiary rounded-xl">
            <p className="text-sm text-text-tertiary text-center">
              This loan has been closed and is read-only.
            </p>
          </div>
        )}

        {/* Summary Cards */}
        <PrincipalCard loan={loan} />
        <InterestCard loan={loan} />
        <TotalInterestPaidCard loan={loan} />
        <DueDateCard loan={loan} />

        {/* Event Timeline */}
        <EventTimeline events={loan.events} />

        {/* Record Payment Button (only for active loans) */}
        {isActive && (
          <button
            onClick={handleRecordPayment}
            className="w-full py-4 px-4 bg-primary text-white font-semibold rounded-xl
                       transition-all duration-200 active:scale-[0.98]
                       hover:bg-primary-dark flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Record Payment
          </button>
        )}
      </div>

      {/* Edit Modal */}
      <EditLoanModal
        isOpen={isEditModalOpen}
        loan={loan}
        onClose={() => setIsEditModalOpen(false)}
        onSave={updateLoan}
        isSaving={isUpdating}
      />

      {/* Delete Dialog */}
      <DeleteLoanDialog
        isOpen={isDeleteDialogOpen}
        counterpartyName={loan.counterpartyName}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isPaymentModalOpen}
        loan={loan}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={recordPayment}
        isSubmitting={isRecordingPayment}
      />
    </div>
  )
}
