import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { clearAuth } = useAuthStore()

  const logout = useCallback(async () => {
    setIsLoading(true)

    try {
      // Call logout endpoint to invalidate refresh token
      await authApi.logout()
    } catch {
      // Ignore errors - we'll clear local state anyway
    } finally {
      // Clear local auth state
      clearAuth()
      setIsLoading(false)
      // Redirect to login
      navigate('/login', { replace: true })
    }
  }, [clearAuth, navigate])

  return { logout, isLoading }
}
