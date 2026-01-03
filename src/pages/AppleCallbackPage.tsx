import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppleAuth } from '@/hooks/useAppleAuth'
import { useAuthStore } from '@/stores/authStore'

/**
 * Apple Sign-In Callback Page
 *
 * Note: Apple uses form_post response mode, so the callback data
 * comes as POST form data to the server, not as URL parameters.
 * The backend should handle the POST and redirect to this page
 * with the necessary data as URL parameters or in the body.
 *
 * Alternative approach: The backend can process the Apple callback
 * and redirect to this page with a one-time token that can be
 * exchanged for the actual tokens.
 */
export function AppleCallbackPage() {
  const navigate = useNavigate()
  const { handleAppleCallback } = useAppleAuth()
  const { setError } = useAuthStore()
  const hasProcessed = useRef(false)

  useEffect(() => {
    // Prevent double processing in StrictMode
    if (hasProcessed.current) return
    hasProcessed.current = true

    // Apple's form_post sends data to the server
    // The server should redirect here with the processed data
    // For now, we'll look for data passed via URL params or session
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const idToken = params.get('id_token')
    const state = params.get('state')
    const error = params.get('error')

    // Try to get user info from URL (base64 encoded by server)
    const userParam = params.get('user')
    let user: { name?: { firstName?: string; lastName?: string }; email?: string } | undefined

    if (userParam) {
      try {
        user = JSON.parse(atob(userParam))
      } catch {
        // Ignore parsing errors
      }
    }

    if (error) {
      const errorDescription = params.get('error_description')
      setError(errorDescription || 'Apple sign-in was cancelled or failed')
      navigate('/login', { replace: true })
      return
    }

    if (!code || !idToken || !state) {
      // This might happen if user navigates here directly
      // or if the server hasn't processed the callback yet
      setError('Invalid Apple callback. Please try signing in again.')
      navigate('/login', { replace: true })
      return
    }

    handleAppleCallback(code, idToken, state, user)
  }, [handleAppleCallback, setError, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-text-secondary">Completing sign in...</p>
      </div>
    </div>
  )
}
