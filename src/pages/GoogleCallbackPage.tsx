import { useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useGoogleAuth } from '@/hooks/useGoogleAuth'
import { useAuthStore } from '@/stores/authStore'

export function GoogleCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { handleGoogleCallback } = useGoogleAuth()
  const { setError } = useAuthStore()
  const hasProcessed = useRef(false)

  useEffect(() => {
    // Prevent double processing in StrictMode
    if (hasProcessed.current) return
    hasProcessed.current = true

    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      // Handle OAuth errors
      const errorDescription = searchParams.get('error_description')
      setError(errorDescription || 'Google sign-in was cancelled or failed')
      navigate('/login', { replace: true })
      return
    }

    if (!code || !state) {
      setError('Invalid OAuth callback. Missing required parameters.')
      navigate('/login', { replace: true })
      return
    }

    handleGoogleCallback(code, state)
  }, [searchParams, handleGoogleCallback, setError, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-text-secondary">Completing sign in...</p>
      </div>
    </div>
  )
}
