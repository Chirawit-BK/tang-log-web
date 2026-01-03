import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { TabBar } from './TabBar'
import { AddTransactionModal } from '@/components/AddTransactionModal'

export function MainLayout() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-bg-secondary pt-safe">
      {/* Main content area - with bottom padding for tab bar */}
      <main className="pb-[calc(49px+env(safe-area-inset-bottom))]">
        <div className="max-w-lg mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Tab bar */}
      <TabBar onAddClick={() => setIsAddModalOpen(true)} />

      {/* Add transaction modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  )
}
