import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/api/auth'

const APPLE_CLIENT_ID = import.meta.env.VITE_APPLE_CLIENT_ID
const APPLE_REDIRECT_URI = import.meta.env.VITE_APPLE_REDIRECT_URI

// Generate a random state for CSRF protection
function generateState(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

// Store state in sessionStorage for verification
function storeOAuthState(state: string) {
  sessionStorage.setItem('apple_oauth_state', state)
}

export function getStoredAppleOAuthState(): string | null {
  return sessionStorage.getItem('apple_oauth_state')
}

export function clearAppleOAuthState() {
  sessionStorage.removeItem('apple_oauth_state')
}

export function useAppleAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { setAuth, setError, setLoading } = useAuthStore()

  const initiateAppleLogin = useCallback(() => {
    if (!APPLE_CLIENT_ID || !APPLE_REDIRECT_URI) {
      setError('Apple Sign-In is not configured')
      return
    }

    setIsLoading(true)

    // Generate and store state for CSRF protection
    const state = generateState()
    storeOAuthState(state)

    // Build Apple OAuth URL (redirect flow)
    const params = new URLSearchParams({
      client_id: APPLE_CLIENT_ID,
      redirect_uri: APPLE_REDIRECT_URI,
      response_type: 'code id_token',
      response_mode: 'form_post',
      scope: 'name email',
      state,
    })

    // Redirect to Apple
    window.location.href = `https://appleid.apple.com/auth/authorize?${params.toString()}`
  }, [setError])

  const handleAppleCallback = useCallback(
    async (code: string, idToken: string, state: string, user?: { name?: { firstName?: string; lastName?: string }; email?: string }) => {
      setLoading(true)

      // Verify state matches
      const storedState = getStoredAppleOAuthState()
      if (state !== storedState) {
        setError('Invalid OAuth state. Please try again.')
        clearAppleOAuthState()
        navigate('/login', { replace: true })
        return
      }

      clearAppleOAuthState()

      try {
        const response = await authApi.appleAuth(code, idToken, user)
        setAuth(response.user, response.accessToken)
        navigate('/', { replace: true })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to sign in with Apple'
        setError(message)
        navigate('/login', { replace: true })
      }
    },
    [setAuth, setError, setLoading, navigate]
  )

  return {
    initiateAppleLogin,
    handleAppleCallback,
    isLoading,
  }
}
