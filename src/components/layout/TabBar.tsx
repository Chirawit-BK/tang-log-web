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
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-primary border-t border-bg-tertiary pb-safe z-50">
      <div className="flex items-center justify-around h-[49px]">
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
                active:scale-95 active:opacity-70
                ${isAddButton ? '' : active ? 'text-primary' : 'text-text-tertiary'}
              `}
              aria-label={tab.label}
              aria-current={active ? 'page' : undefined}
            >
              {isAddButton ? (
                <div className="flex items-center justify-center w-11 h-7 bg-primary rounded-full">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              ) : (
                <Icon className="w-6 h-6" />
              )}
              <span className={`text-[10px] mt-0.5 ${isAddButton ? 'text-primary font-medium' : ''}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
