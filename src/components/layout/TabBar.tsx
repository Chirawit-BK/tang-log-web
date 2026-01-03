import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Receipt, Plus, Handshake, Settings } from 'lucide-react'

interface TabItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  route?: string
  isAction?: boolean
}

const tabs: TabItem[] = [
  { id: 'dashboard', label: 'Dash', icon: LayoutDashboard, route: '/' },
  { id: 'transactions', label: 'Trans', icon: Receipt, route: '/transactions' },
  { id: 'add', label: 'Add', icon: Plus, isAction: true },
  { id: 'loans', label: 'Loans', icon: Handshake, route: '/loans' },
  { id: 'settings', label: 'Set', icon: Settings, route: '/settings' },
]

interface TabBarProps {
  onAddClick: () => void
}

export function TabBar({ onAddClick }: TabBarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (route?: string) => {
    if (!route) return false
    if (route === '/') return location.pathname === '/'
    return location.pathname.startsWith(route)
  }

  const handleTabClick = (tab: TabItem) => {
    if (tab.isAction) {
      onAddClick()
    } else if (tab.route) {
      navigate(tab.route)
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary border-t-3 border-border pb-safe z-50">
      <div className="flex items-center justify-around h-[56px]">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = isActive(tab.route)
          const isAddButton = tab.isAction

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`
                flex flex-col items-center justify-center flex-1 h-full
                touch-target transition-all duration-150
                ${isAddButton ? '' : active ? 'text-primary font-bold' : 'text-text-tertiary'}
              `}
              aria-label={tab.label}
              aria-current={active ? 'page' : undefined}
            >
              {isAddButton ? (
                <div className="flex items-center justify-center w-12 h-8 bg-primary border-3 border-border rounded-lg shadow-[2px_2px_0px_#1a1a1a] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              ) : (
                <Icon className="w-6 h-6" />
              )}
              <span className={`text-[10px] mt-0.5 font-semibold ${isAddButton ? 'text-primary' : ''}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
