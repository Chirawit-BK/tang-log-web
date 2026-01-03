import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/api/auth'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

// Generate a random state for CSRF protection
function generateState(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

// Store state in sessionStorage for verification
function storeOAuthState(state: string) {
  sessionStorage.setItem('oauth_state', state)
}

export function getStoredOAuthState(): string | null {
  return sessionStorage.getItem('oauth_state')
}

export function clearOAuthState() {
  sessionStorage.removeItem('oauth_state')
}

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { setAuth, setError, setLoading } = useAuthStore()

  const initiateGoogleLogin = useCallback(() => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google Sign-In is not configured')
      return
    }

    setIsLoading(true)

    // Generate and store state for CSRF protection
    const state = generateState()
    storeOAuthState(state)

    // Build Google OAuth URL (redirect flow)
    const redirectUri = `${window.location.origin}/auth/google/callback`
    const scope = 'openid email profile'

    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope,
      state,
      access_type: 'offline',
      prompt: 'consent',
    })

    // Redirect to Google
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }, [setError])

  const handleGoogleCallback = useCallback(
    async (code: string, state: string) => {
      setLoading(true)

      // Verify state matches
      const storedState = getStoredOAuthState()
      if (state !== storedState) {
        setError('Invalid OAuth state. Please try again.')
        clearOAuthState()
        navigate('/login', { replace: true })
        return
      }

      clearOAuthState()

      try {
        const response = await authApi.googleAuth(code)
        setAuth(response.user, response.accessToken)
        navigate('/', { replace: true })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to sign in with Google'
        setError(message)
        navigate('/login', { replace: true })
      }
    },
    [setAuth, setError, setLoading, navigate]
  )

  return {
    initiateGoogleLogin,
    handleGoogleCallback,
    isLoading,
  }
}
