import { create } from 'zustand'

interface User {
  id: string
  email: string
  name: string
  picture?: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  setAuth: (user: User, accessToken: string) => void
  setAccessToken: (accessToken: string) => void
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearAuth: () => void
}

// TODO: Remove mock auth when integrating real authentication
const DEV_MOCK_AUTH = import.meta.env.DEV

export const useAuthStore = create<AuthState>()((set) => ({
  user: DEV_MOCK_AUTH ? { id: '1', email: 'dev@test.com', name: 'Dev User' } : null,
  accessToken: DEV_MOCK_AUTH ? 'mock-token' : null,
  isAuthenticated: DEV_MOCK_AUTH,
  isLoading: false,
  error: null,

  setAuth: (user, accessToken) => {
    set({
      user,
      accessToken,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    })
  },

  setAccessToken: (accessToken) => {
    set({ accessToken })
  },

  setUser: (user) => {
    set({ user })
  },

  setLoading: (loading) => {
    set({ isLoading: loading })
  },

  setError: (error) => {
    set({ error, isLoading: false })
  },

  clearAuth: () => {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  },
}))

// Export User type for use in other modules
export type { User }
