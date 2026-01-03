import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/api'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'

interface AuthProviderProps {
  children: React.ReactNode
}

/**
 * AuthProvider handles:
 * 1. Connecting auth store to API client
 * 2. Attempting to restore session on mount
 * 3. Handling unauthorized (401) responses
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate()
  const {
    accessToken,
    setAccessToken,
    setAuth,
    clearAuth,
    setLoading,
  } = useAuthStore()

  // Connect auth store to API client
  useEffect(() => {
    // Token getter for API requests
    api.setTokenGetter(() => useAuthStore.getState().accessToken)

    // Handle token refresh
    api.setOnTokenRefreshed((newToken) => {
      setAccessToken(newToken)
    })

    // Handle unauthorized (redirect to login)
    api.setOnUnauthorized(() => {
      clearAuth()
      navigate('/login', { replace: true })
    })
  }, [setAccessToken, clearAuth, navigate])

  // Attempt to restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      // If we already have an access token, we're authenticated
      if (accessToken) {
        setLoading(false)
        return
      }

      try {
        // Try to refresh using httpOnly cookie
        const response = await authApi.refresh()

        if (response.accessToken) {
          // Got new access token, fetch user profile
          setAccessToken(response.accessToken)

          const user = await authApi.me()
          setAuth(user, response.accessToken)
        } else {
          // No valid session
          setLoading(false)
        }
      } catch {
        // Refresh failed - no valid session
        setLoading(false)
      }
    }

    restoreSession()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>
}
