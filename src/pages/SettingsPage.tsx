import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useLogout } from '@/hooks/useLogout'
import { ChevronRight, User, Bell, Shield, HelpCircle, LogOut, Wallet, Tag } from 'lucide-react'

export function SettingsPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { logout, isLoading } = useLogout()

  const menuItems = [
    { icon: Wallet, label: 'Accounts', description: 'Manage your accounts', path: '/settings/accounts' },
    { icon: Tag, label: 'Categories', description: 'Manage income & expense categories', path: '/settings/categories' },
    { icon: User, label: 'Profile', description: 'Manage your profile' },
    { icon: Bell, label: 'Notifications', description: 'Notification preferences' },
    { icon: Shield, label: 'Privacy', description: 'Privacy settings' },
    { icon: HelpCircle, label: 'Help & Support', description: 'Get help' },
  ]

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Settings</h1>

      {/* User card */}
      <div className="neo-card p-4 mb-6 bg-primary/10">
        <div className="flex items-center gap-3">
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className="w-12 h-12 rounded-lg border-3 border-border"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-primary border-3 border-border flex items-center justify-center">
              <span className="text-lg font-black text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-text-primary truncate">{user?.name}</p>
            <p className="text-sm text-text-tertiary truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="neo-card overflow-hidden mb-6">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              onClick={() => item.path && navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3
                         text-left transition-colors active:bg-bg-secondary
                         ${index !== 0 ? 'border-t border-bg-tertiary' : ''}`}
            >
              <Icon className="w-5 h-5 text-text-tertiary" />
              <div className="flex-1">
                <p className="font-medium text-text-primary">{item.label}</p>
                <p className="text-xs text-text-tertiary">{item.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-text-tertiary" />
            </button>
          )
        })}
      </div>

      {/* Sign out button */}
      <button
        onClick={logout}
        disabled={isLoading}
        className="neo-card w-full flex items-center gap-3 px-4 py-3 bg-danger/10
                   text-danger font-bold
                   disabled:opacity-50"
      >
        <LogOut className="w-5 h-5" />
        <span>{isLoading ? 'Signing out...' : 'Sign out'}</span>
      </button>
    </div>
  )
}
